import Link from 'next/link';
import { Instagram, Linkedin, Mail } from 'lucide-react';
import { SiteLogo } from '@/components/Logo';
import { categories } from '@/lib/data';

export function SiteFooter() {
  return (
    <footer className="bg-ilm-navy px-6 py-14 text-white md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" aria-label="ILM home">
              <SiteLogo size="footer" onDark />
            </Link>
          </div>
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[.2em] text-ilm-gold">Explore</p>
            <div className="grid gap-3 text-sm text-white/70">
              <Link href="/articles" className="transition hover:text-ilm-gold">Article library</Link>
              <Link href="/murabbiyun" className="transition hover:text-ilm-gold">Murabbiyūn</Link>
              <Link href="/about" className="transition hover:text-ilm-gold">About ILM</Link>
            </div>
          </div>
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[.2em] text-ilm-gold">Subjects</p>
            <div className="grid gap-3 text-sm text-white/70">
              {categories.slice(0, 3).map((c) => (
                <Link key={c.id} href={`/categories/${c.slug}`} className="transition hover:text-ilm-gold">{c.name}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[.2em] text-ilm-gold">Connect</p>
            <div className="flex gap-2">
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
          <span>© 2024 Islamic League of Murabbiyūn</span>
          <Link href="/disclaimer" className="transition hover:text-ilm-gold">Disclaimer</Link>
        </div>
      </div>
    </footer>
  );
}
