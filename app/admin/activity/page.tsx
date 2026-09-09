'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Activity as ActivityIcon,
  CheckCircle2,
  FileText,
  Loader2,
  Pencil,
  RefreshCw,
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
  create:    { icon: FileText,    color: 'bg-sky-50 text-sky-600'    },
  update:    { icon: Pencil,      color: 'bg-slate-100 text-slate-500' },
  delete:    { icon: Trash2,      color: 'bg-rose-50 text-rose-600'   },
  publish:   { icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
  published: { icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
  review:    { icon: Send,        color: 'bg-amber-50 text-amber-600'  },
  approved:  { icon: CheckCircle2, color: 'bg-amber-50 text-amber-700' },
  returned:  { icon: Send,        color: 'bg-rose-50 text-rose-600'    },
  auth:      { icon: UserPlus,    color: 'bg-sky-50 text-ilm-navy'    },
  invited:   { icon: UserPlus,    color: 'bg-sky-50 text-ilm-navy'    },
};

function getIconConfig(action: string) {
  const key = action.toLowerCase().split(' ')[0];
  return typeIcons[key] || typeIcons.update;
}

export default function AdminActivity() {
  const perms = usePermissions();
  const [rows,    setRows]    = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { data, error: dbError } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (dbError) throw new Error(dbError.message);
      setRows((data as ActivityRow[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load activity log');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (perms.canViewActivity) void load();
    else setLoading(false);
  }, [perms.canViewActivity, load]);

  if (!perms.canViewActivity) {
    return (
      <div>
        <PageHeader title="Activity Log" description="Audit trail" />
        <Card className="p-8 text-center">
          <p className="text-sm text-slate-500">Only Administrators can view the activity log.</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Activity Log"
        description="Immutable audit trail of all admin actions"
        action={
          <button
            type="button"
            onClick={() => void load()}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50"
          >
            <RefreshCw size={13} /> Refresh
          </button>
        }
      />

      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
          <button type="button" onClick={() => void load()} className="ml-3 underline">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16 text-sm text-slate-500">
          <Loader2 className="mr-2 animate-spin" size={18} /> Loading…
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={ActivityIcon}
          title="No activity yet"
          description="Publishes, reviews, role changes, and invites will appear here once they happen."
        />
      ) : (
        <Card className="p-6">
          <div className="relative">
            {/* Timeline spine */}
            <div className="absolute bottom-2 left-[19px] top-2 w-px bg-slate-100" aria-hidden />
            <div className="space-y-1">
              {rows.map((entry) => {
                const tc   = getIconConfig(entry.action);
                const Icon = tc.icon;
                return (
                  <div
                    key={entry.id}
                    className="relative flex items-start gap-4 rounded-lg px-3 py-3 transition hover:bg-sky-50/40"
                  >
                    <span
                      className={cn(
                        'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-4 ring-white',
                        tc.color,
                      )}
                    >
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0 flex-1 pt-1">
                      <p className="text-sm text-slate-700">
                        <span className="font-semibold text-slate-800">{entry.actor_name}</span>{' '}
                        <span className="text-slate-500">{entry.action}</span>{' '}
                        <span className="font-medium text-ilm-navy">{entry.entity_label}</span>
                      </p>
                      {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                        <p className="mt-0.5 text-xs text-slate-400 italic">
                          {Object.entries(entry.metadata)
                            .filter(([, v]) => v && typeof v === 'string')
                            .slice(0, 1)
                            .map(([k, v]) => `${k}: ${String(v).slice(0, 80)}`)
                            .join('')}
                        </p>
                      )}
                      <p className="mt-0.5 text-xs text-slate-400">
                        {entry.entity_type} ·{' '}
                        {new Date(entry.created_at).toLocaleString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
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
