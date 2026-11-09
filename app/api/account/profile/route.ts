import { NextResponse } from 'next/server';
import { tryCreateServiceClient } from '@/lib/supabase/admin';
import { tryCreateServerSupabase } from '@/lib/supabase/server';
import { isSupabaseAdminConfigured, isSupabaseConfigured } from '@/lib/supabase/env';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Body = {
  fullName?: string;
  email?: string;
  bio?: string;
  madhhab?: string;
  credentials?: string;
  /** Public HTTPS URL or data URL (image/*;base64,...) */
  avatarUrl?: string | null;
};

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'user'
  );
}

function parseDataUrl(dataUrl: string): { contentType: string; buffer: Buffer } | null {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
  if (!match) return null;
  try {
    return { contentType: match[1], buffer: Buffer.from(match[2], 'base64') };
  } catch {
    return null;
  }
}

async function uploadAvatar(
  admin: NonNullable<ReturnType<typeof tryCreateServiceClient>>,
  userId: string,
  avatarUrl: string,
) {
  if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
    return avatarUrl;
  }

  const parsed = parseDataUrl(avatarUrl);
  if (!parsed) return null;
  if (parsed.buffer.length > 4.5 * 1024 * 1024) {
    throw new Error('Avatar exceeds 4.5 MB');
  }

  const ext = parsed.contentType.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
  const path = `${userId}/${Date.now()}.${ext}`;

  const upload = await admin.storage.from('avatars').upload(path, parsed.buffer, {
    contentType: parsed.contentType,
    upsert: true,
  });

  if (upload.error) {
    const missingBucket = /bucket|not found|does not exist/i.test(upload.error.message);
    if (!missingBucket) throw new Error(upload.error.message);
    await admin.storage.createBucket('avatars', {
      public: true,
      fileSizeLimit: 5242880,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    });
    const retry = await admin.storage.from('avatars').upload(path, parsed.buffer, {
      contentType: parsed.contentType,
      upsert: true,
    });
    if (retry.error) throw new Error(retry.error.message);
  }

  const { data: pub } = admin.storage.from('avatars').getPublicUrl(path);
  return pub.publicUrl;
}

/** Persist the signed-in user's My Profile fields to Supabase. */
export async function PATCH(req: Request) {
  if (!isSupabaseConfigured() || !isSupabaseAdminConfigured()) {
    return NextResponse.json({ ok: false, error: 'Supabase is not configured' }, { status: 503 });
  }

  const session = tryCreateServerSupabase();
  const admin = tryCreateServiceClient();
  if (!session || !admin) {
    return NextResponse.json({ ok: false, error: 'Auth unavailable' }, { status: 503 });
  }

  const {
    data: { user },
  } = await session.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Not signed in' }, { status: 401 });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const fullName = (body.fullName || '').trim().slice(0, 120);
  const email = (body.email || '').trim().toLowerCase().slice(0, 200);
  if (!fullName || !email || !email.includes('@')) {
    return NextResponse.json({ ok: false, error: 'Full name and a valid email are required' }, { status: 400 });
  }

  let avatarPublicUrl: string | null | undefined = undefined;
  if (body.avatarUrl === null || body.avatarUrl === '') {
    avatarPublicUrl = null;
  } else if (typeof body.avatarUrl === 'string' && body.avatarUrl.trim()) {
    try {
      avatarPublicUrl = await uploadAvatar(admin, user.id, body.avatarUrl.trim());
      if (!avatarPublicUrl) {
        return NextResponse.json({ ok: false, error: 'Invalid avatar image' }, { status: 400 });
      }
    } catch (err) {
      return NextResponse.json(
        { ok: false, error: err instanceof Error ? err.message : 'Avatar upload failed' },
        { status: 500 },
      );
    }
  }

  const profilePatch: Record<string, unknown> = {
    full_name: fullName,
    email,
    bio: (body.bio || '').trim(),
    madhhab: (body.madhhab || '').trim() || null,
    credentials: (body.credentials || '').trim() || null,
    slug: slugify(fullName),
    updated_at: new Date().toISOString(),
  };
  if (avatarPublicUrl !== undefined) {
    profilePatch.avatar_url = avatarPublicUrl;
  }

  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .update(profilePatch)
    .eq('id', user.id)
    .select('id, full_name, email, bio, madhhab, credentials, avatar_url, role')
    .maybeSingle();

  if (profileError) {
    return NextResponse.json({ ok: false, error: profileError.message }, { status: 500 });
  }
  if (!profile) {
    return NextResponse.json({ ok: false, error: 'Profile not found' }, { status: 404 });
  }

  // Keep account.full_name in sync when the mapping table exists
  await admin
    .from('account')
    .update({
      full_name: fullName,
      email,
      updated_at: new Date().toISOString(),
    })
    .eq('auth_user_id', user.id);

  return NextResponse.json({
    ok: true,
    profile: {
      id: profile.id,
      name: profile.full_name,
      email: profile.email,
      bio: profile.bio || '',
      madhhab: profile.madhhab || '',
      credentials: profile.credentials || '',
      image: profile.avatar_url || undefined,
      role: profile.role,
    },
  });
}
