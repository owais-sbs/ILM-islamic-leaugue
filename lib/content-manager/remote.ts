/** ============================================================
 *  Content Manager — remote sync (Phase 2 / live on Vercel)
 *  localStorage remains an optimistic cache; Supabase is source of truth.
 * ============================================================ */

import type { CMHomepageContent, CMPagesContent } from './types';
import { CM_DEFAULTS } from './defaults';
import { CM_PAGE_DEFAULTS } from './page-defaults';
import { mergeHomepage, writeCMContent } from './storage';
import { mergePages, writeCMPages } from './page-storage';

type CmsKey = 'homepage' | 'pages';

async function fetchCmsPayload(key: CmsKey): Promise<unknown | null> {
  try {
    const res = await fetch(`/api/cms?key=${key}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = (await res.json()) as { ok?: boolean; payload?: unknown };
    if (!json.ok || json.payload == null || typeof json.payload !== 'object') return null;
    // Empty object means seed row with no edits yet
    if (Object.keys(json.payload as object).length === 0) return null;
    return json.payload;
  } catch {
    return null;
  }
}

async function putCmsPayload(key: CmsKey, payload: unknown, updatedBy = 'admin'): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/cms', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, payload, updatedBy }),
    });
    const json = (await res.json()) as { ok?: boolean; error?: string };
    if (!res.ok || !json.ok) return { ok: false, error: json.error || `HTTP ${res.status}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Network error' };
  }
}

/** Load homepage: remote wins when present; always refresh local cache. */
export async function loadHomepageLive(): Promise<CMHomepageContent> {
  const remote = await fetchCmsPayload('homepage');
  if (remote) {
    const merged = mergeHomepage(remote as Partial<CMHomepageContent>);
    writeCMContent(merged);
    return merged;
  }
  return mergeHomepage({});
}

/** Load pages: remote wins when present. */
export async function loadPagesLive(): Promise<CMPagesContent> {
  const remote = await fetchCmsPayload('pages');
  if (remote) {
    const merged = mergePages(remote as Partial<CMPagesContent>);
    writeCMPages(merged);
    return merged;
  }
  return mergePages({});
}

/** Persist homepage to local + Supabase. */
export async function saveHomepageLive(
  data: CMHomepageContent,
  updatedBy = 'admin',
): Promise<{ ok: boolean; error?: string }> {
  writeCMContent(data);
  return putCmsPayload('homepage', data, updatedBy);
}

/** Persist pages to local + Supabase. */
export async function savePagesLive(
  data: CMPagesContent,
  updatedBy = 'admin',
): Promise<{ ok: boolean; error?: string }> {
  writeCMPages(data);
  return putCmsPayload('pages', data, updatedBy);
}

export { CM_DEFAULTS, CM_PAGE_DEFAULTS };
