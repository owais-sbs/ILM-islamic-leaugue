'use client';

import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import { ArticleCard } from '@/components/ArticleCard';
import type { Article } from '@/lib/data';

export function ArticleDetailView({
  article,
  related,
}: {
  article: Article;
  related: Article[];
}) {
  return (
    <>
      <article className="px-6 pb-20 pt-36 md:px-12 md:pt-44">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <Reveal>
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.15em] text-ilm-gold transition hover:gap-3"
              >
                ← Back to library
              </Link>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[.14em] text-slate-400">
                <span className="rounded-full bg-ilm-cream px-3 py-1 text-ilm-navy">{article.category}</span>
                <span>{article.publishedAt}</span>
                <span className="h-1 w-1 rounded-full bg-ilm-gold" />
                <span>{article.readTime}</span>
              </div>
              <h1 className="mt-6 font-display text-4xl leading-[1.08] tracking-[-.02em] text-ilm-navy md:text-5xl lg:text-[3.25rem]">
                {article.title}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600 md:text-xl">{article.excerpt}</p>
              <div className="mt-8 flex items-center gap-3 border-b border-slate-100 pb-8 lg:pb-0 lg:border-b-0">
                <img
                  src={article.authorAvatar}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                />
                <div>
                  <p className="text-sm font-medium text-ilm-navy">{article.authorName}</p>
                  <Link href="/murabbiyun" className="text-xs text-ilm-gold transition hover:underline">
                    View contributor
                  </Link>
                </div>
              </div>
            </Reveal>

            {article.featuredImage && (
              <Reveal delay="delay-1" className="lg:sticky lg:top-32">
                <div className="relative">
                  <div className="absolute -right-2 -top-2 h-full w-full rounded-[1.75rem] border border-ilm-gold/20 bg-gradient-to-br from-ilm-gold/10 to-transparent" />
                  <img
                    src={article.featuredImage}
                    alt=""
                    className="relative aspect-[4/3] w-full rounded-[1.75rem] object-cover shadow-[0_24px_60px_rgba(15,22,87,0.14)] lg:aspect-[5/4]"
                  />
                </div>
              </Reveal>
            )}
          </div>

          <Reveal delay="delay-2">
            <div
              className="article-body mx-auto mt-14 max-w-3xl border-t border-slate-100 pt-12 lg:mt-16"
              dangerouslySetInnerHTML={{ __html: article.body }}
            />
          </Reveal>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-ilm-navy/[0.06] bg-ilm-cream/30 px-6 py-16 md:px-12 md:py-20">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.2em] text-ilm-gold">Continue reading</p>
              <h2 className="font-display text-3xl text-ilm-navy">More in {article.category}</h2>
            </Reveal>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {related.map((a, i) => (
                <Reveal key={a.id} delay={`delay-${(i % 2) + 1}`}>
                  <ArticleCard article={a} compact />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
