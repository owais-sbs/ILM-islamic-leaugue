'use client';

import { useEffect, useState } from 'react';
import type { CMDonationPage } from '@/lib/content-manager/types';
import { AddButton, FieldGroup, SaveBar, SectionHeader, TextareaField, TextField } from '../fields';

export function DonationPageEditor({
  data,
  onSave,
  onReset,
}: {
  data: CMDonationPage;
  onSave: (value: CMDonationPage) => void | Promise<void>;
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
      <SectionHeader title="Edit Donation / Support page" description="Copy shown on /donation. Zelle QR image stays fixed." />
      <FieldGroup title="Hero">
        <TextField label="Page title" value={draft.pageTitle} onChange={(pageTitle) => setDraft({ ...draft, pageTitle })} />
        <TextField label="Subtitle" value={draft.subtitle} onChange={(subtitle) => setDraft({ ...draft, subtitle })} />
        <TextareaField
          label="Introduction (one paragraph per line)"
          value={draft.introduction.join('\n\n')}
          onChange={(value) =>
            setDraft({
              ...draft,
              introduction: value.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
            })
          }
          rows={8}
        />
        <TextField label="Zelle label" value={draft.zelleLabel} onChange={(zelleLabel) => setDraft({ ...draft, zelleLabel })} />
        <TextField label="Zelle hint" value={draft.zelleHint} onChange={(zelleHint) => setDraft({ ...draft, zelleHint })} />
      </FieldGroup>
      <FieldGroup title="Mission">
        <TextField label="Mission title" value={draft.missionTitle} onChange={(missionTitle) => setDraft({ ...draft, missionTitle })} />
        <TextareaField label="Mission body" value={draft.missionBody} onChange={(missionBody) => setDraft({ ...draft, missionBody })} rows={4} />
        <TextareaField label="Initial work" value={draft.missionInitialWork} onChange={(missionInitialWork) => setDraft({ ...draft, missionInitialWork })} rows={3} />
        <TextField label="Expand intro" value={draft.missionExpandIntro} onChange={(missionExpandIntro) => setDraft({ ...draft, missionExpandIntro })} />
        <TextareaField
          label="Expand items (one per line)"
          value={draft.missionExpandItems.join('\n')}
          onChange={(value) =>
            setDraft({
              ...draft,
              missionExpandItems: value.split('\n').map((p) => p.trim()).filter(Boolean),
            })
          }
          rows={8}
        />
      </FieldGroup>
      <FieldGroup title="Why support">
        <TextField label="Section title" value={draft.whySupportTitle} onChange={(whySupportTitle) => setDraft({ ...draft, whySupportTitle })} />
        <TextareaField
          label="Intro paragraphs (blank line between)"
          value={draft.whySupportIntro.join('\n\n')}
          onChange={(value) =>
            setDraft({
              ...draft,
              whySupportIntro: value.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
            })
          }
          rows={4}
        />
        <div className="space-y-3">
          {draft.whySupportItems.map((item, index) => (
            <div key={index} className="rounded-xl border border-ilm-navy/10 p-3">
              <TextField
                label={`Item ${index + 1} title`}
                value={item.title}
                onChange={(title) => {
                  const whySupportItems = [...draft.whySupportItems];
                  whySupportItems[index] = { ...whySupportItems[index], title };
                  setDraft({ ...draft, whySupportItems });
                }}
              />
              <TextareaField
                label="Body"
                value={item.body}
                onChange={(body) => {
                  const whySupportItems = [...draft.whySupportItems];
                  whySupportItems[index] = { ...whySupportItems[index], body };
                  setDraft({ ...draft, whySupportItems });
                }}
                rows={3}
              />
            </div>
          ))}
          <AddButton
            label="Add support item"
            onClick={() => setDraft({ ...draft, whySupportItems: [...draft.whySupportItems, { title: '', body: '' }] })}
          />
        </div>
      </FieldGroup>
      <FieldGroup title="Long-term & join">
        <TextField label="Long-term title" value={draft.longTermTitle} onChange={(longTermTitle) => setDraft({ ...draft, longTermTitle })} />
        <TextareaField
          label="Long-term paragraphs"
          value={draft.longTermParagraphs.join('\n\n')}
          onChange={(value) =>
            setDraft({
              ...draft,
              longTermParagraphs: value.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
            })
          }
          rows={6}
        />
        <TextField label="Join title" value={draft.joinUsTitle} onChange={(joinUsTitle) => setDraft({ ...draft, joinUsTitle })} />
        <TextareaField
          label="Join paragraphs"
          value={draft.joinUsParagraphs.join('\n\n')}
          onChange={(value) =>
            setDraft({
              ...draft,
              joinUsParagraphs: value.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
            })
          }
          rows={6}
        />
        <TextareaField label="Organizational note" value={draft.organizational} onChange={(organizational) => setDraft({ ...draft, organizational })} rows={2} />
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
