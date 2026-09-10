import type { Article } from '@/lib/admin-data';
import { images, safeArticleImage } from '@/lib/images';
import type { ArticleRow, ProfileRow, CategoryRow } from '@/types/database';

type RemoteArticle = ArticleRow & {
  profiles?: Pick<ProfileRow, 'full_name' | 'slug' | 'avatar_url'> | null;
  categories?: Pick<CategoryRow, 'name' | 'slug'> | null;
};

function formatDate(iso: string | null | undefined) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return iso;
  }
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

/** Map a Supabase article (+ joins) into the UI Article shape. */
export function mapRemoteArticle(row: RemoteArticle, featured = false): Article {
  const authorName = row.profiles?.full_name || 'Murabbi';
  const authorSlug = row.profiles?.slug || 'murabbi';
  const category = row.categories?.name || 'Tarbiyah';
  const published = formatDate(row.published_at) || formatDate(row.created_at);

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || '',
    body: row.body_html || row.body_text || '',
    footnotes: row.footnotes || '',
    seoTitle: row.seo_title || row.title,
    seoDescription: row.seo_description || row.excerpt || '',
    category,
    author: authorName,
    authorSlug,
    authorInitials: initials(authorName),
    status: row.status,
    date: published,
    publishedAt: published || undefined,
    readTime: `${row.reading_minutes || 5} min`,
    tags: [],
    image: safeArticleImage(row.featured_image_url || images.quranSunrise),
    featured,
    reviewNotes: row.review_notes || undefined,
    revisions: [],
  };
}
