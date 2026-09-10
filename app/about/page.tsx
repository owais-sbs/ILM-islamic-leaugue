'use client';

import Link from 'next/link';
import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';
import { ScrollReveal } from '@/components/public/scroll-reveal';

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-28">
      <SiteHeader active="about" />
      <section className="mx-auto max-w-3xl px-6 py-20">
        <ScrollReveal>
          <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ilm-gold-deep">
            <span className="h-px w-8 bg-ilm-gold" /> About ILM
          </p>
          <h1 className="mt-4 text-[44px] font-semibold tracking-tight text-ilm-navy">
            A living tradition of <em className="font-serif italic font-normal text-ilm-gold">guidance</em>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ilm-navy/65">
            The Islamic League of Murabbiyūn is a home for thoughtful learning, soulful conversation, and the people who help us become more fully human. Knowledge here is not gathered as a possession — it is cultivated until it becomes character.
          </p>
          <p className="mt-4 leading-relaxed text-ilm-navy/60">
            Visitors read published articles. Murabbiyūn write. Editors review. The Director publishes. That is the whole circle.
          </p>
          <Link href="/murabbiyun" className="mt-8 inline-flex border-b border-ilm-gold pb-1 text-sm font-semibold text-ilm-navy">
            Meet the murabbiyūn
          </Link>
        </ScrollReveal>
      </section>
      <SiteFooter />
    </main>
  );
}
