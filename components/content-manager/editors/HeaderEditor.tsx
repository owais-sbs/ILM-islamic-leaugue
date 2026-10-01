'use client';

import { useState } from 'react';
import type { CMHeader, NavItem } from '@/lib/content-manager/types';
import { CM_DEFAULTS } from '@/lib/content-manager/defaults';
import {
  SectionHeader, FieldGroup, TextField, LinkField, VisibilityToggle,
  SortableRow, AddButton, SaveBar, ConfirmDialog,
} from '../fields';

let idCounter = 1;
function newId() { return `nav-new-${Date.now()}-${idCounter++}`; }

export function HeaderEditor({
  data,
  onSave,
  onReset,
}: {
  data: CMHeader;
  onSave: (v: CMHeader) => void;
  onReset: () => void;
}) {
  const [draft, setDraft] = useState<CMHeader>(data);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const update = (patch: Partial<CMHeader>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setDirty(true);
    setSaved(false);
  };

  const updateNav = (id: string, patch: Partial<NavItem>) => {
    setDraft((d) => ({
      ...d,
      navItems: d.navItems.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    }));
    setDirty(true);
    setSaved(false);
  };

  const moveNav = (idx: number, dir: -1 | 1) => {
    const items = [...draft.navItems];
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    [items[idx], items[target]] = [items[target], items[idx]];
    setDraft((d) => ({ ...d, navItems: items.map((n, i) => ({ ...n, order: i })) }));
    setDirty(true);
    setSaved(false);
  };

  const addNav = () => {
    const item: NavItem = { id: newId(), label: 'New Link', href: '/', visible: true, order: draft.navItems.length };
    setDraft((d) => ({ ...d, navItems: [...d.navItems, item] }));
    setDirty(true);
    setSaved(false);
  };

  const removeNav = (id: string) => {
    setDraft((d) => ({ ...d, navItems: d.navItems.filter((n) => n.id !== id) }));
    setDirty(true);
    setSaved(false);
  };

  const handleSave = () => {
    onSave(draft);
    setDirty(false);
    setSaved(true);
  };

  const handleReset = () => setConfirmReset(true);

  return (
    <div className="relative space-y-5 pb-20">
      <SectionHeader title="Header" description="Site name, navigation links, and CTA button." />

      <FieldGroup title="Brand">
        <TextField label="Site / brand name" value={draft.siteName} onChange={(v) => update({ siteName: v })} />
      </FieldGroup>

      <FieldGroup title="Call to Action">
        <TextField label="CTA button text" value={draft.ctaText} onChange={(v) => update({ ctaText: v })} placeholder="Ask a Question" />
        <LinkField label="CTA button URL" value={draft.ctaUrl} onChange={(v) => update({ ctaUrl: v })} />
      </FieldGroup>

      <FieldGroup title="Navigation Items">
        <div className="space-y-2">
          {draft.navItems.map((item, idx) => (
            <SortableRow
              key={item.id}
              onMoveUp={idx > 0 ? () => moveNav(idx, -1) : undefined}
              onMoveDown={idx < draft.navItems.length - 1 ? () => moveNav(idx, 1) : undefined}
              onDelete={() => removeNav(item.id)}
            >
              <div className="grid gap-2 sm:grid-cols-2">
                <TextField value={item.label} onChange={(v) => updateNav(item.id, { label: v })} placeholder="Label" />
                <LinkField value={item.href} onChange={(v) => updateNav(item.id, { href: v })} placeholder="/path" />
              </div>
              <div className="mt-2">
                <VisibilityToggle visible={item.visible} onChange={(v) => updateNav(item.id, { visible: v })} />
              </div>
            </SortableRow>
          ))}
        </div>
        <AddButton onClick={addNav} label="Add navigation item" />
      </FieldGroup>

      <SaveBar dirty={dirty} saved={saved} onSave={handleSave} onReset={handleReset} />
      <ConfirmDialog
        open={confirmReset}
        title="Reset Header?"
        message="This will restore all header settings to their original defaults. Any changes will be lost."
        onConfirm={() => { onReset(); setDraft(CM_DEFAULTS.header); setDirty(false); setSaved(false); setConfirmReset(false); }}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
