'use client';

import { useEffect, useState } from 'react';
import { Bell, Loader2, Save } from 'lucide-react';
import { PageHeader, Card } from '@/components/admin/AdminUI';
import { usePermissions } from '@/components/admin/RoleContext';
import { createClient } from '@/lib/supabase/client';
import { getSettingsMap, setSetting } from '@/lib/supabase/admin-helpers';
import type { ArticleRow } from '@/lib/supabase/types';

export default function AdminSettings() {
  const perms = usePermissions();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState('');
  const [published, setPublished] = useState<ArticleRow[]>([]);
  const [form, setForm] = useState({
    site_title: '',
    contact_email: '',
    contact_phone: '',
    featured_article_id: '',
    announcement_on: false,
    announcement_text: '',
    disclaimer_text: '',
  });

  useEffect(() => {
    if (!perms.canManageSettings) { setLoading(false); return; }
    const load = async () => {
      const supabase = createClient();
      const [map, { data: articles }] = await Promise.all([
        getSettingsMap(),
        supabase.from('articles').select('id, title, status').eq('status', 'published').order('title'),
      ]);
      setPublished((articles as ArticleRow[]) || []);
      setForm({
        site_title: String(map.site_title ?? ''),
        contact_email: String(map.contact_email ?? ''),
        contact_phone: String(map.contact_phone ?? ''),
        featured_article_id: map.featured_article_id ? String(map.featured_article_id) : '',
        announcement_on: Boolean(map.announcement_on),
        announcement_text: String(map.announcement_text ?? ''),
        disclaimer_text: String(map.disclaimer_text ?? ''),
      });
      setLoading(false);
    };
    load();
  }, [perms.canManageSettings]);

  if (!perms.canManageSettings) {
    return (
      <div>
        <PageHeader title="Settings" description="Site configuration" />
        <Card className="p-8 text-center"><p className="text-sm text-slate-500">Only Administrators can change site settings.</p></Card>
      </div>
    );
  }

  const save = async () => {
    setSaving(true);
    setMessage('');
    try {
      await Promise.all([
        setSetting('site_title', form.site_title),
        setSetting('contact_email', form.contact_email),
        setSetting('contact_phone', form.contact_phone),
        setSetting('featured_article_id', form.featured_article_id || null),
        setSetting('announcement_on', form.announcement_on),
        setSetting('announcement_text', form.announcement_text),
        setSetting('disclaimer_text', form.disclaimer_text),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Save failed');
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="flex justify-center py-16 text-sm text-slate-500"><Loader2 className="mr-2 animate-spin" size={18} /> Loading settings…</div>;
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Site title, contact, featured article, banner, and disclaimer"
        action={
          <button type="button" onClick={save} disabled={saving} className="flex items-center gap-2 rounded-lg bg-ilm-navy px-4 py-2.5 text-xs font-semibold text-white hover:bg-ilm-navy-light disabled:opacity-60">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saved ? 'Saved!' : 'Save changes'}
          </button>
        }
      />

      {message && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{message}</div>}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-4 font-display text-lg font-semibold text-ilm-navy">Site information</h3>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Site title</label>
              <input type="text" value={form.site_title} onChange={(e) => setForm({ ...form, site_title: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-ilm-navy/40" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Contact email</label>
              <input type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-ilm-navy/40" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Contact phone</label>
              <input type="text" value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-ilm-navy/40" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 font-display text-lg font-semibold text-ilm-navy">Featured content</h3>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Featured article</label>
              <select value={form.featured_article_id} onChange={(e) => setForm({ ...form, featured_article_id: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-ilm-navy/40">
                <option value="">None</option>
                {published.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
              </select>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
              <div className="flex items-center gap-3">
                <Bell size={17} className={form.announcement_on ? 'text-ilm-navy' : 'text-slate-300'} />
                <div>
                  <p className="text-sm font-medium text-slate-700">Announcement banner</p>
                  <p className="text-xs text-slate-400">Show a banner at the top of the site</p>
                </div>
              </div>
              <button type="button" onClick={() => setForm({ ...form, announcement_on: !form.announcement_on })} className={`relative h-6 w-11 rounded-full transition ${form.announcement_on ? 'bg-ilm-navy' : 'bg-slate-200'}`}>
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${form.announcement_on ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </div>
            {form.announcement_on && (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Banner text</label>
                <input type="text" value={form.announcement_text} onChange={(e) => setForm({ ...form, announcement_text: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-ilm-navy/40" />
              </div>
            )}
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h3 className="mb-4 font-display text-lg font-semibold text-ilm-navy">Disclaimer text</h3>
          <textarea rows={5} value={form.disclaimer_text} onChange={(e) => setForm({ ...form, disclaimer_text: e.target.value })} className="w-full resize-none rounded-lg border border-slate-200 p-3 text-sm leading-6 text-slate-700 outline-none focus:border-ilm-navy/40" />
        </Card>
      </div>
    </div>
  );
}
