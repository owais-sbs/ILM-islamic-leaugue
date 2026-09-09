'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Eye, Inbox, Loader2, RefreshCw } from 'lucide-react';
import { PageHeader, Card, EmptyState } from '@/components/admin/AdminUI';
import { StatusBadge } from '@/components/StatusBadge';
import { fetchAdminArticles } from '@/lib/admin-api';
import type { ArticleRow } from '@/lib/supabase/types';

export default function ReviewQueuePage() {
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // scope=all → editor/admin path in the API (canViewAll = true)
      const data = await fetchAdminArticles('all');
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load review queue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const submitted = articles.filter((a) => a.status === 'submitted');
  const approved  = articles.filter((a) => a.status === 'approved');

  return (
    <div>
      <PageHeader
        title="Review Queue"
        description={
          loading
            ? 'Loading…'
            : `${submitted.length} article${submitted.length !== 1 ? 's' : ''} awaiting review`
        }
        action={
          <button
            type="button"
            onClick={() => void load()}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50"
          >
            <RefreshCw size={13} /> Refresh
          </button>
        }
      />

      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
          <button
            type="button"
            onClick={() => void load()}
            className="ml-3 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats strip */}
      {!loading && (
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Awaiting review',           value: submitted.length, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Approved (pending publish)', value: approved.length,  color: 'text-sky-700',   bg: 'bg-sky-50'   },
            { label: 'Total articles',             value: articles.length,  color: 'text-slate-700', bg: 'bg-slate-100' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4">
              <span className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold ${s.bg} ${s.color}`}>
                {s.value}
              </span>
              <p className="text-sm text-slate-600">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16 text-sm text-slate-500">
          <Loader2 className="mr-2 animate-spin" size={18} /> Loading review queue…
        </div>
      ) : (
        <>
          {/* ── Submitted — needs review ─────────────────────── */}
          <div className="mb-8">
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg text-ilm-navy">
              <Clock size={17} className="text-amber-500" />
              Submitted — Awaiting Review
            </h2>

            {submitted.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title="Queue is clear"
                description="No articles are currently waiting for review."
              />
            ) : (
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        <th className="px-5 py-3">Article</th>
                        <th className="hidden px-5 py-3 md:table-cell">Author</th>
                        <th className="hidden px-5 py-3 lg:table-cell">Category</th>
                        <th className="hidden px-5 py-3 sm:table-cell">Submitted</th>
                        <th className="px-5 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {submitted.map((article) => (
                        <tr key={article.id} className="group transition hover:bg-amber-50/30">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {article.featured_image_url ? (
                                <img
                                  src={article.featured_image_url}
                                  alt=""
                                  className="h-10 w-14 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-slate-100 text-[9px] text-slate-400">
                                  No img
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="truncate font-medium text-slate-800">{article.title}</p>
                                <p className="text-xs text-slate-400">{article.reading_minutes} min read</p>
                              </div>
                            </div>
                          </td>
                          <td className="hidden px-5 py-4 text-slate-600 md:table-cell">
                            {article.profiles?.full_name || '—'}
                          </td>
                          <td className="hidden px-5 py-4 text-slate-600 lg:table-cell">
                            {article.categories?.name || '—'}
                          </td>
                          <td className="hidden px-5 py-4 text-slate-400 sm:table-cell">
                            {article.submitted_at
                              ? new Date(article.submitted_at).toLocaleDateString('en-GB', {
                                  day: 'numeric', month: 'short',
                                })
                              : new Date(article.updated_at).toLocaleDateString('en-GB', {
                                  day: 'numeric', month: 'short',
                                })}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <Link
                              href={`/admin/review/${article.id}`}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-ilm-navy px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-ilm-navy-light"
                            >
                              Review <ArrowRight size={12} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>

          {/* ── Approved — awaiting publication ─────────────── */}
          {approved.length > 0 && (
            <div>
              <h2 className="mb-3 flex items-center gap-2 font-display text-lg text-ilm-navy">
                <Eye size={17} className="text-sky-500" />
                Approved — Awaiting Publication
              </h2>
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        <th className="px-5 py-3">Article</th>
                        <th className="hidden px-5 py-3 md:table-cell">Author</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {approved.map((article) => (
                        <tr key={article.id} className="group transition hover:bg-sky-50/30">
                          <td className="px-5 py-4">
                            <p className="font-medium text-slate-800">{article.title}</p>
                            <p className="text-xs text-slate-400">{article.reading_minutes} min read</p>
                          </td>
                          <td className="hidden px-5 py-4 text-slate-600 md:table-cell">
                            {article.profiles?.full_name || '—'}
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge status={article.status} />
                          </td>
                          <td className="px-5 py-4 text-right">
                            <Link
                              href={`/admin/review/${article.id}`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-[11px] font-semibold text-sky-700 transition hover:bg-sky-100"
                            >
                              <Eye size={12} /> View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}
