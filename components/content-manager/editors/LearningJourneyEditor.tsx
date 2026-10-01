'use client';

import { useState } from 'react';
import type { CMLearningJourney, LearningStep } from '@/lib/content-manager/types';
import { CM_DEFAULTS } from '@/lib/content-manager/defaults';
import {
  SectionHeader, FieldGroup, TextField, TextareaField,
  VisibilityToggle, SortableRow, AddButton, SaveBar, ConfirmDialog,
} from '../fields';

let idCounter = 1;
function newId() { return `step-new-${Date.now()}-${idCounter++}`; }

export function LearningJourneyEditor({
  data, onSave, onReset,
}: { data: CMLearningJourney; onSave: (v: CMLearningJourney) => void; onReset: () => void; }) {
  const [draft, setDraft] = useState<CMLearningJourney>(data);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const update = (patch: Partial<CMLearningJourney>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setDirty(true); setSaved(false);
  };

  const updateStep = (id: string, patch: Partial<LearningStep>) => {
    setDraft((d) => ({ ...d, steps: d.steps.map((s) => (s.id === id ? { ...s, ...patch } : s)) }));
    setDirty(true); setSaved(false);
  };

  const moveStep = (idx: number, dir: -1 | 1) => {
    const items = [...draft.steps];
    const t = idx + dir;
    if (t < 0 || t >= items.length) return;
    [items[idx], items[t]] = [items[t], items[idx]];
    setDraft((d) => ({ ...d, steps: items.map((s, i) => ({ ...s, order: i })) }));
    setDirty(true); setSaved(false);
  };

  const addStep = () => {
    const n = draft.steps.length + 1;
    const step: LearningStep = {
      id: newId(),
      n: String(n).padStart(2, '0'),
      title: 'New Step',
      body: '',
      visible: true,
      order: draft.steps.length,
    };
    setDraft((d) => ({ ...d, steps: [...d.steps, step] }));
    setDirty(true); setSaved(false);
  };

  const removeStep = (id: string) => {
    setDraft((d) => ({ ...d, steps: d.steps.filter((s) => s.id !== id) }));
    setDirty(true); setSaved(false);
  };

  const handleSave = () => { onSave(draft); setDirty(false); setSaved(true); };

  return (
    <div className="relative space-y-5 pb-20">
      <SectionHeader
        title="Learning Journey"
        description="The 'How It Works' section showing the steps for seekers."
        visible={draft.visible}
        onVisibilityChange={(v) => update({ visible: v })}
      />

      <FieldGroup title="Section Labels">
        <TextField label="Section label (eyebrow)" value={draft.sectionLabel} onChange={(v) => update({ sectionLabel: v })} placeholder="A way of learning" />
        <TextField label="Section heading" value={draft.heading} onChange={(v) => update({ heading: v })} placeholder="How seekers walk with ILM." />
      </FieldGroup>

      <FieldGroup title="Steps">
        <div className="space-y-2">
          {draft.steps.map((step, idx) => (
            <SortableRow
              key={step.id}
              onMoveUp={idx > 0 ? () => moveStep(idx, -1) : undefined}
              onMoveDown={idx < draft.steps.length - 1 ? () => moveStep(idx, 1) : undefined}
              onDelete={() => removeStep(step.id)}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-16 shrink-0">
                    <TextField value={step.n} onChange={(v) => updateStep(step.id, { n: v })} placeholder="01" />
                  </div>
                  <div className="flex-1">
                    <TextField value={step.title} onChange={(v) => updateStep(step.id, { title: v })} placeholder="Step title" />
                  </div>
                  <VisibilityToggle visible={step.visible} onChange={(v) => updateStep(step.id, { visible: v })} />
                </div>
                <TextareaField
                  value={step.body}
                  onChange={(v) => updateStep(step.id, { body: v })}
                  rows={2}
                  placeholder="Step description…"
                />
              </div>
            </SortableRow>
          ))}
        </div>
        <AddButton onClick={addStep} label="Add step" />
      </FieldGroup>

      <SaveBar dirty={dirty} saved={saved} onSave={handleSave} onReset={() => setConfirmReset(true)} />
      <ConfirmDialog
        open={confirmReset}
        title="Reset Learning Journey?"
        message="This will restore the Learning Journey section to its original defaults."
        onConfirm={() => { onReset(); setDraft(CM_DEFAULTS.learningJourney); setDirty(false); setSaved(false); setConfirmReset(false); }}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
