'use client';

import Link from 'next/link';
import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-24 sm:pt-28">
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-4 pb-14 pt-6 sm:px-6 sm:pb-20 sm:pt-12">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ilm-gold-deep">Legal</p>
        <h1 className="mt-3 text-3xl font-semibold text-ilm-navy sm:text-4xl">Terms &amp; Conditions</h1>
        <p className="mt-2 text-sm text-ilm-navy/45">Last updated: September 2026</p>
        <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ilm-navy/65 sm:text-base">
          <p>
            By accessing the Islamic League of Murabbiyūn website, you agree to these terms. If you do not agree, please
            do not use the site.
          </p>
          <h2 className="pt-2 text-lg font-semibold text-ilm-navy">Educational purpose</h2>
          <p>
            Content is provided for learning and spiritual reflection. It is not professional, legal, medical, or
            individualized religious counsel. Always consult qualified scholars for matters that apply to your situation.
          </p>
          <h2 className="pt-2 text-lg font-semibold text-ilm-navy">Acceptable use</h2>
          <p>
            You agree not to misuse the site, attempt unauthorized access to contributor systems, submit abusive or
            unlawful content, or scrape the library in a way that harms service for others.
          </p>
          <h2 className="pt-2 text-lg font-semibold text-ilm-navy">Submissions</h2>
          <p>
            Questions and messages you send may be reviewed by ILM staff and assigned Murabbiyūn. Do not include sensitive
            personal data you are not comfortable sharing for that purpose.
          </p>
          <h2 className="pt-2 text-lg font-semibold text-ilm-navy">Intellectual property</h2>
          <p>
            Articles, branding, and site design are protected. You may share links and brief quotations with attribution
            for personal, non-commercial learning. Reproduction of full articles without permission is not allowed.
          </p>
          <h2 className="pt-2 text-lg font-semibold text-ilm-navy">Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, ILM and its contributors are not liable for indirect or consequential
            loss arising from use of the site or reliance on published content.
          </p>
          <h2 className="pt-2 text-lg font-semibold text-ilm-navy">Changes</h2>
          <p>
            We may update these terms as the platform grows. Continued use after changes means you accept the revised
            terms. Related pages include our{' '}
            <Link href="/privacy" className="border-b border-ilm-gold text-ilm-navy">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link href="/disclaimer" className="border-b border-ilm-gold text-ilm-navy">
              Disclaimer
            </Link>
            .
          </p>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
