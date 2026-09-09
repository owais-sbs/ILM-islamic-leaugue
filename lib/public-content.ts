import { createPublicClient } from '@/lib/supabase/public';
import type { Article, Author, Category } from '@/lib/data';
import { mapRowToArticle } from '@/lib/map-article';
import type { ArticleRow, CategoryRow, ProfileRow } from '@/lib/supabase/types';

/** Selective columns — avoid SELECT * on public reads */
const ARTICLE_SELECT = `
  id, title, slug, excerpt, body_html, footnotes, author_id, category_id, status,
  featured_image_url, seo_title, seo_description, reading_minutes, is_featured,
  published_at, views, created_at, updated_at,
  categories(name, slug),
  profiles!author_id(full_name, avatar_url, slug),
  article_tags(tags(name, slug))
`;

/**
 * Fetch all published articles from Supabase.
 * Uses a cookie-free client so Vercel / generateStaticParams builds succeed.
 */
export async function fetchPublishedArticles(): Promise<Article[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('articles')
      .select(ARTICLE_SELECT)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('[public-content] fetchPublishedArticles error:', error.message);
      return [];
    }

    return (data ?? []).map((row) => mapRowToArticle(row as unknown as ArticleRow));
  } catch (err) {
    console.error('[public-content] fetchPublishedArticles exception:', err);
    return [];
  }
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const supabase = createPublicClient();
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

    return data ? mapRowToArticle(data as unknown as ArticleRow) : null;
  } catch (err) {
    console.error('[public-content] fetchArticleBySlug exception:', err);
    return null;
  }
}

export async function fetchPublicCategories(): Promise<Category[]> {
  try {
    const supabase = createPublicClient();
    const [{ data: cats, error: catErr }, { data: published }] = await Promise.all([
      supabase
        .from('categories')
        .select('id, name, slug, description, color, display_order')
        .order('display_order'),
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

    return (cats ?? []).map((c) => {
      const row = c as unknown as CategoryRow;
      return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        color: row.color,
        articleCount: counts.get(row.id) || 0,
      };
    });
  } catch (err) {
    console.error('[public-content] fetchPublicCategories exception:', err);
    return [];
  }
}

/** Active public contributor profiles (Murabbiyūn directory + filters). */
export async function fetchPublicAuthors(): Promise<Author[]> {
  try {
    const supabase = createPublicClient();
    const [{ data: profiles, error }, { data: published }] = await Promise.all([
      supabase
        .from('profiles')
        .select(
          'id, slug, full_name, credentials, madhhab, bio, avatar_url, email_public, role, is_active, created_at, display_order',
        )
        .eq('is_active', true)
        .order('display_order')
        .order('full_name'),
      supabase.from('articles').select('author_id').eq('status', 'published'),
    ]);

    if (error) {
      console.error('[public-content] fetchPublicAuthors error:', error.message);
      return [];
    }

    const counts = new Map<string, number>();
    for (const row of published || []) {
      if (row.author_id) {
        counts.set(row.author_id, (counts.get(row.author_id) || 0) + 1);
      }
    }

    return (profiles ?? [])
      .map((p) => p as unknown as ProfileRow)
      .filter((p) => p.slug)
      .map((p) => ({
        id: p.id,
        slug: p.slug || p.id,
        name: p.full_name,
        credentials: p.credentials || '',
        madhhab: p.madhhab || '',
        bio: p.bio || '',
        avatar: p.avatar_url || '',
        articleCount: counts.get(p.id) || 0,
        role: p.role,
        email: p.email_public || '',
        active: p.is_active,
        joinedAt: p.created_at?.slice(0, 10) || '',
      }));
  } catch (err) {
    console.error('[public-content] fetchPublicAuthors exception:', err);
    return [];
  }
}
