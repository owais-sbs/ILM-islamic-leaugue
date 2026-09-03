'use client';

import { useRef, useState } from 'react';
import { Check, Pencil, Plus, Tag as TagIcon, Trash2, X } from 'lucide-react';
import { PageHeader, Card, EmptyState } from '@/components/admin/AdminUI';
import { usePermissions } from '@/components/admin/RoleContext';
import { tags as initialTags } from '@/lib/data';

type Tag = typeof initialTags[number];

export default function AdminTags() {
  const perms      = usePermissions();
  const inputRef   = useRef<HTMLInputElement>(null);
  const [items,    setItems]    = useState(initialTags);
  const [newName,  setNewName]  = useState('');
  const [added,    setAdded]    = useState(false);   // brief success flash
  const [editId,   setEditId]   = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  if (!perms.canManageTaxonomy) {
    return (
      <div>
        <PageHeader title="Tags" description="Manage article tags" />
        <Card className="p-8 text-center">
          <p className="text-sm text-slate-500">
            Only Administrators can manage tags. Switch your role to Admin using the role switcher.
          </p>
        </Card>
      </div>
    );
  }

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

  return (
    <div>
      <PageHeader
        title="Tags"
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
          >
            {added ? (
              <><Check size={14} /> Added!</>
            ) : (
              <><Plus size={14} /> Add tag</>
            )}
          </button>
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
        </div>
      )}
    </div>
  );
}
