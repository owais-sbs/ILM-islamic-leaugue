'use client';

import { useState } from 'react';
import type { CMFooter, FooterLink, SocialLink } from '@/lib/content-manager/types';
import { CM_DEFAULTS } from '@/lib/content-manager/defaults';
import {
  SectionHeader, FieldGroup, TextField, TextareaField, LinkField,
  VisibilityToggle, SortableRow, AddButton, SaveBar, ConfirmDialog,
} from '../fields';

let idCounter = 1;
function newId(prefix: string) { return `${prefix}-new-${Date.now()}-${idCounter++}`; }

const SOCIAL_LABELS: Record<string, string> = {
  instagram: 'Instagram', linkedin: 'LinkedIn', youtube: 'YouTube',
  twitter: 'Twitter', facebook: 'Facebook', tiktok: 'TikTok',
};

export function FooterEditor({
  data, onSave, onReset,
}: { data: CMFooter; onSave: (v: CMFooter) => void; onReset: () => void; }) {
  const [draft, setDraft] = useState<CMFooter>(data);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const update = (patch: Partial<CMFooter>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setDirty(true); setSaved(false);
  };

  /* ── Explore links ── */
  const updateExplore = (id: string, patch: Partial<FooterLink>) => {
    setDraft((d) => ({ ...d, exploreLinks: d.exploreLinks.map((l) => (l.id === id ? { ...l, ...patch } : l)) }));
    setDirty(true); setSaved(false);
  };
  const moveExplore = (idx: number, dir: -1 | 1) => {
    const items = [...draft.exploreLinks];
    const t = idx + dir;
    if (t < 0 || t >= items.length) return;
    [items[idx], items[t]] = [items[t], items[idx]];
    setDraft((d) => ({ ...d, exploreLinks: items.map((l, i) => ({ ...l, order: i })) }));
    setDirty(true); setSaved(false);
  };
  const addExplore = () => {
    const link: FooterLink = { id: newId('fl'), label: 'New Link', href: '/', visible: true, order: draft.exploreLinks.length };
    setDraft((d) => ({ ...d, exploreLinks: [...d.exploreLinks, link] }));
    setDirty(true); setSaved(false);
  };
  const removeExplore = (id: string) => {
    setDraft((d) => ({ ...d, exploreLinks: d.exploreLinks.filter((l) => l.id !== id) }));
    setDirty(true); setSaved(false);
  };

  /* ── Connect links ── */
  const updateConnect = (id: string, patch: Partial<FooterLink>) => {
    setDraft((d) => ({ ...d, connectLinks: d.connectLinks.map((l) => (l.id === id ? { ...l, ...patch } : l)) }));
    setDirty(true); setSaved(false);
  };
  const moveConnect = (idx: number, dir: -1 | 1) => {
    const items = [...draft.connectLinks];
    const t = idx + dir;
    if (t < 0 || t >= items.length) return;
    [items[idx], items[t]] = [items[t], items[idx]];
    setDraft((d) => ({ ...d, connectLinks: items.map((l, i) => ({ ...l, order: i })) }));
    setDirty(true); setSaved(false);
  };
  const addConnect = () => {
    const link: FooterLink = { id: newId('cl'), label: 'New Link', href: '/', visible: true, order: draft.connectLinks.length };
    setDraft((d) => ({ ...d, connectLinks: [...d.connectLinks, link] }));
    setDirty(true); setSaved(false);
  };
  const removeConnect = (id: string) => {
    setDraft((d) => ({ ...d, connectLinks: d.connectLinks.filter((l) => l.id !== id) }));
    setDirty(true); setSaved(false);
  };

  /* ── Social links ── */
  const updateSocial = (id: string, patch: Partial<SocialLink>) => {
    setDraft((d) => ({ ...d, socialLinks: d.socialLinks.map((l) => (l.id === id ? { ...l, ...patch } : l)) }));
    setDirty(true); setSaved(false);
  };

  const handleSave = () => { onSave(draft); setDirty(false); setSaved(true); };

  const linkRow = (
    link: FooterLink,
    idx: number,
    total: number,
    onMove: (i: number, d: -1 | 1) => void,
    onUpdate: (id: string, p: Partial<FooterLink>) => void,
    onRemove: (id: string) => void,
  ) => (
    <SortableRow
      key={link.id}
      onMoveUp={idx > 0 ? () => onMove(idx, -1) : undefined}
      onMoveDown={idx < total - 1 ? () => onMove(idx, 1) : undefined}
      onDelete={() => onRemove(link.id)}
    >
      <div className="grid gap-2 sm:grid-cols-2">
        <TextField value={link.label} onChange={(v) => onUpdate(link.id, { label: v })} placeholder="Label" />
        <LinkField value={link.href} onChange={(v) => onUpdate(link.id, { href: v })} />
      </div>
      <div className="mt-2">
        <VisibilityToggle visible={link.visible} onChange={(v) => onUpdate(link.id, { visible: v })} />
      </div>
    </SortableRow>
  );

  return (
    <div className="relative space-y-5 pb-20">
      <SectionHeader
        title="Footer"
        description="Site footer description, navigation links, social links, and copyright."
        visible={draft.visible}
        onVisibilityChange={(v) => update({ visible: v })}
      />

      <FieldGroup title="Brand Description">
        <TextareaField label="Tagline / description" value={draft.description} onChange={(v) => update({ description: v })} rows={2} />
        <TextField label="Copyright text" value={draft.copyright} onChange={(v) => update({ copyright: v })} />
      </FieldGroup>

      <FieldGroup title="Explore Column Links">
        <div className="space-y-2">
          {draft.exploreLinks.map((link, idx) =>
            linkRow(link, idx, draft.exploreLinks.length, moveExplore, updateExplore, removeExplore),
          )}
        </div>
        <AddButton onClick={addExplore} label="Add explore link" />
      </FieldGroup>

      <FieldGroup title="Connect Column Links">
        <div className="space-y-2">
          {draft.connectLinks.map((link, idx) =>
            linkRow(link, idx, draft.connectLinks.length, moveConnect, updateConnect, removeConnect),
          )}
        </div>
        <AddButton onClick={addConnect} label="Add connect link" />
      </FieldGroup>

      <FieldGroup title="Social Links">
        <div className="space-y-2">
          {draft.socialLinks.map((social) => (
            <div key={social.id} className="flex items-center gap-3 rounded-xl border border-ilm-navy/8 bg-ilm-cream/50 px-3 py-2.5">
              <span className="w-20 shrink-0 text-xs font-semibold text-ilm-navy/60">{SOCIAL_LABELS[social.platform] ?? social.platform}</span>
              <div className="flex-1">
                <LinkField value={social.href} onChange={(v) => updateSocial(social.id, { href: v })} placeholder="https://…" />
              </div>
              <VisibilityToggle visible={social.visible} onChange={(v) => updateSocial(social.id, { visible: v })} />
            </div>
          ))}
        </div>
      </FieldGroup>

      <SaveBar dirty={dirty} saved={saved} onSave={handleSave} onReset={() => setConfirmReset(true)} />
      <ConfirmDialog
        open={confirmReset}
        title="Reset Footer?"
        message="This will restore the footer to its original defaults."
        onConfirm={() => { onReset(); setDraft(CM_DEFAULTS.footer); setDirty(false); setSaved(false); setConfirmReset(false); }}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
