'use client';

import { Download, Search } from 'lucide-react';
import { subscribers } from '@/lib/admin-data';
import { Reveal, StaggerContainer, StaggerItem } from './reveal';

export function SubscribersScreen() {
  return (
    <Reveal>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-ilm-navy tracking-tight">Subscribers</h2>
        <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wide rounded-full bg-ilm-navy text-white hover:bg-ilm-navy-soft transition-colors">
          <Download size={14} /> Export CSV
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-ilm-navy/8 p-4 mb-4">
        <div className="flex items-center gap-2 text-ilm-navy/40">
          <Search size={16} />
          <input placeholder="Search subscribers..." className="flex-1 border-0 outline-none bg-transparent text-sm text-ilm-navy" />
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-ilm-navy/8 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ilm-navy/8">
              <th className="text-left text-xs font-bold uppercase tracking-wide text-ilm-navy/40 px-6 py-4">Email</th>
              <th className="text-left text-xs font-bold uppercase tracking-wide text-ilm-navy/40 px-6 py-4 hidden md:table-cell">Subscribed</th>
              <th className="text-left text-xs font-bold uppercase tracking-wide text-ilm-navy/40 px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            <StaggerContainer>
              {subscribers.map((s) => (
                <StaggerItem key={s.id}>
                  <tr className="border-b border-ilm-navy/5 last:border-0 hover:bg-ilm-cream/50 transition-colors">
                    <td className="px-6 py-3.5 text-sm font-medium text-ilm-navy">{s.email}</td>
                    <td className="px-6 py-3.5 hidden md:table-cell text-sm text-ilm-navy/50">{s.date}</td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${s.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {s.active ? 'Active' : 'Unsubscribed'}
                      </span>
                    </td>
                  </tr>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </tbody>
        </table>
      </div>
    </Reveal>
  );
}
