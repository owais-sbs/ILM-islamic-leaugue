'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search as SearchIcon } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { PageHero } from '@/components/PageHero';
import { articles, categories } from '@/lib/data';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const published = articles.filter((a) => a.status === 'published');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return published;
    return published.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.authorName.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [query, published]);

  return (
    <main className="bg-white">
      <SiteHeader />
      <PageHero
        eyebrow="Search"
        title="Find what you are looking for"
        description="Search essays, subjects, and contributors across the ILM library."
      />
      <section className="px-6 pb-20 md:px-12">
        <div className="mx-auto max-w-3xl">
          <div className="relative">
            <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles, topics, authors…"
              className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-base shadow-[0_4px_24px_rgba(15,22,87,0.06)] outline-none transition focus:border-ilm-gold focus:ring-2 focus:ring-ilm-gold/20"
              autoFocus
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.slice(0, 4).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setQuery(c.name.split(' ')[0])}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition hover:border-ilm-gold hover:text-ilm-gold"
              >
                {c.name}
              </button>
            ))}
          </div>
          <p className="mt-8 text-sm text-slate-500">{results.length} result{results.length !== 1 ? 's' : ''}</p>
          <div className="mt-4 grid gap-3">
            {results.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition hover:border-ilm-gold/40 hover:shadow-md"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-ilm-gold">{article.category}</p>
                <h2 className="mt-2 font-display text-xl text-ilm-navy group-hover:text-ilm-gold">{article.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-slate-500">{article.excerpt}</p>
                <p className="mt-3 text-xs text-slate-400">{article.authorName} · {article.readTime}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
