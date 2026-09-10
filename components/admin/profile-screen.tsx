'use client';

import { Camera, Save } from 'lucide-react';
import { Reveal } from './reveal';
import type { Role } from '@/lib/admin-data';
import { roleLabels, roleUsers } from '@/lib/admin-data';

const bios: Record<Role, { email: string; bio: string; madhhab: string; credentials: string; articles: number }> = {
  author: { email: 'bilal@ilm.org', bio: 'Educator and writer focused on spiritual growth and community building. Traditional Islamic studies.', madhhab: 'Maliki', credentials: 'Traditional studies · Fiqh', articles: 18 },
  editor: { email: 'omar@ilm.org', bio: 'Editor shaping the ILM library with care for language, sources, and the reader’s heart.', madhhab: 'Hanafi', credentials: 'MA Arabic & Islamic Studies', articles: 4 },
  administrator: { email: 'dawud@ilm.org', bio: 'Director of the league, stewarding publishing, people, and the public voice of ILM.', madhhab: 'Maliki', credentials: 'Imam & Educator', articles: 2 },
};

export function ProfileScreen({ role = 'author' }: { role?: Role }) {
  const user = roleUsers[role];
  const meta = bios[role];

  return (
    <Reveal>
      <h2 className="text-2xl font-semibold text-ilm-navy mb-6 tracking-tight">My Profile</h2>
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        <div className="bg-white rounded-2xl border border-ilm-navy/8 p-6 text-center">
          <div className="relative inline-block mb-4">
            <div className="w-28 h-28 rounded-full bg-ilm-navy grid place-items-center text-3xl font-serif text-ilm-gold-light mx-auto">{user.initials}</div>
            <button className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-ilm-gold text-ilm-navy-deep grid place-items-center hover:bg-ilm-gold-light transition-colors">
              <Camera size={16} />
            </button>
          </div>
          <h3 className="text-lg font-semibold text-ilm-navy">{user.name}</h3>
          <p className="text-sm text-ilm-navy/40">{roleLabels[role]} · {meta.madhhab}</p>
          <div className="mt-4 pt-4 border-t border-ilm-navy/5">
            <div className="flex justify-between text-sm">
              <span className="text-ilm-navy/50">Articles published</span>
              <span className="font-bold text-ilm-navy">{meta.articles}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-ilm-navy/8 p-8">
          <h3 className="text-sm font-bold uppercase tracking-wide text-ilm-navy/40 mb-5">Profile Details</h3>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-ilm-navy/60 mb-1.5">Full Name</label>
                <input defaultValue={user.name} className="w-full px-3.5 py-2.5 rounded-lg border border-ilm-navy/10 bg-ilm-cream text-sm text-ilm-navy outline-none focus:border-ilm-gold transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-ilm-navy/60 mb-1.5">Email</label>
                <input defaultValue={meta.email} className="w-full px-3.5 py-2.5 rounded-lg border border-ilm-navy/10 bg-ilm-cream text-sm text-ilm-navy outline-none focus:border-ilm-gold transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-ilm-navy/60 mb-1.5">Bio</label>
              <textarea defaultValue={meta.bio} rows={3} className="w-full px-3.5 py-2.5 rounded-lg border border-ilm-navy/10 bg-ilm-cream text-sm text-ilm-navy outline-none focus:border-ilm-gold transition-colors resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-ilm-navy/60 mb-1.5">Madhhab</label>
                <select defaultValue={meta.madhhab} className="w-full px-3.5 py-2.5 rounded-lg border border-ilm-navy/10 bg-ilm-cream text-sm text-ilm-navy outline-none focus:border-ilm-gold transition-colors">
                  <option>Hanafi</option><option>Maliki</option><option>Shafi&apos;i</option><option>Hanbali</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-ilm-navy/60 mb-1.5">Credentials</label>
                <input defaultValue={meta.credentials} className="w-full px-3.5 py-2.5 rounded-lg border border-ilm-navy/10 bg-ilm-cream text-sm text-ilm-navy outline-none focus:border-ilm-gold transition-colors" />
              </div>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wide rounded-full bg-ilm-navy text-white hover:bg-ilm-navy-soft transition-colors">
              <Save size={14} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
