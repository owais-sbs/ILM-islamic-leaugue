'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, FileEdit, Loader2, Plus, Search } from 'lucide-react';
import { PageHeader, Card, EmptyState } from '@/components/admin/AdminUI';
import { TableRowActions } from '@/components/admin/TableRowActions';
import { StatusBadge } from '@/components/StatusBadge';
import { useRole, usePermissions, roleLabels } from '@/components/admin/RoleContext';
import { useAuth } from '@/components/admin/AuthProvider';
import { deleteAdminArticle, fetchAdminArticles } from '@/lib/admin-api';
import type { ArticleRow, DbArticleStatus } from '@/lib/supabase/types';
import { cn } from '@/lib/utils';

const statusFilters: (DbArticleStatus | 'all')[] = [
  'all', 'draft', 'submitted', 'approved', 'published', 'returned',
];

export default function AdminArticles() {
  const { role } = useRole();
  const { user } = useAuth();
  const perms = usePermissions();
  const [filter, setFilter] = useState<DbArticleStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadArticles = async () => {
    try {
      const data = await fetchAdminArticles(perms.canViewAllArticles ? 'all' : 'mine');
      setArticles(data);
    } catch (err) {
      console.error('Articles load failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    void loadArticles();
  }, [perms.canViewAllArticles, user]);

  const canDeleteArticle = (article: ArticleRow) => {
    if (role === 'admin' || role === 'editor') return true;
    return article.author_id === user?.id && ['draft', 'returned'].includes(article.status);
  };

  const removeArticle = async (article: ArticleRow) => {
    if (!confirm(`Delete "${article.title || 'Untitled'}"? This cannot be undone.`)) return;
    setDeletingId(article.id);
    try {
      await deleteAdminArticle(article.id);
      setArticles((prev) => prev.filter((a) => a.id !== article.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = articles
    .filter((a) => filter === 'all' || a.status === filter)
    .filter((a) => !search || a.title.toLowerCase().includes(search.toLowerCase()));

  const counts = statusFilters.reduce((acc, s) => {
    acc[s] = s === 'all' ? articles.length : articles.filter((a) => a.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <PageHeader
        title="Articles"
        description={
          perms.canViewAllArticles
            ? `All articles (${articles.length})`
            : `Your articles — ${roleLabels[role]}`
        }
        action={
          <Link
            href="/admin/articles/new"
            className="flex items-center gap-2 rounded-lg bg-ilm-navy px-4 py-2.5 text-xs font-semibold text-white hover:bg-ilm-navy-light"
          >
            <Plus size={15} /> New Article
          </Link>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={cn(
                'flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium capitalize transition',
                filter === s ? 'bg-ilm-navy text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-sky-50',
              )}
            >
              {s === 'all' ? 'All' : s}
              <span className={cn('rounded-full px-1.5 text-[10px]', filter === s ? 'bg-white/20' : 'bg-slate-100 text-slate-500')}>
                {counts[s]}
              </span>
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-ilm-navy/40"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-sm text-slate-500">
          <Loader2 className="mr-2 animate-spin" size={18} /> Loading…
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={FileEdit} title="No articles found" description="Create your first article to get started." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Title</th>
                  <th className="hidden px-5 py-3 md:table-cell">Author</th>
                  <th className="hidden px-5 py-3 lg:table-cell">Category</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="hidden px-5 py-3 lg:table-cell">Updated</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((article) => (
                  <tr key={article.id} className="hover:bg-sky-50/40">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {article.featured_image_url ? (
                          <img src={article.featured_image_url} alt="" className="h-10 w-14 rounded-lg object-cover" />
                        ) : (
                          <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-sky-50 text-[10px] text-sky-400">No img</div>
                        )}
                        <div className="min-w-0">
                          <Link href={`/admin/articles/${article.id}/edit`} className="block truncate font-medium text-slate-800 hover:text-ilm-navy">
                            {article.title || 'Untitled'}
                          </Link>
                          <p className="truncate text-xs text-slate-400">{article.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-5 py-3.5 text-slate-600 md:table-cell">{article.profiles?.full_name || '—'}</td>
                    <td className="hidden px-5 py-3.5 text-slate-600 lg:table-cell">{article.categories?.name || '—'}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={article.status} /></td>
                    <td className="hidden px-5 py-3.5 text-slate-400 lg:table-cell">{new Date(article.updated_at).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/review/${article.id}`} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100" title="Review">
                          <Eye size={15} />
                        </Link>
                        <TableRowActions
                          editHref={`/admin/articles/${article.id}/edit`}
                          onDelete={canDeleteArticle(article) ? () => removeArticle(article) : undefined}
                          deleteLabel={deletingId === article.id ? 'Deleting…' : 'Delete article'}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
