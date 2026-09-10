'use client';

import { LibraryExplorer } from '@/components/public/library-explorer';
import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';

export default function ArticlesPage() {
  return (
    <main className="min-h-screen overflow-x-hidden pb-20 pt-28">
      <SiteHeader active="articles" />
      <LibraryExplorer />
      <SiteFooter />
    </main>
  );
}
