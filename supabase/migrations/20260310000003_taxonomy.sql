-- =============================================================================
-- 20260310000003_taxonomy.sql
-- categories + tags
-- =============================================================================

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  description text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_slug_unique unique (slug),
  constraint categories_name_unique unique (name)
);

create index if not exists categories_display_order_idx
  on public.categories (display_order);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tags_slug_unique unique (slug),
  constraint tags_name_unique unique (name)
);
