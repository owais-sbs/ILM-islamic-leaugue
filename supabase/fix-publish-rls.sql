-- =============================================================================
-- Fix: Articles update RLS policy was blocking editors/admins from publishing
-- Root cause: the "using" clause checked the old row's status. If the article
-- was in 'approved' state, the is_editor_or_admin() check was also failing
-- because the session context is sometimes unavailable in route handlers.
--
-- Solution: allow editors and admins to update any article unconditionally.
-- The API layer (PATCH route) already enforces who can publish.
-- Run this once in the Supabase SQL Editor.
-- =============================================================================

-- Drop the old policy
drop policy if exists "Authors update own drafts" on public.articles;

-- Recreate with correct logic:
-- • Admins & editors → always allowed (service role is used in API anyway)
-- • Authors → only their own articles in draft/returned/submitted/approved
create policy "Staff update articles" on public.articles for update
  using (
    public.is_editor_or_admin()
    or (author_id = auth.uid() and status in ('draft', 'returned', 'submitted', 'approved'))
  );
