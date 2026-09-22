-- =============================================================================
-- Preferred Murabbī / author on public question submissions
-- Extends existing questions workflow; does not create a new messaging system.
-- =============================================================================

alter table public.questions
  add column if not exists preferred_author text;

comment on column public.questions.preferred_author is
  'Optional public preference for which Murabbī / author should answer; admin still routes assignment.';
