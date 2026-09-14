-- =============================================================================
-- 20260314000001_admin_settings_media_subscribers.sql
-- Compatible with existing schema from 20260310000006_engagement_system.sql
-- site_settings = key/value jsonb (NOT a single-row id table)
-- subscribers.is_active (NOT active)
-- media table already exists (do NOT create media_assets)
-- =============================================================================

-- Ensure expected settings keys exist (safe upsert)
insert into public.site_settings (key, value)
values
  ('site_title', '"Islamic League of Murabbiyūn"'::jsonb),
  ('contact_email', '"salam@ilm.org"'::jsonb),
  ('disclaimer', '"The content on this site is for educational and spiritual guidance purposes. Always consult qualified scholars for specific religious rulings."'::jsonb),
  ('disclaimer_text', '"The content on this site is for educational and spiritual guidance purposes. Always consult qualified scholars for specific religious rulings."'::jsonb),
  ('featured_article_id', 'null'::jsonb),
  ('announcement_banner', '""'::jsonb)
on conflict (key) do nothing;

-- Helpful indexes (no-op if already present)
create index if not exists subscribers_is_active_created_at_idx
  on public.subscribers (is_active, created_at desc);

create index if not exists media_created_at_idx
  on public.media (created_at desc);

-- RLS already enabled in earlier migrations; keep idempotent
alter table public.site_settings enable row level security;
alter table public.subscribers enable row level security;
alter table public.media enable row level security;

-- Public subscribe (name matches earlier policy style; drop/recreate safely)
drop policy if exists "Public can subscribe" on public.subscribers;
drop policy if exists subscribers_anon_insert on public.subscribers;
create policy subscribers_anon_insert
  on public.subscribers for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Authenticated read subscribers" on public.subscribers;
drop policy if exists subscribers_admin_read on public.subscribers;
create policy subscribers_admin_read
  on public.subscribers for select
  to authenticated
  using (true);

drop policy if exists subscribers_admin_update on public.subscribers;
create policy subscribers_admin_update
  on public.subscribers for update
  to authenticated
  using (true)
  with check (true);

-- Media: authenticated staff can manage
drop policy if exists "Authenticated manage media" on public.media;
drop policy if exists media_authenticated_all on public.media;
create policy media_authenticated_all
  on public.media for all
  to authenticated
  using (true)
  with check (true);

-- Site settings: public read, authenticated write
drop policy if exists site_settings_public_read on public.site_settings;
create policy site_settings_public_read
  on public.site_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated manage settings" on public.site_settings;
drop policy if exists site_settings_authenticated_all on public.site_settings;
create policy site_settings_authenticated_all
  on public.site_settings for all
  to authenticated
  using (true)
  with check (true);
