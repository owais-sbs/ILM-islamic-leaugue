-- =============================================================================
-- ILM — run once in Supabase SQL Editor
-- Questions workflow, categories, tags, assignment columns, indexes, RLS
-- =============================================================================

-- 1) Question source column (ask | contact)
alter table public.questions
  add column if not exists source text not null default 'ask';

alter table public.questions
  drop constraint if exists questions_source_check;

alter table public.questions
  add constraint questions_source_check
  check (source in ('ask', 'contact'));

create index if not exists questions_source_idx on public.questions (source);

-- 2) Assignment & author draft columns
alter table public.questions
  add column if not exists assigned_to_name text;

alter table public.questions
  add column if not exists author_draft text;

-- 3) Extend question_status enum for author draft ready
do $$ begin
  alter type public.question_status add value if not exists 'author_ready';
exception
  when duplicate_object then null;
end $$;

-- 4) Categories (if missing)
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

-- 5) Tags (if missing)
create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tags_slug_unique unique (slug),
  constraint tags_name_unique unique (name)
);

-- 6) Seed categories
insert into public.categories (name, slug, description, display_order)
values
  ('Islamic Education', 'islamic-education', 'Formation and pedagogy', 1),
  ('Islamic Ethics', 'islamic-ethics', 'Adab and conduct', 2),
  ('Knowledge & Learning', 'knowledge-learning', 'Seeking knowledge', 3),
  ('Tarbiyah', 'tarbiyah', 'Nurturing hearts', 4),
  ('Aqidah', 'aqidah', 'Creed', 5),
  ('Fiqh', 'fiqh', 'Practical guidance', 6),
  ('Spirituality', 'spirituality', 'Inner life', 7)
on conflict (slug) do nothing;

-- 7) Seed tags
insert into public.tags (name, slug)
values
  ('spirituality', 'spirituality'),
  ('growth', 'growth'),
  ('patience', 'patience'),
  ('education', 'education'),
  ('youth', 'youth'),
  ('mentorship', 'mentorship'),
  ('community', 'community'),
  ('belonging', 'belonging'),
  ('leadership', 'leadership'),
  ('listening', 'listening'),
  ('communication', 'communication'),
  ('mindfulness', 'mindfulness'),
  ('mercy', 'mercy'),
  ('curiosity', 'curiosity'),
  ('sustainability', 'sustainability')
on conflict (slug) do nothing;

-- 8) RLS: allow service role full access (anon insert via API route)
alter table public.questions enable row level security;

drop policy if exists "questions_service_all" on public.questions;
create policy "questions_service_all" on public.questions
  for all using (true) with check (true);

-- Done. Restart your Next.js dev server after adding SMTP env vars.
