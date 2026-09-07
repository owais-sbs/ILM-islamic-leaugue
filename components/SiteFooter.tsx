'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Instagram, Linkedin, Mail } from 'lucide-react';
import { SiteLogo } from '@/components/Logo';
import { categories } from '@/lib/data';

export function SiteFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="bg-ilm-navy px-6 py-14 text-white md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          <div>
            <Link href="/" aria-label="ILM home">
              <SiteLogo size="footer" onDark />
            </Link>
            <p className="mt-4 max-w-[220px] text-xs leading-6 text-white/50">
              A considered library of Islamic thought, practice, and renewal.
            </p>
          </div>
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[.2em] text-ilm-gold">Explore</p>
            <div className="grid gap-3 text-sm text-white/70">
              <Link href="/articles" className="transition hover:text-ilm-gold">Article library</Link>
              <Link href="/murabbiyun" className="transition hover:text-ilm-gold">Murabbiyūn</Link>
              <Link href="/about" className="transition hover:text-ilm-gold">About ILM</Link>
              <Link href="/contact" className="transition hover:text-ilm-gold">Contact</Link>
            </div>
          </div>
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[.2em] text-ilm-gold">Subjects</p>
            <div className="grid gap-3 text-sm text-white/70">
              {categories.slice(0, 4).map((c) => (
                <Link key={c.id} href={`/categories/${c.slug}`} className="transition hover:text-ilm-gold">{c.name}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[.2em] text-ilm-gold">Stay in touch</p>
            {subscribed ? (
              <p className="text-sm text-white/70">Thank you — your first letter is on its way.</p>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); if (email.trim()) setSubscribed(true); }}
                className="flex flex-col gap-2"
              >
                <label htmlFor="footer-email" className="sr-only">Email address</label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="h-10 rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-ilm-gold focus:ring-1 focus:ring-ilm-gold/40"
                />
                <button
                  type="submit"
                  className="h-10 rounded-lg bg-ilm-gold px-4 text-[10px] font-semibold uppercase tracking-[.13em] text-white transition hover:bg-ilm-gold-dark"
                >
                  Subscribe
                </button>
              </form>
            )}
            <div className="mt-5 flex gap-2">
              <Link href="/contact" aria-label="Email" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-ilm-gold/85 transition hover:border-ilm-gold hover:text-ilm-gold">
                <Mail size={16} />
              </Link>
              <Link href="/contact" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-ilm-gold/85 transition hover:border-ilm-gold hover:text-ilm-gold">
                <Instagram size={16} />
              </Link>
              <Link href="/contact" aria-label="LinkedIn" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-ilm-gold/85 transition hover:border-ilm-gold hover:text-ilm-gold">
                <Linkedin size={16} />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 text-[10px] uppercase tracking-[.12em] text-white/40 sm:flex-row">
          <span>© {new Date().getFullYear()} Islamic League of Murabbiyūn</span>
          <div className="flex gap-4">
            <Link href="/disclaimer" className="transition hover:text-ilm-gold">Disclaimer</Link>
            <Link href="/contact" className="transition hover:text-ilm-gold">Contact</Link>
            <Link href="/rss.xml" className="transition hover:text-ilm-gold">RSS</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
