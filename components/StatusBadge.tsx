import { cn } from '@/lib/utils';
import type { ArticleStatus } from '@/lib/data';

type AnyStatus = ArticleStatus | string;

const config: Record<string, { label: string; classes: string; dot: string }> = {
  draft:     { label: 'Draft',     classes: 'bg-slate-100 text-slate-600',  dot: 'bg-slate-400' },
  submitted: { label: 'Submitted', classes: 'bg-blue-50 text-blue-700',     dot: 'bg-blue-500'  },
  approved:  { label: 'Approved',  classes: 'bg-amber-50 text-amber-700',   dot: 'bg-amber-500' },
  published: { label: 'Published', classes: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  returned:  { label: 'Returned',  classes: 'bg-rose-50 text-rose-700',     dot: 'bg-rose-500'  },
  // aliases / extra statuses that may come from Supabase or mock data
  unpublished: { label: 'Unpublished', classes: 'bg-slate-100 text-slate-500', dot: 'bg-slate-400' },
  archived:    { label: 'Archived',    classes: 'bg-slate-100 text-slate-500', dot: 'bg-slate-300' },
  new:         { label: 'New',         classes: 'bg-sky-50 text-sky-700',       dot: 'bg-sky-400'   },
  assigned:    { label: 'Assigned',    classes: 'bg-amber-50 text-amber-700',   dot: 'bg-amber-400' },
  answered:    { label: 'Answered',    classes: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-400' },
};

const fallback = { label: 'Unknown', classes: 'bg-slate-100 text-slate-500', dot: 'bg-slate-300' };

export function StatusBadge({
  status,
  className,
}: {
  status: AnyStatus;
  className?: string;
}) {
  const c = config[status as string] ?? fallback;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        c.classes,
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} />
      {c.label}
    </span>
  );
}
