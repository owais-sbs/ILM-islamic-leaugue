-- =============================================================================
-- 20260401000001_cms_live_documents.sql
-- Live Content Manager documents + taxonomy needed for public CMS on Vercel
-- Run in Supabase SQL Editor (ILM project), then redeploy.
-- =============================================================================

-- Single-row-per-document JSON store for homepage + pages CMS
create table if not exists public.cms_documents (
  key text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by text
);

create index if not exists cms_documents_updated_at_idx
  on public.cms_documents (updated_at desc);

comment on table public.cms_documents is
  'Admin Content Manager payloads (homepage, pages). Public read; staff write via service role API.';

alter table public.cms_documents enable row level security;

drop policy if exists cms_documents_public_read on public.cms_documents;
create policy cms_documents_public_read
  on public.cms_documents for select
  to anon, authenticated
  using (true);

drop policy if exists cms_documents_authenticated_write on public.cms_documents;
create policy cms_documents_authenticated_write
  on public.cms_documents for all
  to authenticated
  using (true)
  with check (true);

-- Seed empty documents (safe)
insert into public.cms_documents (key, payload)
values
  ('homepage', '{}'::jsonb),
  ('pages', '{}'::jsonb)
on conflict (key) do nothing;

-- Ensure article categories used by the public library exist
insert into public.categories (name, slug, description, display_order)
values
  ('Islamic Education', 'islamic-education', 'Education and teaching', 10),
  ('Islamic Ethics', 'islamic-ethics', 'Ethics and manners', 20),
  ('Knowledge & Learning', 'knowledge-learning', 'Seeking knowledge', 30),
  ('Tarbiyah', 'tarbiyah', 'Character and cultivation', 40),
  ('Aqidah', 'aqidah', 'Belief and creed', 50),
  ('Fiqh', 'fiqh', 'Jurisprudence and practice', 60),
  ('Purification', 'purification', 'Taharah and purification', 70),
  ('Prayer', 'prayer', 'Salah and related rulings', 80),
  ('Spirituality', 'spirituality', 'Ihsan and the inner life', 90)
on conflict (slug) do nothing;

-- Touch updated_at helper (optional; ignore if trigger already exists)
create or replace function public.cms_documents_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cms_documents_updated_at on public.cms_documents;
create trigger cms_documents_updated_at
  before update on public.cms_documents
  for each row execute function public.cms_documents_set_updated_at();
