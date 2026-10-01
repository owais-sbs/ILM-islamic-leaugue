'use client';

import { useState } from 'react';
import type { CMMissionVisionPage } from '@/lib/content-manager/types';
import { CM_PAGE_DEFAULTS } from '@/lib/content-manager/page-defaults';
import {
  SectionHeader, FieldGroup, TextField, TextareaField,
  SortableRow, AddButton, SaveBar, ConfirmDialog,
} from '../fields';

export function MissionVisionEditor({
  data, onSave, onReset,
}: { data: CMMissionVisionPage; onSave: (v: CMMissionVisionPage) => void; onReset: () => void }) {
  const [draft, setDraft] = useState<CMMissionVisionPage>(data);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [tab, setTab] = useState<'mission' | 'vision' | 'objectives'>('mission');

  const set = (patch: Partial<CMMissionVisionPage>) => { setDraft(d => ({ ...d, ...patch })); setDirty(true); setSaved(false); };

  /* vision notes */
  const setNote = (idx: number, val: string) => {
    const next = [...draft.visionNotes]; next[idx] = val; set({ visionNotes: next });
  };
  const addNote = () => set({ visionNotes: [...draft.visionNotes, ''] });
  const removeNote = (idx: number) => set({ visionNotes: draft.visionNotes.filter((_, i) => i !== idx) });
  const moveNote = (idx: number, dir: -1 | 1) => {
    const arr = [...draft.visionNotes]; const t = idx + dir;
    if (t < 0 || t >= arr.length) return;
    [arr[idx], arr[t]] = [arr[t], arr[idx]]; set({ visionNotes: arr });
  };

  /* objectives */
  const setObj = (idx: number, val: string) => {
    const next = [...draft.objectives]; next[idx] = val; set({ objectives: next });
  };
  const addObj = () => set({ objectives: [...draft.objectives, ''] });
  const removeObj = (idx: number) => set({ objectives: draft.objectives.filter((_, i) => i !== idx) });
  const moveObj = (idx: number, dir: -1 | 1) => {
    const arr = [...draft.objectives]; const t = idx + dir;
    if (t < 0 || t >= arr.length) return;
    [arr[idx], arr[t]] = [arr[t], arr[idx]]; set({ objectives: arr });
  };

  const tabCls = (t: typeof tab) =>
    `px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${tab === t ? 'bg-ilm-navy text-white' : 'text-ilm-navy/50 hover:text-ilm-navy'}`;

  return (
    <div className="relative space-y-4 pb-20">
      <SectionHeader title="Mission & Vision Page" description="Edit the full /mission-vision page content." />

      {/* Tab strip */}
      <div className="flex gap-1 rounded-full border border-ilm-navy/10 bg-ilm-cream/60 p-1 w-fit">
        <button type="button" className={tabCls('mission')} onClick={() => setTab('mission')}>Mission</button>
        <button type="button" className={tabCls('vision')} onClick={() => setTab('vision')}>Vision</button>
        <button type="button" className={tabCls('objectives')} onClick={() => setTab('objectives')}>Objectives</button>
      </div>

      {/* ── Mission ── */}
      {tab === 'mission' && (
        <>
          <FieldGroup title="Page Header">
            <TextField label="Page title (H1)" value={draft.pageTitle} onChange={v => set({ pageTitle: v })} placeholder="Mission & Vision" />
          </FieldGroup>
          <FieldGroup title="Mission Card">
            <TextField label="Card eyebrow" value={draft.missionEyebrow} onChange={v => set({ missionEyebrow: v })} placeholder="Mission" />
            <TextField label="Card heading" value={draft.missionTitle} onChange={v => set({ missionTitle: v })} />
            <TextareaField label="Mission statement" value={draft.missionBody} onChange={v => set({ missionBody: v })} rows={5} />
          </FieldGroup>
        </>
      )}

      {/* ── Vision ── */}
      {tab === 'vision' && (
        <>
          <FieldGroup title="Vision Card">
            <TextField label="Card eyebrow" value={draft.visionEyebrow} onChange={v => set({ visionEyebrow: v })} placeholder="Vision" />
            <TextField label="Card heading" value={draft.visionTitle} onChange={v => set({ visionTitle: v })} />
            <TextareaField label="Vision statement" value={draft.visionBody} onChange={v => set({ visionBody: v })} rows={5} />
          </FieldGroup>

          <FieldGroup title="Vision Notes (below statement)">
            <div className="space-y-2">
              {draft.visionNotes.map((note, idx) => (
                <SortableRow key={`vn-${idx}`}
                  onMoveUp={idx > 0 ? () => moveNote(idx, -1) : undefined}
                  onMoveDown={idx < draft.visionNotes.length - 1 ? () => moveNote(idx, 1) : undefined}
                  onDelete={() => removeNote(idx)}>
                  <TextareaField value={note} onChange={v => setNote(idx, v)} rows={2} placeholder={`Note ${idx + 1}…`} />
                </SortableRow>
              ))}
            </div>
            <AddButton onClick={addNote} label="Add note" />
          </FieldGroup>
        </>
      )}

      {/* ── Objectives ── */}
      {tab === 'objectives' && (
        <FieldGroup title="Objectives">
          <TextField label="Section heading" value={draft.objectivesTitle} onChange={v => set({ objectivesTitle: v })} placeholder="Objectives" />
          <div className="mt-3 space-y-2">
            {draft.objectives.map((obj, idx) => (
              <SortableRow key={`obj-${idx}`}
                onMoveUp={idx > 0 ? () => moveObj(idx, -1) : undefined}
                onMoveDown={idx < draft.objectives.length - 1 ? () => moveObj(idx, 1) : undefined}
                onDelete={() => removeObj(idx)}>
                <TextareaField value={obj} onChange={v => setObj(idx, v)} rows={2} placeholder={`Objective ${idx + 1}…`} />
              </SortableRow>
            ))}
          </div>
          <AddButton onClick={addObj} label="Add objective" />
        </FieldGroup>
      )}

      <SaveBar dirty={dirty} saved={saved}
        onSave={() => { onSave(draft); setDirty(false); setSaved(true); }}
        onReset={() => setConfirmReset(true)} />
      <ConfirmDialog open={confirmReset} title="Reset Mission & Vision page?"
        message="This will restore all Mission & Vision content to the original defaults."
        onConfirm={() => { onReset(); setDraft(CM_PAGE_DEFAULTS.missionVisionPage); setDirty(false); setSaved(false); setConfirmReset(false); }}
        onCancel={() => setConfirmReset(false)} />
    </div>
  );
}
