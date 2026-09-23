'use client';

import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';
import { ScrollReveal, StaggerChild, StaggerIn } from '@/components/public/scroll-reveal';
import { donationContent } from '@/lib/ilm-page-content';

export default function DonationPage() {
  return (
    <main className="flex min-h-[100svh] flex-col overflow-x-hidden pt-28">
      <SiteHeader active="connect" />
      <div className="flex-1">
        <section className="relative mx-auto max-w-[1100px] px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-10 lg:px-8">
          <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(199,154,61,0.16),transparent_65%)]" />
          <div className="grid items-start gap-8 md:grid-cols-2 md:gap-8 lg:gap-10">
            <div className="order-1 min-w-0">
              <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ilm-gold-deep">
                <span className="h-px w-8 bg-ilm-gold" /> Support
              </p>
              <h1 className="mt-4 text-[26px] font-semibold tracking-tight text-ilm-navy sm:text-[34px] lg:text-[40px]">
                {donationContent.pageTitle}
              </h1>
              <p className="mt-3 text-base text-ilm-navy/60 sm:text-lg">{donationContent.subtitle}</p>
              <div className="mt-5 space-y-3.5">
                {donationContent.introduction.map((para) => (
                  <p key={para.slice(0, 48)} className="text-[15px] leading-relaxed text-ilm-navy/65 sm:text-base">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            <div className="order-2 min-w-0 md:sticky md:top-28">
              <article className="overflow-hidden rounded-[28px] border border-ilm-navy/8 bg-white text-left shadow-[0_12px_40px_rgba(11,17,82,0.05)]">
                <div className="flex items-center justify-center bg-[linear-gradient(160deg,rgba(199,154,61,0.14),rgba(247,243,234,0.9)_55%)] p-5 sm:p-7">
                  <div className="w-full max-w-[200px] rounded-[22px] border border-ilm-gold/30 bg-white p-3 shadow-[0_10px_30px_rgba(11,17,82,0.08)] sm:max-w-[240px]">
                    <img
                      src="/talha-zelle-qr.png"
                      alt="Zelle QR code for Talha Islamic Ministry"
                      width={1180}
                      height={1180}
                      className="h-auto w-full [image-rendering:crisp-edges]"
                    />
                  </div>
                </div>
                <div className="min-w-0 p-5 sm:p-6">
                  <h2 className="text-xl font-semibold text-ilm-navy sm:text-2xl">Donate via Zelle</h2>
                  <dl className="mt-4 space-y-2.5 text-[14px] leading-relaxed text-ilm-navy/65 sm:text-[15px]">
                    <div className="flex flex-col gap-0.5">
                      <dt className="font-semibold text-ilm-navy">Zelle Tag:</dt>
                      <dd className="min-w-0 break-words">talha-islamic-ministry</dd>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <dt className="font-semibold text-ilm-navy">Zelle Email:</dt>
                      <dd className="min-w-0 break-all">
                        <a
                          href="mailto:tislamicministry@gmail.com"
                          className="border-b border-ilm-gold/50 text-ilm-navy transition-colors hover:text-ilm-gold-deep"
                        >
                          tislamicministry@gmail.com
                        </a>
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-[14px] font-semibold leading-relaxed text-ilm-navy sm:text-[15px]">
                    Talha ibn Ubaidillah Center
                    <br />
                    1026 Cosby Ave, Cambridge, MD
                  </p>
                  <p className="mt-4 border-t border-ilm-navy/8 pt-4 text-[13px] leading-relaxed text-ilm-navy/65 sm:text-[14px]">
                    Open your banking app, select Zelle, and scan the code above, or search
                    tislamicministry@gmail.com directly in Zelle to send your donation. You&apos;ll see &quot;Talha
                    Islamic Ministry Inc.&quot; as the confirmed recipient.
                  </p>
                </div>
              </article>
            </div>
          </div>
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
