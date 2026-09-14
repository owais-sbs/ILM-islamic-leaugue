'use client';

import Link from 'next/link';
import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen pt-24 sm:pt-28">
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-4 pb-14 pt-6 sm:px-6 sm:pb-20 sm:pt-12">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ilm-gold-deep">Disclaimer</p>
        <h1 className="mt-3 text-3xl font-semibold text-ilm-navy sm:text-4xl">A note on this content</h1>
        <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ilm-navy/65 sm:text-base">
          <p>
            The writings on the Islamic League of Murabbiyūn (ILM) website are offered for educational and spiritual
            guidance. They are intended to support thoughtful learning, character formation, and respectful conversation.
          </p>
          <p>
            This content is not a substitute for asking a qualified scholar about your specific circumstances. Religious
            rulings (fatwa), personal advice, and decisions that apply to your life should be sought from people of knowledge
            who understand your context.
          </p>
          <p>
            Authors and Murabbiyūn write in good faith. Editors and administrators review material for clarity and care,
            but ILM does not guarantee completeness, and readers remain responsible for how they apply what they read.
          </p>
          <p>
            External links, quotations, and references are provided for learning. Their presence does not imply endorsement
            of every view associated with a linked source. Where scholarly disagreement (ikhtilāf) appears, we aim to
            present it with adab rather than to settle every dispute.
          </p>
          <p>
            By using this site you acknowledge that ILM, its contributors, and affiliated organizers are not liable for
            decisions made solely on the basis of published articles, directory profiles, or answers offered through the
            Ask a Question flow.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap gap-5 text-sm font-semibold text-ilm-navy">
          <Link href="/privacy" className="border-b border-ilm-gold pb-1">
            Privacy Policy
          </Link>
          <Link href="/terms" className="border-b border-ilm-gold pb-1">
            Terms &amp; Conditions
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
