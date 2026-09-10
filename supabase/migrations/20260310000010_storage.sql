-- =============================================================================
-- 20260310000010_storage.sql
-- Buckets: media, avatars (public read), private (admin-only)
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'media',
    'media',
    true,
    5242880,
    array['image/jpeg','image/png','image/webp','image/gif','image/svg+xml']
  ),
  (
    'avatars',
    'avatars',
    true,
    5242880,
    array['image/jpeg','image/png','image/webp','image/gif']
  ),
  (
    'private',
    'private',
    false,
    10485760,
    null
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Clean old storage policies for these buckets
do $$
declare r record;
begin
  for r in
    select policyname
    from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname like 'ilm_%'
  loop
    execute format('drop policy if exists %I on storage.objects', r.policyname);
  end loop;
end $$;

create policy ilm_media_public_read
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'media');

create policy ilm_media_staff_upload
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'media'
    and public.is_staff()
  );

create policy ilm_media_staff_update
  on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_staff())
  with check (bucket_id = 'media' and public.is_staff());

create policy ilm_media_staff_delete
  on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (public.is_admin() or owner = auth.uid()));

create policy ilm_avatars_public_read
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'avatars');

create policy ilm_avatars_staff_upload
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and public.is_staff());

create policy ilm_avatars_staff_update
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (public.is_staff()))
  with check (bucket_id = 'avatars' and public.is_staff());

create policy ilm_avatars_staff_delete
  on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (public.is_admin() or owner = auth.uid()));

create policy ilm_private_admin_all
  on storage.objects for all to authenticated
  using (bucket_id = 'private' and public.is_admin())
  with check (bucket_id = 'private' and public.is_admin());
