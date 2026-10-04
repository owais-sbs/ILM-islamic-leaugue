import { NextResponse } from 'next/server';
import { tryCreateServiceClient } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export const dynamic = 'force-dynamic';

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
    admin.from('profiles').select('id, full_name, role, is_active, bio, madhhab, credentials, avatar_url'),
  ]);
  if (settingsError || staffError) {
    return NextResponse.json({ ok: false, error: settingsError?.message || staffError?.message }, { status: 500 });
  }

  const settingValue = setting?.value;
  const overrides = Array.isArray(settingValue) ? settingValue as Array<Record<string, unknown>> : [];
  const profilesById = new Map((staff || []).map((profile) => [profile.id, profile]));
  const profiles = overrides.flatMap((override) => {
    if (typeof override.id !== 'string') return [];
    const profile = profilesById.get(override.id);
    const active = profile ? profile.is_active : override.active !== false;
    const showInDirectory = override.showInDirectory === true;

    if (!active || !showInDirectory) return [{ id: override.id, active, showInDirectory }];
    if (!profile) {
      return [{
        id: override.id,
        active,
        showInDirectory,
        staffTitle: override.staffTitle,
        bio: override.bio,
        biography: override.biography,
        focus: override.focus,
        accent: override.accent,
        image: override.image,
      }];
    }
    return [{
      id: profile.id,
      name: profile.full_name,
      role: profile.role === 'admin' ? 'administrator' : profile.role,
      active,
      showInDirectory,
      staffTitle: typeof override.staffTitle === 'string' ? override.staffTitle : '',
      bio: typeof override.bio === 'string' ? override.bio : profile.bio || '',
      biography: Array.isArray(override.biography) ? override.biography : [],
      focus: override.focus || undefined,
      accent: override.accent || 'bg-sky-100 text-sky-700',
      image: typeof override.image === 'string' && override.image ? override.image : profile.avatar_url || '',
      madhhab: profile.madhhab || '',
    }];
  });

  return NextResponse.json({ ok: true, profiles });
}
