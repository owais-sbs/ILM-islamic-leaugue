'use client';

import { useState } from 'react';
import type { CMQuote } from '@/lib/content-manager/types';
import { CM_DEFAULTS } from '@/lib/content-manager/defaults';
import { SectionHeader, FieldGroup, TextareaField, TextField, SaveBar, ConfirmDialog } from '../fields';

export function QuoteEditor({
  data, onSave, onReset,
}: { data: CMQuote; onSave: (v: CMQuote) => void; onReset: () => void; }) {
  const [draft, setDraft] = useState<CMQuote>(data);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const update = (patch: Partial<CMQuote>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setDirty(true); setSaved(false);
  };

  const handleSave = () => { onSave(draft); setDirty(false); setSaved(true); };

  return (
    <div className="relative space-y-5 pb-20">
      <SectionHeader
        title="Quote Band"
        description="The full-width quote section between the Library and Murabbiyūn."
        visible={draft.visible}
        onVisibilityChange={(v) => update({ visible: v })}
      />

      <FieldGroup title="Quote Content">
        <TextareaField
          label="Quote text"
          value={draft.text}
          onChange={(v) => update({ text: v })}
          rows={3}
          hint="Displayed in large serif italic."
        />
        <TextField
          label="Attribution"
          value={draft.attribution}
          onChange={(v) => update({ attribution: v })}
          hint="Shown below the quote in small caps."
        />
      </FieldGroup>

      {/* Live preview */}
      <FieldGroup title="Preview">
        <div className="relative overflow-hidden rounded-xl bg-[#E8DFD1] px-6 py-8 text-center">
          <span className="absolute left-4 top-2 font-serif text-[60px] leading-none text-ilm-gold/40">"</span>
          <blockquote className="relative font-serif text-[17px] italic leading-snug text-ilm-navy">
            {draft.text || '…'}
          </blockquote>
          <span className="mx-auto mt-4 block h-px w-8 bg-ilm-gold" />
          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-ilm-navy/45">
            {draft.attribution}
          </p>
        </div>
      </FieldGroup>

      <SaveBar dirty={dirty} saved={saved} onSave={handleSave} onReset={() => setConfirmReset(true)} />
      <ConfirmDialog
        open={confirmReset}
        title="Reset Quote?"
        message="This will restore the quote section to its original defaults."
        onConfirm={() => { onReset(); setDraft(CM_DEFAULTS.quote); setDirty(false); setSaved(false); setConfirmReset(false); }}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
