import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/admin';
import { requireStaff } from '@/lib/supabase/route-handler';

type Params = { params: { id: string } };

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireStaff();
  if (!auth.ok) return auth.response;

  const { supabase } = auth.ctx;
  const { data, error } = await supabase
    .from('articles')
    .select('*, article_tags(tags(id, name, slug))')
    .eq('id', params.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const tagNames = (data.article_tags || [])
    .map((t: { tags?: { name?: string } | null }) => t.tags?.name)
    .filter(Boolean) as string[];

  return NextResponse.json({ article: data, tagNames });
}

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireStaff();
  if (!auth.ok) return auth.response;

  const { supabase, profile } = auth.ctx;
  const body = await request.json();
  const { tagNames, ...payload } = body;

  if (payload.status === 'published' && profile.role === 'author') {
    return NextResponse.json(
      { error: 'Only editors and admins can publish articles.' },
      { status: 403 },
    );
  }

  const { data, error } = await supabase
    .from('articles')
    .update(payload)
    .eq('id', params.id)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (Array.isArray(tagNames)) {
    await supabase.from('article_tags').delete().eq('article_id', params.id);
    const { data: tags } = await supabase.from('tags').select('id, name');
    const matched = (tags || []).filter((t) => tagNames.includes(t.name));
    if (matched.length > 0) {
      await supabase.from('article_tags').insert(
        matched.map((t) => ({ article_id: params.id, tag_id: t.id })),
      );
    }
  }

  return NextResponse.json({ article: data, status: data.status });
}

export async function DELETE(_request: Request, { params }: Params) {
  const auth = await requireStaff();
  if (!auth.ok) return auth.response;

  const { supabase, user, profile } = auth.ctx;

  const { data: article, error: fetchError } = await supabase
    .from('articles')
    .select('id, author_id, status, title')
    .eq('id', params.id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }
  if (!article) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const isOwner = article.author_id === user.id;
  const canDelete =
    profile.role === 'admin' ||
    profile.role === 'editor' ||
    (isOwner && ['draft', 'returned'].includes(article.status));

  if (!canDelete) {
    return NextResponse.json({ error: 'You cannot delete this article.' }, { status: 403 });
  }

  const db =
    profile.role === 'admin' || profile.role === 'editor'
      ? createServiceClient()
      : supabase;

  const { error } = await db.from('articles').delete().eq('id', params.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
