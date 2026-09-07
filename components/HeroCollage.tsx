'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { images } from '@/lib/data';
import type { Article } from '@/lib/data';

export function HeroCollage({ featuredArticles }: { featuredArticles: Article[] }) {
  const featured = featuredArticles[0];

  return (
    <div className="hero-rise delay-2 relative mx-auto w-full max-w-md lg:max-w-none">
      {/* Outer height — intentionally shorter so images don't bleed into header */}
      <div className="relative h-[360px] md:h-[400px] lg:h-[440px]">

        {/* Main image — starts with a top offset so it doesn't touch the header */}
        <div className="absolute left-0 top-6 z-10 h-[88%] w-[60%] overflow-hidden rounded-2xl shadow-[0_12px_36px_rgba(15,22,87,0.12)]">
          <img
            src={images.arches2}
            alt="Ornate Islamic arches"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Small image — Quran — anchored to bottom-right */}
        <div className="absolute bottom-0 right-0 z-20 h-[50%] w-[42%] overflow-hidden rounded-xl border-[3px] border-white shadow-[0_8px_28px_rgba(15,22,87,0.16)]">
          <img
            src={images.quranWarm}
            alt="Open Quran in warm light"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Floating article card — overlapping, bottom-left of main image */}
        {featured && (
          <Link
            href={`/articles/${featured.slug}`}
            className="absolute bottom-[8%] left-[3%] z-30 w-[42%] max-w-[190px] rounded-xl bg-white p-3 shadow-[0_6px_24px_rgba(15,22,87,0.11)] ring-1 ring-slate-100 transition hover:shadow-md"
          >
            <p className="text-[8px] font-semibold uppercase tracking-[.2em] text-ilm-gold">
              New this week
            </p>
            <div className="mt-1 h-px w-5 bg-ilm-gold/35" />
            <p className="mt-1.5 font-display text-[11px] leading-snug text-ilm-navy line-clamp-2">
              {featured.title}
            </p>
            <span className="mt-2 flex items-center gap-1 text-[8px] font-semibold uppercase tracking-[.14em] text-ilm-gold">
              Read article <ArrowRight size={9} />
            </span>
          </Link>
        )}

        {/* Gold accent dot — sits in the gap between images */}
        <div
          className="pointer-events-none absolute right-[39%] bottom-[48%] z-30 h-2 w-2 rounded-full border border-ilm-gold/60 bg-white"
          aria-hidden
        />
      </div>
    </div>
  );
}
