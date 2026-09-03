'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, CornerUpLeft, Send, SendHorizontal } from 'lucide-react';
import { Card } from '@/components/admin/AdminUI';
import { StatusBadge } from '@/components/StatusBadge';
import { usePermissions } from '@/components/admin/RoleContext';
import { articles } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function ReviewPage({ params }: { params: { id: string } }) {
  const perms = usePermissions();
  const article = articles.find((a) => a.id === params.id) || articles[0];
  const [reviewNotes, setReviewNotes] = useState('');
  const [action, setAction] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/articles" className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-ilm-gold">
          <ArrowLeft size={16} /> Back to articles
        </Link>
        <StatusBadge status={article.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Article preview */}
        <Card className="overflow-hidden">
          {article.featuredImage && (
            <img src={article.featuredImage} alt="" className="aspect-[2.5] w-full object-cover" />
          )}
          <div className="p-6 md:p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-full bg-ilm-cream px-3 py-1 text-xs font-medium text-ilm-navy">{article.category}</span>
              <span className="text-xs text-slate-400">{article.readTime}</span>
            </div>
            <h1 className="font-display text-3xl font-semibold text-ilm-navy md:text-4xl">{article.title}</h1>
            <div className="mt-4 flex items-center gap-3 border-b border-slate-100 pb-6">
              <img src={article.authorAvatar} alt="" className="h-10 w-10 rounded-full object-cover" />
              <div>
                <p className="text-sm font-medium text-slate-700">{article.authorName}</p>
                <p className="text-xs text-slate-400">Submitted {article.updatedAt}</p>
              </div>
            </div>
            <article className="article-body mt-6" dangerouslySetInnerHTML={{ __html: article.body }} />
          </div>
        </Card>

        {/* Review panel */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Review notes</h3>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Add notes for the author. These will be visible if the article is returned."
              rows={5}
              className="w-full resize-none rounded-lg border border-slate-200 p-3 text-sm text-slate-700 outline-none transition focus:border-ilm-gold"
            />
          </Card>

          {article.status === 'returned' && article.reviewNotes && (
            <Card className="border-rose-100 bg-rose-50/50 p-5">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-rose-500">Previous review notes</h3>
              <p className="text-sm leading-6 text-rose-800">{article.reviewNotes}</p>
            </Card>
          )}

          <Card className="p-5">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Actions</h3>
            <div className="space-y-2">
              {perms.canApprove && (
                <>
                  <button
                    onClick={() => setAction('approved')}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition',
                      action === 'approved' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                    )}
                  >
                    <Check size={16} /> Approve
                  </button>
                  <button
                    onClick={() => setAction('returned')}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition',
                      action === 'returned' ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    )}
                  >
                    <CornerUpLeft size={16} /> Return to author
                  </button>
                </>
              )}
              {perms.canPublish && (
                <button
                  onClick={() => setAction('published')}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition',
                    action === 'published' ? 'bg-ilm-gold text-white' : 'bg-ilm-cream text-ilm-navy hover:bg-ilm-navy/10'
                  )}
                >
                  <SendHorizontal size={16} /> Publish
                </button>
              )}
              <button
                onClick={() => setAction('unpublished')}
                className="flex w-full items-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50"
              >
                <Send size={16} /> Unpublish
              </button>
            </div>
          </Card>

          {action && (
            <Card className="border-ilm-gold/30 bg-ilm-cream p-4">
              <p className="text-sm text-ilm-navy">
                <strong>Confirmation:</strong> This will mark the article as <strong className="capitalize">{action}</strong>. The author will be notified.
              </p>
            </Card>
          )}

          {!perms.canApprove && !perms.canPublish && (
            <Card className="border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                You are viewing as an <strong>Author</strong>. Only Editors and Administrators can review and publish articles.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
