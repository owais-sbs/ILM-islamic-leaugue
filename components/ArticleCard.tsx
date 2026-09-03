import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Article } from '@/lib/data';

export function ArticleCard({ article, featured = false, compact = false }: { article: Article; featured?: boolean; compact?: boolean }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className={`group block overflow-hidden border border-slate-200/70 bg-white shadow-[0_2px_16px_rgba(15,22,87,0.04)] transition duration-500 hover:-translate-y-0.5 hover:border-ilm-gold/35 hover:shadow-[0_16px_40px_rgba(15,22,87,0.09)] ${
        compact ? 'rounded-2xl' : 'rounded-3xl shadow-[0_2px_24px_rgba(15,22,87,0.05)] hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,22,87,0.10)]'
      } ${featured ? 'md:grid md:grid-cols-[1.08fr_1fr]' : ''}`}
    >
      <div className={`relative overflow-hidden ${featured ? 'min-h-[260px] md:min-h-full' : compact ? 'aspect-[1.7]' : 'aspect-[1.55]'}`}>
        <img src={article.featuredImage} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-ilm-navy/30 to-transparent" />
        <span className={`absolute left-3 top-3 rounded-full bg-white/95 font-semibold uppercase tracking-[.14em] text-ilm-navy shadow-sm ${compact ? 'px-2.5 py-1 text-[8px]' : 'left-4 top-4 px-3 py-1.5 text-[9px]'}`}>
          {article.category}
        </span>
      </div>
      <div className={`flex flex-col justify-between ${compact ? 'p-4' : 'p-6'} ${featured ? 'md:p-8' : ''}`}>
        <div>
          <div className={`mb-3 flex items-center gap-2 uppercase tracking-[.12em] text-slate-400 ${compact ? 'text-[9px]' : 'mb-4 text-[10px]'}`}>
            <span>{article.publishedAt}</span>
            <span className="h-1 w-1 rounded-full bg-ilm-gold" />
            <span>{article.readTime}</span>
          </div>
          <h3 className={`font-display leading-[1.15] text-ilm-navy transition-colors group-hover:text-ilm-gold ${featured ? 'text-3xl md:text-[2rem]' : compact ? 'text-lg' : 'text-2xl'}`}>
            {article.title}
          </h3>
          <p className={`mt-2 text-slate-500 ${compact ? 'line-clamp-2 text-xs leading-6' : 'mt-3 max-w-md text-sm leading-7'}`}>{article.excerpt}</p>
        </div>
        <div className={`flex items-center justify-between border-t border-slate-100 ${compact ? 'mt-4 pt-3' : 'mt-6 pt-4'}`}>
          <div className="flex items-center gap-2">
            <img src={article.authorAvatar} alt="" className={`rounded-full object-cover ring-2 ring-white ${compact ? 'h-7 w-7' : 'h-8 w-8'}`} />
            <span className={`font-medium text-ilm-navy ${compact ? 'text-[11px]' : 'text-xs'}`}>{article.authorName}</span>
          </div>
          <ArrowRight size={compact ? 15 : 17} className="text-ilm-gold transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
