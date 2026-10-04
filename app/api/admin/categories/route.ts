import { NextResponse } from 'next/server';
import { tryCreateServiceClient } from '@/lib/supabase/admin';
import { tryCreateServerSupabase } from '@/lib/supabase/server';
import { isSupabaseAdminConfigured, isSupabaseConfigured } from '@/lib/supabase/env';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

type CategoryAccess =
  | { ok: true; admin: NonNullable<ReturnType<typeof tryCreateServiceClient>> }
  | { ok: false; response: NextResponse };

async function authorizeCategoryWrite(): Promise<CategoryAccess> {
  const session = tryCreateServerSupabase();
  if (!session) {
    return { ok: false, response: NextResponse.json({ ok: false, error: 'Session unavailable' }, { status: 503 }) };
  }
  const { data: { user } } = await session.auth.getUser();
  if (!user) {
    return { ok: false, response: NextResponse.json({ ok: false, localOnly: true, error: 'No authenticated Supabase session.' }, { status: 401 }) };
  }

  const admin = tryCreateServiceClient();
  if (!admin) {
    return { ok: false, response: NextResponse.json({ ok: false, error: 'Service role unavailable' }, { status: 503 }) };
  }
  const { data: profile, error } = await admin
    .from('profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .maybeSingle();
  if (error) {
    return { ok: false, response: NextResponse.json({ ok: false, error: error.message }, { status: 500 }) };
  }
  if (!profile?.is_active || (profile.role !== 'admin' && profile.role !== 'editor')) {
    return { ok: false, response: NextResponse.json({ ok: false, error: 'Only editors and administrators can manage categories.' }, { status: 403 }) };
  }
  return { ok: true, admin };
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, categories: [], tags: [], error: 'Supabase not configured' }, { status: 503 });
  }
  const admin = tryCreateServiceClient();
  if (!admin) return NextResponse.json({ ok: false, categories: [], tags: [], error: 'Service role unavailable' }, { status: 503 });

  const [cats, tags] = await Promise.all([
    admin.from('categories').select('id, name, slug, display_order').order('display_order', { ascending: true }),
    admin.from('tags').select('id, name, slug').order('name', { ascending: true }),
  ]);

  if (cats.error) {
    return NextResponse.json({ ok: false, categories: [], tags: [], error: cats.error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    categories: (cats.data ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      articleCount: 0,
    })),
    tags: (tags.data ?? []).map((t) => t.name),
    tagsError: tags.error?.message ?? null,
  });
}

export async function POST(req: Request) {
  if (!isSupabaseConfigured() || !isSupabaseAdminConfigured()) {
    return NextResponse.json({ ok: false, error: 'Supabase admin not configured on Vercel' }, { status: 503 });
  }
  const access = await authorizeCategoryWrite();
  if (!access.ok) return access.response;
  const { admin } = access;

  let body: { name?: string; type?: 'category' | 'tag' };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const name = String(body.name || '').trim();
  const type = body.type === 'tag' ? 'tag' : 'category';
  if (!name) return NextResponse.json({ ok: false, error: 'name required' }, { status: 400 });
  const slug = slugify(name);
  if (!slug) return NextResponse.json({ ok: false, error: 'invalid name' }, { status: 400 });

  if (type === 'tag') {
    const { data, error } = await admin.from('tags').upsert({ name, slug }, { onConflict: 'slug' }).select('id, name, slug').single();
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, tag: data.name });
  }

  const { data, error } = await admin
    .from('categories')
    .upsert({ name, slug, display_order: 100 }, { onConflict: 'slug' })
    .select('id, name, slug')
    .single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({
    ok: true,
    category: { id: data.id, name: data.name, slug: data.slug, articleCount: 0 },
  });
}

export async function DELETE(req: Request) {
  if (!isSupabaseConfigured() || !isSupabaseAdminConfigured()) {
    return NextResponse.json({ ok: false, error: 'Supabase admin not configured on Vercel' }, { status: 503 });
  }
  const access = await authorizeCategoryWrite();
  if (!access.ok) return access.response;
  const { admin } = access;

  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const type = url.searchParams.get('type') === 'tag' ? 'tag' : 'category';
  const name = url.searchParams.get('name');

  if (type === 'tag') {
    if (!name) return NextResponse.json({ ok: false, error: 'name required' }, { status: 400 });
    const { error } = await admin.from('tags').delete().eq('name', name);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (!id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 });
  const { error } = await admin.from('categories').delete().eq('id', id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
