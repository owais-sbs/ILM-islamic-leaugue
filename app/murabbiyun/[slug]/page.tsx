'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { murabbiyūn } from '@/lib/public-data';
import { useIlm } from '@/lib/ilm-store';
import { ArticleCard } from '@/components/public/article-card';
import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';

export default function MurabbiProfilePage({ params }: { params: { slug: string } }) {
  const slug = params.slug === 'maryam-yusuf' ? 'bilal-rahman' : params.slug;
  const person = murabbiyūn.find((m) => m.id === slug);
  const { publishedArticles } = useIlm();
  const works = useMemo(
    () => publishedArticles.filter((a) => a.authorSlug === slug || a.author === person?.name),
    [publishedArticles, slug, person?.name]
  );

  if (!person) {
    return (
      <main className="grid min-h-screen place-items-center pt-28">
        <SiteHeader active="murabbiyun" />
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-ilm-navy">Profile not found</h1>
          <Link href="/murabbiyun" className="mt-4 inline-flex items-center gap-2 text-ilm-gold-deep">
            <ArrowLeft size={14} /> Directory
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[100svh] flex-col pt-28">
      <SiteHeader active="murabbiyun" />
      <section className="mx-auto grid w-full max-w-[1100px] flex-1 gap-10 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-[280px_1fr]">
        <div className="text-center md:text-left">
          <div className="mx-auto h-40 w-40 overflow-hidden rounded-full ring-4 ring-ilm-cream md:mx-0">
            <img src={person.image} alt={person.name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold text-ilm-navy">{person.name}</h1>
          <p className="mt-1 text-ilm-gold-deep">{person.role}</p>
          <p className="mt-2 text-sm text-ilm-navy/45">{person.credentials}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ilm-gold-deep">Biography</p>
          <p className="mt-4 text-lg leading-relaxed text-ilm-navy/70">{person.bio}</p>
          <h2 className="mt-12 text-xl font-semibold text-ilm-navy">Published articles</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {works.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
            {works.length === 0 && <p className="text-sm text-ilm-navy/40">No published articles yet.</p>}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
