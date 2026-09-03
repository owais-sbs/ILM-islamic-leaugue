'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CircleHelp,
  Compass,
  Feather,
  Send,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Reveal } from '@/components/Reveal';
import { HeroCollage } from '@/components/HeroCollage';
import { ArticleCard } from '@/components/ArticleCard';
import { articles, categories, authors, images } from '@/lib/data';

const categoryIcons: Record<string, LucideIcon> = {
  'Qur\'an & Tafsir': BookOpen,
  'Spirituality': Sparkles,
  'Islamic History': Compass,
  'Character & Practice': Feather,
};

export default function Home() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const published = articles.filter((a) => a.status === 'published');

  return (
    <main className="overflow-hidden bg-white">
      <SiteHeader />

      {/* Hero — white, two-column with imagery */}
      <section className="relative bg-white px-6 pb-16 pt-36 md:px-12 md:pb-24 md:pt-44">
        <div className="absolute inset-0 grid-paper opacity-40" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="hero-rise mb-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.28em] text-ilm-gold">
              <span className="h-px w-10 bg-ilm-gold" /> Islamic League of Murabbiyūn
            </div>
            <h1 className="hero-rise delay-1 font-display text-5xl leading-[.98] tracking-[-.03em] text-balance text-ilm-navy md:text-7xl">
              The work of <em className="font-normal text-ilm-gold">becoming.</em>
            </h1>
            <p className="hero-rise delay-2 mt-6 max-w-lg text-lg leading-8 text-slate-600">
              A considered space for the questions, practices, and ideas that help us live with more meaning.
            </p>
            <div className="hero-rise delay-3 mt-8 flex flex-wrap gap-3">
              <Link href="/articles" className="group flex items-center gap-3 rounded-full bg-ilm-gold px-6 py-3.5 text-xs font-semibold uppercase tracking-[.13em] text-white transition hover:bg-ilm-gold-dark hover:shadow-lg hover:shadow-ilm-gold/25">
                Explore the library <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/about" className="rounded-full border border-ilm-navy/15 bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-[.13em] text-ilm-navy transition hover:border-ilm-gold hover:text-ilm-gold">
                Why ILM
              </Link>
            </div>
            <div className="mt-12 hidden items-center gap-3 text-[10px] font-semibold uppercase tracking-[.2em] text-slate-400 md:flex">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ilm-navy/10">
                <ArrowDown size={15} />
              </span>
              Scroll to explore
            </div>
          </div>

          <HeroCollage featuredArticles={published.slice(0, 3)} />
        </div>
      </section>

      {/* About teaser */}
      <section id="about" className="bg-ilm-cream/50 px-6 py-24 md:px-12 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-[.85fr_1.15fr] md:items-end">
          <Reveal>
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[.25em] text-ilm-gold">A place to return to</p>
            <h2 className="max-w-md font-display text-4xl leading-[1.08] text-ilm-navy md:text-5xl">
              Learning is a form of <em className="font-normal text-ilm-gold">devotion.</em>
            </h2>
          </Reveal>
          <Reveal delay="delay-1">
            <p className="max-w-xl text-lg leading-8 text-slate-600">
              ILM is a public library of thoughtful Islamic writing — made for the person who wants to go a little deeper. We bring together qualified voices, careful editorial work, and a belief that good knowledge should feel both rigorous and alive.
            </p>
            <Link href="/about" className="mt-7 inline-flex items-center gap-2 border-b border-ilm-gold pb-2 text-xs font-semibold uppercase tracking-[.15em] text-ilm-navy transition hover:gap-4">
              Find your way in <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Featured articles */}
      <section id="library" className="bg-white px-6 py-20 md:px-12 md:py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[.25em] text-ilm-gold">From the library</p>
                <h2 className="font-display text-4xl text-ilm-navy md:text-5xl">Ideas for the road ahead</h2>
              </div>
              <Link href="/articles" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.15em] text-ilm-navy transition hover:gap-3 hover:text-ilm-gold">
                View all articles <ArrowRight size={15} />
              </Link>
            </div>
          </Reveal>
          <Reveal><ArticleCard article={published[0]} featured /></Reveal>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {published.slice(1).map((article, i) => (
              <Reveal key={article.id} delay={`delay-${(i % 3) + 1}`}>
                <ArticleCard article={article} compact />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by subject */}
      <section className="bg-ilm-cream/50 px-6 py-24 md:px-12 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="mb-12 flex items-end justify-between">
              <div>
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[.25em] text-ilm-gold">Browse by subject</p>
                <h2 className="font-display text-4xl text-ilm-navy md:text-5xl">Where would you like to begin?</h2>
              </div>
              <span className="hidden font-display text-5xl text-ilm-gold/25 md:block" dir="rtl">بسم الله</span>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.slice(0, 4).map(({ name, description, articleCount, slug }, index) => {
              const Icon = categoryIcons[name] || BookOpen;
              return (
                <Reveal key={slug} delay={`delay-${(index % 3) + 1}`}>
                  <Link href={`/categories/${slug}`} className="group flex min-h-[220px] flex-col justify-between rounded-3xl border border-slate-200/70 bg-white p-6 shadow-[0_2px_20px_rgba(15,22,87,0.04)] transition duration-500 hover:-translate-y-1 hover:border-ilm-gold/40 hover:shadow-[0_16px_40px_rgba(15,22,87,0.08)]">
                    <div className="flex items-start justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ilm-cream text-ilm-gold">
                        <Icon size={22} strokeWidth={1.5} />
                      </span>
                      <ArrowUpRight size={18} className="text-ilm-gold/30 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ilm-gold" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl text-ilm-navy">{name}</h3>
                      <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
                      <p className="mt-4 text-[9px] font-semibold uppercase tracking-[.18em] text-ilm-gold/80">{articleCount} articles</p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Murabbiyun */}
      <section id="murabbiyun" className="bg-white px-6 py-24 md:px-12 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1fr_1.1fr] md:items-center">
          <Reveal>
            <div className="relative mx-auto max-w-sm">
              <div className="absolute -bottom-5 -left-5 h-full w-full rounded-3xl border border-ilm-gold/25" />
              <img src={images.scholar1} alt="A scholar sitting among bookshelves" className="relative aspect-[.82] w-full rounded-3xl object-cover shadow-[0_20px_50px_rgba(15,22,87,0.12)]" />
              <div className="absolute -right-4 top-8 rounded-2xl border border-ilm-navy/10 bg-white px-4 py-3 shadow-xl">
                <p className="font-display text-xl text-ilm-navy" dir="rtl">تعارفوا</p>
                <p className="mt-1 text-[9px] uppercase tracking-[.16em] text-ilm-gold">Know one another</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay="delay-1">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[.25em] text-ilm-gold">Meet the Murabbiyūn</p>
            <h2 className="max-w-lg font-display text-4xl leading-[1.08] text-ilm-navy md:text-5xl">
              Good questions need <em className="font-normal text-ilm-gold">good company.</em>
            </h2>
            <p className="mt-7 max-w-lg text-base leading-8 text-slate-600">
              Our contributors are teachers, researchers, and lifelong students. They write from within the tradition, with humility, clarity, and a generous sense of responsibility.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link href="/murabbiyun" className="inline-flex items-center gap-3 rounded-full bg-ilm-gold px-6 py-3.5 text-xs font-semibold uppercase tracking-[.13em] text-white transition hover:bg-ilm-gold-dark">
                Meet the contributors <ArrowRight size={16} />
              </Link>
              <div className="flex -space-x-2">
                {authors.slice(0, 4).map((a) => (
                  <img key={a.id} src={a.avatar} alt={a.name} className="h-9 w-9 rounded-full border-2 border-white object-cover ring-1 ring-slate-200" />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Newsletter — light */}
      <section id="newsletter" className="relative overflow-hidden border-y border-ilm-navy/[0.06] bg-ilm-cream/40 px-6 py-24 md:px-12 md:py-28">
        <div className="absolute -right-20 -top-32 h-96 w-96 rounded-full border border-ilm-gold/15" />
        <div className="relative mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-ilm-gold/40 bg-white text-ilm-gold shadow-sm">
              <Send size={18} />
            </span>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[.25em] text-ilm-gold">A thoughtful note, occasionally</p>
            <h2 className="font-display text-4xl text-ilm-navy md:text-5xl">Make some room for good things.</h2>
            <span className="gold-rule mx-auto mt-5 block w-16" />
            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-slate-600">
              A short letter from ILM with new essays, quiet provocations, and things worth carrying with you.
            </p>
            {subscribed ? (
              <div className="mx-auto mt-8 rounded-2xl border border-ilm-gold/30 bg-white p-5 text-ilm-navy shadow-sm">
                Thank you. Your first letter is on its way.
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (email.trim()) setSubscribed(true); }} className="mx-auto mt-8 flex max-w-md flex-col gap-2 sm:flex-row">
                <label className="sr-only" htmlFor="email">Your email address</label>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" className="h-12 flex-1 rounded-full border border-slate-200 bg-white px-5 text-sm text-ilm-ink shadow-sm outline-none placeholder:text-slate-400 focus:border-ilm-gold focus:ring-2 focus:ring-ilm-gold/20" />
                <button className="h-12 rounded-full bg-ilm-gold px-6 text-xs font-semibold uppercase tracking-[.13em] text-white transition hover:bg-ilm-gold-dark">
                  Subscribe
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      {/* Ask CTA */}
      <section id="ask" className="bg-white px-6 py-16 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-3xl border border-slate-200/70 bg-ilm-cream/30 p-8 md:flex-row md:items-center md:p-10">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ilm-gold shadow-sm">
              <CircleHelp size={21} />
            </div>
            <div>
              <p className="font-display text-2xl text-ilm-navy">Carrying a question?</p>
              <p className="mt-1 text-sm text-slate-500">Bring it to the conversation.</p>
            </div>
          </div>
          <Link href="/ask" className="flex items-center gap-3 rounded-full bg-ilm-gold px-5 py-3 text-xs font-semibold uppercase tracking-[.13em] text-white transition hover:bg-ilm-gold-dark">
            Ask a question <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
