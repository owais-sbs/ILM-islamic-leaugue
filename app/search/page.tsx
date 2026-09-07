'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search as SearchIcon, X } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { PageHero } from '@/components/PageHero';
import { articles, categories } from '@/lib/data';

export default function SearchPage() {
  const [query,          setQuery]     = useState('');
  const [activeCategory, setCategory] = useState('');
  const published = articles.filter((a) => a.status === 'published');

  const results = useMemo(() => {
    const q  = query.trim().toLowerCase();
    const ac = activeCategory.toLowerCase();
    return published.filter((a) => {
      const matchQuery =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.authorName.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q));
      const matchCat = !ac || a.category.toLowerCase() === ac;
      return matchQuery && matchCat;
    });
  }, [query, activeCategory, published]);

  return (
    <main className="bg-white">
      <SiteHeader />
      <PageHero
        eyebrow="Search"
        title="Find what you are looking for"
        description="Search across essays, subjects, and contributors in the ILM library."
      />

      <section className="px-6 pb-20 pt-8 md:px-12 md:pt-10">
        <div className="mx-auto max-w-3xl">
          {/* Search input */}
          <div className="relative">
            <SearchIcon
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles, topics, authors…"
              autoFocus
              className="ilm-input h-13 rounded-xl pl-11 pr-10 text-[15px] shadow-[0_4px_20px_rgba(15,22,87,0.06)]"
              style={{ height: '3.25rem' }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Category filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategory('')}
              className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition ${
                !activeCategory
                  ? 'border-ilm-gold bg-ilm-gold/10 text-ilm-gold'
                  : 'border-slate-200 text-slate-500 hover:border-ilm-gold hover:text-ilm-gold'
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(activeCategory === c.name ? '' : c.name)}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition ${
                  activeCategory === c.name
                    ? 'border-ilm-gold bg-ilm-gold/10 text-ilm-gold'
                    : 'border-slate-200 text-slate-500 hover:border-ilm-gold hover:text-ilm-gold'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Result count */}
          <p className="mt-7 text-[12px] text-slate-400">
            {results.length} result{results.length !== 1 ? 's' : ''}
            {(query || activeCategory) && (
              <button
                type="button"
                onClick={() => { setQuery(''); setCategory(''); }}
                className="ml-3 text-ilm-gold underline"
              >
                Clear
              </button>
            )}
          </p>

          {/* Results */}
          <div className="mt-4 divide-y divide-slate-100">
            {results.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group flex gap-4 py-5 transition"
              >
                {/* Thumbnail */}
                <div className="hidden h-16 w-20 shrink-0 overflow-hidden rounded-lg sm:block">
                  <img
                    src={article.featuredImage}
                    alt=""
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[.16em] text-ilm-gold">
                    {article.category}
                  </p>
                  <h2 className="mt-1 font-display text-[1.05rem] leading-snug text-ilm-navy transition group-hover:text-ilm-gold">
                    {article.title}
                  </h2>
                  <p className="mt-1 line-clamp-1 text-[12px] text-slate-500">{article.excerpt}</p>
                  <p className="mt-1.5 text-[10px] text-slate-400">
                    {article.authorName} · {article.readTime}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {results.length === 0 && (
            <div className="mt-12 text-center">
              <p className="text-slate-400">No results found for &ldquo;{query}&rdquo;.</p>
              <button
                type="button"
                onClick={() => { setQuery(''); setCategory(''); }}
                className="mt-3 text-sm text-ilm-gold underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
