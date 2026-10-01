/** ============================================================
 *  ILM Content Manager — Repository / Adapter (Phase 1)
 *  UI talks ONLY to this layer. In Phase 2 swap localStorage
 *  calls here for Supabase calls — no UI changes needed.
 * ============================================================ */

export {
  readCMContent as getHomepageContent,
  writeCMContent as saveHomepageContent,
  updateCMSection as updateSection,
  resetCMSection as resetSection,
  clearCMContent as clearContent,
} from './storage';

export { CM_DEFAULTS as getDefaults } from './defaults';
export type { CMHomepageContent, CMSection } from './types';
