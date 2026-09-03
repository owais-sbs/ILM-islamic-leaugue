import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { PageHero, ModernCard, SectionLabel } from '@/components/PageHero';
import { Reveal } from '@/components/Reveal';
import { authors, articles } from '@/lib/data';

export default function MurabbiyunPage() {
  const activeAuthors = authors.filter((a) => a.active);

  return (
    <main className="bg-white">
      <SiteHeader />
      <PageHero
        eyebrow="Murabbiyūn"
        title={<>Good questions need <em className="font-normal text-ilm-gold">good company.</em></>}
        description="Our contributors are teachers, researchers, and lifelong students — writing from within the tradition with humility and clarity."
      />
      <section className="px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionLabel>Contributors</SectionLabel>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeAuthors.map((author, i) => {
              const authorArticles = articles.filter((a) => a.authorId === author.id && a.status === 'published');
              return (
                <Reveal key={author.id} delay={`delay-${(i % 3) + 1}`}>
                  <ModernCard className="flex h-full flex-col">
                    <div className="flex items-start gap-4">
                      <img src={author.avatar} alt={author.name} className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-2 ring-ilm-cream" />
                      <div>
                        <h3 className="font-display text-xl text-ilm-navy">{author.name}</h3>
                        <p className="mt-1 text-xs text-ilm-gold">{author.credentials}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[.12em] text-slate-400">{author.madhhab}</p>
                      </div>
                    </div>
                    <p className="mt-5 flex-1 text-sm leading-7 text-slate-600">{author.bio}</p>
                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-xs text-slate-400">{author.articleCount} articles</span>
                      {authorArticles[0] && (
                        <Link href={`/articles/${authorArticles[0].slug}`} className="flex items-center gap-1 text-xs font-medium text-ilm-gold hover:underline">
                          Read latest <ArrowUpRight size={14} />
                        </Link>
                      )}
                    </div>
                  </ModernCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
