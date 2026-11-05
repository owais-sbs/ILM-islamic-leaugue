'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, GraduationCap, Sparkles, UserRound } from 'lucide-react';
import { murabbiFilters, type Murabbi, type MurabbiFilter } from '@/lib/public-data';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import type { CMDirectory } from '@/lib/content-manager/types';
import { useContentManager } from '@/lib/content-manager/useContentManager';
import { orderMurabbiyun, usePublicMurabbiyun } from '@/lib/murabbiyun';
import { FilterPills, ViewToggle } from './library-explorer';
import { ScrollReveal, StaggerChild, StaggerIn } from './scroll-reveal';
import { GeometricOrnament } from './brand';
import { cn } from '@/lib/utils';

const focusIcon = {
  Studies: GraduationCap,
  Fiqh: BookOpen,
  Spiritual: UserRound,
  Arabic: BookOpen,
};

function MurabbiCard({ person, index, view }: { person: Murabbi; index: number; view: 'grid' | 'list' }) {
  const Icon = person.focus ? focusIcon[person.focus] : BookOpen;
  const num = String(index + 1).padStart(2, '0');
  return (
    <article
      className={cn(
        'flex h-full min-h-[440px] flex-col rounded-[24px] border border-ilm-navy/[0.06] bg-white p-5 shadow-[0_8px_30px_rgba(11,17,82,0.04)] transition-shadow duration-300 hover:shadow-[0_18px_40px_rgba(11,17,82,0.08)] sm:min-h-[460px] sm:p-6',
        view === 'list' && 'min-h-0 flex-row items-center gap-6 sm:min-h-[180px]',
      )}
    >
      <div className={cn('flex items-start justify-between', view === 'list' && 'contents')}>
        <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-medium', person.accent)}>
          {num}
        </span>
        {view === 'grid' && (
          <span className="grid h-8 w-8 place-items-center rounded-full bg-ilm-cream text-ilm-navy/40">
            <Icon size={14} />
          </span>
        )}
      </div>
      <div className={cn('mx-auto my-5 h-[118px] w-[118px] shrink-0 overflow-hidden rounded-full ring-4 ring-ilm-cream', view === 'list' && 'mx-0 my-0 h-20 w-20')}>
        <img src={person.image} alt={person.name} className="h-full w-full object-cover" loading="lazy" decoding="async" draggable={false} />
      </div>
      <div className={cn('flex min-w-0 flex-1 flex-col', view === 'grid' ? 'text-center' : '')}>
        <h3 className="break-words text-[18px] font-semibold text-ilm-navy">{person.name}</h3>
        <p className="mt-1 break-words text-[13px] text-ilm-gold-deep">{person.role}</p>
        <p className="mt-3 min-h-[4.5rem] flex-1 text-[13px] leading-relaxed text-ilm-navy/50 line-clamp-4">
          {person.bio || ' '}
        </p>
        <Link
          href={`/murabbiyun/${person.id}`}
          className="mt-5 inline-flex items-center justify-center gap-1.5 self-center rounded-full border border-ilm-navy/10 px-4 py-2 text-[13px] font-medium text-ilm-navy transition-colors hover:bg-ilm-cream"
        >
          View Profile <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}

/**
 * Swipeable row of cards. Phones show one card with the next one peeking in,
 * so it is obvious the row scrolls; wider screens show 2 / 3 / 4 at a time.
 */
function MurabbiCarousel({ people }: { people: Murabbi[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    if (!api) return;
    const sync = () => {
      setSnaps(api.scrollSnapList());
      setSelected(api.selectedScrollSnap());
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };
    sync();
    api.on('select', sync);
    api.on('reInit', sync);
    return () => {
      api.off('select', sync);
      api.off('reInit', sync);
    };
  }, [api]);

  const arrow =
    'grid h-10 w-10 place-items-center rounded-full border border-ilm-navy/10 bg-white text-ilm-navy shadow-sm transition-colors hover:bg-ilm-cream disabled:cursor-not-allowed disabled:opacity-35';

  return (
    <div className="mx-auto mt-8 w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
      <Carousel setApi={setApi} opts={{ align: 'start', containScroll: 'trimSnaps' }} aria-label="Murabbiyūn">
        <CarouselContent className="py-2">
          {people.map((person, index) => (
            <CarouselItem
              key={person.id}
              className="basis-[86%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              aria-label={`${index + 1} of ${people.length}`}
            >
              <MurabbiCard person={person} index={index} view="grid" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {snaps.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button type="button" onClick={() => api?.scrollPrev()} disabled={!canPrev} className={arrow} aria-label="Previous murabbi">
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-1.5">
            {snaps.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => api?.scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === selected}
                className={cn(
                  'h-2 rounded-full transition-all',
                  i === selected ? 'w-6 bg-ilm-navy' : 'w-2 bg-ilm-navy/20 hover:bg-ilm-navy/40',
                )}
              />
            ))}
          </div>
          <button type="button" onClick={() => api?.scrollNext()} disabled={!canNext} className={arrow} aria-label="Next murabbi">
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

export function MurabbiyunDirectory({ compact = false }: { compact?: boolean }) {
  const cm = useContentManager();
  const dir: CMDirectory = cm.directory;
  const { list: murabbiyun } = usePublicMurabbiyun();

  const [filter, setFilter] = useState<MurabbiFilter>('All');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const list = useMemo(() => {
    const base = orderMurabbiyun(murabbiyun, dir.murabbiyun.items);
    return base.filter((m) => {
      if (filter === 'All') return true;
      if (filter === 'Studies') return m.focus === 'Studies';
      return true;
    });
  }, [filter, dir.murabbiyun.items, murabbiyun]);

  return (
    <section className="relative overflow-x-hidden pb-8">
      {!compact && (
        <div className="relative mx-auto grid max-w-[1280px] items-start gap-8 px-4 pt-4 sm:gap-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <ScrollReveal>
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ilm-gold-deep">
              <span className="h-px w-8 bg-ilm-gold" /> {dir.sectionLabel}
            </p>
            <h1 className="mt-4 text-[36px] font-semibold leading-[1.08] tracking-[-0.04em] text-ilm-navy sm:text-[48px] lg:text-[58px]">
              {dir.heading}{' '}
              <em className="font-serif italic font-normal text-ilm-gold">{dir.headingHighlight}</em>
            </h1>
            <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-ilm-navy/55">{dir.description1}</p>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-ilm-navy/50">{dir.description2}</p>
          </ScrollReveal>

          <ScrollReveal delay={0.12} className="relative mx-auto w-full max-w-[420px]">
            <GeometricOrnament className="absolute -right-10 -top-6 hidden h-40 w-28 lg:block" />
            <div className="relative">
              <div className="mosque-arch overflow-hidden shadow-[0_24px_50px_rgba(11,17,82,0.14)]">
                <img src={dir.image} alt={dir.imageAlt} className="h-[200px] w-full object-cover sm:h-[280px]" />
              </div>
              <Sparkles size={14} className="absolute right-8 top-3 text-ilm-gold" />
              <p className="absolute -right-1 bottom-6 rotate-[-12deg] font-serif italic text-[18px] leading-tight text-white drop-shadow-[0_2px_12px_rgba(11,17,82,0.45)] sm:-right-2 sm:bottom-8 sm:text-[22px]">
                {dir.overlayLine1}<br />{dir.overlayLine2}<br />{dir.overlayLine3}
              </p>
            </div>
          </ScrollReveal>
        </div>
      )}

      <div className="mx-auto mt-8 flex max-w-[1280px] items-center justify-between gap-3 px-4 py-1 sm:gap-4 sm:px-6 lg:px-8">
        <div className="min-w-0 flex-1">
          <FilterPills items={murabbiFilters} value={filter} onChange={(v) => setFilter(v as MurabbiFilter)} />
        </div>
        <ViewToggle value={view} onChange={setView} />
      </div>

      {view === 'grid' ? (
        <MurabbiCarousel key={filter} people={list} />
      ) : (
        <StaggerIn
          key={`${filter}-${view}`}
          mode="animate"
          className="murabbi-grid mx-auto mt-8 flex w-full max-w-[1400px] flex-col gap-4 px-4 sm:px-6 lg:px-8"
        >
          {list.map((person, index) => (
            <StaggerChild key={person.id} className="h-full">
              <MurabbiCard person={person} index={index} view="list" />
            </StaggerChild>
          ))}
        </StaggerIn>
      )}

      {!compact && (
        <div className="relative mx-auto mt-14 max-w-[1280px] px-4 text-[11px] uppercase tracking-[0.16em] text-ilm-navy/35 sm:px-6 lg:px-8">
          <p className="flex items-center gap-3">
            <span className="font-serif text-lg text-ilm-gold">✿</span>
            <span className="h-px w-10 bg-ilm-navy/15" />
            ILM / Murabbiyūn
          </p>
        </div>
      )}
    </section>
  );
}
