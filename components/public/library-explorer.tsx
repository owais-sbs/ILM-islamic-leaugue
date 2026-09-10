'use client';

import { useMemo, useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { motion } from 'framer-motion';
import { libraryCategories, type LibraryCategory } from '@/lib/public-data';
import { useIlm } from '@/lib/ilm-store';
import { ArticleCard } from './article-card';
import { GeometricOrnament } from './brand';
import { ScrollReveal, StaggerChild, StaggerIn } from './scroll-reveal';
import { cn } from '@/lib/utils';

export function LibraryExplorer({
  heading = true,
  limit,
}: {
  heading?: boolean;
  limit?: number;
}) {
  const { publishedArticles } = useIlm();
  const [filter, setFilter] = useState<LibraryCategory>('All');
  const filtered = useMemo(() => {
    const list =
      filter === 'All' ? publishedArticles : publishedArticles.filter((a) => a.category === filter);
    return typeof limit === 'number' ? list.slice(0, limit) : list;
  }, [filter, limit, publishedArticles]);

  return (
    <section className="relative overflow-hidden">
      {heading && (
        <div className="relative mx-auto max-w-[1280px] px-6 pt-8 lg:px-8">
          <GeometricOrnament className="absolute right-8 top-0 hidden h-56 w-40 lg:block" />
          <ScrollReveal>
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ilm-gold-deep">
              <span className="h-px w-8 bg-ilm-gold" /> Article library
            </p>
            <h1 className="mt-4 text-[48px] font-semibold tracking-[-0.04em] text-ilm-navy sm:text-[56px]">
              Explore the Library
            </h1>
            <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-ilm-navy/55">
              Thoughtful learning, timeless knowledge. Explore articles that nurture the heart, strengthen the mind, and bring us closer to the Divine.
            </p>
          </ScrollReveal>
        </div>
      )}

      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <ScrollReveal delay={0.08} className="mt-8 flex flex-wrap gap-2">
          {libraryCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                'rounded-full px-4 py-2 text-[13px] font-medium transition-all',
                filter === cat
                  ? 'bg-ilm-navy text-white shadow-sm'
                  : 'bg-white text-ilm-navy/55 ring-1 ring-ilm-navy/10 hover:text-ilm-navy'
              )}
            >
              {cat}
            </button>
          ))}
        </ScrollReveal>

        <StaggerIn className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((article) => (
            <StaggerChild key={article.slug}>
              <ArticleCard article={article} />
            </StaggerChild>
          ))}
        </StaggerIn>
      </div>
    </section>
  );
}

export function ViewToggle({ value, onChange }: { value: 'grid' | 'list'; onChange: (v: 'grid' | 'list') => void }) {
  return (
    <div className="flex overflow-hidden rounded-xl border border-ilm-navy/10 bg-white">
      {(['grid', 'list'] as const).map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={cn('grid h-9 w-9 place-items-center', value === v ? 'bg-ilm-cream text-ilm-navy' : 'text-ilm-navy/35')}
          aria-label={v}
        >
          {v === 'grid' ? <LayoutGrid size={15} /> : <List size={15} />}
        </button>
      ))}
    </div>
  );
}

export function FilterPills({
  items,
  value,
  onChange,
}: {
  items: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <motion.button
          key={item}
          onClick={() => onChange(item)}
          whileTap={{ scale: 0.97 }}
          className={cn(
            'rounded-full px-4 py-2 text-[13px] font-medium transition-all',
            value === item
              ? 'bg-ilm-navy text-white'
              : 'bg-white text-ilm-navy/55 ring-1 ring-ilm-navy/10 hover:text-ilm-navy'
          )}
        >
          {item}
        </motion.button>
      ))}
    </div>
  );
}
