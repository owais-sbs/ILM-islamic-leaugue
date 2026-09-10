'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, GraduationCap, Sparkles, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { mosqueArchImage, murabbiFilters, murabbiyūn, type MurabbiFilter } from '@/lib/public-data';
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

export function MurabbiyunDirectory({ compact = false }: { compact?: boolean }) {
  const [filter, setFilter] = useState<MurabbiFilter>('All');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const list = useMemo(() => {
    return murabbiyūn.filter((m) => {
      if (filter === 'All') return true;
      if (filter === 'Studies') return m.focus === 'Studies';
      return m.madhhab === filter;
    });
  }, [filter]);

  return (
    <section className="relative overflow-hidden pb-8">
      {!compact && (
        <div className="relative mx-auto grid max-w-[1280px] items-start gap-8 px-4 pt-4 sm:gap-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <ScrollReveal>
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ilm-gold-deep">
              <span className="h-px w-8 bg-ilm-gold" /> Directory
            </p>
            <h1 className="mt-4 text-[36px] font-semibold leading-[1.08] tracking-[-0.04em] text-ilm-navy sm:text-[48px] lg:text-[58px]">
              Meet the <em className="font-serif italic font-normal text-ilm-gold">Murabbiyūn</em>
            </h1>
            <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-ilm-navy/55">
              <span className="font-medium text-ilm-navy">Guided by knowledge. Driven by purpose.</span>
              <br />
              Meet the dedicated murabbiyūn who inspire, teach and nurture the next generation.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.12} className="relative mx-auto w-full max-w-[420px]">
            <GeometricOrnament className="absolute -right-10 -top-6 hidden h-40 w-28 lg:block" />
            <div className="relative">
              <div className="mosque-arch overflow-hidden shadow-[0_24px_50px_rgba(11,17,82,0.14)]">
                <img src={mosqueArchImage} alt="Mosque at sunrise" className="h-[200px] w-full object-cover sm:h-[280px]" />
              </div>
              <Sparkles size={14} className="absolute right-8 top-3 text-ilm-gold" />
              <p className="absolute -right-1 bottom-6 rotate-[-12deg] font-serif italic text-[18px] leading-tight text-ilm-navy/70 sm:-right-2 sm:bottom-8 sm:text-[22px]">
                Knowledge
                <br />
                Builds
                <br />
                <span className="text-ilm-gold-deep">Character</span>
              </p>
            </div>
          </ScrollReveal>
        </div>
      )}

      <div className="mx-auto mt-8 flex max-w-[1280px] items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <div className="min-w-0 flex-1">
          <FilterPills items={murabbiFilters} value={filter} onChange={(v) => setFilter(v as MurabbiFilter)} />
        </div>
        <ViewToggle value={view} onChange={setView} />
      </div>

      <StaggerIn
        className={cn(
          'mx-auto mt-8 max-w-[1280px] px-4 sm:px-6 lg:px-8',
          view === 'grid' ? 'grid gap-4 sm:gap-5 sm:grid-cols-2 xl:grid-cols-4' : 'flex flex-col gap-4'
        )}
      >
        {list.map((person) => {
          const Icon = focusIcon[person.focus];
          return (
            <StaggerChild key={person.id}>
              <article
                className={cn(
                  'rounded-[24px] border border-ilm-navy/[0.06] bg-white p-5 shadow-[0_8px_30px_rgba(11,17,82,0.04)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(11,17,82,0.08)] sm:p-6',
                  view === 'list' && 'flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-6'
                )}
              >
                <div className={cn('flex items-start justify-between', view === 'list' && 'contents')}>
                  <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-bold', person.accent)}>
                    {person.initials}
                  </span>
                  {view === 'grid' && (
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-ilm-cream text-ilm-navy/40">
                      <Icon size={14} />
                    </span>
                  )}
                </div>
                <div className={cn('mx-auto my-5 h-[118px] w-[118px] overflow-hidden rounded-full ring-4 ring-ilm-cream', view === 'list' && 'mx-0 my-0 h-20 w-20 shrink-0')}>
                  <img src={person.image} alt={person.name} className="h-full w-full object-cover" />
                </div>
                <div className={cn(view === 'grid' ? 'text-center' : 'flex-1')}>
                  <h3 className="text-[18px] font-semibold text-ilm-navy">{person.name}</h3>
                  <p className="mt-1 text-[13px] text-ilm-gold-deep">{person.role}</p>
                  <p className="mt-3 text-[13px] leading-relaxed text-ilm-navy/50">{person.bio}</p>
                  <Link
                    href={`/murabbiyun/${person.id}`}
                    className={cn(
                      'mt-5 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors',
                      person.button === 'gold' && 'bg-ilm-gold/20 text-ilm-gold-deep hover:bg-ilm-gold/30',
                      person.button === 'ghost' && 'text-ilm-navy hover:bg-ilm-cream',
                      person.button === 'sand' && 'bg-orange-50 text-orange-700 hover:bg-orange-100',
                      person.button === 'navy' && 'bg-ilm-navy text-white'
                    )}
                  >
                    View Profile <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            </StaggerChild>
          );
        })}
      </StaggerIn>

      {!compact && (
        <div className="mx-auto mt-14 flex max-w-[1280px] flex-col gap-3 px-4 text-[11px] uppercase tracking-[0.16em] text-ilm-navy/35 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="flex items-center gap-3">
            <span className="font-serif text-lg text-ilm-gold">✿</span>
            <span className="h-px w-10 bg-ilm-navy/15" />
            ILM / Murabbiyūn
          </p>
          <a href="#directory" className="flex items-center gap-2">
            Scroll to explore <span className="text-ilm-navy">↓</span>
          </a>
        </div>
      )}
    </section>
  );
}
