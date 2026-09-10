-- =============================================================================
-- 20260310000005_article_revisions_tags.sql
-- =============================================================================

create table if not exists public.article_revisions (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles (id) on delete cascade,
  title text not null,
  body_html text not null default '',
  excerpt text not null default '',
  edited_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists article_revisions_article_id_idx
  on public.article_revisions (article_id, created_at desc);

create table if not exists public.article_tags (
  article_id uuid not null references public.articles (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (article_id, tag_id)
);

create index if not exists article_tags_tag_id_idx on public.article_tags (tag_id);
