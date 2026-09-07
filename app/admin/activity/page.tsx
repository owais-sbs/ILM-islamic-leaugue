'use client';

import { useEffect, useState } from 'react';
import {
  Activity as ActivityIcon,
  CheckCircle2,
  FileText,
  Loader2,
  Pencil,
  Send,
  Trash2,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';
import { PageHeader, Card, EmptyState } from '@/components/admin/AdminUI';
import { usePermissions } from '@/components/admin/RoleContext';
import { createClient } from '@/lib/supabase/client';
import type { ActivityRow } from '@/lib/supabase/types';
import { cn } from '@/lib/utils';

const typeIcons: Record<string, { icon: LucideIcon; color: string }> = {
  create: { icon: FileText, color: 'bg-sky-50 text-sky-600' },
  update: { icon: Pencil, color: 'bg-slate-100 text-slate-500' },
  delete: { icon: Trash2, color: 'bg-rose-50 text-rose-600' },
  publish: { icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
  published: { icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
  review: { icon: Send, color: 'bg-amber-50 text-amber-600' },
  approved: { icon: CheckCircle2, color: 'bg-amber-50 text-amber-600' },
  returned: { icon: Send, color: 'bg-rose-50 text-rose-600' },
  auth: { icon: UserPlus, color: 'bg-sky-50 text-ilm-navy' },
  invited: { icon: UserPlus, color: 'bg-sky-50 text-ilm-navy' },
};

export default function AdminActivity() {
  const perms = usePermissions();
  const [activity, setActivity] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!perms.canViewActivity) { setLoading(false); return; }
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(100);
      setActivity((data as ActivityRow[]) || []);
      setLoading(false);
    };
    load();
  }, [perms.canViewActivity]);

  if (!perms.canViewActivity) {
    return (
      <div>
        <PageHeader title="Activity Log" description="Audit trail" />
        <Card className="p-8 text-center"><p className="text-sm text-slate-500">Only Administrators can view the activity log.</p></Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Activity Log" description="Immutable audit trail of admin actions" />

      {loading ? (
        <div className="flex justify-center py-16 text-sm text-slate-500"><Loader2 className="mr-2 animate-spin" size={18} /> Loading…</div>
      ) : activity.length === 0 ? (
        <EmptyState icon={ActivityIcon} title="No activity yet" description="Publishes, reviews, invites and edits will appear here." />
      ) : (
        <Card className="p-6">
          <div className="relative">
            <div className="absolute bottom-2 left-[19px] top-2 w-px bg-slate-100" />
            <div className="space-y-1">
              {activity.map((entry) => {
                const key = entry.action.split(' ')[0];
                const tc = typeIcons[key] || typeIcons[entry.entity_type] || typeIcons.update;
                const Icon = tc.icon;
                return (
                  <div key={entry.id} className="relative flex items-start gap-4 rounded-lg px-3 py-3 hover:bg-sky-50/40">
                    <span className={cn('relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-4 ring-white', tc.color)}>
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0 flex-1 pt-1">
                      <p className="text-sm text-slate-700">
                        <span className="font-semibold text-slate-800">{entry.actor_name}</span>{' '}
                        <span className="text-slate-500">{entry.action}</span>{' '}
                        <span className="font-medium text-ilm-navy">{entry.entity_label}</span>
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {entry.entity_type} · {new Date(entry.created_at).toLocaleString()}
                      </p>
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
