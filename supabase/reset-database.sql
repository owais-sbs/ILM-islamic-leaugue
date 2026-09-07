-- =============================================================================
-- ILM — FULL DATABASE RESET (Supabase SQL Editor)
-- ⚠️  DESTROYS ALL DATA in public schema tables below.
-- Run this, then run supabase/schema.sql, then supabase/admin-bootstrap.sql
-- =============================================================================

-- Drop triggers on auth.users (profile bootstrap)
drop trigger if exists on_auth_user_created on auth.users;

-- Drop application tables (children first)
drop table if exists public.activity_log cascade;
drop table if exists public.article_tags cascade;
drop table if exists public.article_revisions cascade;
drop table if exists public.articles cascade;
drop table if exists public.questions cascade;
drop table if exists public.subscribers cascade;
drop table if exists public.media cascade;
drop table if exists public.site_settings cascade;
drop table if exists public.tags cascade;
drop table if exists public.categories cascade;
drop table if exists public.profiles cascade;

-- Drop helper functions (recreated by schema.sql)
drop function if exists public.handle_new_user() cascade;
drop function if exists public.current_user_role() cascade;
drop function if exists public.is_staff() cascade;
drop function if exists public.is_admin() cascade;
drop function if exists public.is_editor_or_admin() cascade;
drop function if exists public.articles_search_vector_update() cascade;
drop function if exists public.snapshot_article_revision() cascade;
drop function if exists public.set_updated_at() cascade;

-- Optional: remove seeded storage objects (buckets kept)
-- delete from storage.objects where bucket_id in ('media', 'avatars');

select 'ILM tables dropped. Now run supabase/schema.sql then admin-bootstrap.sql' as next_step;
