import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { PageHero, SectionLabel } from '@/components/PageHero';
import { Reveal } from '@/components/Reveal';
import { authors } from '@/lib/data';

import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Murabbiyūn',
  description: 'Meet the teachers, researchers, and lifelong students who write for ILM.',
  path: '/murabbiyun',
});

export default function MurabbiyunPage() {
  const activeAuthors = authors.filter((a) => a.active);

  return (
    <main className="bg-white">
      <SiteHeader />
      <PageHero
        eyebrow="Murabbiyūn"
        title={
          <>
            Good questions need{' '}
            <em className="not-italic text-ilm-gold">good company.</em>
          </>
        }
        description="Our contributors are teachers, researchers, and lifelong students — writing from within the tradition with humility and clarity."
      />

      <section className="px-6 py-12 md:px-12 md:py-14">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionLabel>Contributors</SectionLabel>
          </Reveal>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {activeAuthors.map((author, i) => {
              return (
                <Reveal key={author.id} delay={`delay-${(i % 3) + 1}`}>
                  <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_2px_16px_rgba(15,22,87,0.05)] transition duration-300 hover:shadow-[0_8px_32px_rgba(15,22,87,0.09)]">
                    <div className="h-1 w-full bg-gradient-to-r from-ilm-gold/60 to-ilm-gold/20" />
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-start gap-4">
                        <Link href={`/murabbiyun/${author.slug}`} className="shrink-0">
                          <img
                            src={author.avatar}
                            alt={author.name}
                            className="h-[4.25rem] w-[4.25rem] rounded-xl object-cover ring-2 ring-white shadow-md transition group-hover:ring-ilm-gold/30"
                          />
                        </Link>
                        <div className="min-w-0">
                          <Link href={`/murabbiyun/${author.slug}`}>
                            <h3 className="font-display text-[1.05rem] leading-snug text-ilm-navy transition hover:text-ilm-gold">
                              {author.name}
                            </h3>
                          </Link>
                          <p className="mt-0.5 text-[11px] font-medium text-ilm-gold">{author.credentials}</p>
                          <p className="mt-0.5 text-[9px] uppercase tracking-[.14em] text-slate-400">{author.madhhab}</p>
                        </div>
                      </div>
                      <p className="mt-4 flex-1 text-[13px] leading-6 text-slate-600">{author.bio}</p>
                      <div className="mt-5 border-t border-slate-50 pt-4">
                        <Link
                          href={`/murabbiyun/${author.slug}`}
                          className="text-[10px] font-semibold uppercase tracking-[.14em] text-ilm-gold transition hover:underline"
                        >
                          View profile →
                        </Link>
                      </div>
                    </div>
                  </div>
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
