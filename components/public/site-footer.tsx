'use client';

import Link from 'next/link';
import { Instagram, Linkedin, Youtube } from 'lucide-react';
import { Brand } from './brand';

export function SiteFooter() {
  return (
    <footer className="mt-auto w-full shrink-0 bg-ilm-navy-deep text-white">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10 px-4 py-12 sm:gap-12 sm:px-6 sm:py-16 lg:flex-row lg:justify-between lg:px-8">
        <div className="max-w-sm">
          <Brand tone="light" />
          <p className="mt-5 text-sm leading-relaxed text-white/50 sm:mt-6">
            A home for thoughtful learning
            <br className="hidden sm:block" />
            {' '}and soulful conversation.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:gap-16">
          <div className="flex flex-col gap-2.5 text-sm text-white/60 sm:gap-3">
            <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-ilm-gold-light">Explore</span>
            <Link href="/about" className="hover:text-ilm-gold-light">About Us</Link>
            <Link href="/articles" className="hover:text-ilm-gold-light">Articles</Link>
            <Link href="/murabbiyun" className="hover:text-ilm-gold-light">Murabbiyūn</Link>
          </div>
          <div className="flex flex-col gap-2.5 text-sm text-white/60 sm:gap-3">
            <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-ilm-gold-light">Connect</span>
            <Link href="/ask" className="hover:text-ilm-gold-light">Ask a question</Link>
            <Link href="/contact" className="hover:text-ilm-gold-light">Contact us</Link>
            <Link href="/disclaimer" className="hover:text-ilm-gold-light">Disclaimer</Link>
            <Link href="/login" className="hover:text-ilm-gold-light">Contributor portal</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-4 py-5 text-[11px] text-white/35 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6 lg:px-8">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-1">
            <span>© 2026 Islamic League of Murabbiyūn</span>
            <span className="hidden text-white/20 sm:inline" aria-hidden>
              ·
            </span>
            <a
              href="https://onepathsolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/45 transition hover:text-ilm-gold-light"
            >
              Website made by OnePath Solutions
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
            <Link href="/#top" className="hover:text-ilm-gold-light">Privacy</Link>
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
