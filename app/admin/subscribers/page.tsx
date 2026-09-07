'use client';

import { useEffect, useState } from 'react';
import { Download, Loader2, Plus, Search, X } from 'lucide-react';
import { PageHeader, Card, EmptyState } from '@/components/admin/AdminUI';
import { TableRowActions } from '@/components/admin/TableRowActions';
import { usePermissions } from '@/components/admin/RoleContext';
import { createClient } from '@/lib/supabase/client';
import type { SubscriberRow } from '@/lib/supabase/types';
import { cn } from '@/lib/utils';

export default function AdminSubscribers() {
  const perms = usePermissions();
  const [items, setItems] = useState<SubscriberRow[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [exported, setExported] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<SubscriberRow | null>(null);
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('subscribers').select('*').order('created_at', { ascending: false });
    setItems((data as SubscriberRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (perms.canExport) load();
    else setLoading(false);
  }, [perms.canExport]);

  if (!perms.canExport) {
    return (
      <div>
        <PageHeader title="Subscribers" description="Newsletter subscribers" />
        <Card className="p-8 text-center">
          <p className="text-sm text-slate-500">Only Administrators can manage subscribers.</p>
        </Card>
      </div>
    );
  }

  const filtered = items.filter((s) => !search || s.email.toLowerCase().includes(search.toLowerCase()));
  const activeCount = items.filter((s) => !s.unsubscribed_at).length;

  const exportCsv = () => {
    const csv = [
      'email,confirmed_at,unsubscribed_at,source',
      ...filtered.map((s) => `${s.email},${s.confirmed_at || ''},${s.unsubscribed_at || ''},${s.source}`),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  const add = async () => {
    if (!email.trim()) { setError('Email is required'); return; }
    setSaving(true);
    setError('');
    const supabase = createClient();
    const { error: saveError } = await supabase.from('subscribers').insert({
      email: email.trim(),
      confirmed_at: new Date().toISOString(),
      source: 'admin',
    });
    setSaving(false);
    if (saveError) { setError(saveError.message); return; }
    setShowAdd(false);
    setEmail('');
    await load();
  };

  const openEdit = (sub: SubscriberRow) => {
    setEditing(sub);
    setEmail(sub.email);
    setError('');
  };

  const saveEdit = async () => {
    if (!editing || !email.trim()) { setError('Email is required'); return; }
    setSaving(true);
    setError('');
    const supabase = createClient();
    const { error: saveError } = await supabase
      .from('subscribers')
      .update({ email: email.trim() })
      .eq('id', editing.id);
    setSaving(false);
    if (saveError) { setError(saveError.message); return; }
    setEditing(null);
    setEmail('');
    await load();
  };

  const toggleStatus = async (sub: SubscriberRow) => {
    const supabase = createClient();
    await supabase
      .from('subscribers')
      .update({
        unsubscribed_at: sub.unsubscribed_at ? null : new Date().toISOString(),
      })
      .eq('id', sub.id);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm('Remove this subscriber permanently?')) return;
    const supabase = createClient();
    await supabase.from('subscribers').delete().eq('id', id);
    await load();
  };

  return (
    <div>
      <PageHeader
        title="Subscribers"
        description={`${activeCount} active subscribers`}
        action={
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowAdd(true)} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-sky-50">
              <Plus size={15} /> Add
            </button>
            <button type="button" onClick={exportCsv} className="flex items-center gap-2 rounded-lg bg-ilm-navy px-4 py-2.5 text-xs font-semibold text-white hover:bg-ilm-navy-light">
              <Download size={15} /> {exported ? 'Exported!' : 'Export CSV'}
            </button>
          </div>
        }
      />

      <div className="relative mb-4 w-full sm:w-64">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search subscribers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-ilm-navy/40"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-sm text-slate-500"><Loader2 className="mr-2 animate-spin" size={18} /> Loading…</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Download} title="No subscribers found" description="Add subscribers or wait for website signups." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Email</th>
                  <th className="hidden px-5 py-3 sm:table-cell">Confirmed</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-sky-50/40">
                    <td className="px-5 py-3.5 font-medium text-slate-700">{sub.email}</td>
                    <td className="hidden px-5 py-3.5 text-slate-400 sm:table-cell">
                      {sub.confirmed_at ? new Date(sub.confirmed_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', sub.unsubscribed_at ? 'bg-slate-100 text-slate-500' : 'bg-sky-50 text-ilm-navy')}>
                        {sub.unsubscribed_at ? 'unsubscribed' : 'active'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <TableRowActions
                        onEdit={() => openEdit(sub)}
                        onDelete={() => remove(sub.id)}
                        editLabel="Edit email"
                        deleteLabel="Remove subscriber"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ilm-navy/40 p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-ilm-navy">Edit subscriber</h2>
              <button type="button" onClick={() => setEditing(null)}><X size={18} /></button>
            </div>
            {error && <div className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-ilm-navy/40"
            />
            <button
              type="button"
              onClick={() => toggleStatus(editing)}
              className="mt-3 w-full rounded-lg border border-slate-200 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              {editing.unsubscribed_at ? 'Mark as active' : 'Mark as unsubscribed'}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={saveEdit}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-ilm-navy py-2.5 text-sm font-semibold text-white hover:bg-ilm-navy-light disabled:opacity-60"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : null}
              Save changes
            </button>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ilm-navy/40 p-4" onClick={() => setShowAdd(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-ilm-navy">Add subscriber</h2>
              <button type="button" onClick={() => setShowAdd(false)}><X size={18} /></button>
            </div>
            {error && <div className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-ilm-navy/40"
              placeholder="reader@email.com"
            />
            <button
              type="button"
              disabled={saving}
              onClick={add}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-ilm-navy py-2.5 text-sm font-semibold text-white hover:bg-ilm-navy-light disabled:opacity-60"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              Add subscriber
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
