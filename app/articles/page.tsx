import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { PageHero, SectionLabel } from '@/components/PageHero';
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
      <section className="border-b border-ilm-navy/[0.06] bg-ilm-cream/30 px-6 py-8 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2">
          {categories.map((cat, i) => (
            <Reveal key={cat.id} delay={`delay-${(i % 4) + 1}`}>
              <Link
                href={`/categories/${cat.slug}`}
                className="inline-block rounded-full border border-slate-200/80 bg-white px-4 py-2 text-xs font-medium text-ilm-navy transition hover:border-ilm-gold hover:text-ilm-gold"
              >
                {cat.name}
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {published[0] && (
        <section className="px-6 py-12 md:px-12">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <SectionLabel>Editor&apos;s pick</SectionLabel>
            </Reveal>
            <div className="mt-6">
              <Reveal delay="delay-1">
                <ArticleCard article={published[0]} featured />
              </Reveal>
            </div>
          </div>
        </section>
      )}

      <section className="px-6 pb-16 md:px-12 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionLabel>All published essays</SectionLabel>
          </Reveal>
          <div className="mt-6">
            <ArticleGrid articles={published.slice(1)} compact columns={3} />
          </div>
        </div>
      </section>

      <section className="border-t border-ilm-navy/[0.06] bg-ilm-cream/40 px-6 py-16 md:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionLabel>Browse by subject</SectionLabel>
          </Reveal>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <Reveal key={cat.id} delay={`delay-${(i % 3) + 1}`}>
                <Link
                  href={`/categories/${cat.slug}`}
                  className="group flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition hover:border-ilm-gold/40 hover:shadow-md"
                >
                  <div>
                    <h3 className="font-display text-lg text-ilm-navy">{cat.name}</h3>
                    <p className="mt-1 text-xs text-slate-500">{cat.articleCount} articles</p>
                  </div>
                  <ArrowUpRight size={18} className="text-ilm-gold/40 group-hover:text-ilm-gold" />
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
