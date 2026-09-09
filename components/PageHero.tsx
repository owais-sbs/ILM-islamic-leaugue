import { cn } from '@/lib/utils';

/* ─── PageHero ───────────────────────────────────────────
   Used by every inner page for consistent top-of-page
   hero treatment.
─────────────────────────────────────────────────────────── */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'relative overflow-hidden border-b border-ilm-navy/[0.07] bg-[#F9F8F5] px-6 pb-12 pt-[calc(var(--site-header-offset)+var(--site-header-gap)+1.5rem)] md:px-12 md:pb-16 md:pt-[calc(var(--site-header-offset)+var(--site-header-gap)+2rem)]',
        className,
      )}
    >
      {/* Subtle geometric bg */}
      <div className="pattern-geo pointer-events-none absolute inset-0" aria-hidden />
      {/* Gold accent line */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-ilm-gold/40 via-ilm-gold/10 to-transparent" aria-hidden />

      <div className="relative mx-auto max-w-7xl">
        {eyebrow && (
          <div className="mb-4 flex items-center gap-2.5">
            <span className="h-px w-6 bg-ilm-gold" />
            <p className="text-[10px] font-semibold uppercase tracking-[.28em] text-ilm-gold">
              {eyebrow}
            </p>
          </div>
        )}
        <h1 className="max-w-3xl font-display text-[2.25rem] leading-[1.08] tracking-[-0.02em] text-ilm-navy md:text-[3.25rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-500">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

/* ─── SectionLabel ───────────────────────────────────────
   Small eyebrow label used above section headings
─────────────────────────────────────────────────────────── */
export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mb-3 flex items-center gap-2', className)}>
      <span className="h-px w-5 bg-ilm-gold/60" />
      <p className="text-[10px] font-semibold uppercase tracking-[.26em] text-ilm-gold">
        {children}
      </p>
    </div>
  );
}

/* ─── ModernCard ─────────────────────────────────────────
   Standard white elevated card used across content pages
─────────────────────────────────────────────────────────── */
export function ModernCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_2px_20px_rgba(15,22,87,0.05)] transition-shadow hover:shadow-[0_8px_32px_rgba(15,22,87,0.09)] md:p-8',
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ─── Divider ────────────────────────────────────────────
   Thin gold-accented horizontal divider
─────────────────────────────────────────────────────────── */
export function GoldDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn('h-px w-full bg-gradient-to-r from-ilm-gold/50 via-ilm-gold/20 to-transparent', className)}
      aria-hidden
    />
  );
}
