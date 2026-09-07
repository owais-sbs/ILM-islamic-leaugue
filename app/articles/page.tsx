import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { PageHero, SectionLabel, GoldDivider } from '@/components/PageHero';
import { ArticleCard } from '@/components/ArticleCard';
import { ArticleGrid } from '@/components/ArticleGrid';
import { Reveal } from '@/components/Reveal';
import { articles, categories } from '@/lib/data';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function ArticlesPage() {
  const published = articles.filter((a) => a.status === 'published');

  return (
    <main className="bg-white">
      <SiteHeader />
      <PageHero
        eyebrow="Article library"
        title="Ideas for the road ahead"
        description="Essays on Qur'an, spirituality, history, character, and the questions that matter — written with care by qualified voices."
      />

      {/* Category filter strip */}
      <section className="sticky top-[72px] z-30 border-b border-slate-100 bg-white/95 px-6 py-3 backdrop-blur-sm md:px-12">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[10.5px] font-medium text-slate-600 transition hover:border-ilm-gold hover:text-ilm-gold"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured / editor's pick */}
      {published[0] && (
        <section className="px-6 py-12 md:px-12 md:py-14">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <SectionLabel>Editor&apos;s pick</SectionLabel>
            </Reveal>
            <Reveal delay="delay-1">
              <ArticleCard article={published[0]} featured />
            </Reveal>
          </div>
        </section>
      )}

      <GoldDivider className="mx-auto max-w-7xl px-6 md:px-12" />

      {/* All published essays */}
      <section className="px-6 pb-14 pt-12 md:px-12 md:pb-16">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionLabel>All published essays</SectionLabel>
          </Reveal>
          <div className="mt-6">
            <ArticleGrid articles={published.slice(1)} compact columns={3} />
          </div>
        </div>
      </section>

      {/* Browse by subject */}
      <section className="border-t border-slate-100 bg-[#F9F8F5] px-6 py-14 md:px-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionLabel>Browse by subject</SectionLabel>
          </Reveal>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <Reveal key={cat.id} delay={`delay-${(i % 3) + 1}`}>
                <Link
                  href={`/categories/${cat.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-ilm-gold/30 hover:shadow-md"
                >
                  <div>
                    <h3 className="font-display text-[1.05rem] text-ilm-navy">{cat.name}</h3>
                    <p className="mt-0.5 text-[11px] text-slate-400">{cat.articleCount} articles</p>
                  </div>
                  <ArrowUpRight size={16} className="text-ilm-gold/40 transition group-hover:text-ilm-gold" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
