'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { images } from '@/lib/data';
import type { Article } from '@/lib/data';

const heroSlides = [
  {
    main: images.quranWarm,
    top: images.arches2,
    bottom: images.reading,
    mainAlt: 'Quran on a wooden stand in warm light',
    topAlt: 'Mosque dome viewed through a stone archway',
    bottomAlt: 'Books, notebook, and pen on a desk',
  },
  {
    main: images.quran,
    top: images.arches,
    bottom: images.arches3,
    mainAlt: 'Open Quran in soft daylight',
    topAlt: 'Islamic architectural arches',
    bottomAlt: 'Sunlit archway detail',
  },
  {
    main: images.reading,
    top: images.arches3,
    bottom: images.quranWarm,
    mainAlt: 'Quiet reading and reflection',
    topAlt: 'Geometric arch patterns',
    bottomAlt: 'Sacred text in golden light',
  },
];

export function HeroCollage({ featuredArticles }: { featuredArticles: Article[] }) {
  const [index, setIndex] = useState(0);
  const slide = heroSlides[index];
  const featured = featuredArticles[index] ?? featuredArticles[0];
  const total = heroSlides.length;

  const go = (dir: -1 | 1) => {
    setIndex((i) => (i + dir + total) % total);
  };

  return (
    <div className="hero-rise delay-2 relative mx-auto w-full max-w-lg lg:max-w-none">
      {/* Decorative gold frame */}
      <div
        className="pointer-events-none absolute -right-1 top-6 bottom-16 left-8 rounded-[2rem] border border-ilm-gold/35 sm:left-12"
        aria-hidden
      />
      <div className="pointer-events-none absolute right-4 top-2 h-3 w-3 rounded-full border border-ilm-gold/50" aria-hidden />
      <div className="pointer-events-none absolute bottom-20 left-4 h-px w-8 bg-ilm-gold/40 sm:left-6" aria-hidden />

      <div className="relative ml-0 min-h-[22rem] sm:min-h-[26rem] md:min-h-[30rem] lg:min-h-[34rem]">
        {/* Main — large vertical, center-left */}
        <div className="absolute left-0 top-4 z-10 w-[58%] sm:w-[56%]">
          <div className="overflow-hidden rounded-[1.35rem] shadow-[0_20px_50px_rgba(15,22,87,0.15)] sm:rounded-[1.75rem] md:rounded-[2rem]">
            <img
              key={`main-${index}`}
              src={slide.main}
              alt={slide.mainAlt}
              className="aspect-[4/5] w-full object-cover transition-opacity duration-500"
            />
          </div>
        </div>

        {/* Top-right — tall narrow */}
        <div className="absolute right-0 top-0 z-20 w-[44%] sm:w-[42%]">
          <div className="overflow-hidden rounded-[1.1rem] border-2 border-white shadow-[0_12px_32px_rgba(15,22,87,0.12)] sm:rounded-[1.35rem] md:rounded-[1.5rem]">
            <img
              key={`top-${index}`}
              src={slide.top}
              alt={slide.topAlt}
              className="aspect-[3/4] w-full object-cover transition-opacity duration-500"
            />
          </div>
        </div>

        {/* Bottom-right — wide short */}
        <div className="absolute right-0 top-[52%] z-20 w-[40%] sm:top-[50%] sm:w-[38%]">
          <div className="overflow-hidden rounded-[1rem] border-2 border-white shadow-[0_12px_28px_rgba(15,22,87,0.1)] sm:rounded-[1.25rem]">
            <img
              key={`bottom-${index}`}
              src={slide.bottom}
              alt={slide.bottomAlt}
              className="aspect-[4/3] w-full object-cover transition-opacity duration-500"
            />
          </div>
        </div>

        {/* Floating article card */}
        {featured && (
          <Link
            href={`/articles/${featured.slug}`}
            className="absolute bottom-[18%] left-0 z-30 max-w-[11.5rem] rounded-xl border border-ilm-gold/20 bg-white p-3.5 shadow-[0_8px_28px_rgba(15,22,87,0.12)] transition hover:border-ilm-gold/40 hover:shadow-lg sm:bottom-[16%] sm:max-w-[13rem] sm:p-4 md:max-w-[15rem]"
          >
            <p className="text-[9px] font-semibold uppercase tracking-[.16em] text-ilm-gold sm:text-[10px]">
              New this week
            </p>
            <p className="mt-1.5 font-display text-[13px] leading-snug text-ilm-navy line-clamp-2 sm:text-sm">
              {featured.title}
            </p>
            <span className="mt-2 flex justify-end text-ilm-gold">
              <ArrowRight size={14} />
            </span>
          </Link>
        )}

        {/* Pagination */}
        <div className="absolute bottom-0 right-0 z-30 flex items-center gap-3 sm:gap-4">
          <span className="font-display text-sm tabular-nums text-ilm-gold">
            {String(index + 1).padStart(2, '0')}{' '}
            <span className="text-ilm-gold/50">/ {String(total).padStart(2, '0')}</span>
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous slide"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-ilm-gold/50 text-ilm-navy transition hover:border-ilm-gold hover:bg-ilm-gold/10"
            >
              <ArrowLeft size={15} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next slide"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-ilm-gold/50 text-ilm-navy transition hover:border-ilm-gold hover:bg-ilm-gold/10"
            >
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
