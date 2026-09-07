import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/supabase/route-handler';

export async function GET(request: Request) {
  const auth = await requireStaff();
  if (!auth.ok) return auth.response;

  const { supabase, user, profile } = auth.ctx;
  const scope = new URL(request.url).searchParams.get('scope');

  let query = supabase
    .from('articles')
    .select('*, categories(name), profiles!author_id(full_name, avatar_url)')
    .order('updated_at', { ascending: false });

  const canViewAll = profile.role === 'editor' || profile.role === 'admin';
  if (scope === 'mine' || !canViewAll) {
    query = query.eq('author_id', user.id);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ articles: data ?? [] });
}

export async function POST(request: Request) {
  const auth = await requireStaff();
  if (!auth.ok) return auth.response;

  const { supabase, user } = auth.ctx;
  const body = await request.json();
  const { tagNames, ...payload } = body;

  if (!payload.title?.trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const insertPayload = {
    ...payload,
    author_id: user.id,
  };

  const { data, error } = await supabase
    .from('articles')
    .insert(insertPayload)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (Array.isArray(tagNames) && tagNames.length > 0) {
    const { data: tags } = await supabase.from('tags').select('id, name');
    const matched = (tags || []).filter((t) => tagNames.includes(t.name));
    if (matched.length > 0) {
      await supabase.from('article_tags').insert(
        matched.map((t) => ({ article_id: data.id, tag_id: t.id })),
      );
    }
  }

  return NextResponse.json({ article: data, status: data.status });
}
