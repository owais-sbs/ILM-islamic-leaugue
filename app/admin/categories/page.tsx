'use client';

import { useState } from 'react';
import { FolderTree, GripVertical, Merge, Pencil, Plus, Trash2 } from 'lucide-react';
import { PageHeader, Card, EmptyState } from '@/components/admin/AdminUI';
import { usePermissions } from '@/components/admin/RoleContext';
import { categories as initialCategories } from '@/lib/data';

export default function AdminCategories() {
  const perms = usePermissions();
  const [items, setItems] = useState(initialCategories);
  const [newName, setNewName] = useState('');
  const [showMerge, setShowMerge] = useState(false);

  if (!perms.canManageTaxonomy) {
    return (
      <div>
        <PageHeader title="Categories" description="Manage article subjects" />
        <Card className="p-8 text-center">
          <p className="text-sm text-slate-500">Only Administrators can manage categories. Switch your role to Admin using the role switcher in the topbar.</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Categories" description="Create, rename, reorder, and merge subject categories" />

      <Card className="mb-4 p-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            placeholder="New category name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-ilm-gold/70"
          />
          <button
            onClick={() => { if (newName.trim()) { setItems([...items, { id: `c${items.length + 1}`, name: newName, slug: newName.toLowerCase().replace(/\s+/g, '-'), description: '', articleCount: 0, color: '#0F1657' }]); setNewName(''); } }}
            className="flex items-center justify-center gap-2 rounded-lg bg-ilm-gold px-4 py-2 text-xs font-semibold text-white transition hover:bg-ilm-gold-dark"
          >
            <Plus size={15} /> Add category
          </button>
        </div>
      </Card>

      <Card className="divide-y divide-slate-50">
        {items.map((cat, i) => (
          <div key={cat.id} className="group flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50/50">
            <GripVertical size={16} className="cursor-grab text-slate-300 transition group-hover:text-slate-400" />
            <span className="h-3 w-3 rounded-full" style={{ background: cat.color }} />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-800">{cat.name}</p>
              <p className="truncate text-xs text-slate-400">{cat.description}</p>
            </div>
            <span className="text-xs font-medium text-slate-400">{cat.articleCount} articles</span>
            <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-ilm-navy/10 hover:text-ilm-gold" title="Rename">
                <Pencil size={14} />
              </button>
              <button onClick={() => setShowMerge(true)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-blue-100 hover:text-blue-600" title="Merge">
                <Merge size={14} />
              </button>
              <button onClick={() => setItems(items.filter((x) => x.id !== cat.id))} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-100 hover:text-rose-600" title="Delete">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </Card>

      {items.length === 0 && <EmptyState icon={FolderTree} title="No categories" description="Create your first category to start organizing articles." />}
    </div>
  );
}
