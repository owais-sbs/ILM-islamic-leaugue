-- =============================================================================
-- ILM — Islamic League of Murabbiyūn
-- Schema aligned to Developer Specification v1.0 (29 Aug 2026)
-- Run once in Supabase SQL Editor
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Helpers (updated_at only — role helpers come AFTER profiles exists)
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- profiles (1:1 auth.users) — must exist before RLS helper functions
-- -----------------------------------------------------------------------------
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

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role, email_public)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(coalesce(new.email, 'user'), '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'author'),
    coalesce(new.email, '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Role helpers (after profiles table)
create or replace function public.current_user_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active = true and role in ('author', 'editor', 'admin')
  );
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active = true and role = 'admin'
  );
$$;

create or replace function public.is_editor_or_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active = true and role in ('editor', 'admin')
  );
$$;

-- -----------------------------------------------------------------------------
-- categories
-- -----------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  display_order int not null default 0,
  icon text not null default '',
  color text not null default '#0F1657',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists categories_updated_at on public.categories;
create trigger categories_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- tags
-- -----------------------------------------------------------------------------
create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists tags_updated_at on public.tags;
create trigger tags_updated_at
  before update on public.tags
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- articles
-- -----------------------------------------------------------------------------
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  slug text not null unique,
  excerpt text not null default '',
  body_html text not null default '',
  body_text text not null default '',
  footnotes text not null default '',
  author_id uuid references public.profiles (id) on delete set null,
  category_id uuid references public.categories (id) on delete set null,
  status text not null default 'draft'
    check (status in ('draft', 'submitted', 'approved', 'published', 'returned')),
  featured_image_url text not null default '',
  seo_title text not null default '',
  seo_description text not null default '',
  reading_minutes int not null default 5,
  is_featured boolean not null default false,
  review_notes text not null default '',
  submitted_at timestamptz,
  approved_by uuid references public.profiles (id) on delete set null,
  published_at timestamptz,
  views int not null default 0,
  locale text not null default 'en',
  search_vector tsvector,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_status_published_idx on public.articles (status, published_at desc);
create index if not exists articles_author_idx on public.articles (author_id);
create index if not exists articles_category_idx on public.articles (category_id);
create index if not exists articles_search_vector_idx on public.articles using gin (search_vector);

drop trigger if exists articles_updated_at on public.articles;
create trigger articles_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

create or replace function public.articles_search_vector_update()
returns trigger language plpgsql as $$
begin
  new.body_text := regexp_replace(coalesce(new.body_html, ''), '<[^>]+>', ' ', 'g');
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(new.body_text, '')), 'C');
  return new;
end;
$$;

drop trigger if exists articles_search_vector_trigger on public.articles;
create trigger articles_search_vector_trigger
  before insert or update of title, excerpt, body_html
  on public.articles
  for each row execute function public.articles_search_vector_update();

-- -----------------------------------------------------------------------------
-- article_revisions (snapshot on every save)
-- -----------------------------------------------------------------------------
create table if not exists public.article_revisions (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles (id) on delete cascade,
  body_html text not null default '',
  title text not null default '',
  edited_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists article_revisions_article_idx
  on public.article_revisions (article_id, created_at desc);

create or replace function public.snapshot_article_revision()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.article_revisions (article_id, body_html, title, edited_by)
  values (new.id, new.body_html, new.title, auth.uid());
  return new;
end;
$$;

drop trigger if exists articles_revision_snapshot on public.articles;
create trigger articles_revision_snapshot
  after insert or update of body_html, title
  on public.articles
  for each row execute function public.snapshot_article_revision();

-- -----------------------------------------------------------------------------
-- article_tags
-- -----------------------------------------------------------------------------
create table if not exists public.article_tags (
  article_id uuid not null references public.articles (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (article_id, tag_id)
);

-- -----------------------------------------------------------------------------
-- questions
-- -----------------------------------------------------------------------------
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  body text not null,
  category_id uuid references public.categories (id) on delete set null,
  assigned_to uuid references public.profiles (id) on delete set null,
  status text not null default 'new'
    check (status in ('new', 'assigned', 'answered', 'archived')),
  answer_notes text not null default '',
  linked_article_id uuid references public.articles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists questions_updated_at on public.questions;
create trigger questions_updated_at
  before update on public.questions
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- subscribers
-- -----------------------------------------------------------------------------
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists subscribers_updated_at on public.subscribers;
create trigger subscribers_updated_at
  before update on public.subscribers
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- media
-- -----------------------------------------------------------------------------
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  file_path text not null default '',
  file_name text not null,
  file_url text not null default '',
  mime_type text not null default 'image/jpeg',
  size_bytes bigint not null default 0,
  alt_text text not null default '',
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists media_updated_at on public.media;
create trigger media_updated_at
  before update on public.media
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- site_settings (key / jsonb value — PDF model)
-- -----------------------------------------------------------------------------
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

insert into public.site_settings (key, value) values
  ('site_title', '"ILM — Islamic League of Murabbiyūn"'::jsonb),
  ('contact_email', '"hello@ilm.org"'::jsonb),
  ('contact_phone', '""'::jsonb),
  ('featured_article_id', 'null'::jsonb),
  ('announcement_on', 'true'::jsonb),
  ('announcement_text', '"New essays this week — read the latest from our Murabbiyūn."'::jsonb),
  ('disclaimer_text', '"The articles published on ILM reflect the views of their respective authors and do not necessarily represent the position of the Islamic League of Murabbiyūn. All content is provided for educational purposes. Readers are encouraged to consult qualified scholars for specific religious guidance."'::jsonb)
on conflict (key) do nothing;

-- -----------------------------------------------------------------------------
-- activity_log (insert only)
-- -----------------------------------------------------------------------------
create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id) on delete set null,
  actor_name text not null default 'System',
  action text not null,
  entity_type text not null default '',
  entity_id uuid,
  entity_label text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists activity_log_created_at_idx on public.activity_log (created_at desc);

-- -----------------------------------------------------------------------------
-- Storage buckets
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true), ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.articles enable row level security;
alter table public.article_revisions enable row level security;
alter table public.article_tags enable row level security;
alter table public.questions enable row level security;
alter table public.subscribers enable row level security;
alter table public.media enable row level security;
alter table public.site_settings enable row level security;
alter table public.activity_log enable row level security;

-- Profiles
drop policy if exists "Public read active profiles" on public.profiles;
create policy "Public read active profiles" on public.profiles for select
  using (is_active = true or auth.uid() = id or public.is_editor_or_admin());

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles for update
  using (auth.uid() = id or public.is_admin());

drop policy if exists "Admins insert profiles" on public.profiles;
create policy "Admins insert profiles" on public.profiles for insert
  with check (public.is_admin() or auth.uid() = id);

-- Categories / Tags
drop policy if exists "Public read categories" on public.categories;
create policy "Public read categories" on public.categories for select using (true);
drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories" on public.categories for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read tags" on public.tags;
create policy "Public read tags" on public.tags for select using (true);
drop policy if exists "Admins manage tags" on public.tags;
create policy "Admins manage tags" on public.tags for all
  using (public.is_admin()) with check (public.is_admin());

-- Articles
drop policy if exists "Public read published articles" on public.articles;
create policy "Public read published articles" on public.articles for select
  using (
    status = 'published'
    or author_id = auth.uid()
    or public.is_editor_or_admin()
  );

drop policy if exists "Staff insert articles" on public.articles;
create policy "Staff insert articles" on public.articles for insert
  with check (public.is_staff() and (author_id = auth.uid() or public.is_editor_or_admin()));

drop policy if exists "Authors update own drafts" on public.articles;
create policy "Authors update own drafts" on public.articles for update
  using (
    public.is_editor_or_admin()
    or (author_id = auth.uid() and status in ('draft', 'returned', 'submitted'))
  );

drop policy if exists "Authors delete own drafts" on public.articles;
create policy "Authors delete own drafts" on public.articles for delete
  using (public.is_admin() or (author_id = auth.uid() and status in ('draft', 'returned')));

-- Revisions
drop policy if exists "Staff read revisions" on public.article_revisions;
create policy "Staff read revisions" on public.article_revisions for select using (public.is_staff());
drop policy if exists "Staff insert revisions" on public.article_revisions;
create policy "Staff insert revisions" on public.article_revisions for insert with check (public.is_staff());

-- Article tags
drop policy if exists "Public read article_tags" on public.article_tags;
create policy "Public read article_tags" on public.article_tags for select using (true);
drop policy if exists "Staff manage article_tags" on public.article_tags;
create policy "Staff manage article_tags" on public.article_tags for all
  using (public.is_staff()) with check (public.is_staff());

-- Questions
drop policy if exists "Anyone submit questions" on public.questions;
create policy "Anyone submit questions" on public.questions for insert with check (true);
drop policy if exists "Staff read questions" on public.questions;
create policy "Staff read questions" on public.questions for select using (public.is_staff());
drop policy if exists "Staff update questions" on public.questions;
create policy "Staff update questions" on public.questions for update using (public.is_staff());
drop policy if exists "Admins delete questions" on public.questions;
create policy "Admins delete questions" on public.questions for delete using (public.is_admin());

-- Subscribers
drop policy if exists "Anyone subscribe" on public.subscribers;
create policy "Anyone subscribe" on public.subscribers for insert with check (true);
drop policy if exists "Admins manage subscribers" on public.subscribers;
create policy "Admins manage subscribers" on public.subscribers for all
  using (public.is_admin()) with check (public.is_admin());

-- Media
drop policy if exists "Public read media" on public.media;
create policy "Public read media" on public.media for select using (true);
drop policy if exists "Staff manage media" on public.media;
create policy "Staff manage media" on public.media for all
  using (public.is_staff()) with check (public.is_staff());

-- Settings
drop policy if exists "Public read settings" on public.site_settings;
create policy "Public read settings" on public.site_settings for select using (true);
drop policy if exists "Admins manage settings" on public.site_settings;
create policy "Admins manage settings" on public.site_settings for all
  using (public.is_admin()) with check (public.is_admin());

-- Activity (insert + admin read)
drop policy if exists "Admins read activity" on public.activity_log;
create policy "Admins read activity" on public.activity_log for select using (public.is_admin());
drop policy if exists "Staff insert activity" on public.activity_log;
create policy "Staff insert activity" on public.activity_log for insert with check (public.is_staff());

-- Storage
drop policy if exists "Public read media bucket" on storage.objects;
create policy "Public read media bucket" on storage.objects for select using (bucket_id in ('media', 'avatars'));
drop policy if exists "Staff upload media bucket" on storage.objects;
create policy "Staff upload media bucket" on storage.objects for insert
  with check (bucket_id in ('media', 'avatars') and public.is_staff());
drop policy if exists "Staff update media bucket" on storage.objects;
create policy "Staff update media bucket" on storage.objects for update
  using (bucket_id in ('media', 'avatars') and public.is_staff());
drop policy if exists "Admins delete media bucket" on storage.objects;
create policy "Admins delete media bucket" on storage.objects for delete
  using (bucket_id in ('media', 'avatars') and public.is_admin());

-- -----------------------------------------------------------------------------
-- Seed data
-- -----------------------------------------------------------------------------
insert into public.categories (name, slug, description, display_order, color) values
  ('Qur''an & Tafsir', 'quran-tafsir', 'Revelation, recitation, and reflection on the Book of Allah.', 1, '#0F1657'),
  ('Spirituality', 'spirituality', 'The inner life, the heart''s work, and the path of purification.', 2, '#C9972E'),
  ('Islamic History', 'islamic-history', 'Memory, people, and places across the centuries.', 3, '#1a2380'),
  ('Character & Practice', 'character-practice', 'The art of living with ihsan, day by day.', 4, '#0F1657'),
  ('Law & Methodology', 'law-methodology', 'Usul al-fiqh, legal reasoning, and the schools of thought.', 5, '#C9972E'),
  ('Contemporary Issues', 'contemporary-issues', 'Faith in conversation with the modern world.', 6, '#1a2380')
on conflict (slug) do nothing;

insert into public.tags (name, slug) values
  ('intention', 'intention'),
  ('ramadan', 'ramadan'),
  ('prophetic-example', 'prophetic-example'),
  ('knowledge', 'knowledge'),
  ('community', 'community'),
  ('prayer', 'prayer'),
  ('patience', 'patience'),
  ('gratitude', 'gratitude')
on conflict (slug) do nothing;

insert into public.media (file_name, file_url, mime_type, size_bytes, alt_text)
select * from (values
  ('quran-open.jpg', 'https://images.pexels.com/photos/8164532/pexels-photo-8164532.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'image/jpeg', 2400000, 'Open Quran'),
  ('warm-light.jpg', 'https://images.pexels.com/photos/36516083/pexels-photo-36516083.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'image/jpeg', 3100000, 'Warm light reading'),
  ('reading-light.jpg', 'https://images.pexels.com/photos/33750569/pexels-photo-33750569.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'image/jpeg', 1800000, 'Reading by light'),
  ('arches-detail.jpg', 'https://images.pexels.com/photos/15129765/pexels-photo-15129765.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'image/jpeg', 4200000, 'Mosque arches'),
  ('mosque-arches.jpg', 'https://images.pexels.com/photos/19213544/pexels-photo-19213544.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'image/jpeg', 3700000, 'Mosque arches detail'),
  ('sunlit-archway.jpg', 'https://images.pexels.com/photos/15234829/pexels-photo-15234829.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'image/jpeg', 2900000, 'Sunlit archway'),
  ('scholar-portrait.jpg', 'https://images.pexels.com/photos/14819810/pexels-photo-14819810.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 'image/jpeg', 1500000, 'Scholar portrait'),
  ('library-portrait.jpg', 'https://images.pexels.com/photos/16029777/pexels-photo-16029777.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 'image/jpeg', 2100000, 'Library portrait')
) as v(file_name, file_url, mime_type, size_bytes, alt_text)
where not exists (select 1 from public.media m where m.file_name = v.file_name);

insert into public.subscribers (email, confirmed_at, source) values
  ('reader1@email.com', '2024-08-28', 'website'),
  ('student2@email.com', '2024-08-26', 'website'),
  ('seeker3@email.com', '2024-08-20', 'website'),
  ('mused4@email.com', '2024-08-15', 'website'),
  ('wanderer6@email.com', '2024-08-05', 'website')
on conflict (email) do nothing;

-- Promote test admin after Auth user exists:
-- update public.profiles set role = 'admin', full_name = 'Admin', is_active = true
-- where email = 'adminops@gmail.com';
