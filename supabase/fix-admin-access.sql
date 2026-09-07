-- Quick fix: ensure anon can insert questions/subscribers, and promote test admin
-- Run in Supabase SQL Editor if Ask form or admin inbox still fails

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;

-- Promote test admin (after Auth user exists)
update public.profiles
set
  role = 'admin',
  full_name = coalesce(nullif(full_name, ''), 'Admin'),
  is_active = true,
  email = coalesce(nullif(email, ''), 'adminops@gmail.com'),
  email_public = coalesce(nullif(email_public, ''), 'adminops@gmail.com')
where email = 'adminops@gmail.com'
   or id in (select id from auth.users where email = 'adminops@gmail.com');

-- If profile row is missing for the auth user, create it
insert into public.profiles (id, email, full_name, role, is_active, email_public)
select
  u.id,
  u.email,
  'Admin',
  'admin',
  true,
  u.email
from auth.users u
where u.email = 'adminops@gmail.com'
on conflict (id) do update
set role = 'admin', is_active = true, full_name = excluded.full_name;
