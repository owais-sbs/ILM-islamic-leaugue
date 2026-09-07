import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { User } from '@supabase/supabase-js';
import { createServiceClient } from '@/lib/supabase/admin';
import type { ProfileRow } from '@/lib/supabase/types';

export function createRouteSupabase() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            /* Server Component context */
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            /* Server Component context */
          }
        },
      },
    },
  );
}

type StaffContext = {
  supabase: ReturnType<typeof createRouteSupabase>;
  user: User;
  profile: ProfileRow;
};

const STAFF_ROLES = new Set(['author', 'editor', 'admin']);

function resolveBootstrapRole(user: User): ProfileRow['role'] {
  const meta = user.user_metadata?.role;
  if (meta === 'admin' || meta === 'editor' || meta === 'author') return meta;
  if (user.email?.toLowerCase() === 'adminops@gmail.com') return 'admin';
  return 'author';
}

/** Load profile with service role (bypasses RLS). Creates one if the auth user has no row yet. */
async function loadOrCreateStaffProfile(user: User): Promise<ProfileRow | null> {
  const admin = createServiceClient();

  const { data: existing, error: readError } = await admin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (readError) {
    console.error('Profile read failed:', readError.message);
    return null;
  }

  if (existing) return existing as ProfileRow;

  const email = user.email ?? '';
  const fullName =
    (user.user_metadata?.full_name as string) ||
    (user.user_metadata?.name as string) ||
    email.split('@')[0] ||
    'User';

  const { data: created, error: upsertError } = await admin
    .from('profiles')
    .upsert({
      id: user.id,
      email,
      full_name: fullName,
      role: resolveBootstrapRole(user),
      is_active: true,
      email_public: email,
    })
    .select('*')
    .single();

  if (upsertError) {
    console.error('Profile bootstrap failed:', upsertError.message);
    return null;
  }

  return created as ProfileRow;
}

export async function requireStaff(): Promise<
  { ok: true; ctx: StaffContext } | { ok: false; response: NextResponse }
> {
  const supabase = createRouteSupabase();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  const profile = await loadOrCreateStaffProfile(user);

  if (!profile || !profile.is_active) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error:
            'Forbidden — no active staff profile. Run supabase/admin-bootstrap.sql in the Supabase SQL Editor, then sign in again.',
        },
        { status: 403 },
      ),
    };
  }

  if (!STAFF_ROLES.has(profile.role)) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Forbidden — your account is not assigned a staff role.' },
        { status: 403 },
      ),
    };
  }

  return {
    ok: true,
    ctx: { supabase, user, profile },
  };
}
