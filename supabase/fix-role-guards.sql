-- =============================================================================
-- ILM patch — run in Supabase SQL Editor WITHOUT wiping data
-- 1) Blocks non-admins from changing roles / is_active
-- 2) Safe to re-run
-- =============================================================================

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

-- Keep article workflow guard (no-op if already present)
create or replace function public.enforce_article_workflow()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  r text;
begin
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

-- Ensure adminops stays admin if present
update public.profiles
set role = 'admin', is_active = true
where lower(email) = 'adminops@gmail.com';
