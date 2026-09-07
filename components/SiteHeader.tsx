'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, Menu, Search, X } from 'lucide-react';
import { SiteLogo } from '@/components/Logo';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { usePublicCategories } from '@/hooks/usePublicCategories';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Murabbiyūn', href: '/murabbiyun' },
  { label: 'Ask a question', href: '/ask' },
  { label: 'Contact', href: '/contact' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const categories = usePublicCategories();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setLibraryOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const isActive = (href: string) => pathname === href;
  const linkCls = (active: boolean) =>
    cn(
      'relative rounded-md px-1 py-2 text-[11px] font-medium uppercase tracking-[.12em] transition-colors duration-200',
      active ? 'text-ilm-gold' : 'text-white/80 hover:text-white',
    );

  const libraryActive =
    libraryOpen || pathname.startsWith('/articles') || pathname.startsWith('/categories');

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
    setSearchOpen(false);
    setSearchQuery('');
  };

  const mobileLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Article Library', href: '/articles' },
    { label: 'Murabbiyūn', href: '/murabbiyun' },
    { label: 'Search', href: '/search' },
    { label: 'Ask a Question', href: '/ask' },
    { label: 'Contact', href: '/contact' },
    { label: 'Admin Panel', href: '/admin' },
  ];

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <AnnouncementBar />

      <div
        className={cn(
          'px-4 transition-all duration-300 md:px-6',
          scrolled ? 'pt-1.5' : 'pt-2',
        )}
      >
        <div
          className={cn(
            'mx-auto flex max-w-7xl items-center justify-between gap-3 overflow-visible rounded-xl border border-white/10 bg-ilm-navy px-4 py-2 shadow-[0_4px_24px_rgba(15,22,87,.4)] backdrop-blur-xl transition-shadow duration-300 md:gap-4 md:px-5',
            scrolled && 'shadow-[0_8px_32px_rgba(15,22,87,.55)]',
          )}
        >
          <Link
            href="/"
            className="flex shrink-0 items-center md:min-w-[160px] lg:min-w-[200px]"
            aria-label="Islamic League of Murabbiyūn — home"
          >
            <SiteLogo size="header" onDark />
          </Link>

          <nav className="hidden items-center gap-4 lg:flex xl:gap-5" aria-label="Main">
            <Link href="/about" className={linkCls(isActive('/about'))}>About</Link>

            <div className="relative">
              <button
                type="button"
                onClick={() => setLibraryOpen((o) => !o)}
                className={cn(linkCls(libraryActive), 'flex items-center gap-1')}
                aria-expanded={libraryOpen}
                aria-haspopup="true"
              >
                Article Library
                <ChevronDown
                  size={13}
                  className={cn('transition-transform duration-200', libraryOpen && 'rotate-180')}
                  aria-hidden
                />
              </button>

              {libraryOpen && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-[90] cursor-default bg-transparent"
                    aria-label="Close menu"
                    onClick={() => setLibraryOpen(false)}
                  />
                  <div
                    className="animate-fade-in absolute left-1/2 top-[calc(100%+8px)] z-[100] w-[23rem] -translate-x-1/2 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_24px_64px_rgba(15,22,87,.22)]"
                  >
                    <div className="border-b border-slate-50 px-4 py-3">
                      <p className="text-[9px] font-semibold uppercase tracking-[.22em] text-slate-400">
                        Browse by subject
                      </p>
                    </div>
                    <div className="max-h-[min(60vh,320px)] overflow-y-auto p-2">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/categories/${cat.slug}`}
                          onClick={() => setLibraryOpen(false)}
                          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-[#F9F8F5] focus-visible:bg-[#F9F8F5] focus-visible:outline-none"
                        >
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ilm-gold/40 transition group-hover:bg-ilm-gold" />
                          <div className="min-w-0">
                            <span className="block truncate font-display text-[14px] text-ilm-navy">{cat.name}</span>
                            <span className="block text-[11px] text-slate-400">{cat.articleCount} articles</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-slate-50 p-2">
                      <Link
                        href="/articles"
                        onClick={() => setLibraryOpen(false)}
                        className="block rounded-lg px-3 py-2.5 text-center text-[10px] font-semibold uppercase tracking-[.14em] text-ilm-gold transition hover:bg-[#F9F8F5] focus-visible:bg-[#F9F8F5] focus-visible:outline-none"
                      >
                        View all articles →
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkCls(isActive(link.href))}>
                {link.label}
              </Link>
            ))}

            {/* Desktop search — icon expands to inline field */}
            <div className="relative flex items-center">
              {searchOpen ? (
                <form onSubmit={submitSearch} className="flex items-center gap-1">
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles…"
                    aria-label="Search articles"
                    className="h-9 w-44 rounded-lg border border-white/15 bg-white/10 px-3 text-[12px] text-white placeholder:text-white/40 outline-none transition focus:border-ilm-gold/50 focus:bg-white/15 focus:ring-2 focus:ring-ilm-gold/20 xl:w-52"
                  />
                  <button
                    type="button"
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    aria-label="Close search"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    <X size={15} />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg transition',
                    isActive('/search')
                      ? 'bg-white/10 text-ilm-gold'
                      : 'text-white/75 hover:bg-white/10 hover:text-white',
                  )}
                >
                  <Search size={17} strokeWidth={1.75} />
                </button>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-1.5">
            <Link
              href="/search"
              aria-label="Search"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-white/75 transition hover:bg-white/10 hover:text-white lg:hidden"
            >
              <Search size={17} strokeWidth={1.75} />
            </Link>
            <Link
              href="/admin"
              className="hidden min-h-[36px] items-center rounded-lg border border-ilm-gold/60 bg-ilm-gold/10 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[.12em] text-ilm-gold transition hover:bg-ilm-gold hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ilm-gold/40 sm:inline-flex"
            >
              Admin
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 text-white transition hover:bg-white/10 lg:hidden"
            >
              {menuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="animate-fade-in mx-4 mt-2 overflow-hidden rounded-xl border border-white/10 bg-ilm-navy shadow-2xl md:mx-6 lg:hidden">
          <div className="divide-y divide-white/[0.07]">
            {mobileLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'flex min-h-[44px] items-center px-5 py-3 text-[13px] font-medium transition',
                  pathname === item.href ? 'text-ilm-gold' : 'text-white/80 hover:bg-white/5 hover:text-white',
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
