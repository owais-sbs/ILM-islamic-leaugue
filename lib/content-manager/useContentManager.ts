'use client';

/**
 * useContentManager — reads Content Manager data from localStorage.
 * Safe on SSR: returns CM_DEFAULTS until mounted.
 * Re-reads on every render cycle where the storage changes via a
 * storage event — so changes in the admin dashboard tab are reflected
 * immediately if the homepage is open in another tab.
 */

import { useEffect, useState } from 'react';
import type { CMHomepageContent } from './types';
import { CM_DEFAULTS } from './defaults';
import { readCMContent } from './storage';

export function useContentManager(): CMHomepageContent {
  const [content, setContent] = useState<CMHomepageContent>(CM_DEFAULTS);

  useEffect(() => {
    // Initial read after mount
    setContent(readCMContent());

    // Listen for cross-tab storage changes
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'ilm_content_manager') {
        setContent(readCMContent());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return content;
}
