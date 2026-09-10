'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, MoveUpRight } from 'lucide-react';
import { categories } from '@/lib/admin-data';
import { pillars, steps } from '@/lib/public-data';
import { useIlm } from '@/lib/ilm-store';
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

function OurWhy() {
  return (
    <section id="about-us" className="mx-auto grid max-w-[1280px] gap-12 px-6 py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:px-8 lg:py-32">
      <ScrollReveal from="left">
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ilm-gold-deep">
          <span className="h-px w-8 bg-ilm-gold" /> About Us
        </p>
        <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.04em] text-ilm-navy sm:text-[40px] sm:leading-[1.08] md:text-[52px]">
          Knowledge is not just what we <em className="font-serif italic font-normal text-ilm-gold">know.</em>
          <br />
          It is who we <em className="font-serif italic font-normal text-ilm-gold">become.</em>
        </h2>
      </ScrollReveal>
      <ScrollReveal from="right" delay={0.12}>
        <p className="max-w-sm text-[16px] leading-[1.8] text-ilm-navy/55">
          In a world full of noise, we create room for the questions that matter. ILM brings together mentors, educators, and cultivators to nurture a more intentional way of living.
        </p>
        <Link href="/about" className="mt-7 inline-flex items-center gap-1.5 border-b border-ilm-gold pb-1 text-[13px] font-semibold text-ilm-navy">
          Learn more about ILM <MoveUpRight size={14} />
        </Link>
      </ScrollReveal>
    </section>
  );
}

function Pillars() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 pb-8 lg:px-8">
      <StaggerIn className="grid gap-5 md:grid-cols-3">
        {pillars.map((pillar, i) => (
          <StaggerChild key={pillar.title} from={i % 2 === 0 ? 'left' : 'right'}>
            <article className="rounded-[24px] border border-ilm-navy/[0.06] bg-white p-8 shadow-[0_8px_30px_rgba(11,17,82,0.04)]">
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

function FeaturedAndSubjects() {
  const { publishedArticles } = useIlm();
  const featured = publishedArticles.find((a) => a.featured) || publishedArticles[0];
  if (!featured) return null;
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-12 lg:px-8">
      <ScrollReveal from="left">
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ilm-gold-deep">
          <span className="h-px w-8 bg-ilm-gold" /> Featured
        </p>
        <Link href={`/articles/${featured.slug}`} className="mt-5 grid overflow-hidden rounded-[22px] border border-ilm-navy/10 bg-white sm:rounded-[28px] md:grid-cols-2">
          <img src={featured.image} alt="" className="h-56 w-full object-cover sm:h-72 md:h-full" />
          <div className="p-6 sm:p-8 md:p-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ilm-gold-deep">{featured.category}</span>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-ilm-navy sm:text-3xl">{featured.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ilm-navy/55">{featured.excerpt}</p>
            <p className="mt-6 text-sm font-semibold text-ilm-navy">
              {featured.author} · {featured.readTime}
            </p>
          </div>
        </Link>
      </ScrollReveal>
      <StaggerIn className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {categories.map((cat, i) => (
          <StaggerChild key={cat.id} from={i % 2 === 0 ? 'up' : 'down'}>
            <Link href={`/articles?category=${cat.slug}`} className="block rounded-2xl border border-ilm-navy/8 bg-white p-5 transition hover:-translate-y-1 hover:border-ilm-gold">
              <p className="text-sm font-semibold text-ilm-navy">{cat.name}</p>
              <p className="mt-1 text-xs text-ilm-navy/40">{publishedArticles.filter((a) => a.category === cat.name).length} published</p>
            </Link>
          </StaggerChild>
        ))}
      </StaggerIn>
    </section>
  );
}

function LibraryPreview() {
  return (
    <section className="py-16">
      <LibraryExplorer heading limit={3} />
      <div className="mx-auto mt-10 max-w-[1280px] px-6 lg:px-8">
        <Link href="/articles" className="inline-flex items-center gap-1.5 border-b border-ilm-gold pb-1 text-[13px] font-semibold text-ilm-navy">
          View all writings <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

function QuoteBand() {
  return (
    <section className="relative overflow-hidden bg-[#E8DFD1] px-4 py-16 text-center sm:px-6 sm:py-24">
      <span className="absolute left-[8%] top-6 font-serif text-[90px] leading-none text-ilm-gold/50 sm:left-[12%] sm:top-10 sm:text-[140px]">“</span>
      <ScrollReveal>
        <blockquote className="relative mx-auto max-w-3xl font-serif text-[22px] italic leading-snug tracking-tight text-ilm-navy sm:text-[28px] md:text-[38px]">
          We are not here simply to gather knowledge. We are here to let it change the way we see, serve, and show up in the world.
        </blockquote>
        <span className="mx-auto mt-8 block h-px w-10 bg-ilm-gold" />
        <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-ilm-navy/45">The ILM spirit</p>
      </ScrollReveal>
    </section>
  );
}

function MurabbiPreview() {
  return (
    <section id="murabbiyun" className="py-12">
      <MurabbiyunDirectory />
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-24 lg:px-8">
      <ScrollReveal from="left">
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ilm-gold-deep">
          <span className="h-px w-8 bg-ilm-gold" /> A way of learning
        </p>
        <h2 className="mt-4 max-w-xl text-[32px] font-semibold tracking-[-0.04em] text-ilm-navy sm:text-[40px]">
          How seekers walk with ILM.
        </h2>
      </ScrollReveal>
      <StaggerIn className="mt-12 grid gap-8 md:grid-cols-3">
        {steps.map((step, i) => (
          <StaggerChild key={step.n} from={i % 2 === 0 ? 'left' : 'right'}>
            <p className="font-serif text-4xl text-ilm-gold">{step.n}</p>
            <h3 className="mt-4 text-xl font-semibold text-ilm-navy">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ilm-navy/55">{step.body}</p>
          </StaggerChild>
        ))}
      </StaggerIn>
    </section>
  );
}

function ConnectSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <section id="connect" className="relative overflow-hidden bg-ilm-navy text-white">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[670px] w-[670px] rounded-full border border-ilm-gold/20 shadow-[0_0_0_80px_rgba(199,154,61,0.04)]" />
      <div className="relative mx-auto grid max-w-[1280px] items-center gap-12 px-6 py-24 lg:grid-cols-[1fr_0.8fr] lg:px-8">
        <ScrollReveal from="left">
          <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ilm-gold-light">
            <span className="h-px w-8 bg-ilm-gold" /> Stay in the circle
          </p>
          <h2 className="mt-5 text-[34px] font-semibold leading-[1.08] tracking-[-0.04em] sm:text-[44px] md:text-[58px]">
            A little more
            <br />
            <em className="font-serif italic font-normal text-ilm-gold-light">meaning</em> in your inbox.
          </h2>
          <p className="mt-5 max-w-sm text-white/60">
            Monthly reflections, new conversations, and gentle reminders for the road ahead.
          </p>
        </ScrollReveal>
        <ScrollReveal from="right" delay={0.1} className="rounded-3xl border border-white/15 bg-white/8 p-8">
          {subscribed ? (
            <div className="flex flex-col gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-ilm-gold-light text-ilm-navy">
                <Check size={18} />
              </span>
              <strong className="font-serif text-2xl">You&apos;re on the list.</strong>
              <span className="text-sm text-white/60">We&apos;ll bring something thoughtful your way.</span>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setSubscribed(true);
              }}
            >
              <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/70">
                Your email address
              </label>
              <div className="mt-3 flex border-b border-ilm-gold">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent py-3 text-white outline-none placeholder:text-white/30"
                />
                <button aria-label="Subscribe" className="px-2 text-ilm-gold-light">
                  <ArrowRight size={18} />
                </button>
              </div>
              <small className="mt-4 block text-[11px] text-white/40">No noise. Just a note worth opening.</small>
            </form>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
