'use client';

import { useState } from 'react';
import type { CMAbout, PillarItem } from '@/lib/content-manager/types';
import { CM_DEFAULTS } from '@/lib/content-manager/defaults';
import {
  SectionHeader, FieldGroup, TextField, TextareaField, LinkField,
  VisibilityToggle, SortableRow, AddButton, SaveBar, ConfirmDialog,
} from '../fields';

let idCounter = 1;
function newId() { return `pillar-new-${Date.now()}-${idCounter++}`; }

export function AboutEditor({
  data, onSave, onReset,
}: { data: CMAbout; onSave: (v: CMAbout) => void; onReset: () => void; }) {
  const [draft, setDraft] = useState<CMAbout>(data);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const update = (patch: Partial<CMAbout>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setDirty(true); setSaved(false);
  };

  const updatePillar = (id: string, patch: Partial<PillarItem>) => {
    setDraft((d) => ({ ...d, pillars: d.pillars.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
    setDirty(true); setSaved(false);
  };

  const movePillar = (idx: number, dir: -1 | 1) => {
    const items = [...draft.pillars];
    const t = idx + dir;
    if (t < 0 || t >= items.length) return;
    [items[idx], items[t]] = [items[t], items[idx]];
    setDraft((d) => ({ ...d, pillars: items.map((p, i) => ({ ...p, order: i })) }));
    setDirty(true); setSaved(false);
  };

  const addPillar = () => {
    const item: PillarItem = { id: newId(), title: 'New Pillar', body: '', visible: true, order: draft.pillars.length };
    setDraft((d) => ({ ...d, pillars: [...d.pillars, item] }));
    setDirty(true); setSaved(false);
  };

  const removePillar = (id: string) => {
    setDraft((d) => ({ ...d, pillars: d.pillars.filter((p) => p.id !== id) }));
    setDirty(true); setSaved(false);
  };

  const handleSave = () => { onSave(draft); setDirty(false); setSaved(true); };

  return (
    <div className="relative space-y-5 pb-20">
      <SectionHeader title="About Us" description="The 'Our Why' section and the three pillars below it."
        visible={draft.visible} onVisibilityChange={(v) => update({ visible: v })} />

      <FieldGroup title="Section Text">
        <TextField label="Section label" value={draft.sectionLabel} onChange={(v) => update({ sectionLabel: v })} />
        <TextField label="Main heading" value={draft.heading} onChange={(v) => update({ heading: v })} />
        <TextField label="Highlighted heading text" value={draft.headingHighlight} onChange={(v) => update({ headingHighlight: v })} hint="Renders in serif italic." />
        <TextareaField label="Body paragraph 1" value={draft.body1} onChange={(v) => update({ body1: v })} rows={3} />
        <TextareaField label="Body paragraph 2" value={draft.body2} onChange={(v) => update({ body2: v })} rows={3} />
      </FieldGroup>

      <FieldGroup title="Button">
        <TextField label="Button text" value={draft.btnText} onChange={(v) => update({ btnText: v })} />
        <LinkField label="Button URL" value={draft.btnUrl} onChange={(v) => update({ btnUrl: v })} />
      </FieldGroup>

      <FieldGroup title="Pillars / Feature Cards">
        <div className="space-y-2">
          {draft.pillars.map((pillar, idx) => (
            <SortableRow
              key={pillar.id}
              onMoveUp={idx > 0 ? () => movePillar(idx, -1) : undefined}
              onMoveDown={idx < draft.pillars.length - 1 ? () => movePillar(idx, 1) : undefined}
              onDelete={() => removePillar(pillar.id)}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <TextField value={pillar.title} onChange={(v) => updatePillar(pillar.id, { title: v })} placeholder="Pillar title" />
                  </div>
                  <VisibilityToggle visible={pillar.visible} onChange={(v) => updatePillar(pillar.id, { visible: v })} />
                </div>
                <TextareaField value={pillar.body} onChange={(v) => updatePillar(pillar.id, { body: v })} rows={2} placeholder="Description…" />
              </div>
            </SortableRow>
          ))}
        </div>
        <AddButton onClick={addPillar} label="Add pillar" />
      </FieldGroup>

      <SaveBar dirty={dirty} saved={saved} onSave={handleSave} onReset={() => setConfirmReset(true)} />
      <ConfirmDialog open={confirmReset} title="Reset About Us?" message="This will restore the About Us section to its original defaults."
        onConfirm={() => { onReset(); setDraft(CM_DEFAULTS.about); setDirty(false); setSaved(false); setConfirmReset(false); }}
        onCancel={() => setConfirmReset(false)} />
    </div>
  );
}
