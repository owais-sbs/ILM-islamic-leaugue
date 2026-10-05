'use client';

import Link from 'next/link';
import { murabbiyūn } from '@/lib/public-data';
import { useContentManager } from '@/lib/content-manager/useContentManager';
import { Brand } from './brand';

export function SiteFooter() {
  const cm = useContentManager();
  const footer = cm.footer;

  if (!footer.visible) return null;

  const exploreLinks = footer.exploreLinks.filter((l) => l.visible).sort((a, b) => a.order - b.order);
  const connectLinks = footer.connectLinks.filter((l) => l.visible).sort((a, b) => a.order - b.order);

  return (
    <footer className="mt-auto w-full shrink-0 bg-ilm-navy-deep text-white">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[1.1fr_0.9fr_1fr_1fr] lg:gap-8 lg:px-8">
        <div>
          <Brand tone="light" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">{footer.description}</p>
        </div>

        <div className="flex flex-col gap-2.5 text-sm text-white/60">
          <span className="mb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-ilm-gold-light">Explore</span>
          {exploreLinks.map((link) => (
            <Link key={link.id} href={link.href} className="hover:text-ilm-gold-light">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-2.5 text-sm text-white/60">
          <span className="mb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-ilm-gold-light">Connect</span>
          {connectLinks.map((link) => (
            <Link key={link.id} href={link.href} className="hover:text-ilm-gold-light">
              {link.label}
            </Link>
          ))}
        </div>

        <div>
          <span className="mb-3 block text-[10px] font-medium uppercase tracking-[0.18em] text-ilm-gold-light">Murabbiyūn</span>
          <ul className="space-y-2 text-sm text-white/60">
            {murabbiyūn.map((m) => (
              <li key={m.id}>
                <Link href={`/murabbiyun/${m.id}`} className="hover:text-ilm-gold-light">
                  {m.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-4 py-5 text-[11px] text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5 lg:px-8">
          <p>
            {footer.copyright} Website by{' '}
            <a
              href="https://onepathsolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/55 transition hover:text-ilm-gold-light"
            >
              One Path Solutions
            </a>
            .
          </p>
          <nav
            aria-label="Legal"
            className="flex flex-wrap items-center justify-start gap-4 sm:justify-end sm:gap-5 sm:text-right"
          >
            <Link href="/privacy" className="hover:text-ilm-gold-light">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-ilm-gold-light">
              Terms
            </Link>
            <Link href="/disclaimer" className="hover:text-ilm-gold-light">
              Disclaimer
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
