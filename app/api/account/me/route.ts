import { NextResponse } from 'next/server';
import { tryCreateServiceClient } from '@/lib/supabase/admin';
import { tryCreateServerSupabase } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export const dynamic = 'force-dynamic';

function mapRoleName(roleName: string | null | undefined): 'author' | 'editor' | 'administrator' | null {
  if (!roleName) return null;
  const n = roleName.toLowerCase();
  if (n === 'administrator' || n === 'admin') return 'administrator';
  if (n === 'editor') return 'editor';
  if (n === 'author') return 'author';
  return null;
}

/** Authenticated user clears must_change_password after a successful password update. */
export async function POST() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, error: 'Supabase is not configured' }, { status: 503 });
  }

  const supabase = tryCreateServerSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: 'Session unavailable' }, { status: 401 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Not signed in' }, { status: 401 });
  }

  const admin = tryCreateServiceClient() ?? supabase;
  const { error } = await admin
    .from('account')
    .update({ must_change_password: false, updated_at: new Date().toISOString() })
    .eq('auth_user_id', user.id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

/** Lookup must_change_password + role via account → role_mapping → role_master */
export async function GET(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, mustChangePassword: false, role: null });
  }

  const authUserId = new URL(req.url).searchParams.get('authUserId')?.trim();
  if (!authUserId) {
    return NextResponse.json({ ok: false, error: 'authUserId required' }, { status: 400 });
  }

  const admin = tryCreateServiceClient() ?? tryCreateServerSupabase();
  if (!admin) {
    return NextResponse.json({ ok: false, error: 'Database unavailable' }, { status: 503 });
  }

  const { data: account } = await admin
    .from('account')
    .select('id, must_change_password, full_name, email')
    .eq('auth_user_id', authUserId)
    .maybeSingle();

  if (!account) {
    return NextResponse.json({ ok: true, mustChangePassword: false, role: null, roleName: null });
  }

  const { data: mapping } = await admin
    .from('role_mapping')
    .select('role_id, role_master(role_name)')
    .eq('account_id', account.id)
    .limit(1)
    .maybeSingle();

  const roleMaster = mapping?.role_master as { role_name?: string } | { role_name?: string }[] | null;
  const roleName = Array.isArray(roleMaster)
    ? roleMaster[0]?.role_name
    : roleMaster?.role_name;

  return NextResponse.json({
    ok: true,
    mustChangePassword: Boolean(account.must_change_password),
    role: mapRoleName(roleName),
    roleName: roleName || null,
    fullName: account.full_name,
    email: account.email,
  });
}
