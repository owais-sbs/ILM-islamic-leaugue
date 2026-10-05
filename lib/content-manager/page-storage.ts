/** ============================================================
 *  ILM Content Manager — Pages local cache + merge helpers
 * ============================================================ */

import type { CMPagesContent, CMPageSection } from './types';
import { CM_PAGE_DEFAULTS, CM_PAGE_STORAGE_KEY } from './page-defaults';

function isBrowser() {
  return typeof window !== 'undefined';
}

export function mergePages(parsed: Partial<CMPagesContent> | Record<string, unknown> = {}): CMPagesContent {
  const p = parsed as Partial<CMPagesContent>;
  return {
    aboutPage: {
      ...CM_PAGE_DEFAULTS.aboutPage,
      ...p.aboutPage,
      introParagraphs: p.aboutPage?.introParagraphs ?? CM_PAGE_DEFAULTS.aboutPage.introParagraphs,
      principles: p.aboutPage?.principles ?? CM_PAGE_DEFAULTS.aboutPage.principles,
      founderParagraphs: p.aboutPage?.founderParagraphs ?? CM_PAGE_DEFAULTS.aboutPage.founderParagraphs,
    },
    missionVisionPage: {
      ...CM_PAGE_DEFAULTS.missionVisionPage,
      ...p.missionVisionPage,
      visionNotes: p.missionVisionPage?.visionNotes ?? CM_PAGE_DEFAULTS.missionVisionPage.visionNotes,
      objectives: p.missionVisionPage?.objectives ?? CM_PAGE_DEFAULTS.missionVisionPage.objectives,
    },
    privacyPage: {
      ...CM_PAGE_DEFAULTS.privacyPage,
      ...p.privacyPage,
      sections: Array.isArray(p.privacyPage?.sections)
        ? p.privacyPage!.sections
        : CM_PAGE_DEFAULTS.privacyPage.sections,
    },
    disclaimerPage: {
      ...CM_PAGE_DEFAULTS.disclaimerPage,
      ...p.disclaimerPage,
      sections: Array.isArray(p.disclaimerPage?.sections)
        ? p.disclaimerPage!.sections
        : CM_PAGE_DEFAULTS.disclaimerPage.sections,
    },
    termsPage: {
      ...CM_PAGE_DEFAULTS.termsPage,
      ...p.termsPage,
      sections: Array.isArray(p.termsPage?.sections)
        ? p.termsPage!.sections
        : CM_PAGE_DEFAULTS.termsPage.sections,
    },
  };
}

export function readCMPages(): CMPagesContent {
  if (!isBrowser()) return CM_PAGE_DEFAULTS;
  try {
    const raw = localStorage.getItem(CM_PAGE_STORAGE_KEY);
    if (!raw) return CM_PAGE_DEFAULTS;
    return mergePages(JSON.parse(raw) as Partial<CMPagesContent>);
  } catch {
    return CM_PAGE_DEFAULTS;
  }
}

export function writeCMPages(data: CMPagesContent): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(CM_PAGE_STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function updateCMPage<K extends CMPageSection>(
  section: K,
  value: CMPagesContent[K],
): CMPagesContent {
  const current = readCMPages();
  const next = { ...current, [section]: value };
  writeCMPages(next);
  return next;
}

export function resetCMPage<K extends CMPageSection>(section: K): CMPagesContent {
  const current = readCMPages();
  const next = { ...current, [section]: CM_PAGE_DEFAULTS[section] };
  writeCMPages(next);
  return next;
}
