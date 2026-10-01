'use client';

/**
 * MurabbiyunEditor — SUPERSEDED by DirectoryEditor.
 * Kept to avoid breaking any stale imports. No longer rendered in ContentManagerLayout.
 */

import { useState } from 'react';
import type { CMMurabbiyun, CMMurabbiDisplay } from '@/lib/content-manager/types';
import { CM_DEFAULTS } from '@/lib/content-manager/defaults';
import { murabbiyūn } from '@/lib/public-data';
import { SectionHeader, FieldGroup, VisibilityToggle, SortableRow, SaveBar, ConfirmDialog } from '../fields';

export function MurabbiyunEditor({
  data, onSave, onReset,
}: { data: CMMurabbiyun; onSave: (v: CMMurabbiyun) => void; onReset: () => void; }) {
  const [draft, setDraft] = useState<CMMurabbiyun>(data);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const mergedItems: CMMurabbiDisplay[] = murabbiyūn.map((m) => {
    const display = draft.items.find((i) => i.id === m.id);
    return display ?? { id: m.id, visible: true, order: murabbiyūn.indexOf(m) };
  }).sort((a, b) => a.order - b.order);

  const updateItem = (id: string, patch: Partial<CMMurabbiDisplay>) => {
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
        title="Murabbiyūn"
        description="Control which authors appear on the homepage and in what order."
        visible={draft.visible}
        onVisibilityChange={(v) => { setDraft((d) => ({ ...d, visible: v })); setDirty(true); setSaved(false); }}
      />
      <FieldGroup title="Homepage Author Display">
        <div className="mt-3 space-y-2">
          {mergedItems.map((item, idx) => {
            const murabbi = murabbiyūn.find((m) => m.id === item.id);
            if (!murabbi) return null;
            return (
              <SortableRow
                key={item.id}
                onMoveUp={idx > 0 ? () => moveItem(idx, -1) : undefined}
                onMoveDown={idx < mergedItems.length - 1 ? () => moveItem(idx, 1) : undefined}
                showDelete={false}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ilm-navy">{murabbi.name}</p>
                    <p className="text-[11px] text-ilm-navy/40">{murabbi.role}</p>
                  </div>
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
        title="Reset Murabbiyūn?"
        message="This will restore the Murabbiyūn homepage display settings to their defaults."
        onConfirm={() => {
          onReset();
          setDraft(CM_DEFAULTS.directory.murabbiyun);
          setDirty(false); setSaved(false); setConfirmReset(false);
        }}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
