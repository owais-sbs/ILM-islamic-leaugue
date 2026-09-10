'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, BookOpen, ChevronDown, MoveUpRight, Sprout } from 'lucide-react';
import { GeometricOrnament } from './brand';
import { heroImage } from '@/lib/public-data';
import { useRef } from 'react';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0.15]);

  return (
    <section ref={ref} id="top" className="relative min-h-[100svh] overflow-hidden pt-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(199,154,61,0.08),transparent_42%)]" />
      <GeometricOrnament className="absolute -right-6 top-24 hidden h-[420px] w-[280px] lg:block" />

      <div className="relative mx-auto grid min-h-[calc(100svh-7rem)] max-w-[1280px] items-center gap-10 px-6 pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <motion.div style={{ y: copyY, opacity: fade }} className="relative z-10 max-w-[560px]">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ilm-gold-deep"
          >
            <span className="h-px w-8 bg-ilm-gold" /> A living tradition of guidance
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
            className="mt-6 text-[52px] font-semibold leading-[0.98] tracking-[-0.045em] text-ilm-navy sm:text-[68px] lg:text-[76px]"
          >
            For those who
            <br />
            <em className="font-serif italic font-normal text-ilm-gold">cultivate</em>
            <br />
            goodness.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32 }}
            className="mt-6 max-w-[420px] text-[16px] leading-[1.75] text-ilm-navy/60"
          >
            ILM is a home for thoughtful learning, soulful conversation, and the people who help us become more fully human.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42 }}
            className="mt-9 flex flex-wrap items-center gap-6"
          >
            <Link
              href="/articles"
              className="inline-flex items-center gap-2.5 rounded-full bg-ilm-navy px-6 py-3.5 text-[13px] font-semibold text-white shadow-[0_12px_30px_rgba(11,17,82,0.18)] transition-transform hover:-translate-y-0.5"
            >
              Explore the Library <ArrowRight size={16} />
            </Link>
            <Link
              href="/#our-why"
              className="inline-flex items-center gap-1.5 border-b border-ilm-gold pb-1 text-[13px] font-semibold text-ilm-navy"
            >
              Discover Our Story <MoveUpRight size={14} />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: imageY }} className="relative mx-auto h-[520px] w-full max-w-[520px] lg:h-[560px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
            className="absolute inset-0"
          >
            <div className="absolute right-4 top-2 h-[86%] w-[86%] rounded-full border border-ilm-gold/50" />
            <div
              className="hero-blob absolute inset-y-6 right-0 left-6 overflow-hidden shadow-[0_30px_70px_rgba(11,17,82,0.16)]"
            >
              <img src={heroImage} alt="Qur’an on a wooden stand at sunrise" className="h-full w-full object-cover" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="absolute right-0 top-16 z-10 w-[230px] rounded-[22px] border border-white/80 bg-white/95 p-4 shadow-[0_16px_40px_rgba(11,17,82,0.12)] backdrop-blur"
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
            initial={{ opacity: 0, x: -20, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="absolute bottom-16 left-0 z-10 rounded-[20px] border border-white/80 bg-white/95 px-4 py-3 shadow-[0_16px_40px_rgba(11,17,82,0.12)] backdrop-blur"
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
        className="absolute bottom-8 left-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-ilm-navy/40 lg:left-12"
      >
        <span className="h-8 w-px bg-ilm-gold" />
        Scroll to explore
        <ChevronDown size={14} className="animate-bounce" />
      </a>
    </section>
  );
}
