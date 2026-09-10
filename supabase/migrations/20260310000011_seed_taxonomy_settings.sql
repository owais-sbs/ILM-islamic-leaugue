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
