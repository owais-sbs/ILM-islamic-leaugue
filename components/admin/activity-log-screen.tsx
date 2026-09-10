'use client';

import { useIlm } from '@/lib/ilm-store';
import { Reveal } from './reveal';

const actionColors: Record<string, string> = {
  Published: 'bg-green-100 text-green-700',
  Approved: 'bg-amber-100 text-amber-700',
  Returned: 'bg-red-100 text-red-700',
  Submitted: 'bg-blue-100 text-blue-700',
  Saved: 'bg-gray-100 text-gray-600',
  Unpublished: 'bg-gray-100 text-gray-600',
};

export function ActivityLogScreen() {
  const { activity } = useIlm();
  return (
    <Reveal>
      <h2 className="text-2xl font-semibold text-ilm-navy mb-2 tracking-tight">Activity Log</h2>
      <p className="text-ilm-navy/50 mb-6 text-sm">Read-only audit trail. Admin only.</p>
      <div className="overflow-hidden rounded-2xl border border-ilm-navy/8 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-ilm-navy/8 bg-ilm-cream/60">
              <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/40">Action</th>
              <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/40">Detail</th>
              <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/40">When</th>
            </tr>
          </thead>
          <tbody>
            {activity.map((entry) => (
              <tr key={entry.id} className="border-b border-ilm-navy/5 last:border-0">
                <td className="px-5 py-3.5">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shrink-0 ${actionColors[entry.action] ?? 'bg-gray-100 text-gray-600'}`}>
                    {entry.action}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm text-ilm-navy">
                  <strong className="font-semibold">{entry.user}</strong> {entry.action.toLowerCase()} “{entry.target}”
                </td>
                <td className="px-5 py-3.5 text-xs text-ilm-navy/40">{entry.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Reveal>
  );
}
