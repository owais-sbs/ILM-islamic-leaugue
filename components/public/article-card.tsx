'use client';

import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { safeArticleImage } from '@/lib/images';

export interface CardArticle {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  image: string;
}

export function ArticleCard({ article, className }: { article: CardArticle; className?: string }) {
  const src = safeArticleImage(article.image);
  return (
    <article
      className={cn(
        'group overflow-hidden rounded-[22px] border border-ilm-navy/[0.06] bg-white shadow-[0_8px_30px_rgba(11,17,82,0.04)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(11,17,82,0.08)]',
        className
      )}
    >
      <div className="relative h-[180px] overflow-hidden sm:h-[210px]">
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
          {article.category}
        </span>
      </div>
      <div className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
        <p className="flex items-center gap-2 text-[12px] text-ilm-navy/40">
          <Clock size={13} className="text-ilm-gold-deep" />
          {article.readTime}
          <span className="text-ilm-navy/20">·</span>
          {article.date}
        </p>
        <h3 className="mt-3 text-[20px] font-semibold leading-snug tracking-tight text-ilm-navy sm:text-[22px]">{article.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ilm-navy/55">{article.excerpt}</p>
        <Link
          href={`/articles/${article.slug}`}
          className="mt-5 inline-flex items-center gap-1.5 border-b border-ilm-gold pb-0.5 text-[13px] font-semibold text-ilm-navy hover:text-ilm-gold-deep"
        >
          Read article <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}
