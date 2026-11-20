import { NextResponse } from 'next/server';
import { mergeStaffProfile, type StaffAccount } from '@/lib/staff-merge';
import { tryCreateServiceClient } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_STORE = { 'Cache-Control': 'no-store, max-age=0' };

/**
 * Public Murabbiyūn directory data. Only fields that are safe to show publicly
 * (no emails, roles or account status details beyond visibility).
 *
 * Name, bio, title and photo come live from the account in `public.profiles`, so edits made in the
 * admin dashboard show on the public site without a second update. `site_settings.staff_profiles`
 * only adds display extras and visibility (see lib/staff-merge.ts).
 */
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, profiles: [] }, { headers: NO_STORE });
  }

  const admin = tryCreateServiceClient();
  if (!admin) {
    return NextResponse.json({ ok: false, error: 'Database unavailable' }, { status: 503, headers: NO_STORE });
  }

  const [{ data: setting, error: settingsError }, { data: staff, error: staffError }] = await Promise.all([
    admin.from('site_settings').select('value').eq('key', 'staff_profiles').maybeSingle(),
    admin.from('profiles').select('id, full_name, is_active, role, bio, madhhab, credentials, avatar_url'),
  ]);
  if (settingsError || staffError) {
    return NextResponse.json(
      { ok: false, error: settingsError?.message || staffError?.message },
      { status: 500, headers: NO_STORE },
    );
  }

  const overrides = Array.isArray(setting?.value) ? (setting!.value as Array<Record<string, unknown>>) : [];
  const accounts = new Map((staff || []).map((profile) => [profile.id, profile as StaffAccount]));

  const profiles = overrides.flatMap((override) => {
    const merged = mergeStaffProfile(override, typeof override.id === 'string' ? accounts.get(override.id) : undefined);
    return merged ? [merged] : [];
  });

  return NextResponse.json({ ok: true, profiles }, { headers: NO_STORE });
}
