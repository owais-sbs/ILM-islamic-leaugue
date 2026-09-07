import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/supabase/route-handler';

export async function GET() {
  const auth = await requireStaff();
  if (!auth.ok) return auth.response;

  const { supabase } = auth.ctx;

  const [{ data: articles, error: articlesError }, { data: questions }, { data: authors }] =
    await Promise.all([
      supabase
        .from('articles')
        .select('*, profiles!author_id(full_name, avatar_url)')
        .order('updated_at', { ascending: false }),
      supabase.from('questions').select('*'),
      supabase.from('profiles').select('*').eq('is_active', true),
    ]);

  if (articlesError) {
    return NextResponse.json({ error: articlesError.message }, { status: 500 });
  }

  return NextResponse.json({
    articles: articles ?? [],
    questions: questions ?? [],
    authors: authors ?? [],
  });
}
