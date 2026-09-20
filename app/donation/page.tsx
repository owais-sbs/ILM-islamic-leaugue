'use client';

import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';
import { ScrollReveal, StaggerChild, StaggerIn } from '@/components/public/scroll-reveal';
import { donationContent } from '@/lib/ilm-page-content';

export default function DonationPage() {
  return (
    <main className="flex min-h-[100svh] flex-col overflow-hidden pt-28">
      <SiteHeader active="connect" />
      <div className="flex-1">
        <section className="relative mx-auto max-w-[1100px] px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-10 lg:px-8">
          <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(199,154,61,0.16),transparent_65%)]" />
          <ScrollReveal from="left">
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ilm-gold-deep">
              <span className="h-px w-8 bg-ilm-gold" /> Support
            </p>
            <h1 className="mt-4 max-w-4xl text-[30px] font-semibold tracking-tight text-ilm-navy sm:text-[40px] md:text-[48px]">
              {donationContent.pageTitle}
            </h1>
            <p className="mt-4 text-base text-ilm-navy/60 sm:text-lg">{donationContent.subtitle}</p>
          </ScrollReveal>
          <ScrollReveal from="right" delay={0.1} className="mt-6 max-w-3xl space-y-4">
            {donationContent.introduction.map((para) => (
              <p key={para.slice(0, 48)} className="text-[15px] leading-relaxed text-ilm-navy/65 sm:text-base">
                {para}
              </p>
            ))}
          </ScrollReveal>
        </section>

        <section className="mx-auto max-w-[1100px] space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8 lg:px-8">
          <ScrollReveal from="left">
            <article className="rounded-[28px] border border-ilm-navy/8 bg-white p-6 shadow-[0_12px_40px_rgba(11,17,82,0.05)] sm:p-8">
              <h2 className="text-2xl font-semibold text-ilm-navy sm:text-[28px]">
                {donationContent.mission.title}
              </h2>
              <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-ilm-navy/60 sm:text-base">
                <p>{donationContent.mission.body}</p>
                <p>{donationContent.mission.initialWork}</p>
                <p>{donationContent.mission.expandIntro}</p>
              </div>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-ilm-navy/65 sm:text-base">
                {donationContent.mission.expandItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </ScrollReveal>

          <ScrollReveal from="right" delay={0.04}>
            <article className="rounded-[28px] border border-ilm-navy/8 bg-white p-6 shadow-[0_12px_40px_rgba(11,17,82,0.05)] sm:p-8">
              <h2 className="text-2xl font-semibold text-ilm-navy sm:text-[28px]">
                {donationContent.whySupport.title}
              </h2>
              <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ilm-navy/60 sm:text-base">
                {donationContent.whySupport.intro.map((para) => (
                  <p key={para.slice(0, 40)}>{para}</p>
                ))}
              </div>
              <StaggerIn className="mt-6 space-y-4">
                {donationContent.whySupport.items.map((item, i) => (
                  <StaggerChild key={item.title} from={i % 2 === 0 ? 'left' : 'right'}>
                    <div className="rounded-[20px] border border-ilm-navy/[0.06] bg-ilm-cream/40 p-5">
                      <h3 className="text-lg font-semibold text-ilm-navy">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-ilm-navy/55 sm:text-[15px]">{item.body}</p>
                    </div>
                  </StaggerChild>
                ))}
              </StaggerIn>
            </article>
          </ScrollReveal>

          <ScrollReveal from="left" delay={0.04}>
            <article className="rounded-[28px] border border-ilm-navy/8 bg-white p-6 shadow-[0_12px_40px_rgba(11,17,82,0.05)] sm:p-8">
              <h2 className="text-2xl font-semibold text-ilm-navy sm:text-[28px]">
                {donationContent.longTerm.title}
              </h2>
              <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-ilm-navy/60 sm:text-base">
                {donationContent.longTerm.paragraphs.map((para) => (
                  <p key={para.slice(0, 40)}>{para}</p>
                ))}
              </div>
            </article>
          </ScrollReveal>

          <ScrollReveal from="right" delay={0.04}>
            <article className="rounded-[28px] border border-ilm-navy/8 bg-white p-6 shadow-[0_12px_40px_rgba(11,17,82,0.05)] sm:p-8">
              <h2 className="text-2xl font-semibold text-ilm-navy sm:text-[28px]">
                {donationContent.joinUs.title}
              </h2>
              <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-ilm-navy/60 sm:text-base">
                {donationContent.joinUs.paragraphs.map((para) => (
                  <p key={para.slice(0, 40)}>{para}</p>
                ))}
              </div>
              <p className="mt-8 border-t border-ilm-navy/8 pt-6 text-sm font-medium leading-relaxed text-ilm-navy/70">
                {donationContent.organizational}
              </p>
            </article>
          </ScrollReveal>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
