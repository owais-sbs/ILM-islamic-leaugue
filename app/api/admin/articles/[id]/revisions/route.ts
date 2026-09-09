import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/supabase/route-handler';

type Params = { params: { id: string } };

/**
 * GET /api/admin/articles/[id]/revisions
 *
 * Returns the revision history for an article from article_revisions.
 * Ordered newest-first. Only accessible to authenticated staff.
 */
export async function GET(_request: Request, { params }: Params) {
  const auth = await requireStaff();
  if (!auth.ok) return auth.response;

  const { supabase } = auth.ctx;

  const { data, error } = await supabase
    .from('article_revisions')
    .select('id, article_id, title, body_html, edited_by, created_at, profiles!edited_by(full_name)')
    .eq('article_id', params.id)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ revisions: data ?? [] });
}
