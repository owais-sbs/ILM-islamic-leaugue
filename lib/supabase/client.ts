import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from './env';

export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Add them in Vercel Project Settings → Environment Variables (and .env.local locally), then redeploy.',
    );
  }

  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey());
}

/** Returns null when env is missing — use this in UI so the site still boots on misconfigured deploys. */
export function tryCreateClient() {
  if (!isSupabaseConfigured()) return null;
  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey());
}
