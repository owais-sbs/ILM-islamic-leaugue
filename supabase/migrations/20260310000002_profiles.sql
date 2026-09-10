-- =============================================================================
-- 20260310000002_profiles.sql
-- profiles linked 1:1 to auth.users
-- =============================================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null default '',
  slug text not null,
  role public.user_role not null default 'author',
  is_active boolean not null default true,
  title_honorific text,
  credentials text,
  madhhab text,
  bio text,
  avatar_url text,
  email_public text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_slug_unique unique (slug),
  constraint profiles_email_unique unique (email)
);

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists profiles_active_idx on public.profiles (is_active);

comment on table public.profiles is 'Staff + Murabbī profiles. role drives RLS.';
