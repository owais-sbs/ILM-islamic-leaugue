'use client';

import { Suspense } from 'react';
import { LibraryExplorer } from '@/components/public/library-explorer';
import { MurabbiyunDirectory } from '@/components/public/murabbiyun-directory';
import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';

export default function ArticlesPage() {
  return (
    <main className="flex min-h-[100svh] flex-col overflow-x-hidden pt-28">
      <SiteHeader active="articles" />
      <div className="flex-1 pb-12">
        <Suspense fallback={<div className="px-4 py-16 text-ilm-navy/40 sm:px-6">Loading library…</div>}>
          <LibraryExplorer />
        </Suspense>
        <section className="mx-auto mt-16 max-w-[1280px] border-t border-ilm-navy/8 px-4 pt-12 sm:mt-20 sm:px-6 sm:pt-14 lg:px-8">
          <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ilm-gold-deep">
            <span className="h-px w-8 bg-ilm-gold" /> Murabbiyūn
          </p>
          <h2 className="mt-4 text-[28px] font-semibold tracking-tight text-ilm-navy sm:text-[36px]">
            Browse by Murabbiyūn categories
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ilm-navy/55">
            Meet the mentors behind the library. Filter by school and focus to find the guides who walk with seekers.
          </p>
        </section>
        <div className="pb-4">
          <MurabbiyunDirectory compact />
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
