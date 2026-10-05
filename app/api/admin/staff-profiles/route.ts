import { NextResponse } from 'next/server';
import { requireAdminWrite } from '@/lib/supabase/admin-bridge';
import { tryCreateServiceClient } from '@/lib/supabase/admin';
import { isSupabaseAdminConfigured, isSupabaseConfigured } from '@/lib/supabase/env';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const FOCUS_OPTIONS = new Set(['Studies', 'Fiqh', 'Spiritual', 'Arabic']);
const ACCENT_OPTIONS = new Set([
  'bg-sky-100 text-sky-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-800',
  'bg-indigo-100 text-indigo-700',
  'bg-orange-100 text-orange-700',
  'bg-rose-100 text-rose-700',
]);

export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json({ ok: true, profiles: [] });
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ ok: false, error: 'Supabase service role is not configured' }, { status: 503 });
  }

  // Read with service role (public directory uses /api/staff-profiles). Admin UI needs overrides even without cookies.
  const admin = tryCreateServiceClient();
  if (!admin) return NextResponse.json({ ok: false, error: 'Database unavailable' }, { status: 503 });

  const { data, error } = await admin.from('site_settings').select('value').eq('key', 'staff_profiles').maybeSingle();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  const value = data?.value;
  return NextResponse.json({ ok: true, profiles: Array.isArray(value) ? value : [] });
}

export async function PUT(req: Request) {
  const access = await requireAdminWrite({ allowEditor: true, allowDemoBridge: true });
  if (!access.ok) return access.response;

  let body: { id?: string; patch?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const id = body.id?.trim();
  const input = body.patch;
  if (!id || !input || typeof input !== 'object') {
    return NextResponse.json({ ok: false, error: 'Profile id and changes are required' }, { status: 400 });
  }

  if (typeof input.staffTitle !== 'string' || typeof input.bio !== 'string' || !Array.isArray(input.biography)) {
    return NextResponse.json({ ok: false, error: 'Display title, bio, and biography are required' }, { status: 400 });
  }
  if (!input.biography.every((paragraph) => typeof paragraph === 'string')) {
    return NextResponse.json({ ok: false, error: 'Biography paragraphs must be text' }, { status: 400 });
  }
  if (input.focus !== null && input.focus !== undefined && !FOCUS_OPTIONS.has(String(input.focus))) {
    return NextResponse.json({ ok: false, error: 'Invalid focus area' }, { status: 400 });
  }
  if (typeof input.accent !== 'string' || !ACCENT_OPTIONS.has(input.accent)) {
    return NextResponse.json({ ok: false, error: 'Invalid profile accent' }, { status: 400 });
  }
  if (typeof input.image !== 'string' || input.image.length > 5_000_000) {
    return NextResponse.json({ ok: false, error: 'Profile image is invalid or too large' }, { status: 400 });
  }
  if (typeof input.showInDirectory !== 'boolean') {
    return NextResponse.json({ ok: false, error: 'Directory visibility is required' }, { status: 400 });
  }

  const profile = {
    id,
    staffTitle: input.staffTitle.slice(0, 300),
    bio: input.bio.slice(0, 2000),
    biography: (input.biography as string[]).map((paragraph) => paragraph.slice(0, 5000)).slice(0, 40),
    focus: input.focus || null,
    accent: input.accent,
    image: input.image,
    showInDirectory: input.showInDirectory,
  };

  const { data: current, error: readError } = await access.admin
    .from('site_settings')
    .select('value')
    .eq('key', 'staff_profiles')
    .maybeSingle();
  if (readError) return NextResponse.json({ ok: false, error: readError.message }, { status: 500 });

  const currentValue = current?.value;
  const profiles = Array.isArray(currentValue) ? (currentValue as Array<Record<string, unknown>>) : [];
  const index = profiles.findIndex((entry) => entry.id === id);
  if (index < 0) profiles.push(profile);
  else profiles[index] = { ...profiles[index], ...profile };

  const { error: saveError } = await access.admin
    .from('site_settings')
    .upsert({ key: 'staff_profiles', value: profiles }, { onConflict: 'key' });
  if (saveError) return NextResponse.json({ ok: false, error: saveError.message }, { status: 500 });

  return NextResponse.json({ ok: true, profile });
}
