-- =============================================================================
-- 20260310000009_rls_policies.sql
-- RLS exactly matching Developer Spec permission matrix
-- =============================================================================

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.articles enable row level security;
alter table public.article_revisions enable row level security;
alter table public.article_tags enable row level security;
alter table public.questions enable row level security;
alter table public.subscribers enable row level security;
alter table public.media enable row level security;
alter table public.site_settings enable row level security;
alter table public.activity_log enable row level security;

-- Drop existing policies if re-run
do $$
declare r record;
begin
  for r in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'profiles','categories','tags','articles','article_revisions','article_tags',
        'questions','subscribers','media','site_settings','activity_log'
      )
  loop
    execute format('drop policy if exists %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

-- ---------- profiles ----------
create policy profiles_anon_read_active
  on public.profiles for select to anon, authenticated
  using (is_active = true);

create policy profiles_self_update
  on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (
    (id = auth.uid() and role = (select role from public.profiles p where p.id = auth.uid()))
    or public.is_admin()
  );

create policy profiles_admin_insert
  on public.profiles for insert to authenticated
  with check (public.is_admin() or id = auth.uid());

create policy profiles_admin_delete
  on public.profiles for delete to authenticated
  using (public.is_admin());

-- ---------- categories / tags ----------
create policy categories_public_read
  on public.categories for select to anon, authenticated
  using (true);

create policy categories_admin_write
  on public.categories for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy tags_public_read
  on public.tags for select to anon, authenticated
  using (true);

create policy tags_admin_write
  on public.tags for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- articles ----------
create policy articles_anon_read_published
  on public.articles for select to anon
  using (status = 'published');

create policy articles_staff_read
  on public.articles for select to authenticated
  using (
    public.is_editor_or_admin()
    or (public.current_user_role() = 'author' and author_id = auth.uid())
    or status = 'published'
  );

create policy articles_insert_staff
  on public.articles for insert to authenticated
  with check (
    public.is_staff()
    and (
      public.is_editor_or_admin()
      or (public.current_user_role() = 'author' and author_id = auth.uid() and status = 'draft')
    )
  );

create policy articles_update_staff
  on public.articles for update to authenticated
  using (
    public.is_editor_or_admin()
    or (
      public.current_user_role() = 'author'
      and author_id = auth.uid()
      and status in ('draft', 'returned', 'submitted')
    )
  )
  with check (
    public.is_admin()
    or (
      public.current_user_role() = 'editor'
      and status in ('draft', 'submitted', 'approved', 'returned')
    )
    or (
      public.current_user_role() = 'author'
      and author_id = auth.uid()
      and status in ('draft', 'returned', 'submitted')
    )
  );

create policy articles_delete_admin
  on public.articles for delete to authenticated
  using (public.is_admin());

-- ---------- article_revisions ----------
create policy revisions_staff_read
  on public.article_revisions for select to authenticated
  using (
    public.is_editor_or_admin()
    or exists (
      select 1 from public.articles a
      where a.id = article_id and a.author_id = auth.uid()
    )
  );

create policy revisions_staff_insert
  on public.article_revisions for insert to authenticated
  with check (public.is_staff());

-- ---------- article_tags ----------
create policy article_tags_public_read_published
  on public.article_tags for select to anon, authenticated
  using (
    exists (
      select 1 from public.articles a
      where a.id = article_id
        and (a.status = 'published' or public.is_staff())
    )
  );

create policy article_tags_staff_write
  on public.article_tags for all to authenticated
  using (
    public.is_editor_or_admin()
    or exists (
      select 1 from public.articles a
      where a.id = article_id
        and a.author_id = auth.uid()
        and a.status in ('draft', 'returned')
    )
  )
  with check (
    public.is_editor_or_admin()
    or exists (
      select 1 from public.articles a
      where a.id = article_id
        and a.author_id = auth.uid()
        and a.status in ('draft', 'returned')
    )
  );

-- ---------- questions ----------
create policy questions_anon_insert
  on public.questions for insert to anon, authenticated
  with check (true);

create policy questions_staff_read
  on public.questions for select to authenticated
  using (
    public.is_editor_or_admin()
    or (public.current_user_role() = 'author' and assigned_to = auth.uid())
  );

create policy questions_staff_update
  on public.questions for update to authenticated
  using (
    public.is_editor_or_admin()
    or (public.current_user_role() = 'author' and assigned_to = auth.uid())
  )
  with check (
    public.is_editor_or_admin()
    or (public.current_user_role() = 'author' and assigned_to = auth.uid())
  );

create policy questions_admin_delete
  on public.questions for delete to authenticated
  using (public.is_admin());

-- ---------- subscribers ----------
create policy subscribers_anon_insert
  on public.subscribers for insert to anon, authenticated
  with check (true);

create policy subscribers_admin_read
  on public.subscribers for select to authenticated
  using (public.is_admin());

create policy subscribers_admin_update
  on public.subscribers for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy subscribers_admin_delete
  on public.subscribers for delete to authenticated
  using (public.is_admin());

-- ---------- media ----------
create policy media_staff_read
  on public.media for select to authenticated
  using (public.is_staff());

create policy media_staff_insert
  on public.media for insert to authenticated
  with check (public.is_staff() and uploaded_by = auth.uid());

create policy media_admin_delete
  on public.media for delete to authenticated
  using (public.is_admin() or uploaded_by = auth.uid());

-- ---------- site_settings ----------
create policy settings_public_read
  on public.site_settings for select to anon, authenticated
  using (true);

create policy settings_admin_write
  on public.site_settings for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- activity_log ----------
create policy activity_admin_read
  on public.activity_log for select to authenticated
  using (public.is_admin());

create policy activity_staff_insert
  on public.activity_log for insert to authenticated
  with check (public.is_staff());

-- Immutable: no update/delete for anyone via RLS (admins use service role if needed)
