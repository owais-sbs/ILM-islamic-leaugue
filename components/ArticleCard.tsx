import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Article } from '@/lib/data';

/* ─── ArticleCard ────────────────────────────────────────
   Three modes:
   featured  — large horizontal editorial card (desktop image | text)
   compact   — small card for grids (image top, content below)
   default   — medium card
─────────────────────────────────────────────────────────── */
export function ArticleCard({
  article,
  featured = false,
  compact = false,
}: {
  article: Article;
  featured?: boolean;
  compact?: boolean;
}) {
  if (featured) {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="group block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_2px_24px_rgba(15,22,87,0.06)] transition duration-300 hover:shadow-[0_12px_40px_rgba(15,22,87,0.10)] md:grid md:grid-cols-[1.1fr_0.9fr]"
      >
        {/* Image */}
        <div className="relative min-h-[240px] overflow-hidden md:min-h-[360px]">
          <img
            src={article.featuredImage}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ilm-navy/10" />
          <span className="absolute left-4 top-4 rounded-sm bg-ilm-gold px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[.16em] text-white">
            {article.category}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between p-6 md:p-9">
          <div>
            <div className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[.14em] text-slate-400">
              <span>{article.publishedAt}</span>
              <span className="h-1 w-1 rounded-full bg-ilm-gold/60" />
              <span>{article.readTime}</span>
            </div>
            <h3 className="font-display text-2xl leading-[1.2] tracking-[-0.01em] text-ilm-navy transition-colors group-hover:text-ilm-gold md:text-[1.9rem]">
              {article.title}
            </h3>
            <p className="mt-3 text-[14px] leading-7 text-slate-500 line-clamp-3">
              {article.excerpt}
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
            <div className="flex items-center gap-2.5">
              <img
                src={article.authorAvatar}
                alt={article.authorName}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-white"
              />
              <span className="text-xs font-medium text-ilm-navy">{article.authorName}</span>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[.12em] text-ilm-gold">
              Read <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  /* compact & default share the same vertical layout */
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_1px_12px_rgba(15,22,87,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-ilm-gold/25 hover:shadow-[0_8px_28px_rgba(15,22,87,0.09)]"
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${compact ? 'aspect-[16/9]' : 'aspect-[3/2]'}`}>
        <img
          src={article.featuredImage}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ilm-navy/20 to-transparent" />
        <span className="absolute left-3 top-3 rounded-sm bg-white/95 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[.14em] text-ilm-navy shadow-sm">
          {article.category}
        </span>
      </div>

      {/* Content */}
      <div className={`flex flex-1 flex-col justify-between ${compact ? 'p-4' : 'p-5'}`}>
        <div>
          <div className="mb-2.5 flex items-center gap-1.5 text-[9px] uppercase tracking-[.12em] text-slate-400">
            <span>{article.publishedAt}</span>
            <span className="h-0.5 w-0.5 rounded-full bg-ilm-gold/50" />
            <span>{article.readTime}</span>
          </div>
          <h3 className={`font-display leading-[1.25] tracking-[-0.01em] text-ilm-navy transition-colors group-hover:text-ilm-gold ${compact ? 'text-[1.05rem]' : 'text-[1.15rem]'}`}>
            {article.title}
          </h3>
          <p className="mt-1.5 text-[12px] leading-6 text-slate-500 line-clamp-2">
            {article.excerpt}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
          <div className="flex items-center gap-1.5">
            <img
              src={article.authorAvatar}
              alt={article.authorName}
              className="h-6 w-6 rounded-full object-cover"
            />
            <span className="text-[11px] text-slate-500">{article.authorName}</span>
          </div>
          <ArrowRight
            size={14}
            className="shrink-0 text-ilm-gold opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
          />
        </div>
      </div>
    </Link>
  );
}
