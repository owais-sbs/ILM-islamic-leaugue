import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { CategoryPageContent } from '@/components/CategoryPageContent';
import { PageHero } from '@/components/PageHero';
import { articles, categories } from '@/lib/data';

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) return {};
  return {
    title: `${category.name} — ILM`,
    description: category.description,
    openGraph: { title: `${category.name} — ILM`, description: category.description },
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) notFound();

  const categoryArticles = articles.filter(
    (a) => a.status === 'published' && a.category === category.name,
  );

  const moreFromLibrary = articles
    .filter((a) => a.status === 'published' && a.category !== category.name)
    .slice(0, 3);

  return (
    <main className="bg-white">
      <SiteHeader />
      <PageHero
        eyebrow="Subject"
        title={category.name}
        description={category.description}
      />
      <CategoryPageContent
        category={category}
        categoryArticles={categoryArticles}
        moreFromLibrary={moreFromLibrary}
      />
      <SiteFooter />
    </main>
  );
}
