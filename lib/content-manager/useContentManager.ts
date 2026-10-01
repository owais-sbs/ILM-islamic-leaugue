'use client';

/**
 * useContentManager — loads live CMS from Supabase (/api/cms),
 * with localStorage as optimistic cache for instant paint.
 */

import { useEffect, useState } from 'react';
import type { CMHomepageContent } from './types';
import { CM_DEFAULTS } from './defaults';
import { CM_STORAGE_KEY, readCMContent } from './storage';
import { loadHomepageLive } from './remote';

export function useContentManager(): CMHomepageContent {
  const [content, setContent] = useState<CMHomepageContent>(CM_DEFAULTS);

  useEffect(() => {
    setContent(readCMContent());

    let cancelled = false;
    void loadHomepageLive().then((live) => {
      if (!cancelled) setContent(live);
    });

    const onStorage = (e: StorageEvent) => {
      if (e.key === CM_STORAGE_KEY || e.key === 'ilm_content_manager') {
        setContent(readCMContent());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      cancelled = true;
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return content;
}
