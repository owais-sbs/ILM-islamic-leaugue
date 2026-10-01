'use client';

/**
 * CategoriesEditor — SUPERSEDED by DirectoryEditor.
 * Kept to avoid breaking any stale imports. No longer rendered in ContentManagerLayout.
 */

import { useState } from 'react';
import type { CMCategories, CMCategoryDisplay } from '@/lib/content-manager/types';
import { CM_DEFAULTS } from '@/lib/content-manager/defaults';
import { useIlm } from '@/lib/ilm-store';
import { SectionHeader, FieldGroup, VisibilityToggle, SortableRow, SaveBar, ConfirmDialog } from '../fields';

export function CategoriesEditor({
  data, onSave, onReset,
}: { data: CMCategories; onSave: (v: CMCategories) => void; onReset: () => void; }) {
  const { categories: storeCategories } = useIlm();
  const [draft, setDraft] = useState<CMCategories>(data);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const mergedItems = storeCategories.map((cat) => {
    const display = draft.items.find((i) => i.id === cat.id);
    return display ?? { id: cat.id, visible: true, order: storeCategories.indexOf(cat) };
  }).sort((a, b) => a.order - b.order);

  const updateItem = (id: string, patch: Partial<CMCategoryDisplay>) => {
    const exists = draft.items.some((i) => i.id === id);
    const next = exists
      ? draft.items.map((i) => (i.id === id ? { ...i, ...patch } : i))
      : [...draft.items, { id, visible: true, order: draft.items.length, ...patch }];
    setDraft((d) => ({ ...d, items: next }));
    setDirty(true); setSaved(false);
  };

  const moveItem = (idx: number, dir: -1 | 1) => {
    const items = [...mergedItems];
    const t = idx + dir;
    if (t < 0 || t >= items.length) return;
    [items[idx], items[t]] = [items[t], items[idx]];
    setDraft((d) => ({ ...d, items: items.map((item, i) => ({ ...item, order: i })) }));
    setDirty(true); setSaved(false);
  };

  const handleSave = () => { onSave(draft); setDirty(false); setSaved(true); };

  return (
    <div className="relative space-y-5 pb-20">
      <SectionHeader
        title="Categories"
        description="Control which categories appear on the homepage and in what order."
        visible={draft.visible}
        onVisibilityChange={(v) => { setDraft((d) => ({ ...d, visible: v })); setDirty(true); setSaved(false); }}
      />
      <FieldGroup title="Homepage Category Display">
        <div className="space-y-2 mt-3">
          {mergedItems.map((item, idx) => {
            const cat = storeCategories.find((c) => c.id === item.id);
            if (!cat) return null;
            return (
              <SortableRow
                key={item.id}
                onMoveUp={idx > 0 ? () => moveItem(idx, -1) : undefined}
                onMoveDown={idx < mergedItems.length - 1 ? () => moveItem(idx, 1) : undefined}
                showDelete={false}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-ilm-navy">{cat.name}</span>
                  <VisibilityToggle visible={item.visible} onChange={(v) => updateItem(item.id, { visible: v })} />
                </div>
              </SortableRow>
            );
          })}
        </div>
      </FieldGroup>
      <SaveBar dirty={dirty} saved={saved} onSave={handleSave} onReset={() => setConfirmReset(true)} />
      <ConfirmDialog
        open={confirmReset}
        title="Reset Categories?"
        message="This will restore category homepage display settings to defaults."
        onConfirm={() => {
          onReset();
          setDraft(CM_DEFAULTS.directory.categories);
          setDirty(false); setSaved(false); setConfirmReset(false);
        }}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
