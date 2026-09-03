import { cn } from '@/lib/utils';

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
    <section className={cn('border-b border-ilm-navy/[0.06] bg-ilm-cream/40 px-6 pb-14 pt-36 md:px-12 md:pb-20 md:pt-44', className)}>
      <div className="mx-auto max-w-7xl">
        {eyebrow && (
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[.28em] text-ilm-gold">{eyebrow}</p>
        )}
        <h1 className="max-w-3xl font-display text-4xl leading-[1.05] text-ilm-navy md:text-6xl">{title}</h1>
        {description && (
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{description}</p>
        )}
        {children}
      </div>
    </section>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-[10px] font-semibold uppercase tracking-[.25em] text-ilm-gold">{children}</p>
  );
}

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
        'rounded-3xl border border-slate-200/70 bg-white p-6 shadow-[0_2px_24px_rgba(15,22,87,0.05)] transition hover:border-ilm-gold/30 hover:shadow-[0_16px_40px_rgba(15,22,87,0.08)] md:p-8',
        className,
      )}
    >
      {children}
    </div>
  );
}
