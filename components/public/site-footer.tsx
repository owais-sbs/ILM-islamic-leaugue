'use client';

import Link from 'next/link';
import { Instagram, Linkedin, Youtube } from 'lucide-react';
import { Brand } from './brand';

export function SiteFooter() {
  return (
    <footer className="bg-ilm-navy-deep text-white">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-6 py-16 lg:flex-row lg:justify-between lg:px-8">
        <div>
          <Brand tone="light" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/50">
            A home for thoughtful learning
            <br />
            and soulful conversation.
          </p>
        </div>
        <div className="flex gap-16">
          <div className="flex flex-col gap-3 text-sm text-white/60">
            <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-ilm-gold-light">Explore</span>
            <Link href="/about" className="hover:text-ilm-gold-light">About Us</Link>
            <Link href="/articles" className="hover:text-ilm-gold-light">Articles</Link>
            <Link href="/murabbiyun" className="hover:text-ilm-gold-light">Murabbiyūn</Link>
          </div>
          <div className="flex flex-col gap-3 text-sm text-white/60">
            <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-ilm-gold-light">Connect</span>
            <Link href="/ask" className="hover:text-ilm-gold-light">Ask a question</Link>
            <Link href="/contact" className="hover:text-ilm-gold-light">Contact us</Link>
            <Link href="/disclaimer" className="hover:text-ilm-gold-light">Disclaimer</Link>
            <Link href="/login" className="hover:text-ilm-gold-light">Contributor portal</Link>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 border-t border-white/10 px-6 py-6 text-[11px] text-white/35 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
          <span>© 2026 Islamic League of Murabbiyūn</span>
<<<<<<< HEAD
          <span className="hidden text-white/20 sm:inline">·</span>
          <a
            href="https://onepathsolutions.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/45 transition hover:text-ilm-gold-light"
          >
            Website made by OnePath Solutions
          </a>
=======
          <span className="hidden text-white/20 sm:inline" aria-hidden>
            ·
          </span>
          <span>
            Website by{' '}
            <a
              href="https://onepathsolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/55 underline-offset-2 transition-colors hover:text-ilm-gold-light hover:underline"
            >
              One Path Solutions
            </a>
          </span>
>>>>>>> 5101914cc611ead94a3bf675e32733332f278d46
        </div>
        <div className="flex items-center gap-5">
          <Link href="/#top" className="hover:text-ilm-gold-light">Privacy</Link>
          <Link href="/disclaimer" className="hover:text-ilm-gold-light">Disclaimer</Link>
          <Link href="/#top" aria-label="Instagram" className="hover:text-ilm-gold-light"><Instagram size={15} /></Link>
          <Link href="/#top" aria-label="LinkedIn" className="hover:text-ilm-gold-light"><Linkedin size={15} /></Link>
          <Link href="/#top" aria-label="YouTube" className="hover:text-ilm-gold-light"><Youtube size={15} /></Link>
        </div>
      </div>
    </footer>
  );
}
