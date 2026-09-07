import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
      <div>
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[.2em] text-sky-600/70">ILM Admin</p>
        <h1 className="font-display text-3xl font-semibold text-ilm-navy">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-slate-500">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, trend, color = 'emerald' }: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: 'emerald' | 'blue' | 'teal' | 'amber' | 'rose';
}) {
  const colors = {
    emerald: 'bg-ilm-cream text-ilm-gold',
    blue: 'bg-blue-50 text-blue-600',
    teal: 'bg-teal-50 text-teal-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
  };
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className={cn('flex h-10 w-10 items-center justify-center rounded-lg', colors[color])}>
          <Icon size={20} />
        </span>
        {trend && <span className="text-xs font-medium text-slate-400">{trend}</span>}
      </div>
      <p className="mt-4 font-display text-3xl font-semibold text-slate-800">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-slate-100 bg-white', className)}>
      {children}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description }: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-16 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Icon size={26} />
      </span>
      <h3 className="font-display text-xl text-slate-700">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-400">{description}</p>
    </div>
  );
}
