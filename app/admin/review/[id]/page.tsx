'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Check,
  CornerUpLeft,
  FileEdit,
  Loader2,
  Send,
  SendHorizontal,
} from 'lucide-react';
import { Card } from '@/components/admin/AdminUI';
import { StatusBadge } from '@/components/StatusBadge';
import { usePermissions } from '@/components/admin/RoleContext';
import { useAuth } from '@/components/admin/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { logActivity } from '@/lib/supabase/admin-helpers';
import type { ArticleRow, DbArticleStatus } from '@/lib/supabase/types';
import { cn } from '@/lib/utils';

export default function ReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const perms = usePermissions();
  const { user, profile } = useAuth();
  const [article, setArticle] = useState<ArticleRow | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('articles')
        .select('*, categories(name), profiles(full_name, avatar_url)')
        .eq('id', params.id)
        .maybeSingle();
      const row = data as ArticleRow | null;
      setArticle(row);
      setReviewNotes(row?.review_notes || '');
      setLoading(false);
    };
    load();
  }, [params.id]);

  const applyStatus = async (status: DbArticleStatus | 'unpublished') => {
    if (!article) return;
    if (status === 'returned' && !reviewNotes.trim()) {
      setMessage('Add review notes before returning an article to the author.');
      return;
    }
    setSaving(true);
    setMessage('');
    const supabase = createClient();

    const nextStatus: DbArticleStatus = status === 'unpublished' ? 'approved' : status;
    const patch: Record<string, unknown> = {
      status: nextStatus,
      review_notes: reviewNotes,
    };

    if (status === 'submitted') patch.submitted_at = new Date().toISOString();
    if (status === 'approved') patch.approved_by = user?.id;
    if (status === 'published') {
      patch.approved_by = user?.id;
      if (!article.published_at) patch.published_at = new Date().toISOString();
    }
    if (status === 'unpublished') {
      // Keep published_at history but remove from public (status → approved)
      patch.published_at = article.published_at;
    }

    const { error } = await supabase.from('articles').update(patch).eq('id', article.id);
    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    await logActivity({
      actorId: user?.id,
      actorName: profile?.full_name || 'Admin',
      action: status === 'unpublished' ? 'unpublished' : status,
      entityType: 'article',
      entityId: article.id,
      entityLabel: article.title,
      metadata: { review_notes: reviewNotes },
    });

    setSaving(false);
    setMessage(`Article marked as ${status === 'unpublished' ? 'unpublished (approved)' : status}.`);
    setArticle({ ...article, status: nextStatus, review_notes: reviewNotes });
    setTimeout(() => router.push('/admin/articles'), 900);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24 text-sm text-slate-500">
        <Loader2 className="mr-2 animate-spin" size={18} /> Loading review…
      </div>
    );
  }

  if (!article) {
    return (
      <Card className="p-8 text-center">
        <p className="text-sm text-slate-500">Article not found.</p>
        <Link href="/admin/articles" className="mt-3 inline-block text-sm font-medium text-ilm-navy hover:underline">
          Back to articles
        </Link>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/articles"
          className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-ilm-navy"
        >
          <ArrowLeft size={16} /> Back to articles
        </Link>
        <div className="flex items-center gap-2">
          <StatusBadge status={article.status} />
          <Link
            href={`/admin/articles/${article.id}/edit`}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-sky-50"
          >
            <FileEdit size={14} /> Edit
          </Link>
        </div>
      </div>

      {message && (
        <div className="mb-4 rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-ilm-navy">
          {message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card className="overflow-hidden">
          {article.featured_image_url && (
            <img src={article.featured_image_url} alt="" className="aspect-[2.5] w-full object-cover" />
          )}
          <div className="p-6 md:p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-ilm-navy">
                {article.categories?.name || 'Uncategorised'}
              </span>
              <span className="text-xs text-slate-400">{article.reading_minutes} min read</span>
            </div>
            <h1 className="font-display text-3xl font-semibold text-ilm-navy md:text-4xl">
              {article.title}
            </h1>
            <div className="mt-4 flex items-center gap-3 border-b border-slate-100 pb-6">
              <img
                src={
                  article.profiles?.avatar_url ||
                  'https://images.pexels.com/photos/14819810/pexels-photo-14819810.jpeg?auto=compress&cs=tinysrgb&h=80&w=80'
                }
                alt=""
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {article.profiles?.full_name || 'Unknown author'}
                </p>
                <p className="text-xs text-slate-400">
                  Updated {new Date(article.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
            <article
              className="article-body mt-6 max-w-none"
              dangerouslySetInnerHTML={{ __html: article.body_html }}
            />
            {article.footnotes && (
              <div className="mt-8 border-t border-slate-100 pt-4 text-sm text-slate-500 whitespace-pre-wrap">
                {article.footnotes}
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">
              Review notes
            </h3>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Required when returning. Visible to the author on the edit screen."
              rows={5}
              className="w-full resize-none rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-ilm-navy/40"
            />
          </Card>

          {article.status === 'returned' && article.review_notes && (
            <Card className="border-rose-100 bg-rose-50/50 p-5">
              <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[.16em] text-rose-500">
                Previous notes
              </h3>
              <p className="text-sm leading-6 text-rose-800">{article.review_notes}</p>
            </Card>
          )}

          <Card className="p-5">
            <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">
              Workflow actions
            </h3>
            <div className="space-y-2">
              {perms.canApprove && (
                <>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => applyStatus('approved')}
                    className="flex w-full items-center gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 disabled:opacity-60"
                  >
                    <Check size={16} /> Approve
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => applyStatus('returned')}
                    className="flex w-full items-center gap-2 rounded-lg bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
                  >
                    <CornerUpLeft size={16} /> Return to author
                  </button>
                </>
              )}
              {perms.canPublish && (
                <>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => applyStatus('published')}
                    className="flex w-full items-center gap-2 rounded-lg bg-ilm-navy px-4 py-3 text-sm font-semibold text-white transition hover:bg-ilm-navy-light disabled:opacity-60"
                  >
                    <SendHorizontal size={16} /> Publish
                  </button>
                  {article.status === 'published' && (
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => applyStatus('unpublished')}
                      className="flex w-full items-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 disabled:opacity-60"
                    >
                      <Send size={16} /> Unpublish
                    </button>
                  )}
                </>
              )}
              {saving && (
                <p className="flex items-center gap-2 pt-1 text-xs text-slate-400">
                  <Loader2 size={14} className="animate-spin" /> Saving…
                </p>
              )}
            </div>
          </Card>

          {!perms.canApprove && !perms.canPublish && (
            <Card className="bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Only Editors and Administrators can approve, return, or publish articles.
              </p>
            </Card>
          )}

          <p className={cn('text-[11px] leading-5 text-slate-400')}>
            Flow: draft → submitted → approved → published. Return sends the article back with notes.
            Unpublish moves a live article back to approved.
          </p>
        </div>
      </div>
    </div>
  );
}
