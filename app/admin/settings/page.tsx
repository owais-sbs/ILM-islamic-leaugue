'use client';

import { useState } from 'react';
import { Bell, Save } from 'lucide-react';
import { PageHeader, Card } from '@/components/admin/AdminUI';
import { usePermissions } from '@/components/admin/RoleContext';
import { articles } from '@/lib/data';

export default function AdminSettings() {
  const perms = usePermissions();
  const [saved, setSaved] = useState(false);
  const [announcementOn, setAnnouncementOn] = useState(true);
  const [featuredArticle, setFeaturedArticle] = useState(articles[0].title);

  if (!perms.canManageSettings) {
    return (
      <div>
        <PageHeader title="Settings" description="Site configuration" />
        <Card className="p-8 text-center">
          <p className="text-sm text-slate-500">Only Administrators can change site settings. Switch your role to Admin using the role switcher.</p>
        </Card>
      </div>
    );
  }

  const published = articles.filter((a) => a.status === 'published');

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your site's content and configuration"
        action={
          <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} className="flex items-center gap-2 rounded-lg bg-ilm-gold px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-ilm-gold-dark">
            <Save size={15} /> {saved ? 'Saved!' : 'Save changes'}
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-4 font-display text-lg font-semibold text-ilm-navy">Site information</h3>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Site title</label>
              <input type="text" defaultValue="ILM — Islamic League of Murabbiyūn" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-ilm-gold/70" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Contact email</label>
              <input type="email" defaultValue="hello@ilm.org" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-ilm-gold/70" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Contact phone</label>
              <input type="text" placeholder="Optional" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-ilm-gold/70" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 font-display text-lg font-semibold text-ilm-navy">Featured content</h3>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Featured article</label>
              <select value={featuredArticle} onChange={(e) => setFeaturedArticle(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-ilm-gold/70">
                {published.map((a) => <option key={a.id} value={a.title}>{a.title}</option>)}
              </select>
              <p className="mt-1 text-xs text-slate-400">This article will be highlighted on the homepage.</p>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
              <div className="flex items-center gap-3">
                <Bell size={17} className={announcementOn ? 'text-ilm-gold' : 'text-slate-300'} />
                <div>
                  <p className="text-sm font-medium text-slate-700">Announcement banner</p>
                  <p className="text-xs text-slate-400">Show a banner at the top of the site</p>
                </div>
              </div>
              <button
                onClick={() => setAnnouncementOn(!announcementOn)}
                className={`relative h-6 w-11 rounded-full transition ${announcementOn ? 'bg-ilm-gold' : 'bg-slate-200'}`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${announcementOn ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </div>
            {announcementOn && (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Banner text</label>
                <input type="text" defaultValue="New essays this week — read the latest from our Murabbiyūn." className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-ilm-gold/70" />
              </div>
            )}
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h3 className="mb-4 font-display text-lg font-semibold text-ilm-navy">Disclaimer text</h3>
          <textarea
            rows={5}
            defaultValue="The articles published on ILM reflect the views of their respective authors and do not necessarily represent the position of the Islamic League of Murabbiyūn. All content is provided for educational purposes. Readers are encouraged to consult qualified scholars for specific religious guidance."
            className="w-full resize-none rounded-lg border border-slate-200 p-3 text-sm leading-6 text-slate-700 outline-none focus:border-ilm-gold/70"
          />
          <p className="mt-2 text-xs text-slate-400">This text appears on the /disclaimer page and in the footer link.</p>
        </Card>
      </div>
    </div>
  );
}
