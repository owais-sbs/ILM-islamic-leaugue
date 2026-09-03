import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ArticleDetailView } from '@/components/ArticleDetailView';
import { articles } from '@/lib/data';

export function generateStaticParams() {
  return articles.filter((a) => a.status === 'published').map((a) => ({ slug: a.slug }));
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = articles.find((a) => a.slug === params.slug && a.status === 'published');
  if (!article) notFound();

  const related = articles
    .filter((a) => a.status === 'published' && a.category === article.category && a.id !== article.id)
    .slice(0, 4);

  return (
    <main className="bg-white">
      <SiteHeader />
      <ArticleDetailView article={article} related={related} />
      <SiteFooter />
    </main>
  );
}
