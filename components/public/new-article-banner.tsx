'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { LATEST_PUBLISH_KEY, useIlm } from '@/lib/ilm-store';

export function NewArticleBanner() {
  const { publishedArticles } = useIlm();
  const [visible, setVisible] = useState(false);
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    try {
      const latestSlug = localStorage.getItem(LATEST_PUBLISH_KEY);
      if (!latestSlug) return;
      const match = publishedArticles.find((a) => a.slug === latestSlug);
      if (match) {
        setSlug(latestSlug);
        setVisible(true);
      }
    } catch {
      /* ignore */
    }
  }, [publishedArticles]);

  const article = publishedArticles.find((a) => a.slug === slug);

  return (
    <AnimatePresence>
      {visible && article && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
          className="pointer-events-auto overflow-hidden"
        >
          <div className="relative border-b border-white/10 bg-gradient-to-r from-ilm-navy-deep via-ilm-navy to-[#1a2466] text-white">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(199,154,61,0.22),transparent_55%)]" />
            <div className="relative mx-auto flex max-w-[1280px] items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
              <span className="hidden h-8 w-8 shrink-0 place-items-center rounded-full bg-ilm-gold/20 text-ilm-gold sm:grid">
                <Sparkles size={14} />
              </span>
              <p className="min-w-0 flex-1 truncate text-[12.5px] leading-snug sm:text-[13px]">
                <span className="mr-2 inline-flex items-center rounded-full bg-ilm-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-ilm-navy-deep">
                  New
                </span>
                <Link
                  href={`/articles/${article.slug}`}
                  className="font-medium text-white underline-offset-4 hover:underline"
                >
                  {article.title}
                </Link>
                <span className="hidden text-white/55 sm:inline"> — just published on ILM</span>
              </p>
              <Link
                href={`/articles/${article.slug}`}
                className="hidden shrink-0 items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white hover:bg-white/15 sm:inline-flex"
              >
                Read <ArrowRight size={12} />
              </Link>
              <button
                type="button"
                aria-label="Dismiss new article notice"
                onClick={() => setVisible(false)}
                className="shrink-0 rounded-full p-1.5 text-white/65 transition hover:bg-white/10 hover:text-white"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
