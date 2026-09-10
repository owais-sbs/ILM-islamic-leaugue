'use client';

import { Save } from 'lucide-react';
import { Reveal } from './reveal';

export function SettingsScreen() {
  return (
    <Reveal>
      <h2 className="text-2xl font-semibold text-ilm-navy mb-6 tracking-tight">Settings</h2>
      <div className="space-y-6 max-w-2xl">
        <div className="bg-white rounded-2xl border border-ilm-navy/8 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wide text-ilm-navy/40 mb-4">Site Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-ilm-navy/60 mb-1.5">Site Title</label>
              <input defaultValue="Islamic League of Murabbiyūn" className="w-full px-3.5 py-2.5 rounded-lg border border-ilm-navy/10 bg-ilm-cream text-sm text-ilm-navy outline-none focus:border-ilm-gold transition-colors" />
            </div>
            <div>
              <label className="block text-sm text-ilm-navy/60 mb-1.5">Contact Email</label>
              <input defaultValue="salam@ilm.org" className="w-full px-3.5 py-2.5 rounded-lg border border-ilm-navy/10 bg-ilm-cream text-sm text-ilm-navy outline-none focus:border-ilm-gold transition-colors" />
            </div>
            <div>
              <label className="block text-sm text-ilm-navy/60 mb-1.5">Disclaimer Text</label>
              <textarea defaultValue="The content on this site is for educational and spiritual guidance purposes. Always consult qualified scholars for specific religious rulings." rows={3} className="w-full px-3.5 py-2.5 rounded-lg border border-ilm-navy/10 bg-ilm-cream text-sm text-ilm-navy outline-none focus:border-ilm-gold transition-colors resize-none" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-ilm-navy/8 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wide text-ilm-navy/40 mb-4">Featured Content</h3>
          <div>
            <label className="block text-sm text-ilm-navy/60 mb-1.5">Featured Article</label>
            <select className="w-full px-3.5 py-2.5 rounded-lg border border-ilm-navy/10 bg-ilm-cream text-sm text-ilm-navy outline-none focus:border-ilm-gold transition-colors">
              <option>The quiet work of becoming</option>
              <option>What we owe the next generation</option>
              <option>Finding stillness in a noisy world</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-ilm-navy/8 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wide text-ilm-navy/40 mb-4">Announcement Banner</h3>
          <div>
            <label className="block text-sm text-ilm-navy/60 mb-1.5">Banner Text</label>
            <input placeholder="Announcement message..." className="w-full px-3.5 py-2.5 rounded-lg border border-ilm-navy/10 bg-ilm-cream text-sm text-ilm-navy outline-none focus:border-ilm-gold transition-colors" />
          </div>
        </div>

        <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wide rounded-full bg-ilm-navy text-white hover:bg-ilm-navy-soft transition-colors">
          <Save size={14} /> Save All Settings
        </button>
      </div>
    </Reveal>
  );
}
