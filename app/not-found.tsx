import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Page not found',
  description: 'The page you are looking for could not be found on ILM.',
  path: '/404',
  noIndex: true,
});

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      <section className="mx-auto max-w-xl px-6 pb-24 pt-[calc(var(--site-header-offset)+3rem)] text-center md:px-12">
        <p className="text-[10px] font-semibold uppercase tracking-[.25em] text-ilm-gold">404</p>
        <h1 className="mt-3 font-display text-4xl text-ilm-navy">Page not found</h1>
        <p className="mt-4 text-sm leading-7 text-slate-500">
          This page may have moved, or the link may be outdated. Return to the library to continue
          reading.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="ilm-btn-primary rounded-full">
            Home
          </Link>
          <Link href="/articles" className="ilm-btn-secondary rounded-full">
            Article library
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
