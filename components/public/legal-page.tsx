'use client';

import Link from 'next/link';
import type { CMLegalPage } from '@/lib/content-manager/types';
import { useCMPages } from '@/lib/content-manager/useCMPages';
import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';

type LegalPageKey = 'privacyPage' | 'disclaimerPage' | 'termsPage';

const relatedPages = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/disclaimer', label: 'Disclaimer' },
  { href: '/terms', label: 'Terms & Conditions' },
];

export function LegalPage({ pageKey }: { pageKey: LegalPageKey }) {
  const content = useCMPages()[pageKey] as CMLegalPage;

  return (
    <main className="min-h-screen pt-24 sm:pt-28">
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-4 pb-14 pt-6 sm:px-6 sm:pb-20 sm:pt-12">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ilm-gold-deep">{content.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold text-ilm-navy sm:text-4xl">{content.title}</h1>
        {content.lastUpdated && <p className="mt-2 text-sm text-ilm-navy/45">Last updated: {content.lastUpdated}</p>}
        <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ilm-navy/65 sm:text-base">
          {content.sections.map((section, index) => (
            <section key={`${section.heading}-${index}`} className="space-y-3">
              {section.heading && <h2 className="pt-2 text-lg font-semibold text-ilm-navy">{section.heading}</h2>}
              {section.body.split(/\n\s*\n/).filter(Boolean).map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex} className="whitespace-pre-line">{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
        <nav aria-label="Related legal pages" className="mt-10 flex flex-wrap gap-5 text-sm font-semibold text-ilm-navy">
          {relatedPages.filter((page) => page.href !== `/${pageKey.replace('Page', '').toLowerCase()}`).map((page) => (
            <Link key={page.href} href={page.href} className="border-b border-ilm-gold pb-1">
              {page.label}
            </Link>
          ))}
        </nav>
      </section>
      <SiteFooter />
    </main>
  );
}
