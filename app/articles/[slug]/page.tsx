import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ArticleDetailView } from '@/components/ArticleDetailView';
import { articles, authors } from '@/lib/data';

export function generateStaticParams() {
  return articles.filter((a) => a.status === 'published').map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = articles.find((a) => a.slug === params.slug && a.status === 'published');
  if (!article) return {};
  return {
    title: `${article.title} — ILM`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt ?? undefined,
      authors: [article.authorName],
      images: [{ url: article.featuredImage, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.featuredImage, alt: article.title }],
    },
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = articles.find((a) => a.slug === params.slug && a.status === 'published');
  if (!article) notFound();

  const author = authors.find((a) => a.id === article.authorId);
  const related = articles
    .filter((a) => a.status === 'published' && a.category === article.category && a.id !== article.id)
    .slice(0, 4);

  return (
    <main className="bg-white">
      <SiteHeader />
      <ArticleDetailView article={article} author={author} related={related} />
      <SiteFooter />
    </main>
  );
}
