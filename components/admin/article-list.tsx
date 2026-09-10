'use client';

import { useMemo, useState } from 'react';
import { Eye, Pencil, Search } from 'lucide-react';
import type { Article, ArticleStatus, Role } from '@/lib/admin-data';
import { StatusPill } from './status-pill';
import { canEditArticle } from '@/lib/ilm-store';
import { cn } from '@/lib/utils';

const statusFilters = ['all', 'draft', 'submitted', 'approved', 'published', 'returned'] as const;

export function ArticleTable({
  articles,
  role,
  userName,
  title,
  onPreview,
  onEdit,
}: {
  articles: Article[];
  role: Role;
  userName: string;
  title?: string;
  onPreview: (article: Article) => void;
  onEdit: (article: Article) => void;
}) {
  const [filter, setFilter] = useState<(typeof statusFilters)[number]>('all');
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const statusOk = filter === 'all' || a.status === filter;
      const query = q.toLowerCase();
      const textOk =
        !query ||
        `${a.title} ${a.author} ${a.category} ${a.excerpt}`.toLowerCase().includes(query);
      return statusOk && textOk;
    });
  }, [articles, filter, q]);

  return (
    <div>
      {title && <h2 className="mb-5 text-2xl font-semibold tracking-tight text-ilm-navy">{title}</h2>}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2 overflow-x-auto">
          {statusFilters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize',
                filter === f ? 'bg-ilm-navy text-white' : 'border border-ilm-navy/10 bg-white text-ilm-navy/50 hover:text-ilm-navy'
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 rounded-full border border-ilm-navy/10 bg-white px-3 py-2 text-ilm-navy/35">
          <Search size={14} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, author…"
            className="w-44 bg-transparent text-sm text-ilm-navy outline-none"
          />
        </label>
      </div>

      <div className="overflow-hidden rounded-2xl border border-ilm-navy/8 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-ilm-navy/8 bg-ilm-cream/60">
                <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/40">Article</th>
                <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/40">Author</th>
                <th className="hidden px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/40 md:table-cell">Category</th>
                <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/40">Status</th>
                <th className="hidden px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/40 lg:table-cell">Date</th>
                <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((article) => {
                const editable = canEditArticle(role, article, userName);
                return (
                  <tr key={article.id} className="border-b border-ilm-navy/5 last:border-0 hover:bg-ilm-cream/40">
                    <td className="px-5 py-4">
                      <p className="max-w-[280px] truncate text-sm font-semibold text-ilm-navy">{article.title}</p>
                      {article.status === 'returned' && article.reviewNotes && (
                        <p className="mt-1 max-w-[280px] truncate text-xs italic text-red-600/70">“{article.reviewNotes}”</p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-ilm-navy/60">{article.author}</td>
                    <td className="hidden px-5 py-4 text-sm text-ilm-navy/50 md:table-cell">{article.category}</td>
                    <td className="px-5 py-4">
                      <StatusPill status={article.status as ArticleStatus} />
                    </td>
                    <td className="hidden px-5 py-4 text-sm text-ilm-navy/45 lg:table-cell">{article.date}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onPreview(article)}
                          className="inline-flex items-center gap-1 rounded-full border border-ilm-navy/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-ilm-navy hover:border-ilm-gold"
                        >
                          <Eye size={13} /> Preview
                        </button>
                        {editable && (
                          <button
                            onClick={() => onEdit(article)}
                            className="inline-flex items-center gap-1 rounded-full bg-ilm-navy px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white"
                          >
                            <Pencil size={13} /> Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-ilm-navy/30">No articles in this view.</div>
        )}
      </div>
    </div>
  );
}
