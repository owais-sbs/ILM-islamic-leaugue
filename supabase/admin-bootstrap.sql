-- =============================================================================
-- ILM Admin Bootstrap — run once in Supabase SQL Editor
-- Fixes 403 Forbidden on /api/admin/* when profile is missing or not promoted.
-- Safe to re-run (idempotent).
-- =============================================================================

-- 1) Ensure schema + RLS helpers exist (no-op if already applied)
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null default '',
  full_name text not null default '',
  slug text unique,
  role text not null default 'author'
    check (role in ('author', 'editor', 'admin')),
  title_honorific text not null default '',
  bio text not null default '',
  credentials text not null default '',
  madhhab text not null default '',
  avatar_url text not null default '',
  email_public text not null default '',
  is_active boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Backfill profiles for every auth user that is missing a row
insert into public.profiles (id, email, full_name, role, is_active, email_public)
select
  u.id,
  coalesce(u.email, ''),
  coalesce(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'name',
    split_part(coalesce(u.email, 'user'), '@', 1)
  ),
  coalesce(u.raw_user_meta_data->>'role', 'author'),
  true,
  coalesce(u.email, '')
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);

-- 3) Promote the default admin account (change email if yours is different)
update public.profiles p
set
  role = 'admin',
  is_active = true,
  full_name = coalesce(nullif(p.full_name, ''), 'Admin'),
  email = coalesce(nullif(p.email, ''), u.email),
  email_public = coalesce(nullif(p.email_public, ''), u.email)
from auth.users u
where p.id = u.id
  and lower(u.email) = lower('adminops@gmail.com');

-- 4) Optional: promote ANY user by email (uncomment and edit)
-- update public.profiles p
-- set role = 'admin', is_active = true
-- from auth.users u
-- where p.id = u.id and lower(u.email) = lower('you@example.com');

-- 5) Verify
select
  u.email,
  p.role,
  p.is_active,
  p.full_name
from auth.users u
left join public.profiles p on p.id = u.id
order by u.created_at desc;
