'use client';

import { useEffect, useState } from 'react';
import { Loader2, Plus, Tag as TagIcon, X } from 'lucide-react';
import { PageHeader, Card, EmptyState } from '@/components/admin/AdminUI';
import { TableRowActions } from '@/components/admin/TableRowActions';
import { usePermissions } from '@/components/admin/RoleContext';
import { createClient } from '@/lib/supabase/client';
import { slugify, type TagRow } from '@/lib/supabase/types';

export default function AdminTags() {
  const perms = usePermissions();
  const [items, setItems] = useState<TagRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TagRow | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('tags').select('*').order('name');
    setItems((data as TagRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (perms.canManageTaxonomy) load();
    else setLoading(false);
  }, [perms.canManageTaxonomy]);

  if (!perms.canManageTaxonomy) {
    return (
      <div>
        <PageHeader title="Tags" description="Manage article tags" />
        <Card className="p-8 text-center">
          <p className="text-sm text-slate-500">Only Administrators can manage tags.</p>
        </Card>
      </div>
    );
  }

  const openCreate = () => {
    setEditing(null);
    setName('');
    setSlug('');
    setError('');
    setShowForm(true);
  };

  const openEdit = (tag: TagRow) => {
    setEditing(tag);
    setName(tag.name);
    setSlug(tag.slug);
    setError('');
    setShowForm(true);
  };

  const save = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setSaving(true);
    setError('');
    const supabase = createClient();
    const payload = {
      name: name.trim(),
      slug: slug || slugify(name),
    };
    const { error: saveError } = editing
      ? await supabase.from('tags').update(payload).eq('id', editing.id)
      : await supabase.from('tags').insert(payload);
    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    setShowForm(false);
    setEditing(null);
    setName('');
    setSlug('');
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this tag? It will be removed from all articles.')) return;
    const supabase = createClient();
    await supabase.from('tags').delete().eq('id', id);
    await load();
  };

  return (
    <div>
      <PageHeader
        title="Tags"
        description="Labels that help readers discover related articles"
        action={
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 rounded-lg bg-ilm-navy px-4 py-2.5 text-xs font-semibold text-white hover:bg-ilm-navy-light"
          >
            <Plus size={15} /> Add tag
          </button>
        }
      />

      {loading ? (
        <div className="flex justify-center py-16 text-sm text-slate-500">
          <Loader2 className="mr-2 animate-spin" size={18} /> Loading…
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon={TagIcon} title="No tags" description="Create tags for your articles." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Name</th>
                  <th className="hidden px-5 py-3 sm:table-cell">Slug</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.map((tag) => (
                  <tr key={tag.id} className="hover:bg-sky-50/40">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <TagIcon size={14} className="text-ilm-navy" />
                        <span className="font-medium text-slate-800">{tag.name}</span>
                      </div>
                    </td>
                    <td className="hidden px-5 py-3.5 text-slate-400 sm:table-cell">/{tag.slug}</td>
                    <td className="px-5 py-3.5">
                      <TableRowActions onEdit={() => openEdit(tag)} onDelete={() => remove(tag.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ilm-navy/40 p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-ilm-navy">{editing ? 'Edit tag' : 'Add tag'}</h2>
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
            {error && <div className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Name *</label>
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editing) setSlug(slugify(e.target.value));
                  }}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-ilm-navy/40"
                  placeholder="e.g. intention"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Slug</label>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-ilm-navy/40"
                />
              </div>
              <button
                type="button"
                disabled={saving}
                onClick={save}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-ilm-navy py-2.5 text-sm font-semibold text-white hover:bg-ilm-navy-light disabled:opacity-60"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                {editing ? 'Save changes' : 'Create tag'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
