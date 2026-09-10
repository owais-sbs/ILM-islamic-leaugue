'use client';

import { MurabbiyunDirectory } from '@/components/public/murabbiyun-directory';
import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';

export default function MurabbiyunPage() {
  return (
    <main id="directory" className="flex min-h-[100svh] flex-col overflow-x-hidden pt-28">
      <SiteHeader active="murabbiyun" />
      <div className="flex-1 pb-8">
        <MurabbiyunDirectory />
      </div>
      <SiteFooter />
    </main>
  );
}
