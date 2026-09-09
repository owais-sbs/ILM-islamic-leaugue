'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { PageHero, SectionLabel, GoldDivider } from '@/components/PageHero';
import { ArticleCard } from '@/components/ArticleCard';
import { ArticleGrid } from '@/components/ArticleGrid';
import { Reveal } from '@/components/Reveal';
import { articles as allArticles, categories, authors } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function ArticlesPage() {
  const published = allArticles.filter((a) => a.status === 'published');

  const [activeCategory, setActiveCategory] = useState('');
  const [activeAuthor,   setActiveAuthor]   = useState('');
  const [search,         setSearch]         = useState('');

  const filtered = useMemo(() => {
    return published.filter((a) => {
      const matchCat    = !activeCategory || a.category === activeCategory;
      const matchAuthor = !activeAuthor   || a.authorId === activeAuthor;
      const matchSearch = !search
        || a.title.toLowerCase().includes(search.toLowerCase())
        || a.excerpt.toLowerCase().includes(search.toLowerCase())
        || a.authorName.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchAuthor && matchSearch;
    });
  }, [activeCategory, activeAuthor, search, published]);

  const hasFilter      = !!(activeCategory || activeAuthor || search);
  const activeAuthors  = authors.filter((a) => a.active);

  const clearAll = () => { setActiveCategory(''); setActiveAuthor(''); setSearch(''); };

  return (
    <main className="bg-white">
      <SiteHeader />
      <PageHero
        eyebrow="Article library"
        title="Ideas for the road ahead"
        description="Essays on Qur'an, spirituality, history, character, and the questions that matter — written with care by qualified voices."
      />

      {/* ── Filter bar (not sticky — avoids collision) ── */}
      <div className="border-b border-slate-100 bg-white px-6 py-4 md:px-12">
        <div className="mx-auto max-w-7xl space-y-3">

          {/* Category row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-14 shrink-0 text-[9px] font-semibold uppercase tracking-[.2em] text-slate-400">Subject</span>
            <button type="button" onClick={() => setActiveCategory('')}
              className={cn('rounded-full px-3 py-1.5 text-[10.5px] font-medium transition',
                !activeCategory ? 'bg-ilm-navy text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-ilm-gold hover:text-ilm-gold')}>
              All
            </button>
            {categories.map((cat) => (
              <button key={cat.id} type="button"
                onClick={() => setActiveCategory(activeCategory === cat.name ? '' : cat.name)}
                className={cn('rounded-full px-3 py-1.5 text-[10.5px] font-medium transition',
                  activeCategory === cat.name
                    ? 'bg-ilm-navy text-white'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-ilm-gold hover:text-ilm-gold')}>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Scholar + search row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-14 shrink-0 text-[9px] font-semibold uppercase tracking-[.2em] text-slate-400">Scholar</span>
            <button type="button" onClick={() => setActiveAuthor('')}
              className={cn('rounded-full px-3 py-1.5 text-[10.5px] font-medium transition',
                !activeAuthor ? 'bg-ilm-gold text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-ilm-gold hover:text-ilm-gold')}>
              All
            </button>
            {activeAuthors.map((a) => (
              <button key={a.id} type="button"
                onClick={() => setActiveAuthor(activeAuthor === a.id ? '' : a.id)}
                className={cn('flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10.5px] font-medium transition',
                  activeAuthor === a.id
                    ? 'bg-ilm-gold text-white'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-ilm-gold hover:text-ilm-gold')}>
                <img src={a.avatar} alt="" className="h-4 w-4 rounded-full object-cover" />
                {a.name.split(' ').slice(-1)[0]}
              </button>
            ))}

            {/* Search — pushed right */}
            <div className="relative ml-auto">
              <Search size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search articles…" value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 w-36 rounded-full border border-slate-200 bg-white pl-8 pr-8 text-[11px] outline-none transition focus:border-ilm-gold focus:ring-1 focus:ring-ilm-gold/20 md:w-52" />
              {search && (
                <button type="button" onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Result summary */}
          {hasFilter && (
            <div className="flex items-center gap-2 pt-0.5">
              <p className="text-[11px] text-slate-400">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                {activeCategory && <> in <strong className="text-ilm-navy">{activeCategory}</strong></>}
                {activeAuthor && <> by <strong className="text-ilm-navy">{authors.find((a) => a.id === activeAuthor)?.name}</strong></>}
                {search && <> matching &ldquo;{search}&rdquo;</>}
              </p>
              <button type="button" onClick={clearAll} className="text-[10px] font-semibold text-ilm-gold underline">
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Content ─────────────────────────────────── */}
      {filtered.length === 0 ? (
        <section className="px-6 py-20 md:px-12">
          <div className="mx-auto max-w-xl text-center">
            <p className="font-display text-xl text-ilm-navy">No essays match your filter</p>
            <p className="mt-2 text-sm text-slate-500">Try a different combination or clear your search.</p>
            <button type="button" onClick={clearAll}
              className="mt-4 text-sm font-medium text-ilm-gold underline">
              Clear filters
            </button>
          </div>
        </section>
      ) : (
        <>
          {/* Featured — only when unfiltered */}
          {!hasFilter && filtered[0] && (
            <section className="px-6 py-12 md:px-12 md:py-14">
              <div className="mx-auto max-w-7xl">
                <Reveal><SectionLabel>Editor&apos;s pick</SectionLabel></Reveal>
                <Reveal delay="delay-1">
                  <ArticleCard article={filtered[0]} featured />
                </Reveal>
              </div>
            </section>
          )}

          {!hasFilter && <GoldDivider className="mx-auto max-w-7xl px-6 md:px-12" />}

          <section className="px-6 pb-14 pt-10 md:px-12 md:pb-16">
            <div className="mx-auto max-w-7xl">
              <Reveal>
                <SectionLabel>
                  {hasFilter
                    ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`
                    : 'All published essays'}
                </SectionLabel>
              </Reveal>
              <div className="mt-6">
                <ArticleGrid articles={hasFilter ? filtered : filtered.slice(1)} compact columns={3} />
              </div>
            </div>
          </section>

          {/* Browse by subject — only unfiltered */}
          {!hasFilter && (
            <section className="border-t border-slate-100 bg-[#F9F8F5] px-6 py-14 md:px-12 md:py-16">
              <div className="mx-auto max-w-7xl">
                <Reveal><SectionLabel>Browse by subject</SectionLabel></Reveal>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {categories.map((cat, i) => (
                    <Reveal key={cat.id} delay={`delay-${(i % 3) + 1}`}>
                      <button type="button" onClick={() => setActiveCategory(cat.name)}
                        className="group flex w-full items-center justify-between rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-ilm-gold/30 hover:shadow-md">
                        <div className="text-left">
                          <h3 className="font-display text-[1.05rem] text-ilm-navy">{cat.name}</h3>
                          <p className="mt-0.5 text-[11px] text-slate-400">{cat.articleCount} articles</p>
                        </div>
                        <ArrowUpRight size={16} className="text-ilm-gold/40 transition group-hover:text-ilm-gold" />
                      </button>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <SiteFooter />
    </main>
  );
}
