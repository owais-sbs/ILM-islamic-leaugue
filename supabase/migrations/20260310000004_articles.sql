-- =============================================================================
-- 20260310000004_articles.sql
-- articles + full-text search vector
-- =============================================================================

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  excerpt text not null default '',
  body_html text not null default '',
  body_text text not null default '',
  footnotes text not null default '',
  author_id uuid not null references public.profiles (id) on delete restrict,
  category_id uuid references public.categories (id) on delete set null,
  status public.article_status not null default 'draft',
  featured_image_url text,
  seo_title text,
  seo_description text,
  reading_minutes integer not null default 5,
  review_notes text,
  approved_by uuid references public.profiles (id) on delete set null,
  submitted_at timestamptz,
  published_at timestamptz,
  search_vector tsvector,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint articles_slug_unique unique (slug),
  constraint articles_reading_minutes_check check (reading_minutes >= 1)
);

create index if not exists articles_status_idx on public.articles (status);
create index if not exists articles_author_id_idx on public.articles (author_id);
create index if not exists articles_category_id_idx on public.articles (category_id);
create index if not exists articles_published_at_idx on public.articles (published_at desc nulls last);
create index if not exists articles_search_vector_gin
  on public.articles using gin (search_vector);

comment on column public.articles.published_at is
  'Set once on first publish; preserved on later edits/unpublish.';
