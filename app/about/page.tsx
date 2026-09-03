import Link from 'next/link';
import { ArrowRight, BookOpen, Heart, Users } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { PageHero, ModernCard, SectionLabel } from '@/components/PageHero';
import { Reveal } from '@/components/Reveal';
import { images } from '@/lib/data';

const values = [
  { icon: BookOpen, title: 'Rigorous & alive', text: 'Knowledge that is faithful to tradition and written for real life — never dry, never careless.' },
  { icon: Heart, title: 'Formation first', text: 'We care less about performance and more about the slow work of becoming.' },
  { icon: Users, title: 'Qualified voices', text: 'Every contributor is a teacher, researcher, or serious student vetted by our editorial team.' },
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
      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <img src={images.arches2} alt="" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-[0_20px_50px_rgba(15,22,87,0.10)]" />
          </Reveal>
          <Reveal delay="delay-1">
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
      <section className="bg-ilm-cream/40 px-6 py-20 md:px-12">
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
      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl text-ilm-navy">Ready to begin?</h2>
          <p className="mt-4 text-slate-600">Explore the library or meet the Murabbiyūn who write for ILM.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/articles" className="inline-flex items-center gap-2 rounded-full bg-ilm-gold px-6 py-3 text-xs font-semibold uppercase tracking-[.13em] text-white hover:bg-ilm-gold-dark">
              Article library <ArrowRight size={15} />
            </Link>
            <Link href="/murabbiyun" className="inline-flex items-center gap-2 rounded-full border border-ilm-navy/15 px-6 py-3 text-xs font-semibold uppercase tracking-[.13em] text-ilm-navy hover:border-ilm-gold hover:text-ilm-gold">
              Meet the Murabbiyūn
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
