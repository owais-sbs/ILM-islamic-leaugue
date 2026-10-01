'use client';

import { useEffect, useState } from 'react';
import type { CMPagesContent } from './types';
import { CM_PAGE_DEFAULTS } from './page-defaults';
import { readCMPages } from './page-storage';

export function useCMPages(): CMPagesContent {
  const [content, setContent] = useState<CMPagesContent>(CM_PAGE_DEFAULTS);

  useEffect(() => {
    setContent(readCMPages());
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'ilm_content_manager_pages_v1') setContent(readCMPages());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return content;
}
