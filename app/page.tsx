import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CircleHelp,
  Compass,
  Feather,
  Scale,
  Shield,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Reveal } from '@/components/Reveal';
import { HeroCollage } from '@/components/HeroCollage';
import { ArticleCard } from '@/components/ArticleCard';
import { NewsletterSubscribe } from '@/components/NewsletterSubscribe';
import { SectionLabel } from '@/components/PageHero';
import { fetchPublishedArticles, fetchPublicCategories } from '@/lib/public-content';
import { articles as demoArticles, authors, categories as demoCategories, images } from '@/lib/data';
import { buildPageMetadata } from '@/lib/seo';

export const revalidate = 60;

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: 'ILM — Islamic League of Murabbiyūn',
    description:
      'A considered space for the questions, practices, and ideas that help us live with more meaning. Explore the ILM library of thoughtful Islamic writing.',
    path: '/',
  }),
  title: { absolute: 'ILM — Islamic League of Murabbiyūn' },
};

const categoryIcons: Record<string, LucideIcon> = {
  "Qur'an & Tafsir": BookOpen,
  Spirituality: Sparkles,
  'Islamic History': Compass,
  'Character & Practice': Feather,
  'Law & Methodology': Scale,
  'Contemporary Issues': Shield,
};

export default async function Home() {
  const [dbArticles, dbCategories] = await Promise.all([
    fetchPublishedArticles(),
    fetchPublicCategories(),
  ]);

  const published =
    dbArticles.length > 0
      ? dbArticles
      : demoArticles.filter((a) => a.status === 'published');
  const categories = dbCategories.length > 0 ? dbCategories : demoCategories;

  return (
    <main className="overflow-x-hidden bg-white">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#FBFBFA] px-6 pb-14 pt-[calc(var(--site-header-offset)+var(--site-header-gap))] md:px-12 md:pb-20 md:pt-[calc(var(--site-header-offset)+var(--site-header-gap)+0.5rem)]">
        <div className="pattern-geo pointer-events-none absolute inset-0 opacity-55" aria-hidden />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 xl:gap-12">
          <div className="max-w-xl">
            <div className="hero-rise mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.28em] text-ilm-gold">
              <span className="h-px w-8 bg-ilm-gold" />
              Islamic League of Murabbiyūn
            </div>

            <h1 className="hero-rise delay-1 font-display text-[3rem] leading-[1.02] tracking-[-0.03em] text-ilm-navy sm:text-[3.5rem] md:text-[4.25rem] lg:text-[4.75rem]">
              The work of <em className="font-normal italic text-ilm-gold">becoming.</em>
            </h1>

            <p className="hero-rise delay-2 mt-6 max-w-md text-[15px] leading-[1.9] text-slate-500 md:text-base">
              A considered space for the questions, practices, and ideas that help us live with more meaning.
            </p>

            <div className="hero-rise delay-3 mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/articles"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-ilm-gold px-6 py-2.5 text-[10.5px] font-semibold uppercase tracking-[.14em] text-white transition hover:bg-ilm-gold-dark"
              >
                Explore the library
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/about"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-[10.5px] font-semibold uppercase tracking-[.14em] text-ilm-navy transition hover:border-ilm-gold hover:text-ilm-gold"
              >
                Why ILM
              </Link>
            </div>

            <p className="hero-rise delay-4 mt-12 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[.2em] text-slate-400">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400">
                <ArrowRight size={12} className="rotate-90" />
              </span>
              Scroll to explore
            </p>
          </div>

          <HeroCollage featuredArticles={published.slice(0, 3)} />
        </div>
      </section>

      {/* Mission */}
      <section className="relative overflow-hidden border-y border-ilm-navy/[0.06] bg-[#F9F8F5] px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20">
            <Reveal from="left">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[.25em] text-ilm-gold">
                A place to return to
              </p>
              <h2 className="font-display text-[2.5rem] leading-[1.08] tracking-[-0.02em] text-ilm-navy md:text-[3.25rem]">
                Learning is a form of <em className="font-normal italic text-ilm-gold">devotion.</em>
              </h2>
            </Reveal>
            <Reveal from="right" delay="delay-1">
              <p className="max-w-xl text-[15px] leading-[1.9] text-slate-600">
                ILM is a public library of thoughtful Islamic writing — made for the person who wants to go a
                little deeper. We bring together qualified voices, careful editorial work, and a belief that
                good knowledge should feel both rigorous and alive.
              </p>
              <Link
                href="/about"
                className="mt-7 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.16em] text-ilm-navy transition hover:gap-3 hover:text-ilm-gold"
              >
                Find your way in <ArrowRight size={14} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* From the library */}
      <section className="bg-white px-6 py-20 md:px-12 md:py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal from="left">
            <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <SectionLabel>From the library</SectionLabel>
                <h2 className="font-display text-[2.1rem] text-ilm-navy md:text-[2.6rem]">
                  Ideas for the road ahead
                </h2>
              </div>
              <Link
                href="/articles"
                className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[.14em] text-ilm-navy transition hover:text-ilm-gold"
              >
                View all articles <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {published.slice(0, 12).map((article, i) => (
              <Reveal
                key={article.id}
                from="scale"
                delay={`delay-${(i % 6) + 1}`}
                className="h-full"
              >
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-[#F9F8F5] px-6 py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-7xl">
          <Reveal from="left">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <SectionLabel>Browse by subject</SectionLabel>
                <h2 className="font-display text-[2rem] text-ilm-navy md:text-[2.4rem]">
                  Where would you like to begin?
                </h2>
              </div>
              <span className="hidden font-display text-5xl text-ilm-gold/25 md:block" dir="rtl">
                بسم الله
              </span>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.slice(0, 4).map(({ name, description, articleCount, slug }, i) => {
              const Icon = categoryIcons[name] || BookOpen;
              return (
                <Reveal key={slug} from="up" delay={`delay-${(i % 4) + 1}`}>
                  <Link
                    href={`/categories/${slug}`}
                    className="group flex h-full flex-col gap-4 rounded-2xl border border-slate-100/80 bg-white p-6 shadow-[0_1px_16px_rgba(15,22,87,0.04)] transition duration-300 hover:-translate-y-1 hover:border-ilm-gold/30 hover:shadow-[0_12px_32px_rgba(15,22,87,0.09)]"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F9F8F5] text-ilm-gold">
                      <Icon size={20} strokeWidth={1.5} />
                    </span>
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-[1.2rem] leading-snug text-ilm-navy">{name}</h3>
                        <ArrowUpRight
                          size={16}
                          className="mt-1 shrink-0 text-ilm-gold/30 transition-all group-hover:text-ilm-gold"
                        />
                      </div>
                      <p className="mt-2 text-[13px] leading-6 text-slate-500">{description}</p>
                      <p className="mt-4 text-[9px] font-semibold uppercase tracking-[.16em] text-ilm-gold/70">
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

      {/* Murabbiyūn */}
      <section className="bg-white px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid items-end gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <Reveal from="left">
              <div className="relative overflow-hidden rounded-2xl shadow-[0_16px_40px_rgba(15,22,87,0.12)]">
                <img
                  src={images.scholar2}
                  alt="A scholar sitting among bookshelves"
                  className="aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ilm-navy/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="font-display text-3xl" dir="rtl">
                    تعارفوا
                  </p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[.2em] text-white/80">
                    Know one another
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal from="right" delay="delay-1">
              <SectionLabel>Meet the Murabbiyūn</SectionLabel>
              <h2 className="font-display text-[2.1rem] leading-[1.15] text-ilm-navy md:text-[2.75rem]">
                Good questions need <em className="font-normal italic text-ilm-gold">good company.</em>
              </h2>
              <p className="mt-5 max-w-lg text-[15px] leading-[1.85] text-slate-600">
                Our contributors are teachers, researchers, and lifelong students. They write from within the
                tradition, with humility, clarity, and a generous sense of responsibility.
              </p>
              <Link
                href="/murabbiyun"
                className="mt-7 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.16em] text-ilm-navy transition hover:gap-3 hover:text-ilm-gold"
              >
                Meet the contributors <ArrowRight size={14} />
              </Link>

              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {authors
                  .filter((a) => a.active)
                  .slice(0, 4)
                  .map((a, i) => (
                    <Reveal key={a.id} from="up" delay={`delay-${(i % 4) + 1}`}>
                      <Link
                        href={`/murabbiyun/${a.slug}`}
                        className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-[#F9F8F5] p-3 transition hover:border-ilm-gold/30 hover:bg-white"
                      >
                        <img
                          src={a.avatar}
                          alt={a.name}
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-white"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-display text-[15px] text-ilm-navy group-hover:text-ilm-gold">
                            {a.name}
                          </p>
                          <p className="truncate text-[11px] text-slate-500">{a.credentials}</p>
                        </div>
                      </Link>
                    </Reveal>
                  ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative overflow-hidden border-y border-ilm-navy/[0.06] bg-[#F9F8F5] px-6 py-16 md:px-12 md:py-20">
        <div className="pattern-geo pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-xl text-center">
          <Reveal from="up">
            <SectionLabel className="justify-center">A thoughtful note, occasionally</SectionLabel>
            <h2 className="font-display text-[2rem] text-ilm-navy md:text-[2.4rem]">
              Make some room for <em className="font-normal italic text-ilm-gold">good things.</em>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[14px] leading-7 text-slate-500">
              A short letter from ILM with new essays, quiet provocations, and things worth carrying with you.
            </p>
            <NewsletterSubscribe />
          </Reveal>
        </div>
      </section>

      {/* Ask CTA */}
      <section className="bg-white px-6 py-12 md:px-12 md:py-14">
        <div className="mx-auto max-w-7xl">
          <Reveal from="scale">
            <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-ilm-navy px-7 py-8 md:flex-row md:items-center md:px-10 md:py-10">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-ilm-gold">
                  <CircleHelp size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-display text-2xl text-white">Carrying a question?</p>
                  <p className="mt-1 text-[14px] text-white/65">Bring it to the conversation.</p>
                </div>
              </div>
              <Link href="/ask" className="ilm-btn-primary group shrink-0 rounded-full">
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
