export type DbRole = 'author' | 'editor' | 'admin';
export type DbArticleStatus = 'draft' | 'submitted' | 'approved' | 'published' | 'returned';
export type DbQuestionStatus = 'new' | 'assigned' | 'answered' | 'archived';

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string;
  slug: string | null;
  role: DbRole;
  title_honorific: string;
  bio: string;
  credentials: string;
  madhhab: string;
  avatar_url: string;
  email_public: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  display_order: number;
  icon: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface TagRow {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body_html: string;
  body_text: string;
  footnotes: string;
  author_id: string | null;
  category_id: string | null;
  status: DbArticleStatus;
  featured_image_url: string;
  seo_title: string;
  seo_description: string;
  reading_minutes: number;
  is_featured: boolean;
  review_notes: string;
  submitted_at: string | null;
  approved_by: string | null;
  published_at: string | null;
  views: number;
  locale: string;
  created_at: string;
  updated_at: string;
  categories?: { id: string; name: string; slug: string } | null;
  profiles?: { id: string; full_name: string; avatar_url: string } | null;
  article_tags?: { tags: { id: string; name: string; slug: string } | null }[];
}

export interface QuestionRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  category_id: string | null;
  assigned_to: string | null;
  status: DbQuestionStatus;
  answer_notes: string;
  linked_article_id: string | null;
  created_at: string;
  updated_at: string;
  categories?: { name: string } | null;
  profiles?: { full_name: string } | null;
}

export interface SubscriberRow {
  id: string;
  email: string;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface MediaRow {
  id: string;
  file_path: string;
  file_name: string;
  file_url: string;
  mime_type: string;
  size_bytes: number;
  alt_text: string;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActivityRow {
  id: string;
  actor_id: string | null;
  actor_name: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  entity_label: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function formatBytes(bytes: number) {
  if (!bytes) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
