import {
  fetchPublishedArticles,
  fetchPublicAuthors,
  fetchPublicCategories,
} from '@/lib/public-content';
import {
  articles as demoArticles,
  authors as demoAuthors,
  categories as demoCategories,
} from '@/lib/data';
import { ArticlesLibraryClient } from '@/components/ArticlesLibraryClient';

export const revalidate = 60;

export default async function ArticlesPage() {
  const [dbArticles, dbCategories, dbAuthors] = await Promise.all([
    fetchPublishedArticles(),
    fetchPublicCategories(),
    fetchPublicAuthors(),
  ]);

  const articles =
    dbArticles.length > 0
      ? dbArticles
      : demoArticles.filter((a) => a.status === 'published');
  const categories = dbCategories.length > 0 ? dbCategories : demoCategories;
  const authors =
    dbAuthors.length > 0 ? dbAuthors.filter((a) => a.active) : demoAuthors.filter((a) => a.active);

  return (
    <ArticlesLibraryClient articles={articles} categories={categories} authors={authors} />
  );
}
