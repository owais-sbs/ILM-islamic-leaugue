import { createClient } from '@/lib/supabase/client';

export async function logActivity(params: {
  actorId?: string | null;
  actorName?: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  entityLabel?: string;
  metadata?: Record<string, unknown>;
}) {
  const supabase = createClient();
  await supabase.from('activity_log').insert({
    actor_id: params.actorId ?? null,
    actor_name: params.actorName || 'System',
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId ?? null,
    entity_label: params.entityLabel || '',
    metadata: params.metadata || {},
  });
}

export async function getSettingsMap() {
  const supabase = createClient();
  const { data } = await supabase.from('site_settings').select('key, value');
  const map: Record<string, unknown> = {};
  for (const row of data || []) {
    map[row.key] = row.value;
  }
  return map;
}

export async function setSetting(key: string, value: unknown) {
  const supabase = createClient();
  return supabase.from('site_settings').upsert({ key, value });
}
