'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useIlm } from '@/lib/ilm-store';
import { ArticlePreview } from '@/components/admin/article-preview';
import { ArticleCard } from '@/components/public/article-card';
import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';

export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const { publishedArticles } = useIlm();
  const article = useMemo(
    () => publishedArticles.find((a) => a.slug === params.slug),
    [publishedArticles, params.slug]
  );
  const related = publishedArticles.filter((a) => a.slug !== params.slug && a.category === article?.category).slice(0, 3);

  if (!article) {
    return (
      <main className="grid min-h-screen place-items-center pt-28">
        <SiteHeader active="articles" />
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-ilm-navy">This article is not published</h1>
          <p className="mt-2 text-sm text-ilm-navy/50">Visitors only see articles with status = published.</p>
          <Link href="/articles" className="mt-4 inline-flex items-center gap-2 text-sm text-ilm-gold-deep">
            <ArrowLeft size={14} /> Back to articles
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[100svh] flex-col pt-28">
      <SiteHeader active="articles" />
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-12">
        <Link href="/articles" className="inline-flex items-center gap-2 text-sm text-ilm-navy/50 hover:text-ilm-navy">
          <ArrowLeft size={14} /> Article library
        </Link>
        <div className="mt-6">
          <ArticlePreview article={article} />
        </div>
      </div>
      {related.length > 0 && (
        <section className="mx-auto w-full max-w-[1280px] px-4 pb-16 sm:px-6 sm:pb-20">
          <h2 className="mb-6 text-2xl font-semibold text-ilm-navy">Related articles</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
      <SiteFooter />
    </main>
  );
}
