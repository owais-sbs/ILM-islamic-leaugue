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
