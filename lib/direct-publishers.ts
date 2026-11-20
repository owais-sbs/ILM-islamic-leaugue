import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Accounts (profile ids) that may publish their own articles without review, even though their
 * role is "author". Stored in `site_settings.direct_publishers` as a JSON array of ids, so it
 * applies only to the accounts listed and changes no one else's workflow.
 */
export const DIRECT_PUBLISHERS_KEY = 'direct_publishers';

export async function canPublishDirectly(admin: SupabaseClient, userId: string | null | undefined) {
  if (!userId) return false;
  const { data } = await admin.from('site_settings').select('value').eq('key', DIRECT_PUBLISHERS_KEY).maybeSingle();
  const ids = Array.isArray(data?.value) ? (data!.value as unknown[]) : [];
  return ids.some((id) => typeof id === 'string' && id.toLowerCase() === userId.toLowerCase());
}
