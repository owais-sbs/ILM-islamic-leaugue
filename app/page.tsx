'use client';

import { Hero } from '@/components/public/hero';
import { HomeSections } from '@/components/public/home-sections';
import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';

export default function HomePage() {
  return (
    <main className="flex min-h-[100svh] flex-col overflow-x-hidden">
      <SiteHeader active="about" />
      <div className="flex-1">
        <Hero />
        <HomeSections />
      </div>
      <SiteFooter />
    </main>
  );
}
