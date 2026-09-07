'use client';

<<<<<<< HEAD
import { useEffect, useState } from 'react';
import { Loader2, Plus, Tag as TagIcon, Trash2, X } from 'lucide-react';
=======
import { useRef, useState } from 'react';
import { Check, Pencil, Plus, Tag as TagIcon, Trash2, X } from 'lucide-react';
>>>>>>> 03a3145bf8aa2b0217bde3a2111ce6e5470555b0
import { PageHeader, Card, EmptyState } from '@/components/admin/AdminUI';
import { usePermissions } from '@/components/admin/RoleContext';
import { createClient } from '@/lib/supabase/client';
import { slugify, type TagRow } from '@/lib/supabase/types';

type Tag = typeof initialTags[number];

export default function AdminTags() {
<<<<<<< HEAD
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
=======
  const perms      = usePermissions();
  const inputRef   = useRef<HTMLInputElement>(null);
  const [items,    setItems]    = useState(initialTags);
  const [newName,  setNewName]  = useState('');
  const [added,    setAdded]    = useState(false);   // brief success flash
  const [editId,   setEditId]   = useState<string | null>(null);
  const [editName, setEditName] = useState('');
>>>>>>> 03a3145bf8aa2b0217bde3a2111ce6e5470555b0

  if (!perms.canManageTaxonomy) {
    return (
      <div>
        <PageHeader title="Tags" description="Manage article tags" />
        <Card className="p-8 text-center">
<<<<<<< HEAD
          <p className="text-sm text-slate-500">Only Administrators can manage tags.</p>
=======
          <p className="text-sm text-slate-500">
            Only Administrators can manage tags. Switch your role to Admin using the role switcher.
          </p>
>>>>>>> 03a3145bf8aa2b0217bde3a2111ce6e5470555b0
        </Card>
      </div>
    );
  }

<<<<<<< HEAD
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
=======
  const addTag = () => {
    const name = newName.trim();
    if (!name) {
      inputRef.current?.focus();
      return;
    }
    if (items.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
      setNewName('');
      inputRef.current?.focus();
      return;
    }
    setItems((prev) => [
      ...prev,
      {
        id:           `t${Date.now()}`,
        name,
        slug:         name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        articleCount: 0,
      },
    ]);
    setNewName('');
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
    inputRef.current?.focus();
  };

  const startEdit = (tag: Tag) => { setEditId(tag.id); setEditName(tag.name); };
  const saveEdit  = () => {
    const name = editName.trim();
    if (name) setItems((prev) => prev.map((t) => t.id === editId ? { ...t, name } : t));
    setEditId(null);
  };
  const deleteTag = (id: string) => setItems((prev) => prev.filter((t) => t.id !== id));
>>>>>>> 03a3145bf8aa2b0217bde3a2111ce6e5470555b0

  return (
    <div>
      <PageHeader
        title="Tags"
<<<<<<< HEAD
        description="Labels that help readers discover related articles"
        action={
          <button
            type="button"
            onClick={() => {
              setError('');
              setShowForm(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-ilm-navy px-4 py-2.5 text-xs font-semibold text-white hover:bg-ilm-navy-light"
=======
        description={`${items.length} tag${items.length !== 1 ? 's' : ''}`}
      />

      {/* ── Add new tag ─────────────────────────────── */}
      <Card className="mb-6 p-4">
        <form
          onSubmit={(e) => { e.preventDefault(); addTag(); }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <TagIcon
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a tag name and press Enter or click Add…"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-ilm-gold focus:ring-2 focus:ring-ilm-gold/15"
            />
          </div>
          <button
            type="submit"
            className={`flex items-center gap-1.5 rounded-lg px-5 py-2 text-xs font-semibold text-white transition ${
              added
                ? 'bg-green-500'
                : 'bg-ilm-gold hover:bg-ilm-gold-dark'
            }`}
>>>>>>> 03a3145bf8aa2b0217bde3a2111ce6e5470555b0
          >
            {added ? (
              <><Check size={14} /> Added!</>
            ) : (
              <><Plus size={14} /> Add tag</>
            )}
          </button>
<<<<<<< HEAD
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
=======
        </form>
        <p className="mt-2 text-[11px] text-slate-400">
          Press <kbd className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[10px]">Enter</kbd> or click <strong>Add tag</strong> to save.
        </p>
      </Card>

      {/* ── Tag chips ───────────────────────────────── */}
      {items.length === 0 ? (
        <EmptyState
          icon={TagIcon}
          title="No tags yet"
          description="Create tags above to help readers discover related articles."
        />
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((tag) => (
            <div
              key={tag.id}
              className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 transition hover:border-ilm-gold/40 hover:bg-[#F9F8F5]"
            >
              <TagIcon size={12} className="shrink-0 text-ilm-gold/70" />

              {editId === tag.id ? (
                /* inline rename */
                <div className="flex items-center gap-1.5">
                  <input
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter')  saveEdit();
                      if (e.key === 'Escape') setEditId(null);
                    }}
                    className="w-28 rounded border border-ilm-gold/50 px-1.5 py-0.5 text-xs outline-none focus:ring-1 focus:ring-ilm-gold/30"
                  />
                  <button onClick={saveEdit} className="flex h-5 w-5 items-center justify-center rounded text-ilm-gold hover:bg-ilm-gold/10">
                    <Check size={11} />
                  </button>
                  <button onClick={() => setEditId(null)} className="flex h-5 w-5 items-center justify-center rounded text-slate-400 hover:bg-slate-100">
                    <X size={11} />
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-sm font-medium text-slate-700">{tag.name}</span>
                  <span className="text-[10px] text-slate-400">{tag.articleCount}</span>
                  <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <button onClick={() => startEdit(tag)} title="Rename" className="flex h-5 w-5 items-center justify-center rounded text-slate-300 hover:text-ilm-gold">
                      <Pencil size={11} />
                    </button>
                    <button onClick={() => deleteTag(tag.id)} title="Delete" className="flex h-5 w-5 items-center justify-center rounded text-slate-300 hover:text-rose-500">
                      <Trash2 size={11} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
>>>>>>> 03a3145bf8aa2b0217bde3a2111ce6e5470555b0
        </div>
      )}
    </div>
  );
}
