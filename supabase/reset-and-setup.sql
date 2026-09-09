-- =============================================================================
-- ILM — RESET + FULL SETUP (Developer Spec v1.0)
-- Run ONCE in Supabase SQL Editor to wipe old tables and recreate everything.
-- Includes strong RLS for Author / Editor / Administrator.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- 0) DROP OLD OBJECTS (safe order)
-- -----------------------------------------------------------------------------
drop trigger if exists on_auth_user_created on auth.users;

drop table if exists public.activity_log cascade;
drop table if exists public.article_revisions cascade;
drop table if exists public.article_tags cascade;
drop table if exists public.articles cascade;
drop table if exists public.questions cascade;
drop table if exists public.subscribers cascade;
drop table if exists public.media cascade;
drop table if exists public.site_settings cascade;
drop table if exists public.tags cascade;
drop table if exists public.categories cascade;
drop table if exists public.profiles cascade;

drop function if exists public.handle_new_user() cascade;
drop function if exists public.set_updated_at() cascade;
drop function if exists public.articles_search_vector_update() cascade;
drop function if exists public.snapshot_article_revision() cascade;
drop function if exists public.current_user_role() cascade;
drop function if exists public.is_staff() cascade;
drop function if exists public.is_admin() cascade;
drop function if exists public.is_editor_or_admin() cascade;
drop function if exists public.is_author() cascade;
drop function if exists public.can_edit_article(uuid) cascade;
drop function if exists public.enforce_article_workflow() cascade;
drop function if exists public.enforce_profile_security() cascade;

-- -----------------------------------------------------------------------------
-- 1) HELPERS
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- 2) PROFILES (must exist before role helpers)
-- -----------------------------------------------------------------------------
create table public.profiles (
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

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role, email_public, slug)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(coalesce(new.email, 'user'), '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'author'),
    coalesce(new.email, ''),
    lower(regexp_replace(coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email, 'user'), '@', 1)), '[^a-zA-Z0-9]+', '-', 'g'))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Role helpers (PDF §7 — UI + RLS)
create or replace function public.current_user_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid() and is_active = true;
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active and role in ('author', 'editor', 'admin')
  );
$$;

create or replace function public.is_author()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active and role = 'author'
  );
$$;

create or replace function public.is_editor_or_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active and role in ('editor', 'admin')
  );
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active and role = 'admin'
  );
$$;

-- -----------------------------------------------------------------------------
-- 3) CATEGORIES / TAGS
-- -----------------------------------------------------------------------------
create table public.categories (
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
create trigger categories_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger tags_updated_at
  before update on public.tags
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 4) ARTICLES + REVISIONS + TAGS
-- -----------------------------------------------------------------------------
create table public.articles (
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

create index articles_status_published_idx on public.articles (status, published_at desc);
create index articles_author_idx on public.articles (author_id);
create index articles_category_idx on public.articles (category_id);
create index articles_search_vector_idx on public.articles using gin (search_vector);

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

create trigger articles_search_vector_trigger
  before insert or update of title, excerpt, body_html
  on public.articles
  for each row execute function public.articles_search_vector_update();

create table public.article_revisions (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles (id) on delete cascade,
  body_html text not null default '',
  title text not null default '',
  edited_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index article_revisions_article_idx on public.article_revisions (article_id, created_at desc);

create or replace function public.snapshot_article_revision()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.article_revisions (article_id, body_html, title, edited_by)
  values (new.id, new.body_html, new.title, auth.uid());
  return new;
end;
$$;

create trigger articles_revision_snapshot
  after insert or update of body_html, title
  on public.articles
  for each row execute function public.snapshot_article_revision();

create table public.article_tags (
  article_id uuid not null references public.articles (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (article_id, tag_id)
);

-- Helper: who may edit a given article row
create or replace function public.can_edit_article(p_author_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select
    public.is_editor_or_admin()
    or (auth.uid() = p_author_id and public.is_staff());
$$;

-- -----------------------------------------------------------------------------
-- 5) QUESTIONS / SUBSCRIBERS / MEDIA / SETTINGS / ACTIVITY
-- -----------------------------------------------------------------------------
create table public.questions (
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
create trigger questions_updated_at
  before update on public.questions
  for each row execute function public.set_updated_at();

create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger subscribers_updated_at
  before update on public.subscribers
  for each row execute function public.set_updated_at();

create table public.media (
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
create trigger media_updated_at
  before update on public.media
  for each row execute function public.set_updated_at();

create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

create table public.activity_log (
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
create index activity_log_created_at_idx on public.activity_log (created_at desc);

-- Storage buckets
insert into storage.buckets (id, name, public)
values ('media', 'media', true), ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- 6) RLS — PDF §7 matrix (Author / Editor / Admin)
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

-- PROFILES
create policy "public_read_active_profiles" on public.profiles for select
  using (is_active = true or auth.uid() = id or public.is_editor_or_admin());
create policy "users_update_own_profile" on public.profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());
create policy "admins_insert_profiles" on public.profiles for insert
  with check (public.is_admin() or auth.uid() = id);
create policy "admins_delete_profiles" on public.profiles for delete
  using (public.is_admin());

-- Prevent non-admins from escalating role / toggling is_active (PDF §7)
create or replace function public.enforce_profile_security()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return new;
  end if;

  if not public.is_admin() then
    if new.role is distinct from old.role then
      raise exception 'ILM: only administrators can change roles';
    end if;
    if new.is_active is distinct from old.is_active then
      raise exception 'ILM: only administrators can activate or deactivate users';
    end if;
    if new.id is distinct from auth.uid() then
      raise exception 'ILM: you can only edit your own profile';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_enforce_security on public.profiles;
create trigger profiles_enforce_security
  before update on public.profiles
  for each row execute function public.enforce_profile_security();

-- CATEGORIES / TAGS — public read; admin manage only
create policy "public_read_categories" on public.categories for select using (true);
create policy "admin_manage_categories" on public.categories for all
  using (public.is_admin()) with check (public.is_admin());

create policy "public_read_tags" on public.tags for select using (true);
create policy "admin_manage_tags" on public.tags for all
  using (public.is_admin()) with check (public.is_admin());

-- ARTICLES
-- Public: published only
-- Author: own rows
-- Editor/Admin: all
create policy "articles_select" on public.articles for select
  using (
    status = 'published'
    or author_id = auth.uid()
    or public.is_editor_or_admin()
  );

-- Insert: staff; authors may only insert as themselves
create policy "articles_insert" on public.articles for insert
  with check (
    public.is_staff()
    and (
      public.is_editor_or_admin()
      or author_id = auth.uid()
    )
  );

-- Update rules (PDF workflow):
-- Author: own drafts/returned/submitted only; cannot set published/approved
-- Editor: any article; can set draft/submitted/approved/returned (NOT published)
-- Admin: any status including published
create policy "articles_update_author" on public.articles for update
  using (
    author_id = auth.uid()
    and status in ('draft', 'returned', 'submitted')
    and public.is_staff()
  )
  with check (
    author_id = auth.uid()
    and status in ('draft', 'returned', 'submitted')
  );

create policy "articles_update_editor" on public.articles for update
  using (public.current_user_role() = 'editor')
  with check (status in ('draft', 'submitted', 'approved', 'returned'));

create policy "articles_update_admin" on public.articles for update
  using (public.is_admin())
  with check (true);

create policy "articles_delete" on public.articles for delete
  using (
    public.is_admin()
    or (author_id = auth.uid() and status in ('draft', 'returned'))
  );

-- Belt-and-suspenders: enforce PDF workflow even if a policy is misconfigured.
-- Author → draft/submitted/returned only
-- Editor → may approve/return, NEVER publish
-- Admin → final publish authority; published_at set once and preserved
create or replace function public.enforce_article_workflow()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  r text;
begin
  -- Service role / system jobs (no JWT) may pass through
  if auth.uid() is null then
    if new.status = 'published' and (tg_op = 'INSERT' or old.status is distinct from 'published') then
      if new.published_at is null then
        new.published_at := now();
      end if;
    end if;
    return new;
  end if;

  r := public.current_user_role();

  if r is null then
    raise exception 'ILM: inactive or missing profile role';
  end if;

  -- First publish timestamp (PDF: set on first publication, preserve later)
  if new.status = 'published' then
    if tg_op = 'INSERT' or old.status is distinct from 'published' then
      if new.published_at is null then
        new.published_at := now();
      end if;
    elsif old.published_at is not null then
      new.published_at := old.published_at;
    end if;
  end if;

  if r = 'author' then
    if new.author_id is distinct from auth.uid() then
      raise exception 'ILM: authors may only edit their own articles';
    end if;
    if new.status not in ('draft', 'submitted', 'returned') then
      raise exception 'ILM: authors cannot set status to % (no approve/publish)', new.status;
    end if;
    if tg_op = 'UPDATE' and old.status not in ('draft', 'submitted', 'returned') then
      raise exception 'ILM: authors cannot edit articles in status %', old.status;
    end if;
  elsif r = 'editor' then
    if new.status = 'published' then
      raise exception 'ILM: editors cannot publish — Administrator has final publishing authority';
    end if;
  elsif r <> 'admin' then
    raise exception 'ILM: unknown role %', r;
  end if;

  return new;
end;
$$;

drop trigger if exists articles_enforce_workflow on public.articles;
create trigger articles_enforce_workflow
  before insert or update on public.articles
  for each row execute function public.enforce_article_workflow();

-- REVISIONS
create policy "revisions_select_staff" on public.article_revisions for select
  using (public.is_staff());
create policy "revisions_insert_staff" on public.article_revisions for insert
  with check (public.is_staff());

-- ARTICLE_TAGS
create policy "article_tags_select" on public.article_tags for select using (true);
create policy "article_tags_manage" on public.article_tags for all
  using (public.is_staff()) with check (public.is_staff());

-- QUESTIONS
-- Public insert only; no public read
create policy "questions_insert_anyone" on public.questions for insert with check (true);

-- Editor/Admin: all questions
create policy "questions_select_editor_admin" on public.questions for select
  using (public.is_editor_or_admin());

-- Author: assigned only (PDF: Assigned only)
create policy "questions_select_assigned_author" on public.questions for select
  using (assigned_to = auth.uid() and public.is_author());

create policy "questions_update_editor_admin" on public.questions for update
  using (public.is_editor_or_admin());

create policy "questions_update_assigned_author" on public.questions for update
  using (assigned_to = auth.uid() and public.is_author())
  with check (assigned_to = auth.uid());

create policy "questions_delete_admin" on public.questions for delete
  using (public.is_admin());

-- SUBSCRIBERS — public insert; admin only otherwise
create policy "subscribers_insert_anyone" on public.subscribers for insert with check (true);
create policy "subscribers_admin_all" on public.subscribers for all
  using (public.is_admin()) with check (public.is_admin());

-- MEDIA — public read; staff write; admin delete
create policy "media_public_read" on public.media for select using (true);
create policy "media_staff_insert" on public.media for insert with check (public.is_staff());
create policy "media_staff_update" on public.media for update using (public.is_staff());
create policy "media_admin_delete" on public.media for delete using (public.is_admin());

-- SETTINGS — public read; admin write
create policy "settings_public_read" on public.site_settings for select using (true);
create policy "settings_admin_all" on public.site_settings for all
  using (public.is_admin()) with check (public.is_admin());

-- ACTIVITY — staff insert; admin read only (immutable)
create policy "activity_admin_read" on public.activity_log for select using (public.is_admin());
create policy "activity_staff_insert" on public.activity_log for insert with check (public.is_staff());

-- STORAGE (drop legacy + current policy names so re-runs are idempotent)
drop policy if exists "Public read media bucket" on storage.objects;
drop policy if exists "Staff upload media bucket" on storage.objects;
drop policy if exists "Staff update media bucket" on storage.objects;
drop policy if exists "Admins delete media bucket" on storage.objects;
drop policy if exists "storage_public_read" on storage.objects;
drop policy if exists "storage_staff_insert" on storage.objects;
drop policy if exists "storage_staff_update" on storage.objects;
drop policy if exists "storage_admin_delete" on storage.objects;

create policy "storage_public_read" on storage.objects for select
  using (bucket_id in ('media', 'avatars'));
create policy "storage_staff_insert" on storage.objects for insert
  with check (bucket_id in ('media', 'avatars') and public.is_staff());
create policy "storage_staff_update" on storage.objects for update
  using (bucket_id in ('media', 'avatars') and public.is_staff());
create policy "storage_admin_delete" on storage.objects for delete
  using (bucket_id in ('media', 'avatars') and public.is_admin());

-- Grants
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;

-- -----------------------------------------------------------------------------
-- 7) SEED
-- -----------------------------------------------------------------------------
insert into public.categories (name, slug, description, display_order, color) values
  ('Qur''an & Tafsir', 'quran-tafsir', 'Revelation, recitation, and reflection on the Book of Allah.', 1, '#0F1657'),
  ('Spirituality', 'spirituality', 'The inner life, the heart''s work, and the path of purification.', 2, '#C9972E'),
  ('Islamic History', 'islamic-history', 'Memory, people, and places across the centuries.', 3, '#1a2380'),
  ('Character & Practice', 'character-practice', 'The art of living with ihsan, day by day.', 4, '#0F1657'),
  ('Law & Methodology', 'law-methodology', 'Usul al-fiqh, legal reasoning, and the schools of thought.', 5, '#C9972E'),
  ('Contemporary Issues', 'contemporary-issues', 'Faith in conversation with the modern world.', 6, '#1a2380');

insert into public.tags (name, slug) values
  ('intention', 'intention'),
  ('ramadan', 'ramadan'),
  ('prophetic-example', 'prophetic-example'),
  ('knowledge', 'knowledge'),
  ('community', 'community'),
  ('prayer', 'prayer'),
  ('patience', 'patience'),
  ('gratitude', 'gratitude');

insert into public.site_settings (key, value) values
  ('site_title', '"ILM — Islamic League of Murabbiyūn"'::jsonb),
  ('contact_email', '"hello@ilm.org"'::jsonb),
  ('contact_phone', '""'::jsonb),
  ('featured_article_id', 'null'::jsonb),
  ('announcement_on', 'true'::jsonb),
  ('announcement_text', '"New essays this week — read the latest from our Murabbiyūn."'::jsonb),
  ('disclaimer_text', '"The articles published on ILM reflect the views of their respective authors and do not necessarily represent the position of the Islamic League of Murabbiyūn. All content is provided for educational purposes. Readers are encouraged to consult qualified scholars for specific religious guidance."'::jsonb);

insert into public.media (file_name, file_url, mime_type, size_bytes, alt_text) values
  ('quran-open.jpg', 'https://images.pexels.com/photos/8164532/pexels-photo-8164532.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'image/jpeg', 2400000, 'Open Quran'),
  ('warm-light.jpg', 'https://images.pexels.com/photos/36516083/pexels-photo-36516083.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'image/jpeg', 3100000, 'Warm light reading'),
  ('arches-detail.jpg', 'https://images.pexels.com/photos/15129765/pexels-photo-15129765.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'image/jpeg', 4200000, 'Mosque arches'),
  ('mosque-arches.jpg', 'https://images.pexels.com/photos/19213544/pexels-photo-19213544.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'image/jpeg', 3700000, 'Mosque arches detail'),
  ('scholar-portrait.jpg', 'https://images.pexels.com/photos/14819810/pexels-photo-14819810.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 'image/jpeg', 1500000, 'Scholar portrait');

-- Promote existing Auth user to admin (if present)
insert into public.profiles (id, email, full_name, role, is_active, email_public, slug)
select u.id, u.email, 'Admin', 'admin', true, u.email, 'admin'
from auth.users u
where lower(u.email) = 'adminops@gmail.com'
on conflict (id) do update
set role = 'admin', is_active = true, full_name = 'Admin';

-- =============================================================================
-- DONE
-- Permission matrix enforced in RLS:
-- Author  : own drafts, submit, assigned questions only
-- Editor  : all articles, approve/return, questions (NO publish)
-- Admin   : publish + taxonomy + users + subscribers + settings + activity
-- =============================================================================
