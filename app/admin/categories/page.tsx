'use client';

import { useState } from 'react';
import { Check, FolderTree, GripVertical, Merge, Pencil, Plus, Trash2, X } from 'lucide-react';
import { PageHeader, Card, EmptyState } from '@/components/admin/AdminUI';
import { usePermissions } from '@/components/admin/RoleContext';
import { categories as initialCategories } from '@/lib/data';

type Category = typeof initialCategories[number];

export default function AdminCategories() {
  const perms = usePermissions();
  const [items, setItems]       = useState(initialCategories);
  const [newName, setNewName]   = useState('');
  const [editId, setEditId]     = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [mergeFrom, setMergeFrom] = useState('');
  const [mergeTo, setMergeTo]     = useState('');
  const [showMerge, setShowMerge] = useState(false);
  const [mergeConfirmed, setMergeConfirmed] = useState(false);

  if (!perms.canManageTaxonomy) {
    return (
      <div>
        <PageHeader title="Categories" description="Manage article subjects" />
        <Card className="p-8 text-center">
          <p className="text-sm text-slate-500">
            Only Administrators can manage categories. Switch your role to Admin using the role switcher.
          </p>
        </Card>
      </div>
    );
  }

  const addCategory = () => {
    if (!newName.trim()) return;
    setItems([
      ...items,
      {
        id: `c${Date.now()}`,
        name: newName.trim(),
        slug: newName.trim().toLowerCase().replace(/\s+/g, '-'),
        description: '',
        articleCount: 0,
        color: '#0F1657',
      },
    ]);
    setNewName('');
  };

  const startEdit = (cat: Category) => {
    setEditId(cat.id);
    setEditName(cat.name);
  };

  const saveEdit = () => {
    if (!editName.trim()) return;
    setItems(items.map((c) => c.id === editId ? { ...c, name: editName.trim() } : c));
    setEditId(null);
  };

  const doMerge = () => {
    if (!mergeFrom || !mergeTo || mergeFrom === mergeTo) return;
    setItems(items.filter((c) => c.name !== mergeFrom));
    setMergeConfirmed(true);
    setTimeout(() => { setShowMerge(false); setMergeConfirmed(false); setMergeFrom(''); setMergeTo(''); }, 1500);
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Create, rename, reorder, and merge subject categories"
        action={
          <button
            onClick={() => setShowMerge(true)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <Merge size={14} /> Merge categories
          </button>
        }
      />

      {/* Add new */}
      <Card className="mb-4 p-4">
        <form
          onSubmit={(e) => { e.preventDefault(); addCategory(); }}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <div className="relative flex-1">
            <FolderTree
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="New category name…"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-ilm-gold focus:ring-2 focus:ring-ilm-gold/15"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-lg bg-ilm-gold px-5 py-2 text-xs font-semibold text-white transition hover:bg-ilm-gold-dark"
          >
            <Plus size={14} /> Add category
          </button>
        </form>
        <p className="mt-2 text-[11px] text-slate-400">
          Press <kbd className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[10px]">Enter</kbd> or click <strong>Add category</strong> to save.
        </p>
      </Card>

      {/* Category list */}
      <Card className="divide-y divide-slate-50">
        {items.map((cat) => (
          <div key={cat.id} className="group flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50/50">
            <GripVertical size={15} className="shrink-0 cursor-grab text-slate-300 transition group-hover:text-slate-400" />
            <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: cat.color }} />

            {/* Inline rename */}
            {editId === cat.id ? (
              <div className="flex flex-1 items-center gap-2">
                <input
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditId(null); }}
                  className="flex-1 rounded-lg border border-ilm-gold/60 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-ilm-gold/15"
                />
                <button onClick={saveEdit} className="flex h-7 w-7 items-center justify-center rounded-lg bg-ilm-gold text-white transition hover:bg-ilm-gold-dark">
                  <Check size={13} />
                </button>
                <button onClick={() => setEditId(null)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50">
                  <X size={13} />
                </button>
              </div>
            ) : (
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-800">{cat.name}</p>
                <p className="truncate text-xs text-slate-400">{cat.description}</p>
              </div>
            )}

            <span className="shrink-0 text-xs font-medium text-slate-400">{cat.articleCount} articles</span>

            {editId !== cat.id && (
              <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                <button
                  onClick={() => startEdit(cat)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-ilm-navy/10 hover:text-ilm-gold"
                  title="Rename"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => { setMergeFrom(cat.name); setShowMerge(true); }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                  title="Merge"
                >
                  <Merge size={14} />
                </button>
                <button
                  onClick={() => setItems(items.filter((x) => x.id !== cat.id))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </Card>

      {items.length === 0 && (
        <div className="mt-4">
          <EmptyState icon={FolderTree} title="No categories" description="Create your first category to start organising articles." />
        </div>
      )}

      {/* Merge modal */}
      {showMerge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowMerge(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl text-ilm-navy">Merge categories</h2>
              <button onClick={() => setShowMerge(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                <X size={16} />
              </button>
            </div>

            {mergeConfirmed ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <Check size={32} className="text-ilm-gold" />
                <p className="font-medium text-ilm-navy">Categories merged successfully.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">Merge from (will be deleted)</label>
                  <select
                    value={mergeFrom}
                    onChange={(e) => setMergeFrom(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-ilm-gold/70"
                  >
                    <option value="">Select category…</option>
                    {items.filter((c) => c.name !== mergeTo).map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">Merge into (will be kept)</label>
                  <select
                    value={mergeTo}
                    onChange={(e) => setMergeTo(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-ilm-gold/70"
                  >
                    <option value="">Select category…</option>
                    {items.filter((c) => c.name !== mergeFrom).map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                {mergeFrom && mergeTo && (
                  <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                    All articles in <strong>{mergeFrom}</strong> will be moved to <strong>{mergeTo}</strong>. This cannot be undone.
                  </p>
                )}
                <button
                  onClick={doMerge}
                  disabled={!mergeFrom || !mergeTo}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-ilm-gold py-2.5 text-sm font-semibold text-white transition hover:bg-ilm-gold-dark disabled:opacity-40"
                >
                  <Merge size={15} /> Confirm merge
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
