'use client';

import { useEffect, useState } from 'react';
import type { CMPagesContent } from './types';
import { CM_PAGE_DEFAULTS, CM_PAGE_STORAGE_KEY } from './page-defaults';
import { readCMPages } from './page-storage';
import { loadPagesLive } from './remote';

export function useCMPages(): CMPagesContent {
  const [content, setContent] = useState<CMPagesContent>(CM_PAGE_DEFAULTS);

  useEffect(() => {
    try {
      localStorage.removeItem('ilm_content_manager_pages_v1');
      localStorage.removeItem('ilm_content_manager_pages_v2');
    } catch {
      /* ignore */
    }
    setContent(readCMPages());

    let cancelled = false;
    void loadPagesLive().then((live) => {
      if (!cancelled) setContent(live);
    });

    const onStorage = (e: StorageEvent) => {
      if (e.key === CM_PAGE_STORAGE_KEY) setContent(readCMPages());
    };
    window.addEventListener('storage', onStorage);
    return () => {
      cancelled = true;
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return content;
}
