'use client';

import { useMemo, useState } from 'react';
import { Download, Search } from 'lucide-react';
import { useIlm } from '@/lib/ilm-store';
import { adminSwal } from '@/lib/admin-swal';
import { Reveal } from './reveal';
import { cn } from '@/lib/utils';

export function SubscribersScreen() {
  const { subscribers, toggleSubscriber } = useIlm();
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return subscribers;
    return subscribers.filter((s) => s.email.toLowerCase().includes(query));
  }, [subscribers, q]);

  const exportCsv = () => {
    const rows = [['email', 'subscribed', 'status'], ...subscribers.map((s) => [s.email, s.date, s.active ? 'active' : 'unsubscribed'])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ilm-subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
    void adminSwal.success('CSV exported', `${subscribers.length} subscribers`);
  };

  return (
    <Reveal>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-ilm-navy">Subscribers</h2>
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-full bg-ilm-navy px-4 py-2 text-xs font-bold uppercase tracking-wide text-white"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="mb-4 rounded-2xl border border-ilm-navy/10 bg-white p-4">
        <label className="flex items-center gap-2 text-ilm-navy/40">
          <Search size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search subscribers..."
            className="w-full border-0 bg-transparent text-sm text-ilm-navy outline-none"
          />
        </label>
      </div>

      <div className="overflow-hidden rounded-2xl border border-ilm-navy/10 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] table-fixed text-left">
            <thead>
              <tr className="border-b border-ilm-navy/10 bg-ilm-cream/60">
                <th className="w-[50%] px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/55">Email</th>
                <th className="w-[25%] px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/55">Subscribed</th>
                <th className="w-[25%] px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/55">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-ilm-navy/5 last:border-0 hover:bg-ilm-cream/40">
                  <td className="px-5 py-3.5 align-middle text-sm font-medium text-ilm-navy">{s.email}</td>
                  <td className="px-5 py-3.5 align-middle text-sm text-ilm-navy/55">{s.date}</td>
                  <td className="px-5 py-3.5 align-middle">
                    <button
                      type="button"
                      onClick={async () => {
                        const next = !s.active;
                        const res = await adminSwal.confirm(
                          next ? 'Reactivate subscriber?' : 'Unsubscribe?',
                          s.email,
                          next ? 'Activate' : 'Unsubscribe'
                        );
                        if (!res.isConfirmed) return;
                        toggleSubscriber(s.id, next);
                        await adminSwal.success(next ? 'Subscriber active' : 'Unsubscribed', s.email);
                      }}
                      className={cn(
                        'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide',
                        s.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      )}
                    >
                      {s.active ? 'Active' : 'Unsubscribed'}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-5 py-12 text-center text-sm text-ilm-navy/35">
                    No subscribers match this search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Reveal>
  );
}
