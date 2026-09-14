'use client';

import { useState } from 'react';
import { Plus, Tag, Trash2 } from 'lucide-react';
import { useIlm } from '@/lib/ilm-store';
import { adminSwal } from '@/lib/admin-swal';
import { Reveal, StaggerContainer, StaggerItem } from './reveal';

export function CategoriesScreen() {
  const { categories, tags, articles, addCategory, removeCategory, addTag, removeTag } = useIlm();
  const [categoryName, setCategoryName] = useState('');
  const [tagName, setTagName] = useState('');

  const counts = categories.map((cat) => ({
    ...cat,
    articleCount: articles.filter((a) => a.category === cat.name).length,
  }));

  return (
    <Reveal>
      <p className="mb-6 text-sm text-ilm-navy/50">
        Organise the public library. Categories appear in filters; tags help editors group related writing.
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-xs uppercase tracking-[0.14em] text-ilm-navy/45">Categories</h3>
            <form
              className="flex flex-1 max-w-xs gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const created = addCategory(categoryName);
                if (created) {
                  void adminSwal.success('Category added', created.name);
                  setCategoryName('');
                } else {
                  void adminSwal.error('Could not add', 'Enter a unique category name.');
                }
              }}
            >
              <input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="New category…"
                className="flex-1 rounded-lg border border-ilm-navy/10 bg-ilm-cream px-3 py-2 text-sm text-ilm-navy outline-none focus:border-ilm-gold"
              />
              <button type="submit" className="inline-flex items-center gap-1 rounded-full bg-ilm-navy px-3 py-2 text-[11px] uppercase tracking-wide text-white">
                <Plus size={13} /> Add
              </button>
            </form>
          </div>
          <StaggerContainer className="space-y-3">
            {counts.map((cat) => (
              <StaggerItem key={cat.id}>
                <div className="flex items-center gap-3 rounded-xl border border-ilm-navy/8 bg-white p-4 transition-colors hover:border-ilm-gold/40">
                  <Tag size={16} className="shrink-0 text-ilm-gold-deep" />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm text-ilm-navy">{cat.name}</h4>
                    <p className="text-xs text-ilm-navy/40">{cat.articleCount} articles · /{cat.slug}</p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${cat.name}`}
                    onClick={async () => {
                      const res = await adminSwal.confirm('Remove category?', cat.name, 'Remove');
                      if (res.isConfirmed) removeCategory(cat.id);
                    }}
                    className="text-ilm-navy/30 transition-colors hover:text-red-500"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        <div>
          <h3 className="mb-4 text-xs uppercase tracking-[0.14em] text-ilm-navy/45">Popular tags</h3>
          <div className="rounded-2xl border border-ilm-navy/8 bg-white p-6">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="rounded-full border border-ilm-navy/8 bg-ilm-cream px-3 py-1.5 text-xs text-ilm-navy/60 transition-colors hover:border-red-200 hover:text-red-600"
                  title="Click to remove"
                >
                  {tag}
                </button>
              ))}
            </div>
            <form
              className="mt-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (addTag(tagName)) {
                  setTagName('');
                  void adminSwal.success('Tag added');
                } else {
                  void adminSwal.error('Could not add tag', 'Enter a unique tag name.');
                }
              }}
            >
              <input
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="tag name"
                className="flex-1 rounded-lg border border-ilm-navy/10 bg-ilm-cream px-3.5 py-2 text-sm text-ilm-navy outline-none focus:border-ilm-gold"
              />
              <button type="submit" className="rounded-full bg-ilm-navy px-4 py-2 text-[11px] uppercase tracking-wide text-white">
                Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
