import { createClient } from '@/lib/supabase/server';
import type { Article, Category } from '@/lib/data';
import { articles as mockArticles, categories as mockCategories } from '@/lib/data';
import { mapRowToArticle } from '@/lib/map-article';
import type { ArticleRow, CategoryRow } from '@/lib/supabase/types';

const ARTICLE_SELECT = `
  *,
  categories(name, slug),
  profiles!author_id(full_name, avatar_url),
  article_tags(tags(name, slug))
`;

export async function fetchPublishedArticles(): Promise<Article[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('articles')
      .select(ARTICLE_SELECT)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error || !data?.length) {
      return mockArticles.filter((a) => a.status === 'published');
    }
    return data.map((row) => mapRowToArticle(row as ArticleRow));
  } catch {
    return mockArticles.filter((a) => a.status === 'published');
  }
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('articles')
      .select(ARTICLE_SELECT)
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error || !data) {
      return mockArticles.find((a) => a.slug === slug && a.status === 'published') ?? null;
    }
    return mapRowToArticle(data as ArticleRow);
  } catch {
    return mockArticles.find((a) => a.slug === slug && a.status === 'published') ?? null;
  }
}

export async function fetchPublicCategories(): Promise<Category[]> {
  try {
    const supabase = createClient();
    const [{ data: cats, error: catErr }, { data: published }] = await Promise.all([
      supabase.from('categories').select('*').order('display_order'),
      supabase.from('articles').select('category_id').eq('status', 'published'),
    ]);

    if (catErr || !cats?.length) {
      return mockCategories;
    }

    const counts = new Map<string, number>();
    for (const row of published || []) {
      if (row.category_id) {
        counts.set(row.category_id, (counts.get(row.category_id) || 0) + 1);
      }
    }

    return (cats as CategoryRow[]).map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      color: c.color,
      articleCount: counts.get(c.id) || 0,
    }));
  } catch {
    return mockCategories;
  }
}
