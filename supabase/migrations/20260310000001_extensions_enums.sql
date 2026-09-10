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
