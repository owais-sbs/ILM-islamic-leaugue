import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ArticleDetailView } from '@/components/ArticleDetailView';
import { JsonLd } from '@/components/JsonLd';
import { fetchArticleBySlug, fetchPublishedArticles } from '@/lib/public-content';
import { authors } from '@/lib/data';
import { getSiteUrl } from '@/lib/site-url';
import { buildPageMetadata } from '@/lib/seo';

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
  if (!article) return { title: 'Article not found' };

  const title = article.title;
  const description = article.excerpt || `Read “${article.title}” on ILM.`;
  const path = `/articles/${article.slug}`;
  const image = article.featuredImage || undefined;

  return {
    ...buildPageMetadata({
      title,
      description,
      path,
      image,
      type: 'article',
    }),
    title,
    openGraph: {
      type: 'article',
      title,
      description,
      url: `${getSiteUrl()}${path}`,
      publishedTime: article.publishedAt ?? undefined,
      modifiedTime: article.updatedAt || undefined,
      authors: [article.authorName],
      tags: article.tags,
      images: image
        ? [{ url: image, alt: article.title }]
        : [{ url: '/og-image.png', alt: title }],
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

  const base = getSiteUrl();
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImage || `${base}/og-image.png`,
    datePublished: article.publishedAt || undefined,
    dateModified: article.updatedAt || article.publishedAt || undefined,
    author: {
      '@type': 'Person',
      name: article.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Islamic League of Murabbiyūn',
      logo: {
        '@type': 'ImageObject',
        url: `${base}/ILM_Final_Logo_Icon.png`,
      },
    },
    mainEntityOfPage: `${base}/articles/${article.slug}`,
    articleSection: article.category,
    keywords: article.tags?.join(', '),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: base },
      { '@type': 'ListItem', position: 2, name: 'Articles', item: `${base}/articles` },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: `${base}/articles/${article.slug}`,
      },
    ],
  };

  return (
    <main className="bg-white">
      <JsonLd data={articleLd} />
      <JsonLd data={breadcrumbLd} />
      <SiteHeader />
      <ArticleDetailView article={article} author={author} related={related} />
      <SiteFooter />
    </main>
  );
}
