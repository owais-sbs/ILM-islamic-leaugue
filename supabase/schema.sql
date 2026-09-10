-- =============================================================================
-- ILM — FULL SCHEMA (Developer Spec) — run once in Supabase SQL Editor
-- After this succeeds, run locally: npm run db:demo-users
-- Demo logins:
--   Admin  adminops@gmail.com / admin123
--   Editor editor.smoke@ilm.test / editor123
--   Author author.smoke@ilm.test / author123
-- =============================================================================


-- >>> 20260310000001_extensions_enums.sql
-- =============================================================================
-- 20260310000001_extensions_enums.sql
-- Extensions + shared enums for ILM (Developer Spec)
-- =============================================================================

create extension if not exists "pgcrypto";

do $$ begin
  create type public.user_role as enum ('author', 'editor', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.article_status as enum (
    'draft',
    'submitted',
    'approved',
    'published',
    'returned'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.question_status as enum (
    'new',
    'assigned',
    'answered',
    'archived'
  );
exception when duplicate_object then null;
end $$;

-- >>> 20260310000002_profiles.sql
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

-- >>> 20260310000003_taxonomy.sql
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

-- >>> 20260310000004_articles.sql
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

-- >>> 20260310000005_article_revisions_tags.sql
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

-- >>> 20260310000006_engagement_system.sql
-- =============================================================================
-- 20260310000006_engagement_system.sql
-- questions, subscribers, media, site_settings, activity_log
-- =============================================================================

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  body text not null,
  category text,
  status public.question_status not null default 'new',
  assigned_to uuid references public.profiles (id) on delete set null,
  answer_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists questions_status_idx on public.questions (status);
create index if not exists questions_assigned_to_idx on public.questions (assigned_to);

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subscribers_email_unique unique (email)
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  path text,
  filename text not null,
  mime_type text,
  size_bytes bigint,
  alt_text text,
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists media_uploaded_by_idx on public.media (uploaded_by);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists activity_log_created_at_idx
  on public.activity_log (created_at desc);
create index if not exists activity_log_entity_idx
  on public.activity_log (entity_type, entity_id);

-- >>> 20260310000007_helpers_updated_at_search.sql
-- =============================================================================
-- 20260310000007_helpers_updated_at_search.sql
-- Role helpers, updated_at trigger, search_vector generation
-- =============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid() and is_active = true;
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active = true
      and role in ('author', 'editor', 'admin')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active = true and role = 'admin'
  );
$$;

create or replace function public.is_editor_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active = true and role in ('editor', 'admin')
  );
$$;

create or replace function public.articles_set_search_vector()
returns trigger
language plpgsql
as $$
begin
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(new.body_text, '')), 'C');
  return new;
end;
$$;

-- updated_at triggers
do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles', 'categories', 'tags', 'articles', 'article_revisions',
    'article_tags', 'questions', 'subscribers', 'media', 'site_settings', 'activity_log'
  ]
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format(
      'create trigger set_updated_at before update on public.%I
       for each row execute function public.set_updated_at()',
      t
    );
  end loop;
end $$;

drop trigger if exists articles_search_vector_trg on public.articles;
create trigger articles_search_vector_trg
  before insert or update of title, excerpt, body_text
  on public.articles
  for each row execute function public.articles_set_search_vector();

-- >>> 20260310000008_triggers_workflow.sql
-- =============================================================================
-- 20260310000008_triggers_workflow.sql
-- Profile bootstrap, article workflow guards, revisions, activity log,
-- published_at preservation
-- =============================================================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_slug text;
  final_slug text;
  n int := 0;
begin
  base_slug := lower(regexp_replace(
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), 'user'),
    '[^a-z0-9]+', '-', 'g'
  ));
  base_slug := trim(both '-' from base_slug);
  if base_slug = '' then base_slug := 'user'; end if;
  final_slug := base_slug;

  while exists (select 1 from public.profiles where slug = final_slug) loop
    n := n + 1;
    final_slug := base_slug || '-' || n::text;
  end loop;

  insert into public.profiles (id, email, full_name, slug, role, is_active, email_public)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    final_slug,
    case
      when lower(new.email) = 'adminops@gmail.com' then 'admin'::public.user_role
      when coalesce(new.raw_user_meta_data->>'role', '') = 'admin' then 'admin'::public.user_role
      when coalesce(new.raw_user_meta_data->>'role', '') = 'editor' then 'editor'::public.user_role
      else 'author'::public.user_role
    end,
    true,
    new.email
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Block non-admins from changing role / is_active on profiles
create or replace function public.profiles_guard_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_role public.user_role;
begin
  if tg_op = 'UPDATE'
     and (old.role is distinct from new.role or old.is_active is distinct from new.is_active) then
    select role into actor_role from public.profiles where id = auth.uid();
    if actor_role is distinct from 'admin' then
      raise exception 'ILM: only administrators can change roles or active status';
    end if;

    insert into public.activity_log (actor_id, action, entity_type, entity_id, meta)
    values (
      auth.uid(),
      case when old.role is distinct from new.role then 'role_change' else 'profile_active_change' end,
      'profiles',
      new.id,
      jsonb_build_object(
        'old_role', old.role,
        'new_role', new.role,
        'old_active', old.is_active,
        'new_active', new.is_active
      )
    );
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard_role_change on public.profiles;
create trigger profiles_guard_role_change
  before update on public.profiles
  for each row execute function public.profiles_guard_role_change();

-- Article workflow + published_at + activity
create or replace function public.articles_enforce_workflow()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_role public.user_role;
  actor_id uuid := auth.uid();
begin
  select role into actor_role
  from public.profiles
  where id = actor_id and is_active = true;

  -- Service role / SQL Editor bootstrap (no JWT): skip enforcement
  if actor_id is null then
    if tg_op = 'UPDATE' and old.published_at is not null then
      new.published_at := old.published_at;
    end if;
    if tg_op = 'UPDATE'
       and old.status is distinct from 'published'
       and new.status = 'published'
       and new.published_at is null then
      new.published_at := now();
    end if;
    return new;
  end if;

  if actor_role is null then
    raise exception 'ILM: no active staff profile';
  end if;

  -- Preserve first published_at forever
  if tg_op = 'UPDATE' then
    if old.published_at is not null then
      new.published_at := old.published_at;
    end if;
  end if;

  if tg_op = 'INSERT' then
    if new.status is distinct from 'draft' then
      raise exception 'ILM: new articles must start as draft';
    end if;
    if actor_role = 'author' and new.author_id is distinct from actor_id then
      raise exception 'ILM: authors can only create their own articles';
    end if;
    if new.author_id is null then
      new.author_id := actor_id;
    end if;

    insert into public.activity_log (actor_id, action, entity_type, entity_id, meta)
    values (actor_id, 'article_created', 'articles', new.id,
      jsonb_build_object('status', new.status, 'title', new.title));
    return new;
  end if;

  -- UPDATE status transitions
  if old.status is distinct from new.status then
    -- Author rules
    if actor_role = 'author' then
      if new.author_id is distinct from actor_id or old.author_id is distinct from actor_id then
        raise exception 'ILM: authors can only change their own articles';
      end if;
      if not (
        (old.status in ('draft', 'returned') and new.status = 'submitted')
      ) then
        raise exception 'ILM: authors can only submit draft/returned → submitted (no approve/publish)';
      end if;
      new.submitted_at := coalesce(new.submitted_at, now());
      new.review_notes := null;
    end if;

    -- Editor rules
    if actor_role = 'editor' then
      if new.status = 'published' then
        raise exception 'ILM: editors cannot publish — Administrator has final publishing authority';
      end if;
      if old.status = 'published' then
        raise exception 'ILM: editors cannot unpublish';
      end if;
      if old.status = 'submitted' and new.status = 'approved' then
        new.approved_by := actor_id;
        new.review_notes := coalesce(new.review_notes, '');
      elsif old.status = 'submitted' and new.status = 'returned' then
        if coalesce(trim(new.review_notes), '') = '' then
          raise exception 'ILM: return requires review_notes';
        end if;
      elsif old.status = 'approved' and new.status = 'returned' then
        if coalesce(trim(new.review_notes), '') = '' then
          raise exception 'ILM: return requires review_notes';
        end if;
      else
        -- allow content edits without status change already handled; block other transitions
        raise exception 'ILM: editors may only approve or return submitted (or return approved) articles';
      end if;
    end if;

    -- Admin rules — final publishing authority
    if actor_role = 'admin' then
      if new.status = 'returned' and coalesce(trim(new.review_notes), '') = ''
         and old.status is distinct from 'returned' then
        raise exception 'ILM: return requires review_notes';
      end if;
      if old.status is distinct from 'published' and new.status = 'published' then
        if new.published_at is null then
          new.published_at := now();
        end if;
      end if;
      if new.status = 'approved' and old.status = 'submitted' then
        new.approved_by := coalesce(new.approved_by, actor_id);
      end if;
      if new.status = 'submitted' then
        new.submitted_at := coalesce(new.submitted_at, now());
      end if;
    end if;

    insert into public.activity_log (actor_id, action, entity_type, entity_id, meta)
    values (
      actor_id,
      case
        when new.status = 'published' then 'article_published'
        when old.status = 'published' and new.status = 'approved' then 'article_unpublished'
        when new.status = 'approved' then 'article_approved'
        when new.status = 'returned' then 'article_returned'
        when new.status = 'submitted' then 'article_submitted'
        else 'article_status_change'
      end,
      'articles',
      new.id,
      jsonb_build_object('from', old.status, 'to', new.status, 'title', new.title)
    );
  else
    -- Non-status updates: authors may only edit own draft/returned content
    if actor_role = 'author' then
      if old.author_id is distinct from actor_id then
        raise exception 'ILM: authors can only edit their own articles';
      end if;
      if old.status not in ('draft', 'returned') then
        raise exception 'ILM: authors can only edit draft or returned articles';
      end if;
      -- lock status / author_id
      new.status := old.status;
      new.author_id := old.author_id;
      new.published_at := old.published_at;
    end if;

    if actor_role = 'editor' then
      -- editors cannot sneak publish via content update
      new.status := old.status;
      if old.status = 'published' then
        new.published_at := old.published_at;
      end if;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists articles_enforce_workflow on public.articles;
create trigger articles_enforce_workflow
  before insert or update on public.articles
  for each row execute function public.articles_enforce_workflow();

-- Snapshot revision on every save
create or replace function public.articles_snapshot_revision()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.article_revisions (article_id, title, body_html, excerpt, edited_by)
  values (new.id, new.title, new.body_html, new.excerpt, auth.uid());
  return new;
end;
$$;

drop trigger if exists articles_snapshot_revision on public.articles;
create trigger articles_snapshot_revision
  after insert or update of title, body_html, excerpt, footnotes, seo_title, seo_description, featured_image_url
  on public.articles
  for each row execute function public.articles_snapshot_revision();

-- >>> 20260310000009_rls_policies.sql
-- =============================================================================
-- 20260310000009_rls_policies.sql
-- RLS exactly matching Developer Spec permission matrix
-- =============================================================================

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

-- Drop existing policies if re-run
do $$
declare r record;
begin
  for r in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'profiles','categories','tags','articles','article_revisions','article_tags',
        'questions','subscribers','media','site_settings','activity_log'
      )
  loop
    execute format('drop policy if exists %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

-- ---------- profiles ----------
create policy profiles_anon_read_active
  on public.profiles for select to anon, authenticated
  using (is_active = true);

create policy profiles_self_update
  on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (
    (id = auth.uid() and role = (select role from public.profiles p where p.id = auth.uid()))
    or public.is_admin()
  );

create policy profiles_admin_insert
  on public.profiles for insert to authenticated
  with check (public.is_admin() or id = auth.uid());

create policy profiles_admin_delete
  on public.profiles for delete to authenticated
  using (public.is_admin());

-- ---------- categories / tags ----------
create policy categories_public_read
  on public.categories for select to anon, authenticated
  using (true);

create policy categories_admin_write
  on public.categories for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy tags_public_read
  on public.tags for select to anon, authenticated
  using (true);

create policy tags_admin_write
  on public.tags for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- articles ----------
create policy articles_anon_read_published
  on public.articles for select to anon
  using (status = 'published');

create policy articles_staff_read
  on public.articles for select to authenticated
  using (
    public.is_editor_or_admin()
    or (public.current_user_role() = 'author' and author_id = auth.uid())
    or status = 'published'
  );

create policy articles_insert_staff
  on public.articles for insert to authenticated
  with check (
    public.is_staff()
    and (
      public.is_editor_or_admin()
      or (public.current_user_role() = 'author' and author_id = auth.uid() and status = 'draft')
    )
  );

create policy articles_update_staff
  on public.articles for update to authenticated
  using (
    public.is_editor_or_admin()
    or (
      public.current_user_role() = 'author'
      and author_id = auth.uid()
      and status in ('draft', 'returned', 'submitted')
    )
  )
  with check (
    public.is_admin()
    or (
      public.current_user_role() = 'editor'
      and status in ('draft', 'submitted', 'approved', 'returned')
    )
    or (
      public.current_user_role() = 'author'
      and author_id = auth.uid()
      and status in ('draft', 'returned', 'submitted')
    )
  );

create policy articles_delete_admin
  on public.articles for delete to authenticated
  using (public.is_admin());

-- ---------- article_revisions ----------
create policy revisions_staff_read
  on public.article_revisions for select to authenticated
  using (
    public.is_editor_or_admin()
    or exists (
      select 1 from public.articles a
      where a.id = article_id and a.author_id = auth.uid()
    )
  );

create policy revisions_staff_insert
  on public.article_revisions for insert to authenticated
  with check (public.is_staff());

-- ---------- article_tags ----------
create policy article_tags_public_read_published
  on public.article_tags for select to anon, authenticated
  using (
    exists (
      select 1 from public.articles a
      where a.id = article_id
        and (a.status = 'published' or public.is_staff())
    )
  );

create policy article_tags_staff_write
  on public.article_tags for all to authenticated
  using (
    public.is_editor_or_admin()
    or exists (
      select 1 from public.articles a
      where a.id = article_id
        and a.author_id = auth.uid()
        and a.status in ('draft', 'returned')
    )
  )
  with check (
    public.is_editor_or_admin()
    or exists (
      select 1 from public.articles a
      where a.id = article_id
        and a.author_id = auth.uid()
        and a.status in ('draft', 'returned')
    )
  );

-- ---------- questions ----------
create policy questions_anon_insert
  on public.questions for insert to anon, authenticated
  with check (true);

create policy questions_staff_read
  on public.questions for select to authenticated
  using (
    public.is_editor_or_admin()
    or (public.current_user_role() = 'author' and assigned_to = auth.uid())
  );

create policy questions_staff_update
  on public.questions for update to authenticated
  using (
    public.is_editor_or_admin()
    or (public.current_user_role() = 'author' and assigned_to = auth.uid())
  )
  with check (
    public.is_editor_or_admin()
    or (public.current_user_role() = 'author' and assigned_to = auth.uid())
  );

create policy questions_admin_delete
  on public.questions for delete to authenticated
  using (public.is_admin());

-- ---------- subscribers ----------
create policy subscribers_anon_insert
  on public.subscribers for insert to anon, authenticated
  with check (true);

create policy subscribers_admin_read
  on public.subscribers for select to authenticated
  using (public.is_admin());

create policy subscribers_admin_update
  on public.subscribers for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy subscribers_admin_delete
  on public.subscribers for delete to authenticated
  using (public.is_admin());

-- ---------- media ----------
create policy media_staff_read
  on public.media for select to authenticated
  using (public.is_staff());

create policy media_staff_insert
  on public.media for insert to authenticated
  with check (public.is_staff() and uploaded_by = auth.uid());

create policy media_admin_delete
  on public.media for delete to authenticated
  using (public.is_admin() or uploaded_by = auth.uid());

-- ---------- site_settings ----------
create policy settings_public_read
  on public.site_settings for select to anon, authenticated
  using (true);

create policy settings_admin_write
  on public.site_settings for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- activity_log ----------
create policy activity_admin_read
  on public.activity_log for select to authenticated
  using (public.is_admin());

create policy activity_staff_insert
  on public.activity_log for insert to authenticated
  with check (public.is_staff());

-- Immutable: no update/delete for anyone via RLS (admins use service role if needed)

-- >>> 20260310000010_storage.sql
-- =============================================================================
-- 20260310000010_storage.sql
-- Buckets: media, avatars (public read), private (admin-only)
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'media',
    'media',
    true,
    5242880,
    array['image/jpeg','image/png','image/webp','image/gif','image/svg+xml']
  ),
  (
    'avatars',
    'avatars',
    true,
    5242880,
    array['image/jpeg','image/png','image/webp','image/gif']
  ),
  (
    'private',
    'private',
    false,
    10485760,
    null
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Clean old storage policies for these buckets
do $$
declare r record;
begin
  for r in
    select policyname
    from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname like 'ilm_%'
  loop
    execute format('drop policy if exists %I on storage.objects', r.policyname);
  end loop;
end $$;

create policy ilm_media_public_read
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'media');

create policy ilm_media_staff_upload
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'media'
    and public.is_staff()
  );

create policy ilm_media_staff_update
  on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_staff())
  with check (bucket_id = 'media' and public.is_staff());

create policy ilm_media_staff_delete
  on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (public.is_admin() or owner = auth.uid()));

create policy ilm_avatars_public_read
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'avatars');

create policy ilm_avatars_staff_upload
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and public.is_staff());

create policy ilm_avatars_staff_update
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (public.is_staff()))
  with check (bucket_id = 'avatars' and public.is_staff());

create policy ilm_avatars_staff_delete
  on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (public.is_admin() or owner = auth.uid()));

create policy ilm_private_admin_all
  on storage.objects for all to authenticated
  using (bucket_id = 'private' and public.is_admin())
  with check (bucket_id = 'private' and public.is_admin());

-- >>> 20260310000011_seed_taxonomy_settings.sql
-- =============================================================================
-- 20260310000011_seed_taxonomy_settings.sql
-- Safe seed data (no auth users — create those via scripts/ensure-demo-users.mjs)
-- =============================================================================

insert into public.categories (name, slug, description, display_order)
values
  ('Aqidah', 'aqidah', 'Matters of belief and creed', 1),
  ('Fiqh', 'fiqh', 'Jurisprudence and practice', 2),
  ('Tarbiyah', 'tarbiyah', 'Character and cultivation', 3),
  ('History', 'history', 'Islamic history and biography', 4),
  ('Spirituality', 'spirituality', 'Ihsan and the inner life', 5)
on conflict (slug) do nothing;

insert into public.tags (name, slug)
values
  ('Seeking Knowledge', 'seeking-knowledge'),
  ('Character', 'character'),
  ('Mercy', 'mercy'),
  ('Family', 'family'),
  ('Prayer', 'prayer')
on conflict (slug) do nothing;

insert into public.site_settings (key, value)
values
  ('site_title', '"Islamic League of Murabbiyūn"'::jsonb),
  ('contact_email', '"info@islamicleague.org"'::jsonb),
  ('contact_phone', '""'::jsonb),
  ('disclaimer', '"Content is for educational purposes and does not constitute a fatwa."'::jsonb),
  ('featured_article_id', 'null'::jsonb),
  ('announcement_banner', '""'::jsonb)
on conflict (key) do nothing;

-- Promote adminops@gmail.com if that Auth user already exists
update public.profiles
set role = 'admin', is_active = true, full_name = coalesce(nullif(full_name, ''), 'Admin Director')
where lower(email) = 'adminops@gmail.com';
