'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { useIlm } from '@/lib/ilm-store';
import { ArticleCard } from '@/components/public/article-card';
import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';

function SearchInner() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const { publishedArticles } = useIlm();
  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return publishedArticles;
    return publishedArticles.filter((a) =>
      `${a.title} ${a.excerpt} ${a.body} ${a.author}`.toLowerCase().includes(needle)
    );
  }, [q, publishedArticles]);

  return (
    <section className="mx-auto max-w-[1100px] px-6 py-16">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ilm-gold-deep">Search</p>
      <h1 className="mt-3 text-4xl font-semibold text-ilm-navy">Search the library</h1>
      <label className="mt-8 flex items-center gap-3 rounded-full border border-ilm-navy/10 bg-white px-5 py-3">
        <Search size={18} className="text-ilm-navy/35" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Title, excerpt, or body…"
          className="flex-1 bg-transparent text-sm outline-none"
        />
      </label>
      <p className="mt-4 text-sm text-ilm-navy/40">{results.length} published result{results.length === 1 ? '' : 's'}</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {results.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  );
}

export default function SearchPage() {
  return (
    <main className="min-h-screen pt-28">
      <SiteHeader active="articles" />
      <Suspense fallback={<div className="px-6 py-16 text-ilm-navy/40">Loading search…</div>}>
        <SearchInner />
      </Suspense>
      <SiteFooter />
    </main>
  );
}
