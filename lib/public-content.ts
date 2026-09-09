import { createClient } from '@/lib/supabase/server';
import type { Article, Category } from '@/lib/data';
import { mapRowToArticle } from '@/lib/map-article';
import type { ArticleRow, CategoryRow } from '@/lib/supabase/types';

const ARTICLE_SELECT = `
  *,
  categories(name, slug),
  profiles!author_id(full_name, avatar_url),
  article_tags(tags(name, slug))
`;

/**
 * Fetch all published articles from Supabase.
 * Returns an empty array on error — never falls back to mock data.
 * The public pages handle an empty array gracefully with an EmptyArticles state.
 */
export async function fetchPublishedArticles(): Promise<Article[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('articles')
      .select(ARTICLE_SELECT)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('[public-content] fetchPublishedArticles error:', error.message);
      return [];
    }

    return (data ?? []).map((row) => mapRowToArticle(row as ArticleRow));
  } catch (err) {
    console.error('[public-content] fetchPublishedArticles exception:', err);
    return [];
  }
}

/**
 * Fetch a single published article by slug.
 * Returns null if not found or not published.
 */
export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('articles')
      .select(ARTICLE_SELECT)
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) {
      console.error('[public-content] fetchArticleBySlug error:', error.message);
      return null;
    }

    return data ? mapRowToArticle(data as ArticleRow) : null;
  } catch (err) {
    console.error('[public-content] fetchArticleBySlug exception:', err);
    return null;
  }
}

/**
 * Fetch all categories with real published article counts.
 */
export async function fetchPublicCategories(): Promise<Category[]> {
  try {
    const supabase = createClient();
    const [{ data: cats, error: catErr }, { data: published }] = await Promise.all([
      supabase.from('categories').select('*').order('display_order'),
      supabase.from('articles').select('category_id').eq('status', 'published'),
    ]);

    if (catErr) {
      console.error('[public-content] fetchPublicCategories error:', catErr.message);
      return [];
    }

    const counts = new Map<string, number>();
    for (const row of published || []) {
      if (row.category_id) {
        counts.set(row.category_id, (counts.get(row.category_id) || 0) + 1);
      }
    }

    return (cats ?? []).map((c: CategoryRow) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      color: c.color,
      articleCount: counts.get(c.id) || 0,
    }));
  } catch (err) {
    console.error('[public-content] fetchPublicCategories exception:', err);
    return [];
  }
}
