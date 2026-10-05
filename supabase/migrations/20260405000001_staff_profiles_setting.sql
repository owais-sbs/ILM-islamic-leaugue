-- Ensure staff profile overrides key exists (idempotent)
insert into public.site_settings (key, value)
values ('staff_profiles', '[]'::jsonb)
on conflict (key) do nothing;
