'use client';

import Link from 'next/link';
import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';
import { ScrollReveal, StaggerChild, StaggerIn } from '@/components/public/scroll-reveal';

const sections = [
  {
    id: 'about-ilm',
    eyebrow: 'About ILM',
    title: 'A league for cultivated learning',
    body: [
      'The Islamic League of Murabbiyūn (ILM) is a home for thoughtful Islamic learning — articles, mentorship, and conversation that treat knowledge as formation, not accumulation.',
      'We gather writers, editors, and seekers around a shared aim: to let learning settle into character, manners, and service. In a noisy age, ILM creates room for paced study, careful speech, and questions held with adab.',
    ],
  },
  {
    id: 'meaning',
    eyebrow: 'Meaning',
    title: 'What Murabbiyūn means',
    body: [
      'Murabbī (plural Murabbiyūn) points to the one who nurtures — who raises, educates, and accompanies another toward maturity. It is not a title of status alone; it is a responsibility of care.',
      'At ILM, Murabbiyūn are mentors and cultivators: people who write with clarity, answer with patience, and model that knowledge is measured by how we become, not only by what we know.',
    ],
  },
  {
    id: 'methodology',
    eyebrow: 'Methodology',
    title: 'How we approach learning',
    body: [
      'We begin with roots — classical sources, careful language, and respect for scholarly disagreement (ikhtilāf) without losing brotherhood.',
      'Writings are paced for reflection. Readers are invited to sit with an article the way one sits with a teacher. Questions may be asked with adab, and answers are offered with care rather than haste.',
      'The path is simple: read with presence, ask with sincerity, and live what you learn until habit and character catch up with understanding.',
    ],
  },
  {
    id: 'governance',
    eyebrow: 'Governance',
    title: 'How ILM is stewarded',
    body: [
      'Murabbiyūn write. Editors review for clarity, tone, and scholarly care. The Administrator holds final publishing authority for what appears in the public library.',
      'That circle keeps the site accountable and human: visitors read what is published; contributors work through a clear review path; questions and correspondence reach the team so they can be answered thoughtfully.',
      'We do not replace personal consultation with a qualified scholar for your specific circumstances. ILM offers educational guidance within a transparent editorial process.',
    ],
  },
];

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
              A living tradition of <em className="font-serif italic font-normal text-ilm-gold">guidance</em>
            </h1>
          </ScrollReveal>
          <ScrollReveal from="right" delay={0.1} className="mt-6 max-w-2xl">
            <p className="text-base leading-relaxed text-ilm-navy/65 sm:text-lg">
              The Islamic League of Murabbiyūn is a home for thoughtful learning, soulful conversation, and the people who help us become more fully human.
            </p>
          </ScrollReveal>
        </section>

        <section className="mx-auto max-w-[1100px] space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8 lg:px-8">
          {sections.map((section, i) => (
            <ScrollReveal key={section.id} from={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.04}>
              <article
                id={section.id}
                className="rounded-[28px] border border-ilm-navy/8 bg-white p-6 shadow-[0_12px_40px_rgba(11,17,82,0.05)] sm:p-8"
              >
                <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ilm-gold-deep">
                  <span className="h-px w-8 bg-ilm-gold" /> {section.eyebrow}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-ilm-navy sm:text-[28px]">{section.title}</h2>
                <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ilm-navy/60 sm:text-base">
                  {section.body.map((para) => (
                    <p key={para.slice(0, 40)}>{para}</p>
                  ))}
                </div>
              </article>
            </ScrollReveal>
          ))}
        </section>

        <section className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <ScrollReveal from="up">
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ilm-gold-deep">
              <span className="h-px w-8 bg-ilm-gold" /> What guides us
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ilm-navy sm:text-3xl">Principles we practice</h2>
          </ScrollReveal>
          <StaggerIn className="mt-8 grid gap-5 md:grid-cols-3">
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
          <ScrollReveal from="up" delay={0.1} className="mt-10 flex flex-wrap gap-5">
            <Link href="/murabbiyun" className="inline-flex border-b border-ilm-gold pb-1 text-sm font-semibold text-ilm-navy">
              Meet the murabbiyūn
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
