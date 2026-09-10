'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/lib/site';

export function Brand({
  tone = 'navy',
  compact = false,
}: {
  tone?: 'navy' | 'light';
  compact?: boolean;
}) {
  const light = tone === 'light';
  return (
    <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3" aria-label={`${siteConfig.name} home`}>
      <span
        className={cn(
          'relative pl-2.5 font-serif text-[28px] leading-none tracking-[-0.14em] sm:text-[32px]',
          light ? 'text-ilm-gold-light' : 'text-ilm-navy'
        )}
      >
        <span className="absolute left-0 top-[-3px] h-1.5 w-1.5 rounded-full bg-ilm-gold" />
        ilm
      </span>
      {!compact && (
        <span
          className={cn(
            'hidden border-l pl-2.5 text-[8px] font-semibold uppercase leading-[1.25] tracking-[0.08em] sm:block sm:pl-3 sm:text-[9px]',
            light ? 'border-white/35 text-white/90' : 'border-ilm-navy/20 text-ilm-navy'
          )}
        >
          Islamic League
          <br />
          of Murabbiyūn
        </span>
      )}
    </Link>
  );
}

export function GoldRule({ className = '' }: { className?: string }) {
  return <span className={cn('inline-block h-px w-7 bg-ilm-gold', className)} />;
}

export function GeometricOrnament({ className = '' }: { className?: string }) {
  return (
    <svg
      className={cn('pointer-events-none text-ilm-gold/25', className)}
      viewBox="0 0 200 280"
      fill="none"
      aria-hidden
    >
      <g stroke="currentColor" strokeWidth="1.2">
        <path d="M100 8 L168 48 L168 128 L100 168 L32 128 L32 48 Z" />
        <path d="M100 48 L140 72 L140 120 L100 144 L60 120 L60 72 Z" />
        <circle cx="100" cy="96" r="18" />
        <path d="M100 168 L132 220 L100 272 L68 220 Z" />
        <path d="M100 196 L118 226 L100 256 L82 226 Z" />
      </g>
    </svg>
  );
}
