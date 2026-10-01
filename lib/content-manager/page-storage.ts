/** ============================================================
 *  ILM Content Manager — Pages localStorage persistence (Phase 1)
 * ============================================================ */

import type { CMPagesContent, CMPageSection } from './types';
import { CM_PAGE_DEFAULTS, CM_PAGE_STORAGE_KEY } from './page-defaults';

function isBrowser() { return typeof window !== 'undefined'; }

export function readCMPages(): CMPagesContent {
  if (!isBrowser()) return CM_PAGE_DEFAULTS;
  try {
    const raw = localStorage.getItem(CM_PAGE_STORAGE_KEY);
    if (!raw) return CM_PAGE_DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<CMPagesContent>;
    return {
      aboutPage: {
        ...CM_PAGE_DEFAULTS.aboutPage,
        ...parsed.aboutPage,
        introParagraphs: parsed.aboutPage?.introParagraphs ?? CM_PAGE_DEFAULTS.aboutPage.introParagraphs,
        principles: parsed.aboutPage?.principles ?? CM_PAGE_DEFAULTS.aboutPage.principles,
        founderParagraphs: parsed.aboutPage?.founderParagraphs ?? CM_PAGE_DEFAULTS.aboutPage.founderParagraphs,
      },
      missionVisionPage: {
        ...CM_PAGE_DEFAULTS.missionVisionPage,
        ...parsed.missionVisionPage,
        visionNotes: parsed.missionVisionPage?.visionNotes ?? CM_PAGE_DEFAULTS.missionVisionPage.visionNotes,
        objectives: parsed.missionVisionPage?.objectives ?? CM_PAGE_DEFAULTS.missionVisionPage.objectives,
      },
    };
  } catch {
    return CM_PAGE_DEFAULTS;
  }
}

export function writeCMPages(data: CMPagesContent): void {
  if (!isBrowser()) return;
  try { localStorage.setItem(CM_PAGE_STORAGE_KEY, JSON.stringify(data)); } catch { /* ignore */ }
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
