-- Fix mis-attributed "The Quran" article:
-- It was published under the admin profile (Najeeb) because publish/workflow
-- fell back to the signed-in admin when authorEmail was missing.
-- Reassign ownership to Mohammed Ateeq (ateeqmohd0005@gmail.com).

update public.articles a
set author_id = p.id,
    updated_at = now()
from public.profiles p
where a.slug = 'the-quran'
  and lower(p.email) = 'ateeqmohd0005@gmail.com'
  and a.author_id is distinct from p.id;

-- Optional verification:
-- select a.slug, a.title, p.full_name, p.email
-- from public.articles a
-- join public.profiles p on p.id = a.author_id
-- where a.slug = 'the-quran';
