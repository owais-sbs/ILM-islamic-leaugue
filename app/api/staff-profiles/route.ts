import { NextResponse } from 'next/server';
import { tryCreateServiceClient } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export const dynamic = 'force-dynamic';

const str = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

/** Account form fills `credentials` with the role name when no title is given — not a display title. */
const ROLE_LABELS = new Set(['author', 'editor', 'admin', 'administrator']);
const displayTitle = (value: unknown) => {
  const title = str(value);
  return ROLE_LABELS.has(title.toLowerCase()) ? '' : title;
};

/**
 * Public Murabbiyūn directory data. Only fields that are safe to show publicly
 * (no emails, roles or account status details beyond visibility).
 */
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, profiles: [] });
  }

  const admin = tryCreateServiceClient();
  if (!admin) {
    return NextResponse.json({ ok: false, error: 'Database unavailable' }, { status: 503 });
  }

  const [{ data: setting, error: settingsError }, { data: staff, error: staffError }] = await Promise.all([
    admin.from('site_settings').select('value').eq('key', 'staff_profiles').maybeSingle(),
    admin.from('profiles').select('id, full_name, is_active, bio, madhhab, credentials, avatar_url'),
  ]);
  if (settingsError || staffError) {
    return NextResponse.json({ ok: false, error: settingsError?.message || staffError?.message }, { status: 500 });
  }

  const overrides = Array.isArray(setting?.value) ? (setting!.value as Array<Record<string, unknown>>) : [];
  const accounts = new Map((staff || []).map((profile) => [profile.id, profile]));

  const profiles = overrides.flatMap((override) => {
    if (typeof override.id !== 'string') return [];
    const account = accounts.get(override.id);
    const active = account ? account.is_active !== false : override.active !== false;
    const showInDirectory = override.showInDirectory === true;
    const directoryId = str(override.directoryId) || undefined;

    if (!active || !showInDirectory) return [{ id: override.id, directoryId, active, showInDirectory }];

    return [{
      id: override.id,
      directoryId,
      active,
      showInDirectory,
      name: str(account?.full_name),
      staffTitle: str(override.staffTitle) || displayTitle(account?.credentials),
      bio: str(override.bio) || str(account?.bio),
      biography: Array.isArray(override.biography) ? override.biography.filter((p) => typeof p === 'string') : [],
      focus: override.focus || undefined,
      accent: str(override.accent) || undefined,
      image: str(override.image) || str(account?.avatar_url),
      madhhab: str(account?.madhhab),
    }];
  });

  return NextResponse.json({ ok: true, profiles });
}
