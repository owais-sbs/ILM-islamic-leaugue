import type { Article } from '@/lib/data';
import type { ArticleRow } from '@/lib/supabase/types';

/** Maps a Supabase article row to the public Article shape (safe for client + server). */
export function mapRowToArticle(row: ArticleRow): Article {
  const tags = (row.article_tags || [])
    .map((t) => t.tags?.name)
    .filter((name): name is string => Boolean(name));

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body_html,
    category: row.categories?.name || 'Essays',
    tags,
    authorId: row.author_id || '',
    authorName: row.profiles?.full_name || 'ILM Contributor',
    authorAvatar: row.profiles?.avatar_url || '',
    status: row.status,
    featuredImage: row.featured_image_url,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    readTime: `${row.reading_minutes || 5} min read`,
    views: row.views,
  };
}
