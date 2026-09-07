import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ArticleDetailView } from '@/components/ArticleDetailView';
import { fetchArticleBySlug, fetchPublishedArticles } from '@/lib/public-content';
import { authors } from '@/lib/data';

export const revalidate = 60;

export async function generateStaticParams() {
  const articles = await fetchPublishedArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await fetchArticleBySlug(params.slug);
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
      images: article.featuredImage ? [{ url: article.featuredImage, alt: article.title }] : [],
    },
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await fetchArticleBySlug(params.slug);
  if (!article) notFound();

  const author = authors.find((a) => a.id === article.authorId);
  const allPublished = await fetchPublishedArticles();
  const related = allPublished
    .filter((a) => a.category === article.category && a.id !== article.id)
    .slice(0, 4);

  return (
    <main className="bg-white">
      <SiteHeader />
      <ArticleDetailView article={article} author={author} related={related} />
      <SiteFooter />
    </main>
  );
}
