'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ArrowRight,
  FileText,
  CheckCircle2,
  FileEdit,
  MessageCircle,
  TrendingUp,
  Loader2,
  RefreshCw,
  Inbox,
  AlertCircle,
} from 'lucide-react';
import { PageHeader, StatCard, Card } from '@/components/admin/AdminUI';
import { StatusBadge } from '@/components/StatusBadge';
import { useRole, usePermissions, roleLabels } from '@/components/admin/RoleContext';
import { useAuth } from '@/components/admin/AuthProvider';
import { AdminLink } from '@/components/admin/AdminLink';
import { fetchAdminDashboard, fetchAuthorDashboard, type AuthorDashboardData } from '@/lib/admin-api';
import type { ArticleRow, ProfileRow, QuestionRow } from '@/lib/supabase/types';

// ── Author Dashboard — connected to Supabase ──────────────────────────────
function AuthorDashboard() {
  const [data,    setData]    = useState<AuthorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchAuthorDashboard();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-slate-500">
        <Loader2 className="mr-2 animate-spin" size={18} /> Loading your workspace…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800">
        <div className="mb-2 flex items-center gap-2 font-semibold">
          <AlertCircle size={16} /> Failed to load dashboard
        </div>
        <p className="text-rose-700">{error || 'Unknown error'}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-3 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const { profile, counts, recentArticles } = data;
  const recentDraft = recentArticles.find((a) => a.status === 'draft');

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${profile.title_honorific ? `${profile.title_honorific} ` : ''}${profile.full_name}`}
        description="Continue writing your next masterpiece."
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

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Drafts"            value={counts.draft}      icon={FileEdit}    color="blue" />
        <StatCard label="Submitted"         value={counts.submitted}  icon={Inbox}       color="amber"
          trend={counts.submitted > 0 ? 'awaiting review' : undefined} />
        <StatCard label="Returned"          value={counts.returned}   icon={MessageCircle} color="rose"
          trend={counts.returned > 0 ? 'needs correction' : undefined} />
        <StatCard label="Approved"          value={counts.approved}   icon={FileText}    color="teal" />
        <StatCard label="Published"         value={counts.published}  icon={CheckCircle2} color="emerald" />
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="mb-4 font-display text-xl font-semibold text-ilm-navy">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AdminLink
            href="/admin/articles/new"
            className="flex flex-col items-center justify-center gap-2 rounded-xl bg-ilm-navy py-6 text-white transition hover:bg-ilm-navy-light"
          >
            <FileEdit size={24} />
            <span className="text-sm font-semibold">Create New Article</span>
          </AdminLink>

          {recentDraft ? (
            <AdminLink
              href={`/admin/articles/${recentDraft.id}/edit`}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-6 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <RefreshCw size={24} className="text-blue-500" />
              <span className="text-sm font-semibold">Continue Draft</span>
            </AdminLink>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 py-6 text-slate-400">
              <RefreshCw size={24} />
              <span className="text-sm font-medium">No active drafts</span>
            </div>
          )}

          <AdminLink
            href="/admin/articles?status=submitted"
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-6 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <Inbox size={24} className="text-amber-500" />
            <span className="text-sm font-semibold">Submitted ({counts.submitted})</span>
          </AdminLink>

          <AdminLink
            href="/admin/articles?status=returned"
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-6 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <MessageCircle size={24} className="text-rose-500" />
            <span className="text-sm font-semibold">Returned ({counts.returned})</span>
          </AdminLink>
        </div>
      </div>

      {/* Recent articles */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ilm-navy">My Articles</h2>
          <AdminLink
            href="/admin/articles"
            className="flex items-center gap-1 text-xs font-medium text-ilm-navy transition hover:gap-2 hover:text-ilm-gold"
          >
            View all <ArrowRight size={14} />
          </AdminLink>
        </div>

        <Card className="overflow-hidden">
          {recentArticles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileEdit size={32} className="mb-3 text-slate-300" />
              <p className="text-sm text-slate-500">No articles yet.</p>
              <AdminLink
                href="/admin/articles/new"
                className="mt-3 text-sm font-medium text-ilm-navy hover:underline"
              >
                Write your first article →
              </AdminLink>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between gap-4 px-4 py-3.5 transition hover:bg-slate-50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {article.featured_image_url ? (
                      <img
                        src={article.featured_image_url}
                        alt=""
                        className="h-11 w-16 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[9px] text-slate-400">
                        No img
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {article.title || 'Untitled'}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
                        <span>{(article as any).categories?.name || '—'}</span>
                        <span>·</span>
                        <span>{new Date(article.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                        <span>·</span>
                        <span>{article.reading_minutes} min</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <StatusBadge status={article.status} />
                    {(article.status === 'draft' || article.status === 'returned') && (
                      <AdminLink
                        href={`/admin/articles/${article.id}/edit`}
                        className={`text-xs font-medium hover:underline ${
                          article.status === 'returned' ? 'text-rose-600' : 'text-sky-600'
                        }`}
                      >
                        {article.status === 'returned' ? 'Correct & resubmit' : 'Edit'}
                      </AdminLink>
                    )}
                    {(article.status === 'submitted' || article.status === 'approved' || article.status === 'published') && (
                      <AdminLink
                        href={`/admin/articles/${article.id}/preview`}
                        className="text-xs font-medium text-slate-500 hover:underline"
                      >
                        View
                      </AdminLink>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { role } = useRole();
  const perms = usePermissions();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [authors, setAuthors] = useState<ProfileRow[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await fetchAdminDashboard();
      setArticles((data.articles as ArticleRow[]) || []);
      setQuestions((data.questions as QuestionRow[]) || []);
      setAuthors((data.authors as ProfileRow[]) || []);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load dashboard');
      setArticles([]);
      setQuestions([]);
      setAuthors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visibleArticles = perms.canViewAllArticles
    ? articles
    : articles.filter((a) => a.author_id === user?.id);

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const publishedThisMonth = visibleArticles.filter(
    (a) => a.status === 'published' && a.published_at?.startsWith(thisMonth),
  ).length;
  const awaitingReview = visibleArticles.filter((a) => a.status === 'submitted').length;
  const myDrafts = visibleArticles.filter((a) => a.status === 'draft').length;
  const unanswered = questions.filter((q) => q.status === 'new').length;
  const recentArticles = visibleArticles.slice(0, 5);

  const byAuthor = authors
    .map((a) => ({
      author: a.full_name,
      count: articles.filter(
        (art) =>
          art.author_id === a.id &&
          art.status === 'published' &&
          art.published_at?.startsWith(thisMonth),
      ).length,
    }))
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex justify-center py-24 text-sm text-slate-500">
        <Loader2 className="mr-2 animate-spin" size={18} /> Loading dashboard…
      </div>
    );
  }

  if (role === 'author') {
    return <AuthorDashboard />;
  }

  // ── Editor Dashboard ────────────────────────────────
  if (role === 'editor') {
    const submitted    = articles.filter((a) => a.status === 'submitted');
    const approvedItems = articles.filter((a) => a.status === 'approved');
    const returnedItems = articles.filter((a) => a.status === 'returned');

    return (
      <div>
        <PageHeader
          title="Editorial Dashboard"
          description="Review submitted articles and manage the editorial queue."
          action={
            <div className="flex items-center gap-2">
              <span className="rounded-lg border border-sky-100 bg-sky-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-ilm-navy">
                Editor
              </span>
              <button
                type="button"
                onClick={() => void load()}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50"
              >
                <RefreshCw size={13} /> Refresh
              </button>
            </div>
          }
        />

        {loadError && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {loadError}
          </div>
        )}

        {/* Stats — all from real Supabase articles state */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Awaiting review"    value={submitted.length}     icon={FileText}    color="amber"   trend={submitted.length ? 'needs attention' : undefined} />
          <StatCard label="Approved"           value={approvedItems.length} icon={CheckCircle2} color="emerald" />
          <StatCard label="Returned to author" value={returnedItems.length} icon={FileEdit}    color="rose"    />
          <StatCard label="Total articles"     value={articles.length}      icon={Inbox}       color="blue"    />
        </div>

        {/* Review queue preview */}
        <div className="mt-6">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-ilm-navy">Review Queue</h2>
              <AdminLink href="/admin/review" className="flex items-center gap-1 text-xs font-medium text-ilm-navy transition hover:gap-2 hover:text-ilm-gold">
                Open full queue <ArrowRight size={14} />
              </AdminLink>
            </div>
            {submitted.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">No articles awaiting review.</p>
            ) : (
              <div className="divide-y divide-slate-50">
                {submitted.slice(0, 5).map((article) => (
                  <AdminLink
                    key={article.id}
                    href={`/admin/review/${article.id}`}
                    className="flex items-center gap-4 rounded-lg px-3 py-3 transition hover:bg-amber-50/40"
                  >
                    {article.featured_image_url ? (
                      <img src={article.featured_image_url} alt="" className="h-11 w-16 rounded-lg object-cover" />
                    ) : (
                      <div className="flex h-11 w-16 items-center justify-center rounded-lg bg-slate-100 text-[9px] text-slate-400">No img</div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">{article.title}</p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {article.profiles?.full_name || '—'} · {article.reading_minutes} min ·{' '}
                        {article.submitted_at
                          ? new Date(article.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                          : new Date(article.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <StatusBadge status={article.status as any} />
                  </AdminLink>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`Welcome back. Signed in as ${roleLabels[role]}.`}
        action={
          <button
            type="button"
            onClick={() => void load()}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        }
      />

      {loadError && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {loadError}. Check Supabase connection and run <code className="rounded bg-rose-100 px-1">admin-bootstrap.sql</code>.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Published this month" value={publishedThisMonth} icon={CheckCircle2} color="emerald" />
        <StatCard label="Awaiting review" value={awaitingReview} icon={FileText} trend={awaitingReview ? 'needs attention' : undefined} color="amber" />
        <StatCard label="Drafts" value={myDrafts} icon={FileEdit} color="blue" />
        <StatCard label="Unanswered questions" value={unanswered} icon={MessageCircle} color="rose" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-ilm-navy">Recent articles</h2>
            <AdminLink href="/admin/articles" className="flex items-center gap-1 text-xs font-medium text-ilm-navy hover:gap-2">
              View all <ArrowRight size={14} />
            </AdminLink>
          </div>
          {recentArticles.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              No articles yet.{' '}
              <AdminLink href="/admin/articles/new" className="font-medium text-ilm-navy hover:underline">Create one</AdminLink>
            </p>
          ) : (
            <div className="space-y-1">
              {recentArticles.map((article) => (
                <AdminLink key={article.id} href={`/admin/articles/${article.id}/edit`} className="flex items-center gap-4 rounded-lg px-3 py-3 hover:bg-sky-50/60">
                  {article.featured_image_url ? (
                    <img src={article.featured_image_url} alt="" className="h-12 w-16 rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-sky-50 text-[10px] text-sky-400">No img</div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">{article.title || 'Untitled'}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {article.profiles?.full_name || 'Unknown'} · {new Date(article.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={article.status} />
                </AdminLink>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-ilm-navy">Monthly contributions</h2>
            <TrendingUp size={18} className="text-slate-300" />
          </div>
          {byAuthor.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No publishes this month yet.</p>
          ) : (
            <div className="space-y-4">
              {byAuthor.map((d) => (
                <div key={d.author}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-600">{d.author}</span>
                    <span className="text-slate-400">{d.count} articles</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-ilm-navy"
                      style={{ width: `${(d.count / Math.max(...byAuthor.map((x) => x.count), 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-center">
            <div>
              <p className="font-display text-2xl font-semibold text-ilm-navy">{visibleArticles.length}</p>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">Articles</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-ilm-navy">{authors.length}</p>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">Authors</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-ilm-navy">
                {visibleArticles.reduce((sum, a) => sum + (a.views || 0), 0).toLocaleString()}
              </p>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">Views</p>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Author Contribution Analytics ── */}
      <div className="mt-6">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-ilm-navy">
                Author Contributions — Current Month
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                {new Date().toLocaleString('en-GB', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <AdminLink href="/admin/authors" className="flex items-center gap-1 text-xs font-medium text-ilm-navy transition hover:gap-2 hover:text-ilm-gold">
              Manage authors <ArrowRight size={13} />
            </AdminLink>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Murabbī</th>
                  <th className="px-5 py-3 text-center">Published</th>
                  <th className="px-5 py-3 text-center">Submitted</th>
                  <th className="px-5 py-3 text-center">Drafts</th>
                  <th className="hidden px-5 py-3 sm:table-cell">Last Published</th>
                  <th className="px-5 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {authors.filter((a) => a.is_active).map((author) => {
                  const authorArticles = articles.filter((a) => a.author_id === author.id);
                  const published  = authorArticles.filter((a) => a.status === 'published');
                  const submitted  = authorArticles.filter((a) => a.status === 'submitted');
                  const drafts     = authorArticles.filter((a) => a.status === 'draft');
                  const lastPublished = [...published].sort((a, b) =>
                    (b.published_at || '').localeCompare(a.published_at || ''),
                  )[0];

                  return (
                    <tr key={author.id} className="transition hover:bg-sky-50/30">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={author.avatar_url || 'https://images.pexels.com/photos/14819810/pexels-photo-14819810.jpeg?auto=compress&cs=tinysrgb&h=80&w=80'}
                            alt={author.full_name}
                            className="h-9 w-9 rounded-full object-cover ring-2 ring-white shadow-sm"
                          />
                          <div>
                            <p className="font-medium text-slate-800">
                              {author.title_honorific ? `${author.title_honorific} ` : ''}{author.full_name}
                            </p>
                            <p className="text-[10px] uppercase tracking-wide text-slate-400">
                              {author.role === 'editor' ? 'Editor' : author.role === 'admin' ? 'Admin' : 'Author / Murabbī'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-block min-w-[28px] rounded-full px-2 py-0.5 text-xs font-semibold ${published.length > 0 ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400'}`}>
                          {published.length}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-block min-w-[28px] rounded-full px-2 py-0.5 text-xs font-semibold ${submitted.length > 0 ? 'bg-amber-50 text-amber-700' : 'text-slate-400'}`}>
                          {submitted.length}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-block min-w-[28px] rounded-full px-2 py-0.5 text-xs font-semibold ${drafts.length > 0 ? 'bg-sky-50 text-sky-700' : 'text-slate-400'}`}>
                          {drafts.length}
                        </span>
                      </td>
                      <td className="hidden px-5 py-3.5 text-slate-500 sm:table-cell">
                        {lastPublished?.published_at
                          ? new Date(lastPublished.published_at).toLocaleDateString('en-GB', {
                              day: 'numeric', month: 'short',
                            })
                          : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
