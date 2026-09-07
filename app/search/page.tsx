'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Loader2, Search as SearchIcon, X } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { PageHero } from '@/components/PageHero';
import { ArticleImage } from '@/components/ArticleImage';
import { createClient } from '@/lib/supabase/client';
import type { Article } from '@/lib/data';
import { articles as mockArticles } from '@/lib/data';
import { mapRowToArticle } from '@/lib/map-article';
import type { ArticleRow } from '@/lib/supabase/types';
import { usePublicCategories } from '@/hooks/usePublicCategories';

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="bg-white">
          <SiteHeader />
          <PageHero eyebrow="Search" title="Find what you are looking for" description="Search across essays, subjects, and contributors in the ILM library." />
          <div className="ilm-section flex justify-center text-sm text-slate-500">
            <Loader2 size={18} className="mr-2 animate-spin" /> Loading…
          </div>
          <SiteFooter />
        </main>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setCategory] = useState('');
  const [published, setPublished] = useState<Article[]>(
    mockArticles.filter((a) => a.status === 'published'),
  );
  const [loading, setLoading] = useState(true);
  const categories = usePublicCategories();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const supabase = createClient();
    void (async () => {
      const { data } = await supabase
        .from('articles')
        .select(
          `*, categories(name, slug), profiles!author_id(full_name, avatar_url), article_tags(tags(name, slug))`,
        )
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      if (data?.length) {
        setPublished(data.map((row) => mapRowToArticle(row as ArticleRow)));
      }
      setLoading(false);
    })();
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
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

      <section className="ilm-section !pt-8">
        <div className="mx-auto max-w-3xl">
          <div className="relative">
            <SearchIcon
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles, topics, authors…"
              autoFocus
              aria-label="Search articles"
              className="h-[3.25rem] w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-11 text-[15px] text-slate-800 shadow-[0_4px_20px_rgba(15,22,87,0.06)] outline-none transition placeholder:text-slate-400 focus:border-ilm-gold focus:ring-2 focus:ring-ilm-gold/20"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategory('')}
              className={`min-h-[36px] rounded-full border px-3.5 py-1.5 text-[11px] font-medium transition ${
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
                className={`min-h-[36px] rounded-full border px-3.5 py-1.5 text-[11px] font-medium transition ${
                  activeCategory === c.name
                    ? 'border-ilm-gold bg-ilm-gold/10 text-ilm-gold'
                    : 'border-slate-200 text-slate-500 hover:border-ilm-gold hover:text-ilm-gold'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="mt-10 flex items-center justify-center gap-2 text-sm text-slate-500">
              <Loader2 size={18} className="animate-spin" aria-hidden />
              Loading articles…
            </div>
          ) : (
            <>
              <p className="mt-7 text-[12px] text-slate-400">
                {results.length} result{results.length !== 1 ? 's' : ''}
                {(query || activeCategory) && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setCategory('');
                    }}
                    className="ml-3 text-ilm-gold underline"
                  >
                    Clear filters
                  </button>
                )}
              </p>

              <div className="mt-4 divide-y divide-slate-100">
                {results.map((article) => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    className="group flex gap-4 py-5 transition hover:bg-slate-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ilm-gold/30"
                  >
                    <div className="hidden h-16 w-20 shrink-0 overflow-hidden rounded-lg sm:block">
                      <ArticleImage
                        src={article.featuredImage}
                        alt={article.title}
                        className="transition group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[9px] font-semibold uppercase tracking-[.16em] text-ilm-gold">
                        {article.category}
                      </p>
                      <h2 className="mt-1 font-display text-[1.05rem] leading-snug text-ilm-navy transition group-hover:text-ilm-gold line-clamp-2">
                        {article.title}
                      </h2>
                      <p className="mt-1 line-clamp-2 text-[12px] text-slate-500">{article.excerpt}</p>
                      <p className="mt-1.5 text-[10px] text-slate-400">
                        {article.authorName} · {article.readTime}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {results.length === 0 && (
                <div className="ilm-empty mt-10">
                  <p className="text-slate-500">
                    {published.length === 0
                      ? 'No published articles yet.'
                      : `No results found${query ? ` for “${query}”` : ''}.`}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
