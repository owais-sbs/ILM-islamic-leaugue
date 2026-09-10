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
