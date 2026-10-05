'use client';

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { CMLegalPage } from '@/lib/content-manager/types';
import { AddButton, FieldGroup, SaveBar, SectionHeader, TextareaField, TextField } from '../fields';

export function LegalPageEditor({
  data,
  pageName,
  onSave,
  onReset,
}: {
  data: CMLegalPage;
  pageName: string;
  onSave: (value: CMLegalPage) => void | Promise<void>;
  onReset: () => void | Promise<void>;
}) {
  const [draft, setDraft] = useState(data);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(data);

  useEffect(() => {
    setDraft(data);
    setSaved(false);
  }, [data]);

  const updateSection = (index: number, patch: Partial<CMLegalPage['sections'][number]>) => {
    setDraft((current) => ({
      ...current,
      sections: current.sections.map((section, i) => i === index ? { ...section, ...patch } : section),
    }));
  };

  return (
    <div className="space-y-5 p-5 sm:p-6">
      <SectionHeader
        title={`Edit ${pageName}`}
        description="Changes are published to the matching public legal page. Use a blank section heading for introductory or plain paragraphs."
      />

      <FieldGroup title="Page heading">
        <TextField label="Eyebrow label" value={draft.eyebrow} onChange={(eyebrow) => setDraft({ ...draft, eyebrow })} />
        <TextField label="Page title" value={draft.title} onChange={(title) => setDraft({ ...draft, title })} />
        <TextField label="Last updated" hint="Leave blank to hide the date." value={draft.lastUpdated} onChange={(lastUpdated) => setDraft({ ...draft, lastUpdated })} />
      </FieldGroup>

      <FieldGroup title="Page content">
        <div className="space-y-4">
          {draft.sections.map((section, index) => (
            <div key={index} className="rounded-xl border border-ilm-navy/10 bg-ilm-cream/40 p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-ilm-navy">Content block {index + 1}</p>
                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, sections: draft.sections.filter((_, i) => i !== index) })}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ilm-navy/35 transition hover:bg-red-50 hover:text-red-600"
                  aria-label={`Remove content block ${index + 1}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <TextField
                  label="Section heading (optional)"
                  value={section.heading}
                  onChange={(heading) => updateSection(index, { heading })}
                  placeholder="Section heading"
                />
                <TextareaField
                  label="Text"
                  value={section.body}
                  onChange={(body) => updateSection(index, { body })}
                  rows={5}
                  hint="Separate paragraphs with a blank line."
                />
              </div>
            </div>
          ))}
          <AddButton
            label="Add content block"
            onClick={() => setDraft({ ...draft, sections: [...draft.sections, { heading: '', body: '' }] })}
          />
        </div>
      </FieldGroup>

      <SaveBar
        dirty={dirty && !busy}
        saved={saved}
        onSave={() => {
          setBusy(true);
          void Promise.resolve(onSave(draft)).finally(() => {
            setBusy(false);
            setSaved(true);
          });
        }}
        onReset={() => {
          setBusy(true);
          void Promise.resolve(onReset()).finally(() => {
            setBusy(false);
            setSaved(false);
          });
        }}
      />
    </div>
  );
}
