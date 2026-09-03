'use client';

import Link from 'next/link';
import { ArticleGrid } from '@/components/ArticleGrid';
import { Reveal } from '@/components/Reveal';
import { SectionLabel, GoldDivider } from '@/components/PageHero';
import type { Article, Category } from '@/lib/data';

export function CategoryPageContent({
  category,
  categoryArticles,
  moreFromLibrary,
}: {
  category: Category;
  categoryArticles: Article[];
  moreFromLibrary: Article[];
}) {
  return (
    <>
      <section className="px-6 py-12 md:px-12 md:py-14">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="mb-6 text-[12px] text-slate-400">
              {categoryArticles.length || category.articleCount} essays in this collection
            </p>
          </Reveal>

          {categoryArticles.length > 0 ? (
            <ArticleGrid articles={categoryArticles} compact columns={3} />
          ) : (
            <Reveal>
              <div className="rounded-xl border border-dashed border-slate-200 bg-[#F9F8F5] p-10 text-center">
                <p className="text-[14px] text-slate-500">
                  New essays in this subject are on their way.
                </p>
                <Link
                  href="/articles"
                  className="mt-3 inline-block text-[11px] font-semibold uppercase tracking-[.14em] text-ilm-gold"
                >
                  Browse all articles →
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {moreFromLibrary.length > 0 && (
        <>
          <GoldDivider className="mx-auto max-w-7xl px-6 md:px-12" />
          <section className="bg-[#F9F8F5] px-6 py-12 md:px-12 md:py-14">
            <div className="mx-auto max-w-7xl">
              <Reveal>
                <SectionLabel>Also worth reading</SectionLabel>
                <h2 className="font-display text-[1.6rem] text-ilm-navy">From across the library</h2>
              </Reveal>
              <div className="mt-7">
                <ArticleGrid articles={moreFromLibrary} compact columns={3} />
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
