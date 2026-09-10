/**
 * Generated manually from supabase/migrations (Developer Spec).
 * Regenerate with `supabase gen types typescript` when CLI is available.
 */

export type UserRole = 'author' | 'editor' | 'admin';
export type ArticleStatus = 'draft' | 'submitted' | 'approved' | 'published' | 'returned';
export type QuestionStatus = 'new' | 'assigned' | 'answered' | 'archived';

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string;
  slug: string;
  role: UserRole;
  is_active: boolean;
  title_honorific: string | null;
  credentials: string | null;
  madhhab: string | null;
  bio: string | null;
  avatar_url: string | null;
  email_public: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
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
  author_id: string;
  category_id: string | null;
  status: ArticleStatus;
  featured_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  reading_minutes: number;
  review_notes: string | null;
  approved_by: string | null;
  submitted_at: string | null;
  published_at: string | null;
  search_vector: unknown;
  created_at: string;
  updated_at: string;
}

export interface ArticleRevisionRow {
  id: string;
  article_id: string;
  title: string;
  body_html: string;
  excerpt: string;
  edited_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ArticleTagRow {
  article_id: string;
  tag_id: string;
  created_at: string;
  updated_at: string;
}

export interface QuestionRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  category: string | null;
  status: QuestionStatus;
  assigned_to: string | null;
  answer_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriberRow {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MediaRow {
  id: string;
  url: string;
  path: string | null;
  filename: string;
  mime_type: string | null;
  size_bytes: number | null;
  alt_text: string | null;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteSettingRow {
  key: string;
  value: unknown;
  created_at: string;
  updated_at: string;
}

export interface ActivityLogRow {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  meta: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: { Row: ProfileRow; Insert: Partial<ProfileRow> & Pick<ProfileRow, 'id' | 'email' | 'slug'>; Update: Partial<ProfileRow> };
      categories: { Row: CategoryRow; Insert: Partial<CategoryRow> & Pick<CategoryRow, 'name' | 'slug'>; Update: Partial<CategoryRow> };
      tags: { Row: TagRow; Insert: Partial<TagRow> & Pick<TagRow, 'name' | 'slug'>; Update: Partial<TagRow> };
      articles: { Row: ArticleRow; Insert: Partial<ArticleRow> & Pick<ArticleRow, 'title' | 'slug' | 'author_id'>; Update: Partial<ArticleRow> };
      article_revisions: { Row: ArticleRevisionRow; Insert: Partial<ArticleRevisionRow> & Pick<ArticleRevisionRow, 'article_id' | 'title'>; Update: Partial<ArticleRevisionRow> };
      article_tags: { Row: ArticleTagRow; Insert: ArticleTagRow; Update: Partial<ArticleTagRow> };
      questions: { Row: QuestionRow; Insert: Partial<QuestionRow> & Pick<QuestionRow, 'name' | 'email' | 'subject' | 'body'>; Update: Partial<QuestionRow> };
      subscribers: { Row: SubscriberRow; Insert: Partial<SubscriberRow> & Pick<SubscriberRow, 'email'>; Update: Partial<SubscriberRow> };
      media: { Row: MediaRow; Insert: Partial<MediaRow> & Pick<MediaRow, 'url' | 'filename'>; Update: Partial<MediaRow> };
      site_settings: { Row: SiteSettingRow; Insert: Pick<SiteSettingRow, 'key' | 'value'>; Update: Partial<SiteSettingRow> };
      activity_log: { Row: ActivityLogRow; Insert: Partial<ActivityLogRow> & Pick<ActivityLogRow, 'action' | 'entity_type'>; Update: Partial<ActivityLogRow> };
    };
    Enums: {
      user_role: UserRole;
      article_status: ArticleStatus;
      question_status: QuestionStatus;
    };
  };
};

/** Demo accounts for client walkthrough (created by scripts/ensure-demo-users.mjs) */
export const DEMO_ACCOUNTS = {
  admin: { email: 'adminops@gmail.com', password: 'admin123', role: 'admin' as const },
  editor: { email: 'editor.smoke@ilm.test', password: 'editor123', role: 'editor' as const },
  author: { email: 'author.smoke@ilm.test', password: 'author123', role: 'author' as const },
} as const;
