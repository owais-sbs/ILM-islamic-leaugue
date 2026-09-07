'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CircleHelp,
  Compass,
  Feather,
  Scale,
  Send,
  Sparkles,
  Shield,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Reveal } from '@/components/Reveal';
import { HeroCollage } from '@/components/HeroCollage';
import { ArticleCard } from '@/components/ArticleCard';
<<<<<<< HEAD
import { articles, categories, authors, images } from '@/lib/data';
import { createClient } from '@/lib/supabase/client';
=======
import { SectionLabel, GoldDivider } from '@/components/PageHero';
import { articles, categories, authors } from '@/lib/data';
>>>>>>> 03a3145bf8aa2b0217bde3a2111ce6e5470555b0

const categoryIcons: Record<string, LucideIcon> = {
  "Qur'an & Tafsir":    BookOpen,
  'Spirituality':        Sparkles,
  'Islamic History':     Compass,
  'Character & Practice':Feather,
  'Law & Methodology':   Scale,
  'Contemporary Issues': Shield,
};

export default function Home() {
  const [subscribed, setSubscribed] = useState(false);
<<<<<<< HEAD
  const [email, setEmail] = useState('');
  const [subError, setSubError] = useState('');
  const [subLoading, setSubLoading] = useState(false);
=======
  const [email,      setEmail]      = useState('');
>>>>>>> 03a3145bf8aa2b0217bde3a2111ce6e5470555b0
  const published = articles.filter((a) => a.status === 'published');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubError('');
    setSubLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from('subscribers').insert({
      email: email.trim().toLowerCase(),
      confirmed_at: new Date().toISOString(),
      source: 'website',
    });
    setSubLoading(false);
    if (error) {
      // Duplicate email still counts as success for the visitor
      if (error.code === '23505' || error.message.toLowerCase().includes('duplicate')) {
        setSubscribed(true);
        return;
      }
      setSubError(error.message);
      return;
    }
    setSubscribed(true);
  };

  return (
    <main className="overflow-hidden bg-white">
      <SiteHeader />

      {/* ═══════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#F9F8F5] px-6 pb-12 pt-28 md:px-12 md:pb-16 md:pt-32">
        {/* Geometric bg */}
        <div className="pattern-geo pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        {/* Gold gradient bottom edge */}
        <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-ilm-gold/40 via-ilm-gold/15 to-transparent" aria-hidden />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left: copy */}
          <div>
            {/* Eyebrow */}
            <div className="hero-rise mb-5 flex items-center gap-2.5 text-[9px] font-semibold uppercase tracking-[.28em] text-ilm-gold">
              <span className="h-px w-7 bg-ilm-gold" />
              Knowledge · Understanding · Application
            </div>

            {/* Headline */}
            <h1 className="hero-rise delay-1 font-display text-[2.6rem] leading-[1.06] tracking-[-0.025em] text-ilm-navy md:text-[3.1rem] lg:text-[3.4rem]">
              The work of{' '}
              <em className="not-italic text-ilm-gold">becoming.</em>
            </h1>

            {/* Sub */}
            <p className="hero-rise delay-2 mt-4 max-w-[380px] text-[14.5px] leading-[1.8] text-slate-500">
              A considered space for the questions, practices, and ideas that help us live with more meaning.
            </p>

            {/* CTAs */}
            <div className="hero-rise delay-3 mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/articles"
                className="group flex items-center gap-2 rounded-lg bg-ilm-gold px-5 py-2.5 text-[10.5px] font-semibold uppercase tracking-[.14em] text-white transition duration-200 hover:bg-ilm-gold-dark"
              >
                Explore the Library
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/about"
                className="rounded-lg border border-ilm-navy/20 bg-white px-5 py-2.5 text-[10.5px] font-semibold uppercase tracking-[.14em] text-ilm-navy transition duration-200 hover:border-ilm-gold hover:text-ilm-gold"
              >
                Why ILM
              </Link>
            </div>

            {/* Feature strip */}
            <div className="hero-rise delay-4 mt-9 grid grid-cols-3 gap-4 border-t border-ilm-navy/[0.07] pt-6">
              {[
                { icon: BookOpen, label: 'Authentic Sources', sub: "Rooted in Qur'ān & Sunnah" },
                { icon: Users,    label: 'Qualified Voices',   sub: 'Scholars and teachers' },
                { icon: Shield,   label: 'Beneficial Impact',  sub: 'Knowledge that transforms' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-start gap-2">
                  <Icon size={15} strokeWidth={1.5} className="mt-0.5 shrink-0 text-ilm-gold" />
                  <div>
                    <p className="text-[10px] font-semibold leading-tight text-ilm-navy">{label}</p>
                    <p className="mt-0.5 text-[9px] leading-snug text-slate-400">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: collage */}
          <HeroCollage featuredArticles={published.slice(0, 3)} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FEATURED ARTICLE
      ═══════════════════════════════════════════════ */}
      <section className="bg-white px-6 py-14 md:px-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionLabel>From the library</SectionLabel>
            <h2 className="font-display text-[1.85rem] text-ilm-navy md:text-[2.25rem]">
              Ideas for the road ahead
            </h2>
          </Reveal>
          <div className="mt-8">
            <Reveal delay="delay-1">
              {published[0] && <ArticleCard article={published[0]} featured />}
            </Reveal>
          </div>
        </div>
      </section>

      <GoldDivider className="mx-auto max-w-7xl px-6 md:px-12" />

      {/* ═══════════════════════════════════════════════
          LATEST ARTICLES GRID
      ═══════════════════════════════════════════════ */}
      <section className="bg-white px-6 pb-14 pt-12 md:px-12 md:pb-16 md:pt-14">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="mb-7 flex items-end justify-between">
              <SectionLabel>Latest essays</SectionLabel>
              <Link
                href="/articles"
                className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[.14em] text-ilm-navy transition hover:text-ilm-gold"
              >
                View all <ArrowRight size={13} />
              </Link>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {published.slice(1, 9).map((article, i) => (
              <Reveal key={article.id} delay={`delay-${(i % 4) + 1}`}>
                <ArticleCard article={article} compact />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SUBJECTS / CATEGORIES
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#F9F8F5] px-6 py-14 md:px-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="mb-8 flex items-end justify-between">
              <div>
                <SectionLabel>Browse by subject</SectionLabel>
                <h2 className="font-display text-[1.85rem] text-ilm-navy md:text-[2.25rem]">
                  Where would you like to begin?
                </h2>
              </div>
              <span className="hidden font-display text-4xl text-ilm-gold/20 md:block" dir="rtl">
                بسم الله
              </span>
            </div>
          </Reveal>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(({ name, description, articleCount, slug }, i) => {
              const Icon = categoryIcons[name] || BookOpen;
              return (
                <Reveal key={slug} delay={`delay-${(i % 3) + 1}`}>
                  <Link
                    href={`/categories/${slug}`}
                    className="group flex items-start gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-[0_1px_12px_rgba(15,22,87,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-ilm-gold/30 hover:shadow-[0_8px_28px_rgba(15,22,87,0.08)]"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F9F8F5] text-ilm-gold">
                      <Icon size={19} strokeWidth={1.5} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-[1.05rem] leading-snug text-ilm-navy">{name}</h3>
                        <ArrowUpRight
                          size={15}
                          className="mt-0.5 shrink-0 text-ilm-gold/30 transition-all group-hover:text-ilm-gold"
                        />
                      </div>
                      <p className="mt-1 text-[11.5px] leading-5 text-slate-500">{description}</p>
                      <p className="mt-2.5 text-[9px] font-semibold uppercase tracking-[.16em] text-ilm-gold/70">
                        {articleCount} articles
                      </p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          MURABBIYŪN TEASER
      ═══════════════════════════════════════════════ */}
      <section className="bg-white px-6 py-14 md:px-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <SectionLabel>Meet the Murabbiyūn</SectionLabel>
                <h2 className="font-display text-[1.85rem] leading-tight text-ilm-navy md:text-[2.25rem]">
                  Good questions need{' '}
                  <em className="not-italic text-ilm-gold">good company.</em>
                </h2>
              </div>
              <Link
                href="/murabbiyun"
                className="flex shrink-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[.14em] text-ilm-navy transition hover:gap-2.5 hover:text-ilm-gold"
              >
                All contributors <ArrowRight size={13} />
              </Link>
            </div>
          </Reveal>

          {/* Scholar portrait cards — landscape format */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {authors.filter((a) => a.active).slice(0, 4).map((a, i) => (
              <Reveal key={a.id} delay={`delay-${i + 1}`}>
                <Link
                  href={`/murabbiyun/${a.slug}`}
                  className="group relative overflow-hidden rounded-xl bg-ilm-navy shadow-[0_4px_20px_rgba(15,22,87,0.15)] transition duration-300 hover:shadow-[0_12px_36px_rgba(15,22,87,0.22)]"
                >
                  {/* Portrait image — tall format */}
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={a.avatar}
                      alt={a.name}
                      className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-[1.04] group-hover:opacity-90"
                    />
                  </div>
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ilm-navy via-ilm-navy/60 to-transparent" />
                  {/* Content over image */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-[8px] font-semibold uppercase tracking-[.18em] text-ilm-gold/80">
                      {a.madhhab}
                    </p>
                    <h3 className="mt-1 font-display text-[15px] leading-snug text-white">
                      {a.name}
                    </h3>
                    <p className="mt-0.5 text-[11px] leading-tight text-white/60">
                      {a.credentials}
                    </p>
                    <p className="mt-2.5 text-[9px] font-semibold uppercase tracking-[.14em] text-ilm-gold/70">
                      {a.articleCount} articles
                    </p>
                  </div>
                  {/* Hover arrow */}
                  <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:opacity-100">
                    <ArrowRight size={12} className="text-white" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Short description below */}
          <Reveal>
            <p className="mt-6 max-w-xl text-[13.5px] leading-7 text-slate-500">
              Our contributors are teachers, researchers, and lifelong students — writing from within
              the tradition with humility, clarity, and responsibility.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          QURANIC QUOTE — editorial break
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-y border-ilm-navy/[0.06] bg-ilm-navy px-6 py-14 md:px-12 md:py-16">
        <div className="pattern-geo-gold pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="mb-3 block font-display text-5xl leading-none text-ilm-gold/30">&ldquo;</span>
            <p className="font-display text-2xl leading-relaxed text-white/90 md:text-3xl">
              And say, &lsquo;My Lord, increase me in knowledge.&rsquo;
            </p>
            <p className="mt-4 text-[11px] font-medium uppercase tracking-[.2em] text-ilm-gold/70">
              Qur&rsquo;ān 20:114
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          NEWSLETTER
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#F9F8F5] px-6 py-14 md:px-12 md:py-16">
        <div className="pattern-geo pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-xl text-center">
          <Reveal>
            <span className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-ilm-gold/30 bg-white text-ilm-gold shadow-sm">
              <Send size={17} />
            </span>
            <SectionLabel className="justify-center">Stay connected</SectionLabel>
            <h2 className="font-display text-[1.85rem] text-ilm-navy md:text-[2.1rem]">
              A thoughtful note, occasionally.
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-[13.5px] leading-7 text-slate-500">
              New essays, quiet provocations, and things worth carrying with you.
            </p>
            {subscribed ? (
              <div className="mx-auto mt-7 rounded-xl border border-ilm-gold/25 bg-white p-4 text-sm text-ilm-navy shadow-sm">
                Thank you — your first letter is on its way.
              </div>
            ) : (
<<<<<<< HEAD
              <form onSubmit={handleSubscribe} className="mx-auto mt-8 flex max-w-md flex-col gap-2 sm:flex-row">
                <label className="sr-only" htmlFor="email">Your email address</label>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" className="h-12 flex-1 rounded-full border border-slate-200 bg-white px-5 text-sm text-ilm-ink shadow-sm outline-none placeholder:text-slate-400 focus:border-ilm-gold focus:ring-2 focus:ring-ilm-gold/20" />
                <button disabled={subLoading} className="h-12 rounded-full bg-ilm-gold px-6 text-xs font-semibold uppercase tracking-[.13em] text-white transition hover:bg-ilm-gold-dark disabled:opacity-60">
                  {subLoading ? '…' : 'Subscribe'}
=======
              <form
                onSubmit={(e) => { e.preventDefault(); if (email.trim()) setSubscribed(true); }}
                className="mx-auto mt-7 flex max-w-sm flex-col gap-2 sm:flex-row"
              >
                <label className="sr-only" htmlFor="hero-email">Your email address</label>
                <input
                  id="hero-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="ilm-input flex-1 rounded-lg"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-ilm-gold px-5 py-2.5 text-[10.5px] font-semibold uppercase tracking-[.13em] text-white transition hover:bg-ilm-gold-dark"
                >
                  Subscribe
>>>>>>> 03a3145bf8aa2b0217bde3a2111ce6e5470555b0
                </button>
              </form>
            )}
            {subError && <p className="mt-3 text-sm text-rose-600">{subError}</p>}
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          ASK CTA
      ═══════════════════════════════════════════════ */}
      <section className="bg-white px-6 py-10 md:px-12 md:py-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-5 rounded-xl border border-slate-100 bg-[#F9F8F5] p-6 md:flex-row md:items-center md:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-ilm-gold shadow-sm">
                  <CircleHelp size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-display text-xl text-ilm-navy">Carrying a question?</p>
                  <p className="mt-0.5 text-[13px] text-slate-500">Bring it to the conversation.</p>
                </div>
              </div>
              <Link
                href="/ask"
                className="group flex items-center gap-2 rounded-lg bg-ilm-navy px-5 py-2.5 text-[10.5px] font-semibold uppercase tracking-[.13em] text-white transition hover:bg-ilm-navy-light"
              >
                Ask a question <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
