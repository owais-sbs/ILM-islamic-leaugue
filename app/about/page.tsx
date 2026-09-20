'use client';

import Link from 'next/link';
import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';
import { ScrollReveal, StaggerChild, StaggerIn } from '@/components/public/scroll-reveal';
import { aboutContent } from '@/lib/ilm-page-content';

export default function AboutPage() {
  return (
    <main className="flex min-h-[100svh] flex-col overflow-hidden pt-28">
      <SiteHeader active="about" />
      <div className="flex-1">
        <section className="relative mx-auto max-w-[1100px] px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-10 lg:px-8">
          <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(199,154,61,0.16),transparent_65%)]" />
          <ScrollReveal from="left">
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ilm-gold-deep">
              <span className="h-px w-8 bg-ilm-gold" /> About Us
            </p>
            <h1 className="mt-4 max-w-3xl text-[34px] font-semibold tracking-tight text-ilm-navy sm:text-[42px] md:text-[52px]">
              Contributing Mentors /{' '}
              <em className="font-serif italic font-normal text-ilm-gold">Murabbiyūn</em>
            </h1>
          </ScrollReveal>
          <ScrollReveal from="right" delay={0.1} className="mt-6 max-w-3xl space-y-4">
            {aboutContent.intro.map((para) => (
              <p key={para.slice(0, 48)} className="text-base leading-relaxed text-ilm-navy/65 sm:text-lg">
                {para}
              </p>
            ))}
          </ScrollReveal>
        </section>

        <section className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <ScrollReveal from="up">
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ilm-gold-deep">
              <span className="h-px w-8 bg-ilm-gold" /> What guides us
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ilm-navy sm:text-3xl">
              {aboutContent.principlesTitle}
            </h2>
          </ScrollReveal>
          <StaggerIn className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {aboutContent.principles.map((item, i) => (
              <StaggerChild key={item.title} from={i % 3 === 0 ? 'left' : i % 3 === 1 ? 'up' : 'right'}>
                <article className="h-full rounded-[24px] border border-ilm-navy/[0.06] bg-white p-7">
                  <span className="font-serif text-2xl text-ilm-gold/70">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-ilm-navy">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ilm-navy/55">{item.body}</p>
                </article>
              </StaggerChild>
            ))}
          </StaggerIn>
          <ScrollReveal from="up" delay={0.08} className="mt-8">
            <p className="max-w-3xl text-[15px] leading-relaxed text-ilm-navy/60 sm:text-base">
              {aboutContent.closing}
            </p>
          </ScrollReveal>
        </section>

        <section id="founders-statement" className="mx-auto max-w-[1100px] px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8">
          <ScrollReveal from="left">
            <article className="rounded-[28px] border border-ilm-navy/8 bg-white p-6 shadow-[0_12px_40px_rgba(11,17,82,0.05)] sm:p-8 md:p-10">
              <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ilm-gold-deep">
                <span className="h-px w-8 bg-ilm-gold" /> Founder
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-ilm-navy sm:text-[28px]">
                {aboutContent.founderTitle}
              </h2>
              <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ilm-navy/65 sm:text-base">
                {aboutContent.founderParagraphs.map((para, index) => {
                  const isQuote = para.startsWith('“') || para.startsWith('"');
                  const isLabel = para === 'Allah says:';
                  return (
                    <p
                      key={`founder-${index}`}
                      className={
                        isQuote
                          ? 'border-l-2 border-ilm-gold/60 pl-4 font-serif italic text-ilm-navy/80'
                          : isLabel
                            ? 'font-semibold text-ilm-navy'
                            : undefined
                      }
                    >
                      {para}
                    </p>
                  );
                })}
              </div>
              <p className="mt-8 text-sm font-semibold text-ilm-navy">
                {aboutContent.founderAuthor}
              </p>
            </article>
          </ScrollReveal>
          <ScrollReveal from="up" delay={0.1} className="mt-10 flex flex-wrap gap-5">
            <Link href="/murabbiyun" className="inline-flex border-b border-ilm-gold pb-1 text-sm font-semibold text-ilm-navy">
              Meet the murabbiyūn
            </Link>
            <Link href="/mission-vision" className="inline-flex border-b border-ilm-gold pb-1 text-sm font-semibold text-ilm-navy">
              Mission &amp; Vision
            </Link>
            <Link href="/articles" className="inline-flex border-b border-ilm-gold pb-1 text-sm font-semibold text-ilm-navy">
              Explore the library
            </Link>
          </ScrollReveal>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
