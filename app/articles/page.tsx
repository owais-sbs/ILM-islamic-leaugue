'use client';

import { LibraryExplorer } from '@/components/public/library-explorer';
import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';

export default function ArticlesPage() {
  return (
    <main className="flex min-h-[100svh] flex-col overflow-x-hidden pt-28">
      <SiteHeader active="articles" />
      <div className="flex-1 pb-12">
        <LibraryExplorer />
      </div>
      <SiteFooter />
    </main>
  );
}
