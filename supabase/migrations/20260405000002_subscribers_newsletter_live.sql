-- Newsletter subscribers live table (idempotent)
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subscribers_email_unique unique (email)
);

create index if not exists subscribers_is_active_created_at_idx
  on public.subscribers (is_active, created_at desc);

create index if not exists subscribers_email_lower_idx
  on public.subscribers (lower(email));

alter table public.subscribers enable row level security;

drop policy if exists subscribers_anon_insert on public.subscribers;
create policy subscribers_anon_insert
  on public.subscribers for insert
  to anon, authenticated
  with check (true);

drop policy if exists subscribers_anon_update_own on public.subscribers;
create policy subscribers_anon_update_own
  on public.subscribers for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists subscribers_admin_read on public.subscribers;
create policy subscribers_admin_read
  on public.subscribers for select
  to authenticated
  using (true);
