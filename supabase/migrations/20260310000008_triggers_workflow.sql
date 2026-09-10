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
