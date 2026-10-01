'use client';

import { useState } from 'react';
import type { CMDirectory, CMMurabbiDisplay, CMCategoryDisplay } from '@/lib/content-manager/types';
import { CM_DEFAULTS } from '@/lib/content-manager/defaults';
import { murabbiyūn } from '@/lib/public-data';
import { useIlm } from '@/lib/ilm-store';
import {
  SectionHeader, FieldGroup, TextField, TextareaField,
  VisibilityToggle, SortableRow, SaveBar, ConfirmDialog,
} from '../fields';

type Tab = 'content' | 'murabbiyun' | 'categories';

export function DirectoryEditor({
  data,
  onSave,
  onReset,
}: {
  data: CMDirectory;
  onSave: (v: CMDirectory) => void;
  onReset: () => void;
}) {
  const { categories: storeCategories } = useIlm();
  const [draft, setDraft] = useState<CMDirectory>(data);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [tab, setTab] = useState<Tab>('content');

  const update = (patch: Partial<CMDirectory>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setDirty(true); setSaved(false);
  };

  /* ── Murabbiyūn helpers ── */
  const mergedMurabbi = murabbiyūn
    .map((m) => {
      const d = draft.murabbiyun.items.find((i) => i.id === m.id);
      return d ?? { id: m.id, visible: true, order: murabbiyūn.indexOf(m) };
    })
    .sort((a, b) => a.order - b.order);

  const updateMItem = (id: string, patch: Partial<CMMurabbiDisplay>) => {
    const exists = draft.murabbiyun.items.some((i) => i.id === id);
    const next = exists
      ? draft.murabbiyun.items.map((i) => (i.id === id ? { ...i, ...patch } : i))
      : [...draft.murabbiyun.items, { id, visible: true, order: draft.murabbiyun.items.length, ...patch }];
    setDraft((d) => ({ ...d, murabbiyun: { ...d.murabbiyun, items: next } }));
    setDirty(true); setSaved(false);
  };

  const moveMItem = (idx: number, dir: -1 | 1) => {
    const items = [...mergedMurabbi];
    const t = idx + dir;
    if (t < 0 || t >= items.length) return;
    [items[idx], items[t]] = [items[t], items[idx]];
    setDraft((d) => ({ ...d, murabbiyun: { ...d.murabbiyun, items: items.map((i, n) => ({ ...i, order: n })) } }));
    setDirty(true); setSaved(false);
  };

  /* ── Categories helpers ── */
  const mergedCats = storeCategories
    .map((cat) => {
      const d = draft.categories.items.find((i) => i.id === cat.id);
      return { cat, display: d ?? { id: cat.id, visible: true, order: storeCategories.indexOf(cat) } };
    })
    .sort((a, b) => a.display.order - b.display.order);

  const updateCItem = (id: string, patch: Partial<CMCategoryDisplay>) => {
    const exists = draft.categories.items.some((i) => i.id === id);
    const next = exists
      ? draft.categories.items.map((i) => (i.id === id ? { ...i, ...patch } : i))
      : [...draft.categories.items, { id, visible: true, order: draft.categories.items.length, ...patch }];
    setDraft((d) => ({ ...d, categories: { ...d.categories, items: next } }));
    setDirty(true); setSaved(false);
  };

  const moveCItem = (idx: number, dir: -1 | 1) => {
    const items = mergedCats.map((x) => x.display);
    const t = idx + dir;
    if (t < 0 || t >= items.length) return;
    [items[idx], items[t]] = [items[t], items[idx]];
    setDraft((d) => ({ ...d, categories: { ...d.categories, items: items.map((i, n) => ({ ...i, order: n })) } }));
    setDirty(true); setSaved(false);
  };

  const handleSave = () => { onSave(draft); setDirty(false); setSaved(true); };

  const tabClass = (t: Tab) =>
    `px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
      tab === t ? 'bg-ilm-navy text-white' : 'text-ilm-navy/50 hover:text-ilm-navy'
    }`;

  return (
    <div className="relative space-y-4 pb-20">
      <SectionHeader
        title="Directory"
        description="The Murabbiyūn section on the homepage — heading, text, image, and which authors appear."
        visible={draft.visible}
        onVisibilityChange={(v) => update({ visible: v })}
      />

      {/* Tab strip */}
      <div className="flex gap-1 rounded-full border border-ilm-navy/10 bg-ilm-cream/60 p-1 w-fit">
        <button type="button" className={tabClass('content')} onClick={() => setTab('content')}>Content &amp; Image</button>
        <button type="button" className={tabClass('murabbiyun')} onClick={() => setTab('murabbiyun')}>Murabbiyūn Order</button>
        <button type="button" className={tabClass('categories')} onClick={() => setTab('categories')}>Categories Order</button>
      </div>

      {/* ─── TAB: Content & Image ─── */}
      {tab === 'content' && (
        <>
          <FieldGroup title="Section Labels">
            <TextField label="Eyebrow label" value={draft.sectionLabel} onChange={(v) => update({ sectionLabel: v })} placeholder="Directory" />
            <TextField label="Heading (before highlight)" value={draft.heading} onChange={(v) => update({ heading: v })} placeholder="Meet the" />
            <TextField label="Highlighted heading (italic gold)" value={draft.headingHighlight} onChange={(v) => update({ headingHighlight: v })} placeholder="Murabbiyūn" />
          </FieldGroup>

          <FieldGroup title="Description">
            <TextareaField label="Paragraph 1" value={draft.description1} onChange={(v) => update({ description1: v })} rows={3} />
            <TextareaField label="Paragraph 2" value={draft.description2} onChange={(v) => update({ description2: v })} rows={3} />
          </FieldGroup>

          <FieldGroup title="Section Image">
            {draft.image && (
              <div className="mb-3 overflow-hidden rounded-xl border border-ilm-navy/10">
                <img src={draft.image} alt="Preview" className="h-32 w-full object-cover" />
              </div>
            )}
            <TextField
              label="Image URL"
              value={draft.image}
              onChange={(v) => update({ image: v })}
              placeholder="https://…"
              hint="Paste an Unsplash or uploaded image URL."
            />
            <TextField label="Image alt text" value={draft.imageAlt} onChange={(v) => update({ imageAlt: v })} />
          </FieldGroup>

          <FieldGroup title="Image Overlay Text">
            <div className="grid grid-cols-3 gap-3">
              <TextField label="Line 1" value={draft.overlayLine1} onChange={(v) => update({ overlayLine1: v })} placeholder="Knowledge" />
              <TextField label="Line 2" value={draft.overlayLine2} onChange={(v) => update({ overlayLine2: v })} placeholder="Builds" />
              <TextField label="Line 3" value={draft.overlayLine3} onChange={(v) => update({ overlayLine3: v })} placeholder="Character" />
            </div>
            <p className="text-[10px] text-ilm-navy/40">Displayed as italic overlay text on the image.</p>
          </FieldGroup>
        </>
      )}

      {/* ─── TAB: Murabbiyūn order ─── */}
      {tab === 'murabbiyun' && (
        <FieldGroup title="Murabbiyūn — Homepage Visibility & Order">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] text-ilm-navy/40">Author profiles are managed in Authors. Here you control homepage display only.</p>
            <VisibilityToggle
              visible={draft.murabbiyun.visible}
              onChange={(v) => { setDraft((d) => ({ ...d, murabbiyun: { ...d.murabbiyun, visible: v } })); setDirty(true); setSaved(false); }}
              label={draft.murabbiyun.visible ? 'Section visible' : 'Section hidden'}
            />
          </div>
          <div className="space-y-2">
            {mergedMurabbi.map((item, idx) => {
              const m = murabbiyūn.find((x) => x.id === item.id);
              if (!m) return null;
              return (
                <SortableRow
                  key={item.id}
                  onMoveUp={idx > 0 ? () => moveMItem(idx, -1) : undefined}
                  onMoveDown={idx < mergedMurabbi.length - 1 ? () => moveMItem(idx, 1) : undefined}
                  showDelete={false}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ilm-navy">{m.name}</p>
                      <p className="text-[11px] text-ilm-navy/40">{m.role}</p>
                    </div>
                    <VisibilityToggle visible={item.visible} onChange={(v) => updateMItem(item.id, { visible: v })} />
                  </div>
                </SortableRow>
              );
            })}
          </div>
        </FieldGroup>
      )}

      {/* ─── TAB: Categories order ─── */}
      {tab === 'categories' && (
        <FieldGroup title="Categories — Homepage Visibility & Order">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] text-ilm-navy/40">Category content is managed in Categories &amp; Tags. Here you control homepage display only.</p>
            <VisibilityToggle
              visible={draft.categories.visible}
              onChange={(v) => { setDraft((d) => ({ ...d, categories: { ...d.categories, visible: v } })); setDirty(true); setSaved(false); }}
              label={draft.categories.visible ? 'Section visible' : 'Section hidden'}
            />
          </div>
          <div className="space-y-2">
            {mergedCats.map(({ cat, display }, idx) => (
              <SortableRow
                key={cat.id}
                onMoveUp={idx > 0 ? () => moveCItem(idx, -1) : undefined}
                onMoveDown={idx < mergedCats.length - 1 ? () => moveCItem(idx, 1) : undefined}
                showDelete={false}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-ilm-navy">{cat.name}</span>
                  <VisibilityToggle visible={display.visible} onChange={(v) => updateCItem(cat.id, { visible: v })} />
                </div>
              </SortableRow>
            ))}
          </div>
        </FieldGroup>
      )}

      <SaveBar dirty={dirty} saved={saved} onSave={handleSave} onReset={() => setConfirmReset(true)} />
      <ConfirmDialog
        open={confirmReset}
        title="Reset Directory?"
        message="This will restore all Directory settings (content, image, and display order) to their original defaults."
        onConfirm={() => { onReset(); setDraft(CM_DEFAULTS.directory); setDirty(false); setSaved(false); setConfirmReset(false); }}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
