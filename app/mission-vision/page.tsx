'use client';

import Link from 'next/link';
import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';
import { ScrollReveal, StaggerChild, StaggerIn } from '@/components/public/scroll-reveal';
import { useCMPages } from '@/lib/content-manager/useCMPages';

export default function MissionVisionPage() {
  const { missionVisionPage: c } = useCMPages();

  return (
    <main className="flex min-h-[100svh] flex-col overflow-hidden pt-28">
      <SiteHeader active="about" />
      <div className="flex-1">

        {/* ── Page header ── */}
        <section className="relative mx-auto max-w-[1100px] px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-10 lg:px-8">
          <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(199,154,61,0.16),transparent_65%)]" />
          <ScrollReveal from="left">
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ilm-gold-deep">
              <span className="h-px w-8 bg-ilm-gold" /> ILM
            </p>
            <h1 className="mt-4 max-w-3xl text-[34px] font-semibold tracking-tight text-ilm-navy sm:text-[42px] md:text-[52px]">
              {c.pageTitle}
            </h1>
          </ScrollReveal>
        </section>

        {/* ── Mission & Vision cards ── */}
        <section className="mx-auto max-w-[1100px] space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8 lg:px-8">
          <ScrollReveal from="left">
            <article className="rounded-[28px] border border-ilm-navy/8 bg-white p-6 shadow-[0_12px_40px_rgba(11,17,82,0.05)] sm:p-8">
              <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ilm-gold-deep">
                <span className="h-px w-8 bg-ilm-gold" /> {c.missionEyebrow}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-ilm-navy sm:text-[28px]">{c.missionTitle}</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ilm-navy/60 sm:text-base">{c.missionBody}</p>
            </article>
          </ScrollReveal>

          <ScrollReveal from="right" delay={0.04}>
            <article className="rounded-[28px] border border-ilm-navy/8 bg-white p-6 shadow-[0_12px_40px_rgba(11,17,82,0.05)] sm:p-8">
              <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ilm-gold-deep">
                <span className="h-px w-8 bg-ilm-gold" /> {c.visionEyebrow}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-ilm-navy sm:text-[28px]">{c.visionTitle}</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ilm-navy/60 sm:text-base">{c.visionBody}</p>
              {c.visionNotes.length > 0 && (
                <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ilm-navy/60 sm:text-base">
                  {c.visionNotes.map((note, i) => <p key={i}>{note}</p>)}
                </div>
              )}
            </article>
          </ScrollReveal>
        </section>

        {/* ── Objectives ── */}
        <section className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <ScrollReveal from="up">
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ilm-gold-deep">
              <span className="h-px w-8 bg-ilm-gold" /> Goals
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ilm-navy sm:text-3xl">
              {c.objectivesTitle}
            </h2>
          </ScrollReveal>
          <StaggerIn className="mt-8 space-y-4">
            {c.objectives.map((objective, i) => (
              <StaggerChild key={i} from={i % 2 === 0 ? 'left' : 'right'}>
                <article className="flex gap-4 rounded-[24px] border border-ilm-navy/[0.06] bg-white p-5 sm:p-6">
                  <span className="font-serif text-xl text-ilm-gold/70 sm:text-2xl">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-[15px] leading-relaxed text-ilm-navy/65 sm:text-base">{objective}</p>
                </article>
              </StaggerChild>
            ))}
          </StaggerIn>
          <ScrollReveal from="up" delay={0.1} className="mt-10 flex flex-wrap gap-5">
            <Link href="/about" className="inline-flex border-b border-ilm-gold pb-1 text-sm font-semibold text-ilm-navy">
              About ILM
            </Link>
            <Link href="/donation" className="inline-flex border-b border-ilm-gold pb-1 text-sm font-semibold text-ilm-navy">
              Support ILM
            </Link>
          </ScrollReveal>
        </section>

      </div>
      <SiteFooter />
    </main>
  );
}
