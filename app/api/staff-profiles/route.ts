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
 * For every contributor in the directory list, name / bio / title / photo / madhhab are read live
 * from `public.profiles` and win over any stale CMS override. `site_settings.staff_profiles` only
 * controls visibility and extras (multi-paragraph biography, focus, accent, directoryId).
 * See lib/staff-merge.ts.
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
