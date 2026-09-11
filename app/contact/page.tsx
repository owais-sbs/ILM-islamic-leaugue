'use client';

import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-28">
      <SiteHeader active="connect" />
      <section className="mx-auto max-w-xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ilm-gold-deep">Contact</p>
        <h1 className="mt-3 text-4xl font-semibold text-ilm-navy">Write to ILM</h1>
        <p className="mt-4 leading-relaxed text-ilm-navy/60">
          For general correspondence: <strong className="text-ilm-navy">salam@ilm.org</strong>
        </p>
        <p className="mt-2 text-sm text-ilm-navy/50">Questions about sacred knowledge belong on the Ask a Question page so they can be assigned to a murabbi.</p>
        <form className="mt-8 space-y-3" onSubmit={(e) => e.preventDefault()}>
          <input placeholder="Your name" className="w-full rounded-2xl border border-ilm-navy/10 bg-white px-4 py-3 text-sm outline-none" />
          <input type="email" placeholder="Email" className="w-full rounded-2xl border border-ilm-navy/10 bg-white px-4 py-3 text-sm outline-none" />
          <textarea rows={5} placeholder="Message" className="w-full resize-none rounded-2xl border border-ilm-navy/10 bg-white px-4 py-3 text-sm outline-none" />
          <button className="rounded-full bg-ilm-navy px-5 py-3 text-sm font-semibold text-white">Send message</button>
        </form>
      </section>
      <SiteFooter />
    </main>
  );
}
