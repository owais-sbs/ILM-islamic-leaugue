'use client';

import { IlmProvider } from '@/lib/ilm-store';
import type { ReactNode } from 'react';

export function AppProviders({ children }: { children: ReactNode }) {
  return <IlmProvider>{children}</IlmProvider>;
}
