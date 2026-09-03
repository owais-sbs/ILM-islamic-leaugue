'use client';

import { useState } from 'react';
import { Download, Search } from 'lucide-react';
import { PageHeader, Card, EmptyState } from '@/components/admin/AdminUI';
import { usePermissions } from '@/components/admin/RoleContext';
import { subscribers as initialSubscribers } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function AdminSubscribers() {
  const perms = usePermissions();
  const [search, setSearch] = useState('');
  const [exported, setExported] = useState(false);

  if (!perms.canExport) {
    return (
      <div>
        <PageHeader title="Subscribers" description="Newsletter subscribers" />
        <Card className="p-8 text-center">
          <p className="text-sm text-slate-500">
            Only Administrators can manage subscribers. Switch your role to Admin.
          </p>
        </Card>
      </div>
    );
  }

  const filtered = initialSubscribers.filter(
    (s) => !search || s.email.toLowerCase().includes(search.toLowerCase()),
  );

  const exportCSV = () => {
    const rows = [
      ['Email', 'Subscribed At', 'Status'],
      ...initialSubscribers.map((s) => [s.email, s.subscribedAt, s.status]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = `ilm-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  const active = initialSubscribers.filter((s) => s.status === 'active').length;

  return (
    <div>
      <PageHeader
        title="Subscribers"
        description={`${active} active · ${initialSubscribers.length} total`}
        action={
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 rounded-lg bg-ilm-gold px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-ilm-gold-dark"
          >
            <Download size={14} /> {exported ? 'Downloading…' : 'Export CSV'}
          </button>
        }
      />

      <div className="relative mb-4 w-full sm:w-64">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search subscribers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-ilm-gold/70"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Download} title="No subscribers found" description="Try a different search term." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Email</th>
                  <th className="hidden px-5 py-3 sm:table-cell">Subscribed</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((sub) => (
                  <tr key={sub.id} className="transition hover:bg-slate-50/50">
                    <td className="px-5 py-3.5 font-medium text-slate-700">{sub.email}</td>
                    <td className="hidden px-5 py-3.5 text-slate-400 sm:table-cell">{sub.subscribedAt}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-1 text-xs font-medium',
                          sub.status === 'active'
                            ? 'bg-ilm-cream text-ilm-navy'
                            : 'bg-slate-100 text-slate-500',
                        )}
                      >
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
