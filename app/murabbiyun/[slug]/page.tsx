import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Reveal } from '@/components/Reveal';
import { ArticleCard } from '@/components/ArticleCard';
import { authors, articles } from '@/lib/data';

export function generateStaticParams() {
  return authors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const author = authors.find((a) => a.slug === params.slug);
  if (!author) return {};
  return {
    title: `${author.name} — ILM`,
    description: author.bio,
    openGraph: {
      title: `${author.name} — Islamic League of Murabbiyūn`,
      description: author.bio,
      images: [{ url: author.avatar, alt: author.name }],
    },
  };
}

export default function AuthorProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const author = authors.find((a) => a.slug === params.slug);
  if (!author) notFound();

  const authorArticles = articles.filter(
    (a) => a.authorId === author.id && a.status === 'published',
  );

  return (
    <main className="bg-white">
      <SiteHeader />

      {/* Profile hero */}
      <section className="px-6 pb-0 pt-32 md:px-12 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <Link
              href="/murabbiyun"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.15em] text-ilm-gold transition hover:gap-3"
            >
              <ArrowLeft size={14} /> All Murabbiyūn
            </Link>
          </Reveal>

          <div className="mt-8 grid gap-10 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-16">
            {/* Avatar */}
            <Reveal>
              <div className="relative mx-auto w-40 shrink-0 lg:mx-0 lg:w-48">
                <div className="absolute -bottom-3 -right-3 h-full w-full rounded-3xl border border-ilm-gold/25" />
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="relative aspect-square w-full rounded-3xl object-cover shadow-[0_16px_40px_rgba(15,22,87,0.14)]"
                />
              </div>
            </Reveal>

            {/* Bio */}
            <Reveal delay="delay-1">
              <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-[.18em]">
                <span className="rounded-full bg-ilm-cream px-3 py-1 text-ilm-gold">
                  {author.madhhab}
                </span>
                <span className="text-slate-400">{author.credentials}</span>
              </div>
              <h1 className="mt-4 font-display text-4xl leading-tight text-ilm-navy md:text-5xl">
                {author.name}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                {author.bio}
              </p>
              <p className="mt-4 text-sm text-slate-400">
                {authorArticles.length} published{' '}
                {authorArticles.length === 1 ? 'essay' : 'essays'} · Contributing since{' '}
                {new Date(author.joinedAt).getFullYear()}
              </p>
            </Reveal>
          </div>

          {/* Divider */}
          <div className="mt-14 h-px bg-slate-100" />
        </div>
      </section>

      {/* Articles */}
      <section className="px-6 py-14 md:px-12 md:py-20">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.2em] text-ilm-gold">
              Published essays
            </p>
            <h2 className="font-display text-3xl text-ilm-navy">
              Writing by {author.name.split(' ').pop()}
            </h2>
          </Reveal>

          {authorArticles.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {authorArticles.map((article, i) => (
                <Reveal key={article.id} delay={`delay-${(i % 3) + 1}`}>
                  <ArticleCard article={article} compact />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-ilm-cream/30 p-10 text-center">
              <p className="text-slate-500">Essays from this contributor are coming soon.</p>
            </div>
          )}

          <Reveal>
            <div className="mt-12 text-center">
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.15em] text-ilm-navy transition hover:gap-3 hover:text-ilm-gold"
              >
                Browse the full library <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
