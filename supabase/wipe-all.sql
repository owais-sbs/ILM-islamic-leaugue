-- =============================================================================
-- ILM — WIPE EVERYTHING in this Supabase project
-- Run in: Supabase Dashboard → SQL Editor → New query → Run
-- ⚠️  Irreversible. Deletes public tables, functions, storage files, and
--     optionally all Auth users so you can shift to a clean project.
-- After this, run:  supabase/schema.sql  then  supabase/admin-bootstrap.sql
-- =============================================================================

-- 1) Auth trigger that creates profiles
drop trigger if exists on_auth_user_created on auth.users;

-- 2) Drop ALL tables in public (covers extra/old tables too)
do $$
declare
  r record;
begin
  for r in
    select tablename
    from pg_tables
    where schemaname = 'public'
  loop
    execute format('drop table if exists public.%I cascade', r.tablename);
  end loop;
end $$;

-- 3) Drop ALL views in public
do $$
declare
  r record;
begin
  for r in
    select table_name
    from information_schema.views
    where table_schema = 'public'
  loop
    execute format('drop view if exists public.%I cascade', r.table_name);
  end loop;
end $$;

-- 4) Drop ALL functions in public
do $$
declare
  r record;
begin
  for r in
    select p.proname as name, pg_get_function_identity_arguments(p.oid) as args
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
  loop
    execute format('drop function if exists public.%I(%s) cascade', r.name, r.args);
  end loop;
end $$;

-- 5) Drop custom types in public (enums etc.)
do $$
declare
  r record;
begin
  for r in
    select t.typname
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typtype in ('e', 'c')
      and not exists (
        select 1 from pg_class c
        where c.relnamespace = n.oid and c.relname = t.typname
      )
  loop
    execute format('drop type if exists public.%I cascade', r.typname);
  end loop;
end $$;

-- 6) Storage — NEVER use DELETE FROM storage.objects / storage.buckets
--    Supabase blocks that (protect_delete). Use the Storage API functions.
do $$
declare
  b text;
begin
  foreach b in array array['media'::text, 'avatars', 'private']
  loop
    begin
      perform storage.empty_bucket(b);
    exception when others then
      raise notice 'Could not empty bucket %: %', b, sqlerrm;
    end;
    begin
      perform storage.delete_bucket(b);
    exception when others then
      raise notice 'Could not delete bucket %: %', b, sqlerrm;
    end;
  end loop;
end $$;

-- 7) Auth users + sessions (uncomment if you want a fully empty Auth)
-- WARNING: you will not be able to log in until you recreate users.
-- delete from auth.identities;
-- delete from auth.sessions;
-- delete from auth.refresh_tokens;
-- delete from auth.mfa_factors;
-- delete from auth.users;

select 'Wipe complete. Next: run supabase/schema.sql, then admin-bootstrap.sql. Point .env.local at this project (or a NEW Supabase project).' as next_step;
