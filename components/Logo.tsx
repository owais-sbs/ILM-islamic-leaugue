import { cn } from '@/lib/utils';

const markSizes = {
  sm: 'h-9 w-9 rounded-lg p-1',
  md: 'h-10 w-10 rounded-lg p-1',
  lg: 'h-12 w-12 rounded-xl p-1.5',
  xl: 'h-14 w-14 rounded-xl p-1.5',
  header: 'h-11 w-12 rounded-xl sm:h-12 sm:w-14 md:h-14 md:w-16',
};

/** Full logo lockup from ILM_Final_Logo_Design.png — for header & footer on dark navy */
export function SiteLogo({
  size = 'header',
  onDark = false,
  className,
}: {
  size?: 'sm' | 'header' | 'footer';
  onDark?: boolean;
  className?: string;
}) {
  const heights = {
    sm: 'h-9',
    header: 'h-12 sm:h-14 md:h-[3.75rem] lg:h-[4.25rem]',
    footer: 'h-14 md:h-16',
  };

  return (
    <img
      src="/ILM_Final_Logo_Design.png"
      alt="Islamic League of Murabbiyūn"
      className={cn(
        'w-auto object-contain object-left',
        heights[size],
        onDark && 'mix-blend-screen',
        className,
      )}
    />
  );
}

/** Icon mark only — ILM_Final_Logo_Icon.png */
export function LogoMark({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'header';
  className?: string;
}) {
  return (
    <span className={cn('flex shrink-0 items-center justify-center overflow-hidden', markSizes[size], className)} aria-hidden>
      <img src="/ILM_Final_Logo_Icon.png" alt="" className="h-full w-full object-contain" />
    </span>
  );
}

export function BrandLockup({
  size = 'md',
  showTagline = false,
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}) {
  const wordmarkSizes = {
    sm: 'text-[11px] leading-tight',
    md: 'text-xs leading-tight',
    lg: 'text-sm leading-tight',
  };

  return (
    <span className={cn('flex items-center gap-3', className)}>
      <SiteLogo size="sm" />
      <span className="min-w-0">
        <span className={cn('block font-display font-semibold text-ilm-navy', wordmarkSizes[size])}>
          Islamic League of Murabbiyūn
        </span>
        {showTagline && (
          <>
            <span className="gold-rule mt-1.5 mb-1 block w-full max-w-[220px]" />
            <span className="block text-[8px] font-medium uppercase tracking-[.18em] text-slate-500">
              Mentors · Educators · Cultivators
            </span>
          </>
        )}
      </span>
    </span>
  );
}

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg'; variant?: 'dark' | 'light' }) {
  return <SiteLogo size="sm" />;
}
