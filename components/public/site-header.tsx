'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Menu, Search, X } from 'lucide-react';
import { Brand } from './brand';
import { AskQuestionModal } from './ask-question-modal';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/about', label: 'Our Why', id: 'about' },
  {
    href: '/articles',
    label: 'Articles',
    id: 'articles',
    children: [
      { href: '/articles', label: 'Article library' },
      { href: '/search', label: 'Search' },
    ],
  },
  { href: '/murabbiyun', label: 'Murabbiyūn', id: 'murabbiyun' },
  {
    href: '/contact',
    label: 'Connect',
    id: 'connect',
    children: [
      { href: '/ask', label: 'Ask a question' },
      { href: '/contact', label: 'Contact' },
    ],
  },
];

export function SiteHeader({ active }: { active?: 'about' | 'articles' | 'murabbiyun' | 'connect' }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const current =
    active ??
    (pathname.startsWith('/articles') || pathname.startsWith('/search') || pathname.startsWith('/library')
      ? 'articles'
      : pathname.startsWith('/murabbiyun')
        ? 'murabbiyun'
        : pathname.startsWith('/ask') || pathname.startsWith('/contact')
          ? 'connect'
          : 'about');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <motion.div
          className="pointer-events-auto mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8"
          animate={{ paddingTop: scrolled ? 10 : 18 }}
          transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <motion.div
            className="flex h-[68px] items-center justify-between gap-4 rounded-full border border-ilm-navy/[0.06] bg-white px-5 shadow-[0_10px_40px_rgba(11,17,82,0.06)] sm:px-6"
            animate={{
              boxShadow: scrolled
                ? '0 14px 40px rgba(11,17,82,0.10)'
                : '0 10px 40px rgba(11,17,82,0.06)',
              height: scrolled ? 60 : 68,
            }}
            transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <Brand />

            <nav className="hidden items-center gap-7 lg:flex">
              {nav.map((item) => {
                const isActive = current === item.id;
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => item.children && setOpenMenu(item.label)}
                    onMouseLeave={() => setOpenMenu(null)}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'relative flex items-center gap-1 pb-1 text-[13.5px] font-medium transition-colors',
                        isActive ? 'text-ilm-navy' : 'text-ilm-navy/55 hover:text-ilm-navy'
                      )}
                    >
                      {item.label}
                      {item.children && <ChevronDown size={13} className="opacity-50" />}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute -bottom-0.5 left-0 right-0 mx-auto h-[2px] w-8 rounded-full bg-ilm-gold"
                        />
                      )}
                    </Link>
                    <AnimatePresence>
                      {item.children && openMenu === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          className="absolute left-1/2 top-full z-20 mt-3 w-44 -translate-x-1/2 rounded-2xl border border-ilm-navy/8 bg-white p-2 shadow-xl"
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className="block rounded-xl px-3 py-2 text-sm text-ilm-navy/70 hover:bg-ilm-cream hover:text-ilm-navy"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <button
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
                className="grid h-10 w-10 place-items-center rounded-full text-ilm-navy/70 transition-colors hover:bg-ilm-cream"
              >
                <Search size={18} />
              </button>
              <button
                onClick={() => setAskOpen(true)}
                className="hidden items-center gap-2 rounded-full bg-ilm-navy px-4 py-2.5 text-[13px] font-semibold text-white transition-transform hover:-translate-y-0.5 sm:inline-flex"
              >
                Ask a Question <ArrowRight size={15} />
              </button>
              <button
                className="grid h-10 w-10 place-items-center rounded-full text-ilm-navy lg:hidden"
                aria-label="Open menu"
                onClick={() => setMenuOpen((v) => !v)}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed inset-x-4 top-[92px] z-40 rounded-3xl border border-ilm-navy/8 bg-white p-5 shadow-2xl lg:hidden"
          >
            <div className="flex flex-col gap-3">
              {nav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'rounded-xl px-3 py-2 text-sm font-medium',
                    current === item.id ? 'bg-ilm-cream text-ilm-navy' : 'text-ilm-navy/70'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setAskOpen(true);
                }}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-ilm-navy px-4 py-3 text-sm font-semibold text-white"
              >
                Ask a Question <ArrowRight size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] grid place-items-start bg-ilm-navy/30 px-4 pt-28 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          >
            <motion.form
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              action="/search"
              onClick={(e) => e.stopPropagation()}
              className="mx-auto flex w-full max-w-xl items-center gap-3 rounded-full bg-white px-5 py-3 shadow-2xl"
            >
              <Search size={18} className="text-ilm-navy/40" />
              <input
                autoFocus
                name="q"
                placeholder="Search the library…"
                className="flex-1 bg-transparent text-sm text-ilm-navy outline-none"
              />
              <button type="submit" className="text-sm font-semibold text-ilm-navy">
                Search
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <AskQuestionModal open={askOpen} onClose={() => setAskOpen(false)} />
    </>
  );
}
