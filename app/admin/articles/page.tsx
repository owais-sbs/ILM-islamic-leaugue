'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, FileEdit, Plus, Search } from 'lucide-react';
import { PageHeader, Card, EmptyState } from '@/components/admin/AdminUI';
import { StatusBadge } from '@/components/StatusBadge';
import { useRole, usePermissions, roleLabels } from '@/components/admin/RoleContext';
import { articles, type ArticleStatus } from '@/lib/data';
import { cn } from '@/lib/utils';

const statusFilters: (ArticleStatus | 'all')[] = ['all', 'draft', 'submitted', 'approved', 'published', 'returned'];

export default function AdminArticles() {
  const { role } = useRole();
  const perms = usePermissions();
  const [filter, setFilter] = useState<ArticleStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const visible = perms.canViewAllArticles
    ? articles
    : articles.filter((a) => a.authorName === 'Ustadh Kareem Rahman');

  const filtered = visible
    .filter((a) => filter === 'all' || a.status === filter)
    .filter((a) => !search || a.title.toLowerCase().includes(search.toLowerCase()));

  const counts = statusFilters.reduce((acc, s) => {
    if (s === 'all') acc[s] = visible.length;
    else acc[s] = visible.filter((a) => a.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <PageHeader
        title="Articles"
        description={perms.canViewAllArticles ? `All articles across all authors (${visible.length})` : `Your articles only — viewing as ${roleLabels[role]}`}
        action={
          <Link href="/admin/articles/new" className="flex items-center gap-2 rounded-lg bg-ilm-gold px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-ilm-gold-dark">
            <Plus size={15} /> New Article
          </Link>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                'flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium capitalize transition',
                filter === s
                  ? 'bg-ilm-gold text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-ilm-gold/60 hover:bg-ilm-cream'
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
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-ilm-gold/70"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FileEdit}
          title="No articles found"
          description={search ? "Try a different search term or filter." : "Get started by creating your first article."}
        />
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
                  <tr key={article.id} className="group transition hover:bg-ilm-cream/30">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img src={article.featuredImage} alt="" className="h-10 w-14 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <Link href={`/admin/articles/${article.id}/edit`} className="block truncate font-medium text-slate-800 transition hover:text-ilm-navy">
                            {article.title}
                          </Link>
                          <p className="truncate text-xs text-slate-400">{article.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-5 py-3.5 text-slate-600 md:table-cell">{article.authorName}</td>
                    <td className="hidden px-5 py-3.5 text-slate-600 lg:table-cell">{article.category}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={article.status} /></td>
                    <td className="hidden px-5 py-3.5 text-slate-400 lg:table-cell">{article.updatedAt}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/review/${article.id}`} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600" title="Preview">
                          <Eye size={15} />
                        </Link>
                        <Link href={`/admin/articles/${article.id}/edit`} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-ilm-navy/10 hover:text-ilm-gold" title="Edit">
                          <FileEdit size={15} />
                        </Link>
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
