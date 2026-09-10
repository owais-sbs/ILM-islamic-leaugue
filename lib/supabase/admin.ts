import { createClient } from '@supabase/supabase-js';
import { getSupabaseServiceKey, getSupabaseUrl, isSupabaseAdminConfigured } from './env';

/** Service-role client — server / scripts only. Never import in client components. */
export function createServiceClient() {
  if (!isSupabaseAdminConfigured()) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Check Vercel env vars / .env.local.',
    );
  }

  return createClient(getSupabaseUrl(), getSupabaseServiceKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function tryCreateServiceClient() {
  if (!isSupabaseAdminConfigured()) return null;
  return createServiceClient();
}
