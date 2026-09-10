'use client';

import { Hero } from '@/components/public/hero';
import { HomeSections } from '@/components/public/home-sections';
import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <SiteHeader active="about" />
      <Hero />
      <HomeSections />
      <SiteFooter />
    </main>
  );
}
