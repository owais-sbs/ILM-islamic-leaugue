'use client';

import { IlmProvider } from '@/lib/ilm-store';
import type { ReactNode } from 'react';

/** Bump key when seed catalog changes so HMR cannot keep stale article state. */
export function Providers({ children }: { children: ReactNode }) {
  return <IlmProvider key="ilm-catalog-v7">{children}</IlmProvider>;
}
