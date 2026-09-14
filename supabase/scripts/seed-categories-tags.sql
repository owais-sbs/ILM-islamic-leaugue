-- Run in Supabase SQL Editor if categories/tags tables are empty.
-- Requires: supabase/migrations/20260310000003_taxonomy.sql

insert into public.categories (name, slug, description, display_order)
values
  ('Islamic Education', 'islamic-education', 'Formation and pedagogy', 1),
  ('Islamic Ethics', 'islamic-ethics', 'Adab, character, and conduct', 2),
  ('Knowledge & Learning', 'knowledge-learning', 'Seeking and living knowledge', 3),
  ('Tarbiyah', 'tarbiyah', 'Nurturing hearts and habits', 4),
  ('Aqidah', 'aqidah', 'Creed and foundations', 5),
  ('Fiqh', 'fiqh', 'Practical guidance', 6),
  ('Spirituality', 'spirituality', 'Tazkiyah and inner life', 7)
on conflict (slug) do nothing;

insert into public.tags (name, slug)
values
  ('spirituality', 'spirituality'),
  ('growth', 'growth'),
  ('patience', 'patience'),
  ('education', 'education'),
  ('youth', 'youth'),
  ('mentorship', 'mentorship'),
  ('community', 'community'),
  ('belonging', 'belonging'),
  ('leadership', 'leadership'),
  ('listening', 'listening'),
  ('communication', 'communication'),
  ('mindfulness', 'mindfulness'),
  ('mercy', 'mercy'),
  ('curiosity', 'curiosity'),
  ('sustainability', 'sustainability')
on conflict (slug) do nothing;
