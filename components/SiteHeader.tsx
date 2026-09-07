'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, Search, X } from 'lucide-react';
import { SiteLogo } from '@/components/Logo';
import { categories } from '@/lib/data';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'About',         href: '/about' },
  { label: 'Murabbiyūn',   href: '/murabbiyun' },
  { label: 'Search',        href: '/search' },
  { label: 'Ask a question',href: '/ask' },
  { label: 'Contact',       href: '/contact' },
];

export function SiteHeader() {
  const pathname       = usePathname();
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setLibraryOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href;
  const linkCls = (active: boolean) =>
    cn(
      'relative text-[11px] font-medium uppercase tracking-[.12em] transition-colors duration-200',
      active
        ? 'text-ilm-gold'
        : 'text-white/80 hover:text-white',
    );

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 px-4 transition-all duration-300 md:px-6',
        scrolled ? 'pt-2' : 'pt-4',
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-xl border border-white/10 bg-ilm-navy px-4 py-2.5 backdrop-blur-xl transition-all duration-300 md:px-6',
          scrolled
            ? 'shadow-[0_8px_32px_rgba(15,22,87,.55)]'
            : 'shadow-[0_4px_20px_rgba(15,22,87,.35)]',
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center md:min-w-[180px] lg:min-w-[220px]"
          aria-label="Islamic League of Murabbiyūn — home"
        >
          <SiteLogo size="header" onDark />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 lg:flex xl:gap-6">
          {/* About */}
          <Link href="/about" className={linkCls(isActive('/about'))}>
            About
          </Link>

          {/* Article Library dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLibraryOpen(!libraryOpen)}
              className={linkCls(
                libraryOpen ||
                pathname.startsWith('/articles') ||
                pathname.startsWith('/categories'),
              )}
            >
              <span className="flex items-center gap-1">
                Article Library
                <ChevronDown
                  size={13}
                  className={cn('transition-transform duration-200', libraryOpen && 'rotate-180')}
                />
              </span>
            </button>

            {libraryOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLibraryOpen(false)}
                  aria-hidden
                />
                <div className="animate-fade-in absolute left-1/2 top-10 z-50 w-[23rem] -translate-x-1/2 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_20px_60px_rgba(15,22,87,.18)]">
                  <div className="border-b border-slate-50 px-4 py-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[.22em] text-slate-400">
                      Browse by subject
                    </p>
                  </div>
                  <div className="p-2">
                    {categories.slice(0, 6).map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/categories/${cat.slug}`}
                        onClick={() => setLibraryOpen(false)}
                        className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-[#F9F8F5]"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ilm-gold/40 transition group-hover:bg-ilm-gold" />
                        <div className="min-w-0">
                          <span className="block font-display text-[14px] text-ilm-navy">{cat.name}</span>
                          <span className="block text-[11px] text-slate-400">{cat.articleCount} articles</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-slate-50 p-2">
                    <Link
                      href="/articles"
                      onClick={() => setLibraryOpen(false)}
                      className="block rounded-lg px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-[.14em] text-ilm-gold transition hover:bg-[#F9F8F5]"
                    >
                      View all articles →
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Remaining nav links */}
          {navLinks.slice(1).map((link) => (
            <Link key={link.href} href={link.href} className={linkCls(isActive(link.href))}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <Search size={16} />
          </Link>
          <Link
            href="/admin"
            className="hidden rounded-lg border border-ilm-gold/60 bg-ilm-gold/10 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[.12em] text-ilm-gold transition hover:bg-ilm-gold hover:text-white sm:block"
          >
            Admin
          </Link>
          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 text-white lg:hidden"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="animate-fade-in mx-auto mt-2 max-w-7xl overflow-hidden rounded-xl border border-white/10 bg-ilm-navy shadow-2xl lg:hidden">
          <div className="divide-y divide-white/[0.07]">
            {[
              { label: 'Home',          href: '/' },
              { label: 'About',         href: '/about' },
              { label: 'Article Library',href: '/articles' },
              { label: 'Murabbiyūn',   href: '/murabbiyun' },
              { label: 'Search',        href: '/search' },
              { label: 'Ask a Question',href: '/ask' },
              { label: 'Contact',       href: '/contact' },
              { label: 'Admin Panel',   href: '/admin' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'block px-5 py-3.5 text-[13px] font-medium transition',
                  pathname === item.href ? 'text-ilm-gold' : 'text-white/80 hover:text-white',
                )}
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
