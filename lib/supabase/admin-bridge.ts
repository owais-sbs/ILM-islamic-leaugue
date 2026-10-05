import { NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { tryCreateServiceClient } from '@/lib/supabase/admin';
import { tryCreateServerSupabase } from '@/lib/supabase/server';
import { isSupabaseAdminConfigured, isSupabaseConfigured } from '@/lib/supabase/env';

type AdminBridge =
  | { ok: true; admin: SupabaseClient; userId: string | null; role: string | null; demoBridge: boolean }
  | { ok: false; response: NextResponse };

/**
 * Shared write access for admin APIs on Vercel.
 * Prefer a real Supabase staff session; if cookies are missing but the
 * service role is configured (demo admin UI), allow the write bridge —
 * same pattern as /api/articles/publish and /api/cms.
 */
export async function requireAdminWrite(opts?: {
  allowEditor?: boolean;
  allowDemoBridge?: boolean;
}): Promise<AdminBridge> {
  const allowEditor = opts?.allowEditor !== false;
  const allowDemoBridge = opts?.allowDemoBridge !== false;

  if (!isSupabaseConfigured() || !isSupabaseAdminConfigured()) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          ok: false,
          localOnly: true,
          error:
            'Supabase admin is not configured. Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY on Vercel.',
        },
        { status: 503 },
      ),
    };
  }

  const admin = tryCreateServiceClient();
  if (!admin) {
    return {
      ok: false,
      response: NextResponse.json({ ok: false, error: 'Service role unavailable' }, { status: 503 }),
    };
  }

  const session = tryCreateServerSupabase();
  let userId: string | null = null;
  let role: string | null = null;

  if (session) {
    const {
      data: { user },
    } = await session.auth.getUser();
    if (user) {
      userId = user.id;
      const { data: profile } = await admin.from('profiles').select('role, is_active').eq('id', user.id).maybeSingle();
      if (profile?.is_active) role = profile.role;
    }
  }

  if (role === 'admin' || (allowEditor && role === 'editor')) {
    return { ok: true, admin, userId, role, demoBridge: false };
  }

  if (role && role !== 'admin' && role !== 'editor') {
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, error: 'Only editors and administrators can perform this action.' },
        { status: 403 },
      ),
    };
  }

  // No staff cookie — allow service-role bridge for the hosted admin UI
  if (allowDemoBridge) {
    return { ok: true, admin, userId: null, role: null, demoBridge: true };
  }

  return {
    ok: false,
    response: NextResponse.json(
      { ok: false, localOnly: true, error: 'No authenticated Supabase session.' },
      { status: 401 },
    ),
  };
}
