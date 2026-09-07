'use client';

import { useEffect, useState } from 'react';
import { Loader2, Plus, Tag as TagIcon, Trash2, X } from 'lucide-react';
import { PageHeader, Card, EmptyState } from '@/components/admin/AdminUI';
import { usePermissions } from '@/components/admin/RoleContext';
import { createClient } from '@/lib/supabase/client';
import { slugify, type TagRow } from '@/lib/supabase/types';

export default function AdminTags() {
  const perms = usePermissions();
  const [items, setItems] = useState<TagRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
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

  const save = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setSaving(true);
    setError('');
    const supabase = createClient();
    const { error: saveError } = await supabase.from('tags').insert({
      name: name.trim(),
      slug: slug || slugify(name),
    });
    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    setShowForm(false);
    setName('');
    setSlug('');
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this tag?')) return;
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
            onClick={() => {
              setError('');
              setShowForm(true);
            }}
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
        <div className="flex flex-wrap gap-2">
          {items.map((tag) => (
            <div
              key={tag.id}
              className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 transition hover:border-sky-300 hover:bg-sky-50"
            >
              <TagIcon size={13} className="text-ilm-navy" />
              <span className="text-sm font-medium text-slate-700">{tag.name}</span>
              <button
                type="button"
                onClick={() => remove(tag.id)}
                className="text-slate-300 hover:text-rose-500"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ilm-navy/40 p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-ilm-navy">Add tag</h2>
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
                    setSlug(slugify(e.target.value));
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
                Create tag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
