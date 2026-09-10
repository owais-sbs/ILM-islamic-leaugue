'use client';

import { MurabbiyunDirectory } from '@/components/public/murabbiyun-directory';
import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';

export default function MurabbiyunPage() {
  return (
    <main id="directory" className="min-h-screen overflow-x-hidden pb-16 pt-28">
      <SiteHeader active="murabbiyun" />
      <MurabbiyunDirectory />
      <SiteFooter />
    </main>
  );
}
