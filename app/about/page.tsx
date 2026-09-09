import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, BookOpen, Heart, Users, Scale, Globe, GraduationCap } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { PageHero, ModernCard, SectionLabel } from '@/components/PageHero';
import { Reveal } from '@/components/Reveal';
import { images } from '@/lib/data';

import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'About ILM',
  description:
    'About the Islamic League of Murabbiyūn — a public library of thoughtful Islamic writing. Our mission, methodology, and governance.',
  path: '/about',
});

const values = [
  { icon: BookOpen, title: 'Rigorous & alive', text: 'Knowledge that is faithful to tradition and written for real life — never dry, never careless.' },
  { icon: Heart, title: 'Formation first', text: 'We care less about performance and more about the slow work of becoming.' },
  { icon: Users, title: 'Qualified voices', text: 'Every contributor is a teacher, researcher, or serious student vetted by our editorial team.' },
];

const methodology = [
  { icon: Scale, title: 'Editorial review', text: 'Every essay is reviewed by a senior editor for accuracy, clarity, and adab before publication. We do not publish without attribution.' },
  { icon: BookOpen, title: 'Rooted in tradition', text: 'All positions are grounded in the Qur\'ān, Sunnah, and the recognised schools of Islamic thought. Contested opinions are clearly marked.' },
  { icon: Globe, title: 'Accessible writing', text: 'We write for the curious Muslim, not just the specialist. Technical terms are explained; sources are cited; complexity is earned.' },
];

export default function AboutPage() {
  return (
    <main className="bg-white">
      <SiteHeader />
      <PageHero
        eyebrow="About ILM"
        title={<>A library for the <em className="font-normal text-ilm-gold">work of becoming.</em></>}
        description="The Islamic League of Murabbiyūn publishes thoughtful writing on faith, practice, and renewal — for seekers who want depth without noise."
      />

      {/* ── Meaning of Murabbiyūn ────────────────────── */}
      <section className="ilm-section border-b border-slate-100 bg-[#F9F8F5]">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">

            {/* Left — image composition */}
            <Reveal from="left">
              <div className="relative pb-8 pr-4">
                {/* Main image */}
                <div className="overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(15,22,87,0.14)]">
                  <img
                    src={images.reading}
                    alt="Scholar studying classical texts"
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
                {/* Overlapping secondary image */}
                <div className="absolute -bottom-2 -right-2 w-[52%] overflow-hidden rounded-xl border-[3px] border-white shadow-[0_12px_36px_rgba(15,22,87,0.18)]">
                  <img
                    src={images.arches}
                    alt="Mosque archway"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              </div>
            </Reveal>

            {/* Right — content */}
            <Reveal from="right" delay="delay-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ilm-navy text-ilm-gold shadow-md">
                  <GraduationCap size={24} strokeWidth={1.5} />
                </div>
                <p className="text-[9px] font-semibold uppercase tracking-[.22em] text-slate-400">
                  Murabbiyūn — plural of Murabbī
                </p>
              </div>
              <h2 className="font-display text-[1.9rem] leading-[1.15] text-ilm-navy md:text-[2.2rem]">
                The Meaning of{' '}
                <em className="not-italic text-ilm-gold">Murabbiyūn</em>
              </h2>
              <div className="mt-5 h-px w-10 bg-ilm-gold/50" />
              <p className="mt-5 text-[15px] leading-8 text-slate-600">
                <strong className="font-semibold text-ilm-navy">Murabbī</strong> (مُرَبِّي) comes from the Arabic root{' '}
                <span dir="rtl" className="font-semibold text-ilm-gold">ر ب و</span> — to nourish, to raise, to cultivate. A Murabbī is one who does not merely transmit information, but who tends to the growth of those in their care.
              </p>
              <p className="mt-4 text-[15px] leading-8 text-slate-600">
                In the Islamic tradition, a Murabbī is a teacher who forms character as much as intellect — someone who accompanies the student on the path of becoming, not just the path of knowing. They carry the trust of knowledge with humility, and they give it with sincerity.
              </p>
              <p className="mt-4 text-[15px] leading-8 text-slate-600">
                <strong className="font-semibold text-ilm-navy">Murabbiyūn</strong> is the plural: those who cultivate. Together they form a community of educators, scholars, and guides who believe that knowledge is not a transaction — it is a living inheritance, passed carefully from hand to hand, and from heart to heart.
              </p>
              <div className="mt-7 rounded-xl border border-ilm-gold/20 bg-white p-5">
                <p className="font-display text-[1.05rem] italic text-ilm-navy leading-relaxed">
                  &ldquo;The best of you are those who learn knowledge and then teach it.&rdquo;
                </p>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[.18em] text-ilm-gold/70">
                  — Prophet Muhammad ﷺ (Sunan Ibn Mājah)
                </p>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      <section className="ilm-section">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <SectionLabel>Our mission</SectionLabel>
            <h2 className="font-display text-3xl text-ilm-navy md:text-4xl">Mentors · Educators · Cultivators</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              ILM exists to gather qualified voices in one considered space — a public library where Islamic thought feels both rigorous and alive. We believe good knowledge changes how we meet the world.
            </p>
            <p className="mt-4 text-base leading-7 text-slate-500">
              Our name reflects our calling: to mentor, educate, and cultivate — not merely to inform, but to accompany people on the path of learning.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="ilm-section bg-ilm-cream/40">
        <div className="mx-auto max-w-7xl">
          <SectionLabel>What we stand for</SectionLabel>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {values.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={`delay-${i + 1}`}>
                <ModernCard className="h-full">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ilm-cream text-ilm-gold">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-5 font-display text-xl text-ilm-navy">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
                </ModernCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="ilm-section">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionLabel>Our methodology</SectionLabel>
            <h2 className="mt-2 font-display text-3xl text-ilm-navy md:text-4xl">
              How we work
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
              Good writing requires process. Here is how each essay moves from idea to publication.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {methodology.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={`delay-${i + 1}`}>
                <div className="flex gap-4">
                  <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ilm-cream text-ilm-gold">
                    <Icon size={18} />
                  </span>
                  <div>
                    <h3 className="font-display text-lg text-ilm-navy">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Governance */}
      <section className="ilm-section bg-ilm-navy">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionLabel className="text-ilm-gold/70">Governance</SectionLabel>
            <h2 className="mt-2 font-display text-3xl text-white md:text-4xl">
              Structure &amp; accountability
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <Reveal delay="delay-1">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-display text-xl text-white">Editorial board</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  ILM is governed by an editorial board of qualified Islamic scholars and educators. The board sets content standards, approves contributors, and reviews complaints.
                </p>
              </div>
            </Reveal>
            <Reveal delay="delay-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-display text-xl text-white">Ikhtilāf policy</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  Where scholarly disagreement (ikhtilāf) exists, ILM presents positions fairly without enforcing a single view. Contributors disclose their school of thought, and all articles carry a disclaimer.
                </p>
              </div>
            </Reveal>
            <Reveal delay="delay-1">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-display text-xl text-white">No fatwa service</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  ILM does not issue personal religious rulings. Essays are educational. Readers requiring a fatwa are directed to qualified local scholars.
                </p>
              </div>
            </Reveal>
            <Reveal delay="delay-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-display text-xl text-white">Corrections policy</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  Factual errors are corrected promptly and noted in the article. We do not silently rewrite published content. Contact us at hello@ilm.org to report an issue.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="ilm-section">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl text-ilm-navy">Ready to begin?</h2>
          <p className="mt-4 text-slate-600">Explore the library or meet the Murabbiyūn who write for ILM.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/articles" className="ilm-btn-primary">
              Article library <ArrowRight size={15} />
            </Link>
            <Link href="/murabbiyun" className="ilm-btn-secondary">
              Meet the Murabbiyūn
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
