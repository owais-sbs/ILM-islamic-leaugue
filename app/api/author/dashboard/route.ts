import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/supabase/route-handler';

/**
 * GET /api/author/dashboard
 *
 * Returns article status counts for the signed-in author only.
 * Every query is scoped to author_id = auth.uid() — enforced both
 * in the application query AND by Supabase RLS on the articles table.
 */
export async function GET() {
  const auth = await requireStaff();
  if (!auth.ok) return auth.response;

  const { supabase, user, profile } = auth.ctx;

  // Fetch all of this author's articles in one query (RLS enforces author_id = user.id)
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, slug, status, category_id, updated_at, submitted_at, published_at, featured_image_url, excerpt, reading_minutes, categories(name)')
    .eq('author_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = articles ?? [];

  const counts = {
    draft:     rows.filter((a) => a.status === 'draft').length,
    submitted: rows.filter((a) => a.status === 'submitted').length,
    returned:  rows.filter((a) => a.status === 'returned').length,
    approved:  rows.filter((a) => a.status === 'approved').length,
    published: rows.filter((a) => a.status === 'published').length,
    total:     rows.length,
  };

  return NextResponse.json({
    profile,
    counts,
    recentArticles: rows.slice(0, 6),
  });
}
