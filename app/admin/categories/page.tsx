'use client';

import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  FolderTree,
  Loader2,
  Merge,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { PageHeader, Card, EmptyState } from '@/components/admin/AdminUI';
import { usePermissions } from '@/components/admin/RoleContext';
import { createClient } from '@/lib/supabase/client';
import { slugify, type CategoryRow } from '@/lib/supabase/types';

const COLORS = ['#0F1657', '#1a2380', '#2563eb', '#C9972E', '#0ea5e9', '#334155'];
const emptyForm = { name: '', slug: '', description: '', color: '#0F1657', icon: '' };

export default function AdminCategories() {
  const perms = usePermissions();
  const [items, setItems] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showMerge, setShowMerge] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [mergeFrom, setMergeFrom] = useState('');
  const [mergeInto, setMergeInto] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('categories').select('*').order('display_order');
    setItems((data as CategoryRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (perms.canManageTaxonomy) load();
    else setLoading(false);
  }, [perms.canManageTaxonomy]);

  if (!perms.canManageTaxonomy) {
    return (
      <div>
        <PageHeader title="Categories" description="Manage article subjects" />
        <Card className="p-8 text-center"><p className="text-sm text-slate-500">Only Administrators can manage categories.</p></Card>
      </div>
    );
  }

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  };

  const openEdit = (cat: CategoryRow) => {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, color: cat.color, icon: cat.icon || '' });
    setError('');
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name.trim()) { setError('Name is required'); return; }
    setSaving(true);
    setError('');
    const supabase = createClient();
    const payload = {
      name: form.name.trim(),
      slug: form.slug || slugify(form.name),
      description: form.description,
      color: form.color,
      icon: form.icon,
      display_order: editing ? editing.display_order : items.length + 1,
    };
    const { error: saveError } = editing
      ? await supabase.from('categories').update(payload).eq('id', editing.id)
      : await supabase.from('categories').insert(payload);
    setSaving(false);
    if (saveError) { setError(saveError.message); return; }
    setShowForm(false);
    await load();
  };

  const move = async (id: string, direction: -1 | 1) => {
    const idx = items.findIndex((c) => c.id === id);
    const swapIdx = idx + direction;
    if (idx < 0 || swapIdx < 0 || swapIdx >= items.length) return;
    const a = items[idx];
    const b = items[swapIdx];
    const supabase = createClient();
    await Promise.all([
      supabase.from('categories').update({ display_order: b.display_order }).eq('id', a.id),
      supabase.from('categories').update({ display_order: a.display_order }).eq('id', b.id),
    ]);
    await load();
  };

  const merge = async () => {
    if (!mergeFrom || !mergeInto || mergeFrom === mergeInto) {
      setError('Choose two different categories to merge.');
      return;
    }
    setSaving(true);
    setError('');
    const supabase = createClient();
    await supabase.from('articles').update({ category_id: mergeInto }).eq('category_id', mergeFrom);
    await supabase.from('categories').delete().eq('id', mergeFrom);
    setSaving(false);
    setShowMerge(false);
    setMergeFrom('');
    setMergeInto('');
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this category? Articles will become uncategorised.')) return;
    const supabase = createClient();
    await supabase.from('categories').delete().eq('id', id);
    await load();
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Create, rename, reorder, and merge subject categories"
        action={
          <div className="flex gap-2">
            <button type="button" onClick={() => { setError(''); setShowMerge(true); }} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-sky-50">
              <Merge size={15} /> Merge
            </button>
            <button type="button" onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-ilm-navy px-4 py-2.5 text-xs font-semibold text-white hover:bg-ilm-navy-light">
              <Plus size={15} /> Add category
            </button>
          </div>
        }
      />

      {loading ? (
        <div className="flex justify-center py-16 text-sm text-slate-500"><Loader2 className="mr-2 animate-spin" size={18} /> Loading…</div>
      ) : items.length === 0 ? (
        <EmptyState icon={FolderTree} title="No categories" description="Create your first category." />
      ) : (
        <Card className="divide-y divide-slate-50">
          {items.map((cat, i) => (
            <div key={cat.id} className="group flex items-center gap-4 px-5 py-4 hover:bg-sky-50/40">
              <div className="flex flex-col gap-0.5">
                <button type="button" disabled={i === 0} onClick={() => move(cat.id, -1)} className="text-slate-300 hover:text-ilm-navy disabled:opacity-30"><ArrowUp size={14} /></button>
                <button type="button" disabled={i === items.length - 1} onClick={() => move(cat.id, 1)} className="text-slate-300 hover:text-ilm-navy disabled:opacity-30"><ArrowDown size={14} /></button>
              </div>
              <span className="h-3 w-3 rounded-full" style={{ background: cat.color }} />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-800">{cat.name}</p>
                <p className="truncate text-xs text-slate-400">{cat.description || `/${cat.slug}`}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                <button type="button" onClick={() => openEdit(cat)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-sky-50 hover:text-ilm-navy"><Pencil size={14} /></button>
                <button type="button" onClick={() => remove(cat.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </Card>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ilm-navy/40 p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-ilm-navy">{editing ? 'Edit category' : 'Add category'}</h2>
              <button type="button" onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>
            {error && <div className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-ilm-navy/40" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-ilm-navy/40" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-ilm-navy/40" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Icon (optional emoji or label)</label>
                <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-ilm-navy/40" placeholder="e.g. book" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-500">Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button key={c} type="button" onClick={() => setForm({ ...form, color: c })} className={`h-8 w-8 rounded-full ${form.color === c ? 'ring-2 ring-ilm-navy ring-offset-2' : ''}`} style={{ background: c }} />
                  ))}
                </div>
              </div>
              <button type="button" disabled={saving} onClick={save} className="flex w-full items-center justify-center gap-2 rounded-lg bg-ilm-navy py-2.5 text-sm font-semibold text-white hover:bg-ilm-navy-light disabled:opacity-60">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                {editing ? 'Save changes' : 'Create category'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showMerge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ilm-navy/40 p-4" onClick={() => setShowMerge(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-ilm-navy">Merge categories</h2>
              <button type="button" onClick={() => setShowMerge(false)}><X size={18} /></button>
            </div>
            {error && <div className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}
            <p className="mb-4 text-sm text-slate-500">Articles from the source category move into the target, then the source is deleted.</p>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Merge from</label>
                <select value={mergeFrom} onChange={(e) => setMergeFrom(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm">
                  <option value="">Select…</option>
                  {items.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Into</label>
                <select value={mergeInto} onChange={(e) => setMergeInto(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm">
                  <option value="">Select…</option>
                  {items.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <button type="button" disabled={saving} onClick={merge} className="flex w-full items-center justify-center gap-2 rounded-lg bg-ilm-navy py-2.5 text-sm font-semibold text-white hover:bg-ilm-navy-light disabled:opacity-60">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Merge size={16} />}
                Merge categories
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
