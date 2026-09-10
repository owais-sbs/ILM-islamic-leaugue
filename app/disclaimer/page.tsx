'use client';

import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen pt-28">
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-6 py-20">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ilm-gold-deep">Disclaimer</p>
        <h1 className="mt-3 text-4xl font-semibold text-ilm-navy">A note on this content</h1>
        <p className="mt-6 leading-relaxed text-ilm-navy/65">
          The writings on this site are for educational and spiritual guidance. They are not a substitute for asking a qualified scholar about your specific circumstances. Always consult people of knowledge for religious rulings that apply to you.
        </p>
      </section>
      <SiteFooter />
    </main>
  );
}
