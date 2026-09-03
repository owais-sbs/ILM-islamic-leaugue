'use client';

import { Activity as ActivityIcon, CheckCircle2, FileText, Pencil, Send, Trash2, UserPlus, type LucideIcon } from 'lucide-react';
import { PageHeader, Card, EmptyState } from '@/components/admin/AdminUI';
import { usePermissions } from '@/components/admin/RoleContext';
import { activity, type ActivityEntry } from '@/lib/data';
import { cn } from '@/lib/utils';

const typeConfig: Record<ActivityEntry['type'], { icon: LucideIcon; color: string }> = {
  create: { icon: FileText, color: 'bg-blue-50 text-blue-600' },
  update: { icon: Pencil, color: 'bg-slate-100 text-slate-500' },
  delete: { icon: Trash2, color: 'bg-rose-50 text-rose-600' },
  publish: { icon: CheckCircle2, color: 'bg-ilm-cream text-ilm-gold' },
  review: { icon: Send, color: 'bg-amber-50 text-amber-600' },
  auth: { icon: UserPlus, color: 'bg-ilm-cream text-ilm-gold' },
};

export default function AdminActivity() {
  const perms = usePermissions();

  if (!perms.canViewActivity) {
    return (
      <div>
        <PageHeader title="Activity Log" description="Audit trail" />
        <Card className="p-8 text-center">
          <p className="text-sm text-slate-500">Only Administrators can view the activity log. Switch your role to Admin using the role switcher.</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Activity Log" description="A read-only record of all actions taken in the admin panel" />

      {activity.length === 0 ? (
        <EmptyState icon={ActivityIcon} title="No activity yet" description="Actions taken by you and your team will appear here." />
      ) : (
        <Card className="p-6">
          <div className="relative">
            <div className="absolute left-[19px] top-2 bottom-2 w-px bg-slate-100" />
            <div className="space-y-1">
              {activity.map((entry) => {
                const tc = typeConfig[entry.type];
                const Icon = tc.icon;
                return (
                  <div key={entry.id} className="relative flex items-start gap-4 rounded-lg px-3 py-3 transition hover:bg-slate-50/50">
                    <span className={cn('relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-4 ring-white', tc.color)}>
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0 flex-1 pt-1">
                      <p className="text-sm text-slate-700">
                        <span className="font-semibold text-slate-800">{entry.actor}</span>
                        {' '}<span className="text-slate-500">{entry.action}</span>
                        {' '}<span className="font-medium text-ilm-navy">{entry.entity}</span>
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">{entry.timestamp}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
