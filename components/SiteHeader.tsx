'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, Search, X } from 'lucide-react';
import { SiteLogo } from '@/components/Logo';
import { categories } from '@/lib/data';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Murabbiyūn', href: '/murabbiyun' },
  { label: 'Search', href: '/search' },
  { label: 'Ask a question', href: '/ask' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setLibraryOpen(false);
  }, [pathname]);

  const navClass = (active: boolean) =>
    cn('transition-colors hover:text-white', active ? 'text-ilm-gold' : 'text-white/90');

  return (
    <header className={`fixed left-0 right-0 top-0 z-50 px-4 transition-all duration-500 md:px-6 lg:px-8 ${scrolled ? 'pt-3' : 'pt-5'}`}>
      <div
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl border border-white/10 bg-ilm-navy/95 px-4 py-2 shadow-[0_8px_32px_rgba(15,22,87,.35)] backdrop-blur-xl transition-all duration-500 md:px-6 md:py-2.5',
          scrolled && 'shadow-[0_12px_40px_rgba(15,22,87,.45)]',
        )}
      >
        <Link href="/" className="flex shrink-0 items-center py-0.5 md:min-w-[200px] lg:min-w-[240px]" aria-label="Islamic League of Murabbiyūn home">
          <SiteLogo size="header" onDark />
        </Link>

        <nav className="hidden items-center gap-6 text-[11px] font-medium uppercase tracking-[.13em] lg:flex xl:gap-7">
          {navLinks.slice(0, 1).map((link) => (
            <Link key={link.href} href={link.href} className={navClass(pathname === link.href)}>
              {link.label}
            </Link>
          ))}

          <div className="relative">
            <button
              onClick={() => setLibraryOpen(!libraryOpen)}
              className={navClass(
                libraryOpen || pathname.startsWith('/articles') || pathname.startsWith('/categories'),
              )}
            >
              <span className="flex items-center gap-1">
                Article library
                <ChevronDown size={14} className={cn('transition-transform', libraryOpen && 'rotate-180')} />
              </span>
            </button>
            {libraryOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLibraryOpen(false)} aria-hidden />
                <div className="absolute left-1/2 top-9 z-50 w-[22rem] -translate-x-1/2 rounded-2xl border border-slate-200/80 bg-white p-2 text-left shadow-[0_24px_60px_rgba(15,22,87,.2)]">
                  <div className="mb-1 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[.2em] text-slate-400">
                    Explore the library
                  </div>
                  {categories.slice(0, 4).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      onClick={() => setLibraryOpen(false)}
                      className="group flex items-start gap-3 rounded-xl p-3 transition hover:bg-ilm-cream"
                    >
                      <span className="mt-1.5 h-2 w-0.5 shrink-0 rounded-full bg-ilm-gold/40 transition-all group-hover:h-5 group-hover:bg-ilm-gold" />
                      <span>
                        <span className="block font-display text-[15px] text-ilm-navy">{cat.name}</span>
                        <span className="mt-0.5 block text-[11px] leading-5 text-slate-500">{cat.description}</span>
                      </span>
                    </Link>
                  ))}
                  <Link
                    href="/articles"
                    onClick={() => setLibraryOpen(false)}
                    className="mt-1 block rounded-xl px-3 py-2.5 text-center text-[10px] font-semibold uppercase tracking-[.15em] text-ilm-gold transition hover:bg-ilm-cream"
                  >
                    View all articles →
                  </Link>
                </div>
              </>
            )}
          </div>

          {navLinks.slice(1).map((link) => (
            <Link key={link.href} href={link.href} className={navClass(pathname === link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10 hover:text-white"
          >
            <Search size={17} />
          </Link>
          <Link
            href="/admin"
            className="hidden rounded-full bg-ilm-gold px-4 py-2 text-[10px] font-semibold uppercase tracking-[.13em] text-ilm-navy transition hover:bg-ilm-gold-light sm:block"
          >
            Admin
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white lg:hidden"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mx-auto mt-2 max-w-7xl rounded-2xl border border-white/10 bg-ilm-navy p-4 shadow-2xl lg:hidden">
          <div className="grid gap-1">
            {[
              { label: 'About', href: '/about' },
              { label: 'Article library', href: '/articles' },
              { label: 'Murabbiyūn', href: '/murabbiyun' },
              { label: 'Search', href: '/search' },
              { label: 'Ask a question', href: '/ask' },
              { label: 'Admin panel', href: '/admin' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 font-display text-xl text-white transition hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
