'use client';

import Link from 'next/link';
import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';
import { ScrollReveal, StaggerChild, StaggerIn } from '@/components/public/scroll-reveal';

const values = [
  {
    title: 'Character before content',
    body: 'We treat learning as formation — knowledge that settles into manners, service, and presence.',
  },
  {
    title: 'Careful scholarship',
    body: 'Writings are reviewed with adab. Editors shape clarity; administrators guard what goes public.',
  },
  {
    title: 'A living circle',
    body: 'Murabbiyūn write. Readers ask. Mentors reply. The community grows through conversation.',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden pt-28">
      <SiteHeader active="about" />

      <section className="relative mx-auto max-w-[1100px] px-6 pb-10 pt-12 lg:px-8">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(199,154,61,0.16),transparent_65%)]" />
        <ScrollReveal from="left">
          <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ilm-gold-deep">
            <span className="h-px w-8 bg-ilm-gold" /> About Us
          </p>
<<<<<<< HEAD
          <h1 className="mt-4 max-w-3xl text-[42px] font-semibold tracking-tight text-ilm-navy sm:text-[52px]">
            A living tradition of <em className="font-serif italic font-normal text-ilm-gold">guidance</em>
          </h1>
        </ScrollReveal>
        <ScrollReveal from="right" delay={0.1} className="mt-6 max-w-2xl">
          <p className="text-lg leading-relaxed text-ilm-navy/65">
            The Islamic League of Murabbiyūn is a home for thoughtful learning, soulful conversation, and the people who help us become more fully human.
=======
          <h1 className="mt-4 text-[34px] font-semibold tracking-tight text-ilm-navy sm:text-[44px]">
            A living tradition of <em className="font-serif italic font-normal text-ilm-gold">guidance</em>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ilm-navy/65">
            The Islamic League of Murabbiyūn is a home for thoughtful learning, soulful conversation, and the people who help us become more fully human. Knowledge here is not gathered as a possession; it is cultivated until it becomes character.
>>>>>>> 5101914cc611ead94a3bf675e32733332f278d46
          </p>
        </ScrollReveal>
      </section>

      <section className="mx-auto grid max-w-[1100px] gap-10 px-6 py-10 lg:grid-cols-2 lg:px-8">
        <ScrollReveal from="left">
          <div className="rounded-[28px] border border-ilm-navy/8 bg-white p-8 shadow-[0_12px_40px_rgba(11,17,82,0.05)]">
            <h2 className="text-2xl font-semibold text-ilm-navy">Our mission</h2>
            <p className="mt-4 leading-relaxed text-ilm-navy/60">
              Knowledge here is not gathered as a possession — it is cultivated until it becomes character. We publish writing that is clear, grounded, and useful for real life.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal from="right" delay={0.08}>
          <div className="rounded-[28px] border border-ilm-navy/8 bg-ilm-navy p-8 text-white shadow-[0_12px_40px_rgba(11,17,82,0.12)]">
            <h2 className="text-2xl font-semibold">How ILM works</h2>
            <p className="mt-4 leading-relaxed text-white/65">
              Visitors read published articles. Murabbiyūn write. Editors review. The Administrator publishes. That is the whole circle — simple, accountable, and human.
            </p>
          </div>
        </ScrollReveal>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 py-16 lg:px-8">
        <ScrollReveal from="up">
          <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ilm-gold-deep">
            <span className="h-px w-8 bg-ilm-gold" /> What guides us
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ilm-navy">Principles we practice</h2>
        </ScrollReveal>
        <StaggerIn className="mt-10 grid gap-5 md:grid-cols-3">
          {values.map((item, i) => (
            <StaggerChild key={item.title} from={i === 1 ? 'up' : i === 0 ? 'left' : 'right'}>
              <article className="h-full rounded-[24px] border border-ilm-navy/[0.06] bg-white p-7">
                <span className="font-serif text-2xl text-ilm-gold/70">0{i + 1}</span>
                <h3 className="mt-3 text-lg font-semibold text-ilm-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ilm-navy/55">{item.body}</p>
              </article>
            </StaggerChild>
          ))}
        </StaggerIn>
        <ScrollReveal from="up" delay={0.1} className="mt-12">
          <Link href="/murabbiyun" className="inline-flex border-b border-ilm-gold pb-1 text-sm font-semibold text-ilm-navy">
            Meet the murabbiyūn
          </Link>
        </ScrollReveal>
      </section>

      <SiteFooter />
    </main>
  );
}
