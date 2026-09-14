-- =============================================================================
-- 20260314000002_staff_invites.sql
-- Admin invite tokens for author / editor / admin onboarding via SMTP
-- =============================================================================

create table if not exists public.staff_invites (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text not null,
  role public.user_role not null default 'author',
  bio text,
  madhhab text,
  token text not null,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'revoked')),
  expires_at timestamptz not null,
  accepted_at timestamptz,
  invited_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint staff_invites_token_unique unique (token)
);

create index if not exists staff_invites_email_idx on public.staff_invites (lower(email));
create index if not exists staff_invites_status_expires_idx on public.staff_invites (status, expires_at);

alter table public.staff_invites enable row level security;

drop policy if exists staff_invites_admin_all on public.staff_invites;
create policy staff_invites_admin_all
  on public.staff_invites for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin' and p.is_active = true
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin' and p.is_active = true
    )
  );
