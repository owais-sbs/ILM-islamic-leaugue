import { cn } from '@/lib/utils';
import type { ArticleStatus } from '@/lib/data';

const config: Record<ArticleStatus, { label: string; classes: string; dot: string }> = {
  draft: { label: 'Draft', classes: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
  submitted: { label: 'Submitted', classes: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500' },
  approved: { label: 'Approved', classes: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  published: { label: 'Published', classes: 'bg-ilm-navy/10 text-ilm-navy', dot: 'bg-ilm-gold' },
  returned: { label: 'Returned', classes: 'bg-rose-50 text-rose-700', dot: 'bg-rose-500' },
};

export function StatusBadge({ status, className }: { status: ArticleStatus; className?: string }) {
  const c = config[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium', c.classes, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} />
      {c.label}
    </span>
  );
}
