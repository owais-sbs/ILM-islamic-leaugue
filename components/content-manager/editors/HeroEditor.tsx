'use client';

import { useState } from 'react';
import type { CMHero } from '@/lib/content-manager/types';
import { CM_DEFAULTS } from '@/lib/content-manager/defaults';
import {
  SectionHeader, FieldGroup, TextField, TextareaField, LinkField,
  VisibilityToggle, SaveBar, ConfirmDialog,
} from '../fields';

export function HeroEditor({
  data,
  onSave,
  onReset,
}: {
  data: CMHero;
  onSave: (v: CMHero) => void;
  onReset: () => void;
}) {
  const [draft, setDraft] = useState<CMHero>(data);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const update = (patch: Partial<CMHero>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setDirty(true);
    setSaved(false);
  };

  const handleSave = () => { onSave(draft); setDirty(false); setSaved(true); };

  return (
    <div className="relative space-y-5 pb-20">
      <SectionHeader
        title="Hero"
        description="Main banner section at the top of the homepage."
        visible={draft.visible}
        onVisibilityChange={(v) => update({ visible: v })}
      />

      <FieldGroup title="Text Content">
        <TextField label="Eyebrow text" value={draft.eyebrow} onChange={(v) => update({ eyebrow: v })} placeholder="Knowledge. Clarity. Cultivation." />
        <TextField label="Main heading" value={draft.heading} onChange={(v) => update({ heading: v })} />
        <TextField label="Highlighted heading text (italic gold)" value={draft.headingHighlight} onChange={(v) => update({ headingHighlight: v })} hint="Rendered in serif italic. Example: Murabbiyūn" />
        <TextareaField label="Description" value={draft.description} onChange={(v) => update({ description: v })} rows={2} />
      </FieldGroup>

      <FieldGroup title="Primary Button">
        <div className="flex items-center gap-3 mb-3">
          <VisibilityToggle visible={draft.showPrimaryBtn} onChange={(v) => update({ showPrimaryBtn: v })} label={draft.showPrimaryBtn ? 'Shown' : 'Hidden'} />
        </div>
        <TextField label="Button text" value={draft.primaryBtnText} onChange={(v) => update({ primaryBtnText: v })} />
        <LinkField label="Button URL" value={draft.primaryBtnUrl} onChange={(v) => update({ primaryBtnUrl: v })} />
      </FieldGroup>

      <FieldGroup title="Secondary Button">
        <div className="flex items-center gap-3 mb-3">
          <VisibilityToggle visible={draft.showSecondaryBtn} onChange={(v) => update({ showSecondaryBtn: v })} label={draft.showSecondaryBtn ? 'Shown' : 'Hidden'} />
        </div>
        <TextField label="Button text" value={draft.secondaryBtnText} onChange={(v) => update({ secondaryBtnText: v })} />
        <LinkField label="Button URL" value={draft.secondaryBtnUrl} onChange={(v) => update({ secondaryBtnUrl: v })} />
      </FieldGroup>

      <FieldGroup title="Hero Image">
        <div className="flex items-center gap-3 mb-3">
          <VisibilityToggle visible={draft.showImage} onChange={(v) => update({ showImage: v })} label={draft.showImage ? 'Shown' : 'Hidden'} />
        </div>
        {draft.heroImage && (
          <div className="mb-3 overflow-hidden rounded-xl border border-ilm-navy/10">
            <img src={draft.heroImage} alt="Hero preview" className="h-28 w-full object-cover" />
          </div>
        )}
        <TextField
          label="Image URL"
          value={draft.heroImage}
          onChange={(v) => update({ heroImage: v })}
          placeholder="https://…"
          hint="Paste an image URL. Phase 2 will support file upload."
        />
      </FieldGroup>

      <SaveBar dirty={dirty} saved={saved} onSave={handleSave} onReset={() => setConfirmReset(true)} />
      <ConfirmDialog
        open={confirmReset}
        title="Reset Hero?"
        message="This will restore the hero section to its original defaults."
        onConfirm={() => { onReset(); setDraft(CM_DEFAULTS.hero); setDirty(false); setSaved(false); setConfirmReset(false); }}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
