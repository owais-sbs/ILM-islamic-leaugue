import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { CategoryPageContent } from '@/components/CategoryPageContent';
import { PageHero } from '@/components/PageHero';
import { fetchPublishedArticles, fetchPublicCategories } from '@/lib/public-content';
import { buildPageMetadata } from '@/lib/seo';

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await fetchPublicCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const categories = await fetchPublicCategories();
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) return { title: 'Category not found' };
  return buildPageMetadata({
    title: category.name,
    description: category.description || `Essays in ${category.name} from the ILM library.`,
    path: `/categories/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const [categories, published] = await Promise.all([
    fetchPublicCategories(),
    fetchPublishedArticles(),
  ]);

  const category = categories.find((c) => c.slug === params.slug);
  if (!category) notFound();

  const categoryArticles = published.filter((a) => a.category === category.name);
  const moreFromLibrary = published
    .filter((a) => a.category !== category.name)
    .slice(0, 3);

  return (
    <main className="bg-white">
      <SiteHeader />
      <PageHero eyebrow="Subject" title={category.name} description={category.description} />
      <CategoryPageContent
        category={category}
        categoryArticles={categoryArticles}
        moreFromLibrary={moreFromLibrary}
      />
      <SiteFooter />
    </main>
  );
}
