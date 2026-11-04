-- Allow service-role / SQL Editor (auth.uid() is null) to change role / is_active.
-- Matches articles_enforce_workflow bootstrap behavior used by admin API writes.

create or replace function public.profiles_guard_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_id uuid := auth.uid();
  actor_role public.user_role;
begin
  if tg_op = 'UPDATE'
     and (old.role is distinct from new.role or old.is_active is distinct from new.is_active) then

    -- Service role / SQL Editor: no JWT — allow admin API bridge updates
    if actor_id is null then
      return new;
    end if;

    select role into actor_role from public.profiles where id = actor_id;
    if actor_role is distinct from 'admin' then
      raise exception 'ILM: only administrators can change roles or active status';
    end if;

    insert into public.activity_log (actor_id, action, entity_type, entity_id, meta)
    values (
      actor_id,
      case when old.role is distinct from new.role then 'role_change' else 'profile_active_change' end,
      'profiles',
      new.id,
      jsonb_build_object(
        'old_role', old.role,
        'new_role', new.role,
        'old_active', old.is_active,
        'new_active', new.is_active
      )
    );
  end if;
  return new;
end;
$$;
