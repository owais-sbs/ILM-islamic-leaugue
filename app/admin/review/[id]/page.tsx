'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CornerUpLeft,
  Eye,
  EyeOff,
  FileEdit,
  Loader2,
  Send,
  SendHorizontal,
  X,
} from 'lucide-react';
import { Card } from '@/components/admin/AdminUI';
import { StatusBadge } from '@/components/StatusBadge';
import { usePermissions, useRole } from '@/components/admin/RoleContext';
import { useAuth } from '@/components/admin/AuthProvider';
import { logActivity } from '@/lib/supabase/admin-helpers';
import { saveAdminArticle, fetchAdminArticle } from '@/lib/admin-api';
import type { ArticleRow, DbArticleStatus } from '@/lib/supabase/types';
import { mockArticles, mockAuthors, mockCategories } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

// ── Confirmation dialog ────────────────────────────────────────────────────
type ConfirmType = 'publish' | 'unpublish' | 'approve' | 'return' | null;

interface ConfirmDialogProps {
  type: ConfirmType;
  title: string;
  excerpt: string;
  authorName: string;
  category: string;
  imageUrl?: string;
  reviewNotes: string;
  onCancel: () => void;
  onConfirm: () => void;
}

function ConfirmDialog({
  type, title, excerpt, authorName, category, imageUrl,
  reviewNotes, onCancel, onConfirm,
}: ConfirmDialogProps) {
  const isReturn = type === 'return';
  const isPublish = type === 'publish';
  const isUnpublish = type === 'unpublish';

  const headings: Record<NonNullable<ConfirmType>, string> = {
    publish:   'Publish this article?',
    unpublish: 'Unpublish this article?',
    approve:   'Approve this article?',
    return:    'Return to author?',
  };

  const actionLabels: Record<NonNullable<ConfirmType>, string> = {
    publish:   'Publish Article',
    unpublish: 'Unpublish Article',
    approve:   'Approve Article',
    return:    'Return to Author',
  };

  const actionColors: Record<NonNullable<ConfirmType>, string> = {
    publish:   'bg-ilm-navy hover:bg-ilm-navy-light text-white',
    unpublish: 'bg-rose-600 hover:bg-rose-700 text-white',
    approve:   'bg-amber-500 hover:bg-amber-600 text-white',
    return:    'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={onCancel}>
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="font-display text-xl text-ilm-navy">{type ? headings[type] : ''}</h2>
          <button onClick={onCancel} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Article preview */}
          <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
            {imageUrl ? (
              <img src={imageUrl} alt="" className="h-14 w-20 shrink-0 rounded-lg object-cover" />
            ) : (
              <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-[10px] text-slate-400">No img</div>
            )}
            <div className="min-w-0">
              <p className="font-medium text-slate-800 line-clamp-2">{title}</p>
              <p className="mt-0.5 text-xs text-slate-500">{authorName} · {category}</p>
              <p className="mt-1 text-[11px] text-slate-400 line-clamp-1">{excerpt}</p>
            </div>
          </div>

          {/* Context messages */}
          {isPublish && (
            <div className="flex items-start gap-2.5 rounded-lg bg-sky-50 px-3 py-2.5 text-sm text-sky-800">
              <SendHorizontal size={15} className="mt-0.5 shrink-0" />
              This article will be made visible on the public website immediately.
            </div>
          )}
          {isUnpublish && (
            <div className="flex items-start gap-2.5 rounded-lg bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
              <AlertTriangle size={15} className="mt-0.5 shrink-0" />
              The article will be removed from the public website and returned to <strong>Approved</strong> status.
            </div>
          )}
          {isReturn && (
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[.14em] text-slate-400">
                Review notes <span className="text-rose-500">*</span>
              </label>
              <p className="mb-2 rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-700 min-h-[60px] whitespace-pre-wrap">
                {reviewNotes || <span className="text-slate-400 italic">No notes entered yet — add them in the review panel first.</span>}
              </p>
              {!reviewNotes.trim() && (
                <p className="text-xs text-rose-600">⚠ Review notes are required before returning to the author.</p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 border-t border-slate-100 px-6 py-4">
          <button onClick={onCancel} className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isReturn && !reviewNotes.trim()}
            className={cn('flex-1 rounded-lg py-2.5 text-sm font-semibold transition disabled:opacity-40', type ? actionColors[type] : '')}
          >
            {type ? actionLabels[type] : ''}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Mock article adapter ───────────────────────────────────────────────────
function buildMockArticleRow(id: string): ArticleRow | null {
  const mock = mockArticles.find((a) => a.id === id);
  if (!mock) return null;
  const cat  = mockCategories.find((c) => c.id === mock.categoryId);
  const auth = mockAuthors.find((a) => a.id === mock.authorId);
  return {
    id: mock.id,
    title: mock.title,
    slug: mock.slug,
    excerpt: mock.excerpt,
    body_html: mock.content,
    footnotes: '',
    status: mock.status as DbArticleStatus,
    category_id: mock.categoryId,
    author_id: mock.authorId ?? null,
    featured_image_url: mock.featuredImageUrl,
    seo_title: mock.seoTitle,
    seo_description: mock.seoDescription,
    review_notes: '',
    reading_minutes: mock.readingTime,
    views: 0,
    submitted_at: null,
    approved_by: null,
    published_at: mock.publishedAt,
    created_at: mock.createdAt,
    updated_at: mock.updatedAt,
    categories: cat ? { name: cat.name } : null,
    profiles: auth ? { full_name: auth.fullName, avatar_url: auth.avatarUrl } : null,
  } as unknown as ArticleRow;
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function ReviewPage({ params }: { params: { id: string } }) {
  const router  = useRouter();
  const perms   = usePermissions();
  const { role } = useRole();
  const { user, profile } = useAuth();

  const [article, setArticle]       = useState<ArticleRow | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [message, setMessage]       = useState('');
  const [confirm, setConfirm]       = useState<ConfirmType>(null);

  const isMock = role === 'author'; // editor and admin always use real Supabase

  useEffect(() => {
    const load = async () => {
      if (isMock) {
        const row = buildMockArticleRow(params.id);
        setArticle(row);
        setReviewNotes(row?.review_notes || '');
        setLoading(false);
        return;
      }
      try {
        const { article: row } = await fetchAdminArticle(params.id);
        const typedRow = row as unknown as ArticleRow;
        setArticle(typedRow);
        setReviewNotes(typedRow?.review_notes || '');
      } catch {
        // Article not found or permission denied — leave as null
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.id, isMock]);

  const applyStatus = async (status: DbArticleStatus | 'unpublished') => {
    if (!article) return;
    setSaving(true);
    setMessage('');
    setConfirm(null);

    const nextStatus: DbArticleStatus = status === 'unpublished' ? 'approved' : status;

    if (isMock) {
      // Mock update — update local state only
      await new Promise((r) => setTimeout(r, 500));
      setArticle({ ...article, status: nextStatus, review_notes: reviewNotes });
      setSaving(false);
      setMessage(`Article marked as ${nextStatus}.`);
      setTimeout(() => router.push('/admin/articles'), 900);
      return;
    }

    // Use the API route (service-role key) so RLS never blocks status changes.
    const patch: Record<string, unknown> = {
      status: nextStatus,
      review_notes: reviewNotes,
    };
    if (status === 'submitted') patch.submitted_at = new Date().toISOString();
    if (status === 'approved')  patch.approved_by  = user?.id;
    if (status === 'published') {
      patch.approved_by = user?.id;
      if (!article.published_at) patch.published_at = new Date().toISOString();
    }

    try {
      await saveAdminArticle(patch, article.id);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to update article');
      setSaving(false);
      return;
    }

    // Bust the public site cache immediately on publish or unpublish.
    if (status === 'published' || status === 'unpublished') {
      fetch('/api/revalidate', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paths: ['/', '/articles', `/articles/${article.slug}`],
        }),
      }).catch(() => {});
    }

    await logActivity({
      actorId:     user?.id,
      actorName:   profile?.full_name || 'Admin',
      action:      status === 'unpublished' ? 'unpublished' : status,
      entityType:  'article',
      entityId:    article.id,
      entityLabel: article.title,
      metadata:    { review_notes: reviewNotes },
    });

    setSaving(false);
    setMessage(`Article marked as ${status === 'unpublished' ? 'unpublished (approved)' : status}.`);
    setArticle({ ...article, status: nextStatus, review_notes: reviewNotes });
    setTimeout(() => router.push('/admin/articles'), 900);
  };

  const requestConfirm = (type: ConfirmType) => {
    if (type === 'return' && !reviewNotes.trim()) {
      setMessage('Please add review notes before returning the article.');
      return;
    }
    setConfirm(type);
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
      {/* Back + status bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/review"
          className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-ilm-navy"
        >
          <ArrowLeft size={16} /> Back to queue
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
        {/* Article preview */}
        <Card className="overflow-hidden">
          {article.featured_image_url && (
            <img src={article.featured_image_url} alt="" className="aspect-[2.5] w-full object-cover" />
          )}
          <div className="p-6 md:p-8">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-ilm-navy">
                {article.categories?.name || 'Uncategorised'}
              </span>
              <span className="text-xs text-slate-400">{article.reading_minutes} min read</span>
            </div>
            <h1 className="font-display text-3xl font-semibold text-ilm-navy md:text-4xl">
              {article.title}
            </h1>
            <p className="mt-3 text-slate-500">{article.excerpt}</p>
            <div className="mt-5 flex items-center gap-3 border-b border-slate-100 pb-6">
              <img
                src={article.profiles?.avatar_url || 'https://images.pexels.com/photos/14819810/pexels-photo-14819810.jpeg?auto=compress&cs=tinysrgb&h=80&w=80'}
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
            <article className="article-body mt-6 max-w-none" dangerouslySetInnerHTML={{ __html: article.body_html }} />
            {article.footnotes && (
              <div className="mt-8 border-t border-slate-100 pt-4 text-sm text-slate-500 whitespace-pre-wrap">
                {article.footnotes}
              </div>
            )}

            {/* SEO info */}
            {(article.seo_title || article.seo_description) && (
              <div className="mt-8 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.14em] text-slate-400">SEO</p>
                {article.seo_title && <p className="text-sm font-medium text-slate-700">{article.seo_title}</p>}
                {article.seo_description && <p className="mt-1 text-xs text-slate-500">{article.seo_description}</p>}
              </div>
            )}
          </div>
        </Card>

        {/* Review panel */}
        <div className="space-y-4">
          {/* Review notes */}
          <Card className="p-5">
            <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">
              Review notes
            </h3>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Required when returning. Visible to the author."
              rows={5}
              className="w-full resize-none rounded-lg border border-slate-200 p-3 text-sm outline-none transition focus:border-ilm-navy/40 focus:ring-1 focus:ring-ilm-navy/10"
            />
          </Card>

          {/* Previous notes */}
          {article.status === 'returned' && article.review_notes && (
            <Card className="border-rose-100 bg-rose-50/50 p-5">
              <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[.16em] text-rose-500">
                Previous notes
              </h3>
              <p className="text-sm leading-6 text-rose-800">{article.review_notes}</p>
            </Card>
          )}

          {/* Workflow actions */}
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
                    onClick={() => requestConfirm('approve')}
                    className="flex w-full items-center gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 disabled:opacity-60"
                  >
                    <Check size={16} /> Approve
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => requestConfirm('return')}
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
                    onClick={() => requestConfirm('publish')}
                    className="flex w-full items-center gap-2 rounded-lg bg-ilm-navy px-4 py-3 text-sm font-semibold text-white transition hover:bg-ilm-navy-light disabled:opacity-60"
                  >
                    <SendHorizontal size={16} /> Publish
                  </button>
                  {article.status === 'published' && (
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => requestConfirm('unpublish')}
                      className="flex w-full items-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-60"
                    >
                      <EyeOff size={16} /> Unpublish
                    </button>
                  )}
                </>
              )}

              {saving && (
                <p className="flex items-center gap-2 pt-1 text-xs text-slate-400">
                  <Loader2 size={14} className="animate-spin" /> Saving…
                </p>
              )}

              {!perms.canApprove && !perms.canPublish && (
                <p className="rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-500">
                  Only Editors and Administrators can approve or publish articles.
                </p>
              )}
            </div>
          </Card>

          {/* Workflow hint */}
          <p className="px-1 text-[11px] leading-5 text-slate-400">
            Flow: <span className="font-medium">draft → submitted → approved → published</span>.
            Return sends back with notes. Unpublish moves live article to approved.
          </p>
        </div>
      </div>

      {/* Confirmation dialog */}
      {confirm && (
        <ConfirmDialog
          type={confirm}
          title={article.title}
          excerpt={article.excerpt}
          authorName={article.profiles?.full_name || 'Unknown'}
          category={article.categories?.name || 'Uncategorised'}
          imageUrl={article.featured_image_url || undefined}
          reviewNotes={reviewNotes}
          onCancel={() => setConfirm(null)}
          onConfirm={() => applyStatus(confirm === 'unpublish' ? 'unpublished' : (confirm as DbArticleStatus))}
        />
      )}
    </div>
  );
}
