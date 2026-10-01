'use client';

import { useState } from 'react';
import type { CMNewsletter } from '@/lib/content-manager/types';
import { CM_DEFAULTS } from '@/lib/content-manager/defaults';
import { SectionHeader, FieldGroup, TextField, TextareaField, SaveBar, ConfirmDialog } from '../fields';

export function NewsletterEditor({
  data, onSave, onReset,
}: { data: CMNewsletter; onSave: (v: CMNewsletter) => void; onReset: () => void; }) {
  const [draft, setDraft] = useState<CMNewsletter>(data);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const update = (patch: Partial<CMNewsletter>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setDirty(true); setSaved(false);
  };

  const handleSave = () => { onSave(draft); setDirty(false); setSaved(true); };

  return (
    <div className="relative space-y-5 pb-20">
      <SectionHeader
        title="Newsletter"
        description="The email subscription section at the bottom of the homepage."
        visible={draft.visible}
        onVisibilityChange={(v) => update({ visible: v })}
      />

      <FieldGroup title="Content">
        <TextField
          label="Eyebrow label"
          value={draft.subheading}
          onChange={(v) => update({ subheading: v })}
          placeholder="Stay in the circle"
        />
        <TextareaField
          label="Main heading"
          value={draft.heading}
          onChange={(v) => update({ heading: v })}
          rows={2}
          hint="Supports a line break. The word 'meaning' will render in italic gold on the live site."
        />
        <TextareaField
          label="Description"
          value={draft.description}
          onChange={(v) => update({ description: v })}
          rows={2}
        />
      </FieldGroup>

      <FieldGroup title="Form">
        <TextField
          label="Email input placeholder"
          value={draft.inputPlaceholder}
          onChange={(v) => update({ inputPlaceholder: v })}
          placeholder="you@example.com"
        />
        <TextField
          label="Submit button text"
          value={draft.btnText}
          onChange={(v) => update({ btnText: v })}
          placeholder="Subscribe"
        />
      </FieldGroup>

      <FieldGroup title="Success State">
        <TextField
          label="Success message"
          value={draft.successMessage}
          onChange={(v) => update({ successMessage: v })}
          hint="Shown after a visitor subscribes."
        />
      </FieldGroup>

      <div className="rounded-xl border border-ilm-navy/8 bg-ilm-navy/5 px-4 py-3">
        <p className="text-[11px] text-ilm-navy/50">
          <strong>Note:</strong> The newsletter backend (email collection, Supabase storage) is handled by the existing system and is not affected by these settings.
        </p>
      </div>

      <SaveBar dirty={dirty} saved={saved} onSave={handleSave} onReset={() => setConfirmReset(true)} />
      <ConfirmDialog
        open={confirmReset}
        title="Reset Newsletter?"
        message="This will restore the newsletter section to its original defaults."
        onConfirm={() => { onReset(); setDraft(CM_DEFAULTS.newsletter); setDirty(false); setSaved(false); setConfirmReset(false); }}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
