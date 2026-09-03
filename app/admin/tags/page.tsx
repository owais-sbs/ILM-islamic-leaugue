'use client';

import { useState } from 'react';
import { Plus, Tag as TagIcon, Trash2 } from 'lucide-react';
import { PageHeader, Card, EmptyState } from '@/components/admin/AdminUI';
import { usePermissions } from '@/components/admin/RoleContext';
import { tags as initialTags } from '@/lib/data';

export default function AdminTags() {
  const perms = usePermissions();
  const [items, setItems] = useState(initialTags);
  const [newName, setNewName] = useState('');

  if (!perms.canManageTaxonomy) {
    return (
      <div>
        <PageHeader title="Tags" description="Manage article tags" />
        <Card className="p-8 text-center">
          <p className="text-sm text-slate-500">Only Administrators can manage tags. Switch your role to Admin using the role switcher.</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Tags" description="Create and manage tags for articles" />

      <Card className="mb-4 p-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            placeholder="New tag name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-ilm-gold/70"
          />
          <button
            onClick={() => { if (newName.trim()) { setItems([...items, { id: `t${items.length + 1}`, name: newName, slug: newName.toLowerCase().replace(/\s+/g, '-'), articleCount: 0 }]); setNewName(''); } }}
            className="flex items-center justify-center gap-2 rounded-lg bg-ilm-gold px-4 py-2 text-xs font-semibold text-white transition hover:bg-ilm-gold-dark"
          >
            <Plus size={15} /> Add tag
          </button>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        {items.map((tag) => (
          <div key={tag.id} className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 transition hover:border-ilm-gold/60 hover:bg-ilm-cream">
            <TagIcon size={13} className="text-ilm-gold" />
            <span className="text-sm font-medium text-slate-700">{tag.name}</span>
            <span className="text-xs text-slate-400">{tag.articleCount}</span>
            <button onClick={() => setItems(items.filter((x) => x.id !== tag.id))} className="text-slate-300 transition hover:text-rose-500">
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      {items.length === 0 && <div className="mt-4"><EmptyState icon={TagIcon} title="No tags" description="Create tags to help readers discover related articles." /></div>}
    </div>
  );
}
