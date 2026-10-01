/** ============================================================
 *  ILM Content Manager — localStorage persistence (Phase 1)
 *  Single key. No Supabase. Safe on SSR.
 * ============================================================ */

import type { CMHomepageContent, CMSection } from './types';
import { CM_DEFAULTS } from './defaults';

export const CM_STORAGE_KEY = 'ilm_content_manager_v2';

/** Legacy key — cleared on first load so old structure doesn't bleed through */
const CM_LEGACY_KEY = 'ilm_content_manager';

function isBrowser() {
  return typeof window !== 'undefined';
}

/** Read the full homepage content from localStorage, falling back to defaults. */
export function readCMContent(): CMHomepageContent {
  if (!isBrowser()) return CM_DEFAULTS;
  try {
    // Clear legacy key (old schema had top-level categories/murabbiyun)
    localStorage.removeItem(CM_LEGACY_KEY);

    const raw = localStorage.getItem(CM_STORAGE_KEY);
    if (!raw) return CM_DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<CMHomepageContent>;
    // Deep-merge with defaults so new sections added in future releases still appear
    return {
      header: { ...CM_DEFAULTS.header, ...parsed.header },
      hero: { ...CM_DEFAULTS.hero, ...parsed.hero },
      about: {
        ...CM_DEFAULTS.about,
        ...parsed.about,
        pillars: parsed.about?.pillars ?? CM_DEFAULTS.about.pillars,
      },
      featuredArticles: { ...CM_DEFAULTS.featuredArticles, ...parsed.featuredArticles },
      directory: {
        ...CM_DEFAULTS.directory,
        ...(parsed as any).directory,
        murabbiyun: {
          ...CM_DEFAULTS.directory.murabbiyun,
          ...(parsed as any).directory?.murabbiyun,
          items: (parsed as any).directory?.murabbiyun?.items ?? CM_DEFAULTS.directory.murabbiyun.items,
        },
        categories: {
          ...CM_DEFAULTS.directory.categories,
          ...(parsed as any).directory?.categories,
          items: (parsed as any).directory?.categories?.items ?? CM_DEFAULTS.directory.categories.items,
        },
      },
      learningJourney: {
        ...CM_DEFAULTS.learningJourney,
        ...parsed.learningJourney,
        steps: parsed.learningJourney?.steps ?? CM_DEFAULTS.learningJourney.steps,
      },
      quote: { ...CM_DEFAULTS.quote, ...parsed.quote },
      newsletter: { ...CM_DEFAULTS.newsletter, ...parsed.newsletter },
      footer: {
        ...CM_DEFAULTS.footer,
        ...parsed.footer,
        exploreLinks: parsed.footer?.exploreLinks ?? CM_DEFAULTS.footer.exploreLinks,
        connectLinks: parsed.footer?.connectLinks ?? CM_DEFAULTS.footer.connectLinks,
        socialLinks: parsed.footer?.socialLinks ?? CM_DEFAULTS.footer.socialLinks,
      },
    };
  } catch {
    return CM_DEFAULTS;
  }
}

/** Write the full homepage content to localStorage. */
export function writeCMContent(data: CMHomepageContent): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(CM_STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore quota errors */
  }
}

/** Update a single section and persist. Returns the updated full content. */
export function updateCMSection<K extends CMSection>(
  section: K,
  value: CMHomepageContent[K],
): CMHomepageContent {
  const current = readCMContent();
  const next = { ...current, [section]: value };
  writeCMContent(next);
  return next;
}

/** Reset a single section to its default values. */
export function resetCMSection<K extends CMSection>(section: K): CMHomepageContent {
  const current = readCMContent();
  const next = { ...current, [section]: CM_DEFAULTS[section] };
  writeCMContent(next);
  return next;
}

/** Clear all Content Manager data (full reset). */
export function clearCMContent(): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(CM_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
