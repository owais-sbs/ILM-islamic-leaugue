'use client';

import { Plus, MoreVertical, Mail, ToggleRight, ToggleLeft } from 'lucide-react';
import { contributors } from '@/lib/admin-data';
import { roleLabels, type Role } from '@/lib/admin-data';
import { Reveal, StaggerContainer, StaggerItem } from './reveal';

const rolePill: Record<Role, string> = {
  author: 'bg-gray-100 text-gray-600',
  editor: 'bg-blue-100 text-blue-700',
  administrator: 'bg-amber-100 text-amber-700',
};

export function AuthorsScreen() {
  return (
    <Reveal>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-ilm-navy tracking-tight">Authors & Contributors</h2>
        <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wide rounded-full bg-ilm-navy text-white hover:bg-ilm-navy-soft transition-colors">
          <Plus size={14} /> Invite by Email
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-ilm-navy/8 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ilm-navy/8">
              <th className="text-left text-xs font-bold uppercase tracking-wide text-ilm-navy/40 px-6 py-4">Name</th>
              <th className="text-left text-xs font-bold uppercase tracking-wide text-ilm-navy/40 px-6 py-4 hidden md:table-cell">Role</th>
              <th className="text-left text-xs font-bold uppercase tracking-wide text-ilm-navy/40 px-6 py-4 hidden lg:table-cell">Madhhab</th>
              <th className="text-left text-xs font-bold uppercase tracking-wide text-ilm-navy/40 px-6 py-4 hidden md:table-cell">Articles</th>
              <th className="text-left text-xs font-bold uppercase tracking-wide text-ilm-navy/40 px-6 py-4">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            <StaggerContainer>
              {contributors.map((c) => (
                <StaggerItem key={c.id}>
                  <tr className="border-b border-ilm-navy/5 last:border-0 hover:bg-ilm-cream/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-ilm-navy grid place-items-center text-xs font-serif text-ilm-gold-light shrink-0">{c.initials}</div>
                        <div>
                          <div className="text-sm font-semibold text-ilm-navy">{c.name}</div>
                          <div className="text-xs text-ilm-navy/40 flex items-center gap-1"><Mail size={11} /> {c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${rolePill[c.role]}`}>{roleLabels[c.role]}</span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-sm text-ilm-navy/60">{c.madhhab}</td>
                    <td className="px-6 py-4 hidden md:table-cell text-sm font-semibold text-ilm-navy">{c.articles}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-xs ${c.active ? 'text-green-600' : 'text-ilm-navy/40'}`}>
                        {c.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />} {c.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-ilm-navy/30 hover:text-ilm-navy transition-colors"><MoreVertical size={16} /></button>
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
