'use client';

import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, BookOpen, ChevronDown, MoveUpRight, Sprout } from 'lucide-react';
import { GeometricOrnament } from './brand';
import { heroImage } from '@/lib/public-data';
import { siteConfig } from '@/lib/site';
import { useRef } from 'react';

const ease = [0.22, 0.61, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 72]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 36]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0.2]);

  return (
    <section ref={ref} id="top" className="relative min-h-[100svh] overflow-hidden pt-24 sm:pt-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(199,154,61,0.08),transparent_42%)]" />
      <GeometricOrnament className="absolute -right-6 top-24 hidden h-[420px] w-[280px] lg:block" />

      <div className="relative mx-auto grid min-h-[calc(100svh-6rem)] max-w-[1280px] items-center gap-8 px-4 pb-20 sm:gap-10 sm:px-6 sm:pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <motion.div style={{ y: copyY, opacity: fade }} className="relative z-10 max-w-[560px]">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08, ease }}
            className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-ilm-gold-deep sm:text-[11px] sm:tracking-[0.22em]"
          >
            <span className="h-px w-6 bg-ilm-gold sm:w-8" /> A living tradition of guidance
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.16, ease }}
            className="mt-5 text-[40px] font-semibold leading-[1.02] tracking-[-0.045em] text-ilm-navy sm:mt-6 sm:text-[56px] sm:leading-[0.98] lg:text-[76px]"
          >
            <span className="sr-only">{siteConfig.name}. </span>
            For those who
            <br />
            <em className="font-serif italic font-normal text-ilm-gold">cultivate</em>
            <br />
            goodness.
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.3, ease }}
            className="mt-5 max-w-[420px] text-[15px] leading-[1.7] text-ilm-navy/60 sm:mt-6 sm:text-[16px] sm:leading-[1.75]"
          >
            {siteConfig.description}
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.4, ease }}
            className="mt-7 flex flex-wrap items-center gap-4 sm:mt-9 sm:gap-6"
          >
            <Link
              href="/articles"
              className="inline-flex items-center gap-2.5 rounded-full bg-ilm-navy px-5 py-3 text-[13px] font-semibold text-white shadow-[0_12px_30px_rgba(11,17,82,0.18)] transition-transform duration-300 hover:-translate-y-0.5 sm:px-6 sm:py-3.5"
            >
              Explore the Library <ArrowRight size={16} />
            </Link>
            <Link
              href="/#our-why"
              className="inline-flex items-center gap-1.5 border-b border-ilm-gold pb-1 text-[13px] font-semibold text-ilm-navy transition-colors hover:text-ilm-gold-deep"
            >
              Discover Our Story <MoveUpRight size={14} />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: imageY }}
          className="relative mx-auto h-[340px] w-full max-w-[420px] sm:h-[440px] sm:max-w-[520px] lg:h-[560px]"
        >
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.05, delay: 0.18, ease }}
            className="absolute inset-0"
          >
            <motion.div
              className="absolute right-2 top-1 h-[86%] w-[86%] rounded-full border border-ilm-gold/50 sm:right-4 sm:top-2"
              animate={reduce ? undefined : { rotate: [0, 2, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="hero-blob absolute inset-y-4 right-0 left-4 overflow-hidden shadow-[0_30px_70px_rgba(11,17,82,0.16)] sm:inset-y-6 sm:left-6">
              <img src={heroImage} alt="Open Qur’an" className="h-full w-full object-cover" />
            </div>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, x: 24, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.75, delay: 0.55, ease }}
            className="absolute right-0 top-8 z-10 hidden w-[200px] rounded-[22px] border border-white/80 bg-white/95 p-3 shadow-[0_16px_40px_rgba(11,17,82,0.12)] backdrop-blur sm:top-16 sm:block sm:w-[230px] sm:p-4"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-full bg-ilm-cream text-ilm-gold-deep">
                <Sprout size={15} />
              </span>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-ilm-navy">Ideas with Roots</p>
                <p className="mt-0.5 text-[11px] leading-snug text-ilm-navy/50">
                  Deepen your understanding, live with purpose.
                </p>
              </div>
              <ArrowRight size={14} className="mt-1 text-ilm-navy/30" />
            </div>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, x: -20, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.75, delay: 0.68, ease }}
            className="absolute bottom-8 left-0 z-10 hidden rounded-[20px] border border-white/80 bg-white/95 px-4 py-3 shadow-[0_16px_40px_rgba(11,17,82,0.12)] backdrop-blur sm:bottom-16 sm:block"
          >
            <p className="flex items-center gap-2 text-[13px] font-semibold text-ilm-navy">
              <BookOpen size={15} className="text-ilm-gold-deep" />
              Knowledge <span className="text-ilm-navy/40">→</span> Character
            </p>
          </motion.div>
        </motion.div>
      </div>

      <a
        href="#our-why"
        className="absolute bottom-5 left-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ilm-navy/40 sm:bottom-8 sm:left-6 sm:gap-3 sm:tracking-[0.2em] lg:left-12"
      >
        <span className="h-6 w-px bg-ilm-gold sm:h-8" />
        Scroll to explore
        <ChevronDown size={14} className="animate-bounce" />
      </a>
    </section>
  );
}
