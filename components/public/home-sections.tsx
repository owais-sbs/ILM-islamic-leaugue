'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, MoveUpRight } from 'lucide-react';
import { useIlm } from '@/lib/ilm-store';
import { useContentManager } from '@/lib/content-manager/useContentManager';
import { murabbiyūn } from '@/lib/public-data';
import { LibraryExplorer } from './library-explorer';
import { MurabbiyunDirectory } from './murabbiyun-directory';
import { ScrollReveal, StaggerChild, StaggerIn } from './scroll-reveal';

export function HomeSections() {
  return (
    <>
      <OurWhy />
      <Pillars />
      <FeaturedAndSubjects />
      <LibraryPreview />
      <QuoteBand />
      <MurabbiPreview />
      <HowItWorks />
      <ConnectSection />
    </>
  );
}

/* ─────────────────────────────────────────────────────────── About Us */
function OurWhy() {
  const cm    = useContentManager();
  const about = cm.about;
  if (!about.visible) return null;
  return (
    <section id="our-why" className="mx-auto grid max-w-[1280px] gap-8 px-4 py-12 sm:gap-10 sm:px-6 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:px-8 lg:py-20">
      <ScrollReveal from="left">
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ilm-gold-deep">
          <span className="h-px w-8 bg-ilm-gold" /> {about.sectionLabel}
        </p>
        <h2 className="mt-5 text-[28px] font-semibold leading-[1.15] tracking-[-0.04em] text-ilm-navy sm:text-[36px] sm:leading-[1.1] md:text-[44px]">
          {about.heading}
        </h2>
        <p className="mt-4 max-w-xl text-[16px] leading-[1.8] text-ilm-navy/55 sm:text-[17px]">
          {about.body1}
        </p>
      </ScrollReveal>
      <ScrollReveal from="right" delay={0.12}>
        <p className="max-w-sm text-[16px] leading-[1.8] text-ilm-navy/55">
          {about.body2}
        </p>
        <Link href={about.btnUrl} className="mt-7 inline-flex items-center gap-1.5 border-b border-ilm-gold pb-1 text-[13px] font-semibold text-ilm-navy">
          {about.btnText} <MoveUpRight size={14} />
        </Link>
      </ScrollReveal>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── Pillars */
function Pillars() {
  const cm     = useContentManager();
  const about  = cm.about;
  const visible = about.pillars.filter((p) => p.visible).sort((a, b) => a.order - b.order);
  if (!about.visible || visible.length === 0) return null;
  return (
    <section className="mx-auto max-w-[1280px] px-4 pb-4 sm:px-6 lg:px-8">
      <StaggerIn className="grid gap-5 md:grid-cols-3">
        {visible.map((pillar, i) => (
          <StaggerChild key={pillar.id} from={i % 2 === 0 ? 'left' : 'right'}>
            <article className="rounded-[24px] border border-ilm-navy/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,17,82,0.04)] sm:p-8">
              <span className="font-serif text-3xl text-ilm-gold/70">0{i + 1}</span>
              <h3 className="mt-4 text-xl font-semibold text-ilm-navy">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ilm-navy/55">{pillar.body}</p>
            </article>
          </StaggerChild>
        ))}
      </StaggerIn>
    </section>
  );
}

/* ─────────────────────────────────────────── Featured Articles + Categories */
function FeaturedAndSubjects() {
  const cm                = useContentManager();
  const fa                = cm.featuredArticles;
  const catConfig         = cm.directory.categories;
  const { publishedArticles, newlyPublishedSlugs, categories: storeCategories } = useIlm();

  // Compute featured article based on mode
  let featured = undefined as typeof publishedArticles[0] | undefined;
  if (fa.mode === 'selected' && fa.selectedIds.length > 0) {
    featured = publishedArticles.find((a) => fa.selectedIds.includes(a.id));
  }
  if (!featured) {
    featured = publishedArticles.find((a) => a.featured) || publishedArticles[0];
  }

  // Compute visible categories in CM order
  const visibleCats = catConfig.items
    .filter((ci) => ci.visible)
    .sort((a, b) => a.order - b.order)
    .map((ci) => storeCategories.find((c) => c.id === ci.id))
    .filter(Boolean) as typeof storeCategories;

  if (!fa.visible && !catConfig.visible) return null;

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      {fa.visible && (
        <ScrollReveal from="left">
          <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ilm-gold-deep">
            <span className="h-px w-8 bg-ilm-gold" /> Featured
          </p>
          {featured ? (
            <Link
              href={`/articles/${featured.slug}`}
              className="relative mt-5 grid overflow-hidden rounded-[22px] border border-ilm-navy/10 bg-white sm:rounded-[24px] md:grid-cols-2 md:items-center"
            >
              {newlyPublishedSlugs.includes(featured.slug) && (
                <span className="absolute right-4 top-4 z-10 rounded-full bg-ilm-gold px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-ilm-navy-deep">
                  New
                </span>
              )}
              <img src={featured.image} alt="" className="h-44 w-full object-cover sm:h-52 md:h-[240px]" />
              <div className="flex flex-col justify-center p-5 sm:p-6 md:px-8 md:py-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ilm-gold-deep">{featured.category}</span>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-ilm-navy sm:text-2xl" suppressHydrationWarning>{featured.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ilm-navy/55" suppressHydrationWarning>{featured.excerpt}</p>
                <p className="mt-4 text-sm font-semibold text-ilm-navy" suppressHydrationWarning>{featured.author} · {featured.readTime}</p>
              </div>
            </Link>
          ) : (
            <div className="mt-5 rounded-[22px] border border-ilm-navy/10 bg-white p-8 text-sm text-ilm-navy/50">
              New writing will appear here once it is published.
            </div>
          )}
        </ScrollReveal>
      )}
      {catConfig.visible && visibleCats.length > 0 && (
        <StaggerIn className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {visibleCats.map((cat, i) => (
            <StaggerChild key={cat.id} from={i % 2 === 0 ? 'up' : 'down'}>
              <Link href={`/articles?category=${cat.slug}`} className="block rounded-2xl border border-ilm-navy/8 bg-white p-5 transition hover:-translate-y-1 hover:border-ilm-gold">
                <p className="text-sm font-semibold text-ilm-navy">{cat.name}</p>
                <p className="mt-1 text-xs text-ilm-navy/40">{publishedArticles.filter((a) => a.category === cat.name).length} published</p>
              </Link>
            </StaggerChild>
          ))}
        </StaggerIn>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────────────── Library preview */
function LibraryPreview() {
  return (
    <section className="py-10 sm:py-12">
      <Suspense fallback={<div className="px-4 py-10 text-ilm-navy/40 sm:px-6">Loading library…</div>}>
        <LibraryExplorer heading limit={3} />
      </Suspense>
      <div className="mx-auto mt-8 max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <Link href="/articles" className="inline-flex items-center gap-1.5 border-b border-ilm-gold pb-1 text-[13px] font-semibold text-ilm-navy">
          View all writings <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── Quote band */
function QuoteBand() {
  const cm    = useContentManager();
  const quote = cm.quote;
  if (!quote.visible) return null;
  return (
    <section className="relative overflow-hidden bg-[#E8DFD1] px-4 py-12 text-center sm:px-6 sm:py-16">
      <span className="absolute left-[8%] top-6 font-serif text-[90px] leading-none text-ilm-gold/50 sm:left-[12%] sm:top-10 sm:text-[140px]">"</span>
      <ScrollReveal>
        <blockquote className="relative mx-auto max-w-3xl font-serif text-[22px] italic leading-snug tracking-tight text-ilm-navy sm:text-[28px] md:text-[34px]">
          {quote.text}
        </blockquote>
        <span className="mx-auto mt-8 block h-px w-10 bg-ilm-gold" />
        <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-ilm-navy/45">{quote.attribution}</p>
      </ScrollReveal>
    </section>
  );
}

/* ─────────────────────────────────────────────────────── Murabbiyūn */
function MurabbiPreview() {
  const cm  = useContentManager();
  const dir = cm.directory;
  if (!dir.visible) return null;
  return (
    <section id="murabbiyun" className="py-8 sm:py-10">
      <MurabbiyunDirectory />
    </section>
  );
}

/* ─────────────────────────────────────────────────── Learning Journey */
function HowItWorks() {
  const cm  = useContentManager();
  const lj  = cm.learningJourney;
  if (!lj.visible) return null;
  const visibleSteps = lj.steps.filter((s) => s.visible).sort((a, b) => a.order - b.order);
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <ScrollReveal from="left">
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ilm-gold-deep">
          <span className="h-px w-8 bg-ilm-gold" /> {lj.sectionLabel}
        </p>
        <h2 className="mt-4 max-w-xl text-[32px] font-semibold tracking-[-0.04em] text-ilm-navy sm:text-[40px]">
          {lj.heading}
        </h2>
      </ScrollReveal>
      <StaggerIn className="mt-10 grid gap-8 sm:mt-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {visibleSteps.map((step, i) => (
          <StaggerChild key={step.id} from={i % 2 === 0 ? 'left' : 'right'}>
            <p className="font-serif text-4xl text-ilm-gold">{step.n}</p>
            <h3 className="mt-4 text-xl font-semibold text-ilm-navy">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ilm-navy/55">{step.body}</p>
          </StaggerChild>
        ))}
      </StaggerIn>
    </section>
  );
}

/* ─────────────────────────────────────────────────────── Newsletter */
function ConnectSection() {
  const cm = useContentManager();
  const nl = cm.newsletter;
  const { addSubscriber } = useIlm();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!nl.visible) return null;

  return (
    <section id="connect" className="relative overflow-hidden bg-ilm-navy text-white">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[670px] w-[670px] rounded-full border border-ilm-gold/20 shadow-[0_0_0_80px_rgba(199,154,61,0.04)]" />
      <div className="relative mx-auto grid max-w-[1280px] items-center gap-8 px-4 py-12 sm:gap-10 sm:px-6 sm:py-16 lg:grid-cols-[1fr_0.8fr] lg:px-8">
        <ScrollReveal from="left">
          <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ilm-gold-light">
            <span className="h-px w-8 bg-ilm-gold" /> {nl.subheading}
          </p>
          <h2 className="mt-5 text-[34px] font-semibold leading-[1.08] tracking-[-0.04em] sm:text-[44px] md:text-[58px]">
            {nl.heading}
          </h2>
          <p className="mt-5 max-w-sm text-white/60">{nl.description}</p>
        </ScrollReveal>
        <ScrollReveal from="right" delay={0.1} className="rounded-3xl border border-white/15 bg-white/8 p-6 sm:p-8">
          {subscribed ? (
            <div className="flex flex-col gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-ilm-gold-light text-ilm-navy">
                <Check size={18} />
              </span>
              <strong className="font-serif text-2xl">{nl.successMessage}</strong>
              <span className="text-sm text-white/60">We&apos;ll bring something thoughtful your way.</span>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!email.trim() || busy) return;
                setBusy(true);
                setError('');
                void addSubscriber(email).then((result) => {
                  setBusy(false);
                  if (!result.ok) {
                    setError(result.error || 'Could not subscribe. Please try again.');
                    return;
                  }
                  setSubscribed(true);
                  setEmail('');
                });
              }}
            >
              <label htmlFor="nl-email" className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/70">
                Your email address
              </label>
              <div className="mt-3 flex border-b border-ilm-gold">
                <input
                  id="nl-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={nl.inputPlaceholder}
                  disabled={busy}
                  className="flex-1 bg-transparent py-3 text-white outline-none placeholder:text-white/30 disabled:opacity-60"
                />
                <button type="submit" aria-label={nl.btnText} disabled={busy} className="px-2 text-ilm-gold-light disabled:opacity-60">
                  <ArrowRight size={18} />
                </button>
              </div>
              {error ? <p className="mt-3 text-[12px] text-red-300">{error}</p> : null}
              <small className="mt-4 block text-[11px] text-white/40">No noise. Just a note worth opening.</small>
            </form>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
