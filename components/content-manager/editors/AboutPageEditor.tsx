'use client';

import { useState } from 'react';
import type { CMAboutPage } from '@/lib/content-manager/types';
import { CM_PAGE_DEFAULTS } from '@/lib/content-manager/page-defaults';
import {
  SectionHeader, FieldGroup, TextField, TextareaField,
  SortableRow, AddButton, SaveBar, ConfirmDialog,
} from '../fields';
import { Trash2 } from 'lucide-react';

let pid = 1;
const newPId = () => `p-${Date.now()}-${pid++}`;

export function AboutPageEditor({
  data, onSave, onReset,
}: { data: CMAboutPage; onSave: (v: CMAboutPage) => void; onReset: () => void }) {
  const [draft, setDraft] = useState<CMAboutPage>(data);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [tab, setTab] = useState<'header' | 'principles' | 'founder'>('header');

  const set = (patch: Partial<CMAboutPage>) => { setDraft(d => ({ ...d, ...patch })); setDirty(true); setSaved(false); };

  /* intro paragraphs */
  const setIntro = (idx: number, val: string) => {
    const next = [...draft.introParagraphs]; next[idx] = val;
    set({ introParagraphs: next });
  };
  const addIntro = () => set({ introParagraphs: [...draft.introParagraphs, ''] });
  const removeIntro = (idx: number) => set({ introParagraphs: draft.introParagraphs.filter((_, i) => i !== idx) });
  const moveIntro = (idx: number, dir: -1 | 1) => {
    const arr = [...draft.introParagraphs]; const t = idx + dir;
    if (t < 0 || t >= arr.length) return;
    [arr[idx], arr[t]] = [arr[t], arr[idx]]; set({ introParagraphs: arr });
  };

  /* principles */
  const setPrinciple = (idx: number, patch: Partial<{ title: string; body: string }>) => {
    const arr = draft.principles.map((p, i) => i === idx ? { ...p, ...patch } : p);
    set({ principles: arr });
  };
  const addPrinciple = () => set({ principles: [...draft.principles, { title: 'New Principle', body: '' }] });
  const removePrinciple = (idx: number) => set({ principles: draft.principles.filter((_, i) => i !== idx) });
  const movePrinciple = (idx: number, dir: -1 | 1) => {
    const arr = [...draft.principles]; const t = idx + dir;
    if (t < 0 || t >= arr.length) return;
    [arr[idx], arr[t]] = [arr[t], arr[idx]]; set({ principles: arr });
  };

  /* founder paragraphs */
  const setFounder = (idx: number, val: string) => {
    const next = [...draft.founderParagraphs]; next[idx] = val;
    set({ founderParagraphs: next });
  };
  const addFounder = () => set({ founderParagraphs: [...draft.founderParagraphs, ''] });
  const removeFounder = (idx: number) => set({ founderParagraphs: draft.founderParagraphs.filter((_, i) => i !== idx) });
  const moveFounder = (idx: number, dir: -1 | 1) => {
    const arr = [...draft.founderParagraphs]; const t = idx + dir;
    if (t < 0 || t >= arr.length) return;
    [arr[idx], arr[t]] = [arr[t], arr[idx]]; set({ founderParagraphs: arr });
  };

  const tabCls = (t: typeof tab) =>
    `px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${tab === t ? 'bg-ilm-navy text-white' : 'text-ilm-navy/50 hover:text-ilm-navy'}`;

  return (
    <div className="relative space-y-4 pb-20">
      <SectionHeader title="About Us Page" description="Edit the full /about page content." />

      {/* Tab strip */}
      <div className="flex gap-1 rounded-full border border-ilm-navy/10 bg-ilm-cream/60 p-1 w-fit">
        <button type="button" className={tabCls('header')} onClick={() => setTab('header')}>Header &amp; Intro</button>
        <button type="button" className={tabCls('principles')} onClick={() => setTab('principles')}>Principles</button>
        <button type="button" className={tabCls('founder')} onClick={() => setTab('founder')}>Founder</button>
      </div>

      {/* ── Header & Intro ── */}
      {tab === 'header' && (
        <>
          <FieldGroup title="Page Header">
            <TextField label="Eyebrow label" value={draft.eyebrow} onChange={v => set({ eyebrow: v })} placeholder="About Us" />
            <TextField label="Heading (before highlight)" value={draft.heading} onChange={v => set({ heading: v })} />
            <TextField label="Heading highlight (italic gold)" value={draft.headingHighlight} onChange={v => set({ headingHighlight: v })} hint="Displayed in serif italic." />
            <TextField label="Methodology sub-label" value={draft.methodologyTitle} onChange={v => set({ methodologyTitle: v })} />
          </FieldGroup>

          <FieldGroup title="Introduction Paragraphs">
            <div className="space-y-2">
              {draft.introParagraphs.map((para, idx) => (
                <SortableRow key={`intro-${idx}`}
                  onMoveUp={idx > 0 ? () => moveIntro(idx, -1) : undefined}
                  onMoveDown={idx < draft.introParagraphs.length - 1 ? () => moveIntro(idx, 1) : undefined}
                  onDelete={() => removeIntro(idx)}>
                  <TextareaField value={para} onChange={v => setIntro(idx, v)} rows={2} placeholder={`Paragraph ${idx + 1}…`} />
                </SortableRow>
              ))}
            </div>
            <AddButton onClick={addIntro} label="Add paragraph" />
          </FieldGroup>
        </>
      )}

      {/* ── Principles ── */}
      {tab === 'principles' && (
        <>
          <FieldGroup title="Section Labels">
            <TextField label="Section heading" value={draft.principlesTitle} onChange={v => set({ principlesTitle: v })} />
            <TextareaField label="Closing paragraph (below cards)" value={draft.closingParagraph} onChange={v => set({ closingParagraph: v })} rows={2} />
          </FieldGroup>

          <FieldGroup title="Principle Cards">
            <div className="space-y-2">
              {draft.principles.map((p, idx) => (
                <SortableRow key={`pr-${idx}`}
                  onMoveUp={idx > 0 ? () => movePrinciple(idx, -1) : undefined}
                  onMoveDown={idx < draft.principles.length - 1 ? () => movePrinciple(idx, 1) : undefined}
                  onDelete={() => removePrinciple(idx)}>
                  <div className="space-y-2">
                    <TextField value={p.title} onChange={v => setPrinciple(idx, { title: v })} placeholder="Principle title" />
                    <TextareaField value={p.body} onChange={v => setPrinciple(idx, { body: v })} rows={2} placeholder="Description…" />
                  </div>
                </SortableRow>
              ))}
            </div>
            <AddButton onClick={addPrinciple} label="Add principle" />
          </FieldGroup>
        </>
      )}

      {/* ── Founder ── */}
      {tab === 'founder' && (
        <>
          <FieldGroup title="Founder Block">
            <TextField label="Section title" value={draft.founderTitle} onChange={v => set({ founderTitle: v })} placeholder="Founder's Statement" />
            <TextField label="Author name" value={draft.founderAuthor} onChange={v => set({ founderAuthor: v })} />
          </FieldGroup>

          <FieldGroup title="Founder Paragraphs">
            <p className="text-[11px] text-ilm-navy/40 -mt-2">A paragraph starting with a quote mark renders in italic. &quot;Allah says:&quot; renders bold.</p>
            <div className="space-y-2">
              {draft.founderParagraphs.map((para, idx) => (
                <SortableRow key={`fp-${idx}`}
                  onMoveUp={idx > 0 ? () => moveFounder(idx, -1) : undefined}
                  onMoveDown={idx < draft.founderParagraphs.length - 1 ? () => moveFounder(idx, 1) : undefined}
                  onDelete={() => removeFounder(idx)}>
                  <TextareaField value={para} onChange={v => setFounder(idx, v)} rows={2} placeholder={`Paragraph ${idx + 1}…`} />
                </SortableRow>
              ))}
            </div>
            <AddButton onClick={addFounder} label="Add paragraph" />
          </FieldGroup>
        </>
      )}

      <SaveBar dirty={dirty} saved={saved}
        onSave={() => { onSave(draft); setDirty(false); setSaved(true); }}
        onReset={() => setConfirmReset(true)} />
      <ConfirmDialog open={confirmReset} title="Reset About Us page?"
        message="This will restore all About Us content to the original defaults."
        onConfirm={() => { onReset(); setDraft(CM_PAGE_DEFAULTS.aboutPage); setDirty(false); setSaved(false); setConfirmReset(false); }}
        onCancel={() => setConfirmReset(false)} />
    </div>
  );
}
