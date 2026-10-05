-- Media bucket + category alignment for live admin (idempotent)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  5242880,
  array['image/jpeg','image/png','image/webp','image/gif','image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

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
  ('Spirituality', 'spirituality', 'Ihsan and the inner life', 90),
  ('History', 'history', 'Islamic history', 100)
on conflict (slug) do update set name = excluded.name;
