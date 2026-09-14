'use client';

import Link from 'next/link';
import { Instagram, Linkedin, Youtube } from 'lucide-react';
import { murabbiyūn } from '@/lib/public-data';
import { Brand } from './brand';

export function SiteFooter() {
  return (
    <footer className="mt-auto w-full shrink-0 bg-ilm-navy-deep text-white">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[1.1fr_0.9fr_1fr_1fr] lg:gap-8 lg:px-8">
        <div>
          <Brand tone="light" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
            A home for thoughtful learning and soulful conversation.
          </p>
        </div>
        <div className="flex flex-col gap-2.5 text-sm text-white/60">
          <span className="mb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-ilm-gold-light">Explore</span>
          <Link href="/" className="hover:text-ilm-gold-light">Home</Link>
          <Link href="/about" className="hover:text-ilm-gold-light">About Us</Link>
          <Link href="/articles" className="hover:text-ilm-gold-light">Articles</Link>
          <Link href="/murabbiyun" className="hover:text-ilm-gold-light">Murabbiyūn</Link>
        </div>
        <div className="flex flex-col gap-2.5 text-sm text-white/60">
          <span className="mb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-ilm-gold-light">Connect</span>
          <Link href="/ask" className="hover:text-ilm-gold-light">Ask a question</Link>
          <Link href="/contact" className="hover:text-ilm-gold-light">Contact us</Link>
          <Link href="/disclaimer" className="hover:text-ilm-gold-light">Disclaimer</Link>
          <Link href="/login" className="hover:text-ilm-gold-light">Contributor portal</Link>
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
            © 2026 MD Abidi Arthritis Institute. All Rights Reserved. · Website by{' '}
            <a
              href="https://onepathsolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/55 transition hover:text-ilm-gold-light"
            >
              One Path Solutions
            </a>
          </p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
            <Link href="/disclaimer" className="hover:text-ilm-gold-light">Disclaimer</Link>
            <Link href="/#top" aria-label="Instagram" className="hover:text-ilm-gold-light"><Instagram size={15} /></Link>
            <Link href="/#top" aria-label="LinkedIn" className="hover:text-ilm-gold-light"><Linkedin size={15} /></Link>
            <Link href="/#top" aria-label="YouTube" className="hover:text-ilm-gold-light"><Youtube size={15} /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
