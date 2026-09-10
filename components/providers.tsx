'use client';

import { IlmProvider } from '@/lib/ilm-store';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return <IlmProvider>{children}</IlmProvider>;
}
