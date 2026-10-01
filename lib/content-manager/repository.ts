/** ============================================================
 *  ILM Content Manager — Repository / Adapter
 *  UI talks ONLY to this layer. Live sync goes through remote.ts.
 * ============================================================ */

export {
  readCMContent as getHomepageContent,
  writeCMContent as saveHomepageContent,
  updateCMSection as updateSection,
  resetCMSection as resetSection,
  clearCMContent as clearContent,
  mergeHomepage,
} from './storage';

export {
  loadHomepageLive,
  loadPagesLive,
  saveHomepageLive,
  savePagesLive,
} from './remote';

export { CM_DEFAULTS as getDefaults } from './defaults';
export type { CMHomepageContent, CMSection } from './types';
