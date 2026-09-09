import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Article } from '@/lib/data';
import { ArticleImage } from '@/components/ArticleImage';

export function ArticleCard({
  article,
  featured = false,
  compact = false,
}: {
  article: Article;
  featured?: boolean;
  compact?: boolean;
}) {
  const imageAlt = article.featuredImage
    ? `Featured image for ${article.title}`
    : `No image for ${article.title}`;

  if (featured) {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="group block cursor-pointer overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_2px_24px_rgba(15,22,87,0.06)] transition duration-300 hover:shadow-[0_12px_40px_rgba(15,22,87,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ilm-gold/40 md:grid md:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="relative min-h-[240px] overflow-hidden md:min-h-[360px]">
          <ArticleImage
            src={article.featuredImage}
            alt={imageAlt}
            className="transition duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ilm-navy/10" aria-hidden />
          <span className="absolute left-4 top-4 rounded-sm bg-ilm-gold px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[.16em] text-white">
            {article.category}
          </span>
        </div>

        <div className="flex flex-col justify-between p-6 md:p-9">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[.14em] text-slate-400">
              <span>{article.publishedAt}</span>
              <span className="h-1 w-1 rounded-full bg-ilm-gold/60" aria-hidden />
              <span>{article.readTime}</span>
            </div>
            <h3 className="font-display text-2xl leading-[1.2] tracking-[-0.01em] text-ilm-navy transition-colors group-hover:text-ilm-gold md:text-[1.9rem] line-clamp-3">
              {article.title}
            </h3>
            <p className="mt-3 text-[14px] leading-7 text-slate-500 line-clamp-3">
              {article.excerpt}
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
            <div className="flex min-w-0 items-center gap-2.5">
              {article.authorAvatar ? (
                <img
                  src={article.authorAvatar}
                  alt={article.authorName}
                  className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-white"
                />
              ) : (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-500">
                  {article.authorName.charAt(0)}
                </span>
              )}
              <span className="truncate text-xs font-medium text-ilm-navy">{article.authorName}</span>
            </div>
            <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[.12em] text-ilm-gold">
              Read <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_2px_16px_rgba(15,22,87,0.05)] transition duration-300 hover:-translate-y-1.5 hover:border-ilm-gold/25 hover:shadow-[0_16px_40px_rgba(15,22,87,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ilm-gold/30"
    >
      <div className={`relative overflow-hidden ${compact ? 'aspect-[16/9]' : 'aspect-[3/2]'}`}>
        <ArticleImage
          src={article.featuredImage}
          alt={imageAlt}
          className="transition duration-700 group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ilm-navy/25 via-transparent to-transparent" aria-hidden />
        <span className="absolute left-3 top-3 max-w-[85%] truncate rounded-md bg-white/95 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[.14em] text-ilm-navy shadow-sm">
          {article.category}
        </span>
      </div>

      <div className={`flex flex-1 flex-col justify-between ${compact ? 'p-4' : 'p-5'}`}>
        <div>
          <div className="mb-2.5 flex flex-wrap items-center gap-1.5 text-[9px] uppercase tracking-[.12em] text-slate-400">
            <span>{article.publishedAt}</span>
            <span className="h-0.5 w-0.5 rounded-full bg-ilm-gold/50" aria-hidden />
            <span>{article.readTime}</span>
          </div>
          <h3
            className={`font-display leading-[1.25] tracking-[-0.01em] text-ilm-navy transition-colors group-hover:text-ilm-gold line-clamp-2 ${compact ? 'text-[1.05rem]' : 'text-[1.2rem]'}`}
          >
            {article.title}
          </h3>
          <p className="mt-1.5 text-[12.5px] leading-6 text-slate-500 line-clamp-2">
            {article.excerpt}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-50 pt-3">
          <div className="flex min-w-0 items-center gap-1.5">
            {article.authorAvatar ? (
              <img
                src={article.authorAvatar}
                alt={article.authorName}
                className="h-6 w-6 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[9px] font-medium text-slate-500">
                {article.authorName.charAt(0)}
              </span>
            )}
            <span className="truncate text-[11px] text-slate-500">{article.authorName}</span>
          </div>
          <ArrowRight
            size={14}
            className="shrink-0 text-ilm-gold opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
            aria-hidden
          />
        </div>
      </div>
    </Link>
  );
}
