'use client';

import Link from 'next/link';
import { Clock, Printer, Share2, Tag } from 'lucide-react';
import type { Article } from '@/lib/admin-data';
import { StatusPill } from './status-pill';

export function ArticlePreview({
  article,
  showStatus = false,
}: {
  article: Article;
  showStatus?: boolean;
}) {
  const paragraphs = (article.body || article.excerpt).split(/\n\n+/).filter(Boolean);

  return (
    <article className="overflow-hidden rounded-2xl border border-ilm-navy/8 bg-white">
      <div className="relative h-64 md:h-80">
        <img src={article.image} alt="" className="h-full w-full object-cover" />
        <span className="absolute left-5 top-5 rounded-full bg-black/45 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
          {article.category}
        </span>
      </div>
      <div className="px-6 py-8 md:px-12">
        {showStatus && (
          <div className="mb-4">
            <StatusPill status={article.status} />
          </div>
        )}
        <h1 className="text-3xl font-semibold tracking-tight text-ilm-navy md:text-4xl">{article.title || 'Untitled draft'}</h1>
        <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-ilm-navy/45">
          <Link href={`/murabbiyun/${article.authorSlug}`} className="font-semibold text-ilm-navy hover:text-ilm-gold-deep">
            {article.author}
          </Link>
          <span>·</span>
          {article.publishedAt || article.date}
          <span>·</span>
          <Clock size={13} className="text-ilm-gold-deep" /> {article.readTime}
        </p>
        <p className="mt-6 text-lg leading-relaxed text-ilm-navy/70">{article.excerpt}</p>
        <div className="mt-8 space-y-5 text-[16.5px] leading-[1.85] text-ilm-navy/80">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {article.footnotes && (
          <div className="mt-10 border-t border-ilm-navy/8 pt-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-ilm-navy/40">Footnotes</h2>
            <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-ilm-navy/60">{article.footnotes}</pre>
          </div>
        )}
        {article.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <Tag size={14} className="text-ilm-gold-deep" />
            {article.tags.map((t) => (
              <span key={t} className="rounded-full bg-ilm-cream px-3 py-1 text-xs font-medium text-ilm-navy/60">
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="mt-8 flex gap-3">
          <button
            onClick={() => {
              if (navigator.share) navigator.share({ title: article.title, url: window.location.href }).catch(() => {});
              else navigator.clipboard.writeText(window.location.href);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-ilm-navy/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-ilm-navy"
          >
            <Share2 size={14} /> Share
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full border border-ilm-navy/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-ilm-navy"
          >
            <Printer size={14} /> Print
          </button>
        </div>
      </div>
    </article>
  );
}
