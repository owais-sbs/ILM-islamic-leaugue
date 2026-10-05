'use client';

import { useEffect, useState } from 'react';
import type { CMAskPage } from '@/lib/content-manager/types';
import { FieldGroup, SaveBar, SectionHeader, TextareaField, TextField } from '../fields';

export function AskPageEditor({
  data,
  onSave,
  onReset,
}: {
  data: CMAskPage;
  onSave: (value: CMAskPage) => void | Promise<void>;
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
      <SectionHeader title="Edit Ask a Question page" description="Copy shown on /ask. Form behavior stays the same." />
      <FieldGroup title="Page heading">
        <TextField label="Eyebrow" value={draft.eyebrow} onChange={(eyebrow) => setDraft({ ...draft, eyebrow })} />
        <TextField label="Title" value={draft.title} onChange={(title) => setDraft({ ...draft, title })} />
        <TextareaField label="Intro" value={draft.intro} onChange={(intro) => setDraft({ ...draft, intro })} rows={4} />
      </FieldGroup>
      <FieldGroup title="Form labels">
        <TextField label="Name placeholder" value={draft.namePlaceholder} onChange={(namePlaceholder) => setDraft({ ...draft, namePlaceholder })} />
        <TextField label="Email placeholder" value={draft.emailPlaceholder} onChange={(emailPlaceholder) => setDraft({ ...draft, emailPlaceholder })} />
        <TextField label="Subject placeholder" value={draft.subjectPlaceholder} onChange={(subjectPlaceholder) => setDraft({ ...draft, subjectPlaceholder })} />
        <TextField label="Preferred author label" value={draft.preferredAuthorLabel} onChange={(preferredAuthorLabel) => setDraft({ ...draft, preferredAuthorLabel })} />
        <TextField label="Category label" value={draft.categoryLabel} onChange={(categoryLabel) => setDraft({ ...draft, categoryLabel })} />
        <TextField label="Question placeholder" value={draft.questionPlaceholder} onChange={(questionPlaceholder) => setDraft({ ...draft, questionPlaceholder })} />
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
