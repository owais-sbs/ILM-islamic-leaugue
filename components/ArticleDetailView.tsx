'use client';

import Link from 'next/link';
import { Printer, Share2 } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { ArticleCard } from '@/components/ArticleCard';
import { SectionLabel } from '@/components/PageHero';
import type { Article, Author } from '@/lib/data';

export function ArticleDetailView({
  article,
  author,
  related,
}: {
  article: Article;
  author?: Author;
  related: Article[];
}) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: article.title, text: article.excerpt, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      {/* ── Article header ─────────────────────────────── */}
      <article className="bg-white px-6 pb-16 pt-32 md:px-12 md:pt-40">
        <div className="mx-auto max-w-7xl">

          {/* Back link */}
          <Reveal>
            <Link
              href="/articles"
              className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[.16em] text-ilm-gold transition hover:gap-2.5"
            >
              ← Back to library
            </Link>
          </Reveal>

          {/* Two-column header layout */}
          <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1fr_0.88fr] lg:gap-16">
            <Reveal>
              {/* Category + meta */}
              <div className="flex flex-wrap items-center gap-2.5 text-[10px] uppercase tracking-[.14em] text-slate-400">
                <Link
                  href={`/categories/${article.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  className="rounded-sm bg-ilm-gold/10 px-2.5 py-1 font-semibold text-ilm-gold transition hover:bg-ilm-gold/20"
                >
                  {article.category}
                </Link>
                {article.publishedAt && (
                  <span>
                    {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </span>
                )}
                <span className="h-1 w-1 rounded-full bg-ilm-gold/50" />
                <span>{article.readTime}</span>
                {article.views != null && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-ilm-gold/50" />
                    <span>{article.views.toLocaleString()} views</span>
                  </>
                )}
              </div>

              {/* Title */}
              <h1 className="mt-5 font-display text-[2rem] leading-[1.1] tracking-[-0.02em] text-ilm-navy md:text-[2.75rem] lg:text-[3rem]">
                {article.title}
              </h1>

              {/* Excerpt */}
              <p className="mt-4 max-w-xl text-[15.5px] leading-8 text-slate-500">
                {article.excerpt}
              </p>

              {/* Author + actions row */}
              <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-7">
                <Link
                  href={author ? `/murabbiyun/${author.slug}` : '/murabbiyun'}
                  className="group flex items-center gap-3"
                >
                  <img
                    src={article.authorAvatar}
                    alt={article.authorName}
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-sm transition group-hover:ring-ilm-gold/40"
                  />
                  <div>
                    <p className="text-[13px] font-medium text-ilm-navy transition group-hover:text-ilm-gold">
                      {article.authorName}
                    </p>
                    {author && (
                      <p className="text-[11px] text-slate-400">{author.credentials}</p>
                    )}
                  </div>
                </Link>

                {/* Share / print */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label="Share"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-ilm-gold hover:text-ilm-gold"
                  >
                    <Share2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    aria-label="Print"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-ilm-gold hover:text-ilm-gold"
                  >
                    <Printer size={14} />
                  </button>
                </div>
              </div>
            </Reveal>

            {/* Featured image */}
            {article.featuredImage && (
              <Reveal delay="delay-1" className="lg:sticky lg:top-28">
                <div className="overflow-hidden rounded-2xl shadow-[0_16px_48px_rgba(15,22,87,0.12)]">
                  <img
                    src={article.featuredImage}
                    alt=""
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              </Reveal>
            )}
          </div>

          {/* ── Body ─────────────────────────────────── */}
          <Reveal delay="delay-2">
            <div
              className="article-body mx-auto mt-12 max-w-[68ch]"
              dangerouslySetInnerHTML={{ __html: article.body }}
            />
          </Reveal>

          {/* Tags */}
          {article.tags.length > 0 && (
            <Reveal delay="delay-3">
              <div className="mx-auto mt-10 flex max-w-[68ch] flex-wrap gap-2 border-t border-slate-100 pt-7">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 px-3 py-1 text-[11px] text-slate-500"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </Reveal>
          )}

          {/* Author profile block */}
          {author && (
            <Reveal>
              <div className="mx-auto mt-12 flex max-w-[68ch] items-start gap-5 rounded-xl border border-slate-100 bg-[#F9F8F5] p-6">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="h-16 w-16 shrink-0 rounded-xl object-cover"
                />
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[.2em] text-ilm-gold">
                    About the author
                  </p>
                  <Link href={`/murabbiyun/${author.slug}`}>
                    <h3 className="mt-1 font-display text-lg text-ilm-navy hover:text-ilm-gold">
                      {author.name}
                    </h3>
                  </Link>
                  <p className="mt-0.5 text-xs text-ilm-gold">{author.credentials}</p>
                  <p className="mt-2 text-[13px] leading-6 text-slate-600">{author.bio}</p>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </article>

      {/* ── Related articles ─────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-ilm-navy/[0.06] bg-[#F9F8F5] px-6 py-12 md:px-12 md:py-14">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <SectionLabel>Continue reading</SectionLabel>
              <h2 className="font-display text-[1.6rem] text-ilm-navy">
                More in {article.category}
              </h2>
            </Reveal>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.slice(0, 3).map((a, i) => (
                <Reveal key={a.id} delay={`delay-${(i % 3) + 1}`}>
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
