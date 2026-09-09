'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { images } from '@/lib/data';
import type { Article } from '@/lib/data';

/**
 * Compact Netlify-style hero collage (matches reference dump):
 * large Quran left + tall arches top-right + overlapping reading shot + floating card
 */
export function HeroCollage({ featuredArticles }: { featuredArticles: Article[] }) {
  const featured = featuredArticles[0];

  return (
    <div className="relative mx-auto w-full max-w-[420px] lg:ml-auto lg:mr-0 lg:max-w-[460px] xl:max-w-[500px]">
      <div
        className="pointer-events-none absolute -inset-3 rounded-[2rem] border border-slate-200/70 sm:-inset-4 sm:rounded-[2.25rem]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-6 top-8 h-40 w-40 rounded-full border border-slate-200/50 sm:-right-10 sm:h-52 sm:w-52"
        aria-hidden
      />

      <div className="relative aspect-[5/6] w-full">
        <div className="hero-tile hero-tile-1 absolute left-0 top-0 z-10 h-[78%] w-[58%] overflow-hidden rounded-[1.65rem] shadow-[0_18px_40px_rgba(15,22,87,0.14)]">
          <Image
            src={images.quranWarm}
            alt="Open Quran in warm light"
            fill
            priority
            sizes="(max-width: 1024px) 55vw, 280px"
            className="object-cover object-[center_28%]"
          />
        </div>

        <div className="hero-tile hero-tile-2 absolute right-0 top-[2%] z-20 h-[48%] w-[39%] overflow-hidden rounded-[1.4rem] shadow-[0_14px_32px_rgba(15,22,87,0.14)]">
          <Image
            src={images.arches}
            alt="Islamic stone arches"
            fill
            sizes="(max-width: 1024px) 40vw, 200px"
            className="object-cover"
          />
        </div>

        <div className="hero-tile hero-tile-3 absolute bottom-[10%] right-[2%] z-30 h-[36%] w-[46%] overflow-hidden rounded-[1.35rem] shadow-[0_16px_36px_rgba(15,22,87,0.16)]">
          <Image
            src={images.reading}
            alt="Reading an open book"
            fill
            sizes="(max-width: 1024px) 45vw, 220px"
            className="object-cover object-center"
          />
        </div>

        {featured && (
          <Link
            href={`/articles/${featured.slug}`}
            className="hero-tile hero-tile-4 absolute bottom-[2%] left-[3%] z-40 w-[46%] max-w-[180px] rounded-2xl bg-white p-3.5 shadow-[0_10px_32px_rgba(15,22,87,0.12)] ring-1 ring-black/[0.04] transition hover:-translate-y-0.5 hover:shadow-lg sm:p-4"
          >
            <p className="text-[8px] font-semibold uppercase tracking-[.2em] text-ilm-gold">
              New this week
            </p>
            <p className="mt-2 font-display text-[13px] leading-[1.3] text-ilm-navy line-clamp-3 sm:text-[14px]">
              {featured.title}
            </p>
            <span className="mt-2.5 flex justify-end text-ilm-gold" aria-hidden>
              <ArrowRight size={13} />
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
