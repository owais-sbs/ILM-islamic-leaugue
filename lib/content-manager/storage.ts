/** ============================================================
 *  ILM Content Manager — local cache + merge helpers
 *  Source of truth on production: Supabase via /api/cms
 * ============================================================ */

import type { CMHomepageContent, CMSection } from './types';
import { CM_DEFAULTS } from './defaults';

export const CM_STORAGE_KEY = 'ilm_content_manager_v2';

/** Legacy key — cleared on first load so old structure doesn't bleed through */
const CM_LEGACY_KEY = 'ilm_content_manager';

function isBrowser() {
  return typeof window !== 'undefined';
}

/** Deep-merge partial CMS payload with defaults. */
export function mergeHomepage(parsed: Partial<CMHomepageContent> | Record<string, unknown> = {}): CMHomepageContent {
  const p = parsed as Partial<CMHomepageContent> & { directory?: CMHomepageContent['directory'] };
  return {
    header: { ...CM_DEFAULTS.header, ...p.header },
    hero: { ...CM_DEFAULTS.hero, ...p.hero },
    about: {
      ...CM_DEFAULTS.about,
      ...p.about,
      pillars: p.about?.pillars ?? CM_DEFAULTS.about.pillars,
    },
    featuredArticles: { ...CM_DEFAULTS.featuredArticles, ...p.featuredArticles },
    directory: {
      ...CM_DEFAULTS.directory,
      ...p.directory,
      murabbiyun: {
        ...CM_DEFAULTS.directory.murabbiyun,
        ...p.directory?.murabbiyun,
        items: p.directory?.murabbiyun?.items ?? CM_DEFAULTS.directory.murabbiyun.items,
      },
      categories: {
        ...CM_DEFAULTS.directory.categories,
        ...p.directory?.categories,
        items: p.directory?.categories?.items ?? CM_DEFAULTS.directory.categories.items,
      },
    },
    learningJourney: {
      ...CM_DEFAULTS.learningJourney,
      ...p.learningJourney,
      steps: p.learningJourney?.steps ?? CM_DEFAULTS.learningJourney.steps,
    },
    quote: { ...CM_DEFAULTS.quote, ...p.quote },
    newsletter: { ...CM_DEFAULTS.newsletter, ...p.newsletter },
    footer: {
      ...CM_DEFAULTS.footer,
      ...p.footer,
      exploreLinks: p.footer?.exploreLinks ?? CM_DEFAULTS.footer.exploreLinks,
      connectLinks: p.footer?.connectLinks ?? CM_DEFAULTS.footer.connectLinks,
      socialLinks: p.footer?.socialLinks ?? CM_DEFAULTS.footer.socialLinks,
    },
  };
}

/** Read the full homepage content from localStorage, falling back to defaults. */
export function readCMContent(): CMHomepageContent {
  if (!isBrowser()) return CM_DEFAULTS;
  try {
    localStorage.removeItem(CM_LEGACY_KEY);
    const raw = localStorage.getItem(CM_STORAGE_KEY);
    if (!raw) return CM_DEFAULTS;
    return mergeHomepage(JSON.parse(raw) as Partial<CMHomepageContent>);
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

/** Update a single section and persist locally. Returns the updated full content. */
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
