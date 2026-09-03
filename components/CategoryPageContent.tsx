'use client';

import Link from 'next/link';
import { ArticleGrid } from '@/components/ArticleGrid';
import { Reveal } from '@/components/Reveal';
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
      <section className="px-4 py-10 sm:px-6 md:px-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="mb-5 text-sm text-slate-500">
              {categoryArticles.length || category.articleCount} articles in this collection
            </p>
          </Reveal>
          {categoryArticles.length > 0 ? (
            <ArticleGrid articles={categoryArticles} compact columns={3} />
          ) : (
            <Reveal>
              <div className="rounded-2xl border border-dashed border-slate-200 bg-ilm-cream/30 p-8 text-center sm:rounded-3xl sm:p-12">
                <p className="text-slate-500">New essays in this subject are on their way.</p>
                <Link href="/articles" className="mt-4 inline-block text-sm font-medium text-ilm-gold hover:underline">
                  Browse all articles
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {moreFromLibrary.length > 0 && (
        <section className="border-t border-ilm-navy/[0.06] bg-ilm-cream/30 px-4 py-12 sm:px-6 md:px-12 md:py-16">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.2em] text-ilm-gold">Also worth reading</p>
              <h2 className="font-display text-2xl text-ilm-navy sm:text-3xl">From across the library</h2>
            </Reveal>
            <div className="mt-6">
              <ArticleGrid articles={moreFromLibrary} compact columns={3} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
