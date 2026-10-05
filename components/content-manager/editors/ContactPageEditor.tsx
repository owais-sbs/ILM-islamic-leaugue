'use client';

import { useEffect, useState } from 'react';
import type { CMContactPage } from '@/lib/content-manager/types';
import { FieldGroup, SaveBar, SectionHeader, TextareaField, TextField } from '../fields';

export function ContactPageEditor({
  data,
  onSave,
  onReset,
}: {
  data: CMContactPage;
  onSave: (value: CMContactPage) => void | Promise<void>;
  onReset: () => void | Promise<void>;
}) {
  const [draft, setDraft] = useState(data);
  const [saved, setSaved] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(data);

  useEffect(() => {
    setDraft(data);
    setSaved(false);
  }, [data]);

  return (
    <div className="space-y-5 p-5 sm:p-6">
      <SectionHeader title="Edit Contact page" description="Copy shown on /contact." />
      <FieldGroup title="Page heading">
        <TextField label="Eyebrow" value={draft.eyebrow} onChange={(eyebrow) => setDraft({ ...draft, eyebrow })} />
        <TextField label="Title" value={draft.title} onChange={(title) => setDraft({ ...draft, title })} />
        <TextareaField label="Intro" value={draft.intro} onChange={(intro) => setDraft({ ...draft, intro })} rows={3} />
        <TextField label="Contact email label" value={draft.contactEmailLabel} onChange={(contactEmailLabel) => setDraft({ ...draft, contactEmailLabel })} />
        <TextField label="Contact email" value={draft.contactEmail} onChange={(contactEmail) => setDraft({ ...draft, contactEmail })} />
        <TextareaField label="Secondary note" value={draft.secondaryNote} onChange={(secondaryNote) => setDraft({ ...draft, secondaryNote })} rows={3} />
      </FieldGroup>
      <FieldGroup title="Form labels">
        <TextField label="Name placeholder" value={draft.namePlaceholder} onChange={(namePlaceholder) => setDraft({ ...draft, namePlaceholder })} />
        <TextField label="Email placeholder" value={draft.emailPlaceholder} onChange={(emailPlaceholder) => setDraft({ ...draft, emailPlaceholder })} />
        <TextField label="Subject placeholder" value={draft.subjectPlaceholder} onChange={(subjectPlaceholder) => setDraft({ ...draft, subjectPlaceholder })} />
        <TextField label="Message placeholder" value={draft.messagePlaceholder} onChange={(messagePlaceholder) => setDraft({ ...draft, messagePlaceholder })} />
        <TextField label="Submit button" value={draft.submitLabel} onChange={(submitLabel) => setDraft({ ...draft, submitLabel })} />
      </FieldGroup>
      <FieldGroup title="Success message">
        <TextField label="Success title" value={draft.successTitle} onChange={(successTitle) => setDraft({ ...draft, successTitle })} />
        <TextareaField label="Success body" value={draft.successMessage} onChange={(successMessage) => setDraft({ ...draft, successMessage })} rows={3} />
      </FieldGroup>
      <SaveBar
        dirty={dirty}
        saved={saved}
        onSave={() => {
          void Promise.resolve(onSave(draft)).then(() => setSaved(true));
        }}
        onReset={() => {
          void Promise.resolve(onReset()).then(() => setSaved(false));
        }}
      />
    </div>
  );
}
