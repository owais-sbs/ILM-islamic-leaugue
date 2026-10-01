'use client';

import { useState } from 'react';
import type { CMFeaturedArticles } from '@/lib/content-manager/types';
import { CM_DEFAULTS } from '@/lib/content-manager/defaults';
import { useIlm } from '@/lib/ilm-store';
import { SectionHeader, FieldGroup, VisibilityToggle, SaveBar, ConfirmDialog } from '../fields';
import { cn } from '@/lib/utils';

export function FeaturedArticlesEditor({
  data, onSave, onReset,
}: { data: CMFeaturedArticles; onSave: (v: CMFeaturedArticles) => void; onReset: () => void; }) {
  const { publishedArticles } = useIlm();
  const [draft, setDraft] = useState<CMFeaturedArticles>(data);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const update = (patch: Partial<CMFeaturedArticles>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setDirty(true); setSaved(false);
  };

  const toggleSelected = (id: string) => {
    const next = draft.selectedIds.includes(id)
      ? draft.selectedIds.filter((s) => s !== id)
      : [...draft.selectedIds, id];
    update({ selectedIds: next });
  };

  const handleSave = () => { onSave(draft); setDirty(false); setSaved(true); };

  return (
    <div className="relative space-y-5 pb-20">
      <SectionHeader title="Featured Articles" description="Control which articles appear in the Featured section on the homepage."
        visible={draft.visible} onVisibilityChange={(v) => update({ visible: v })} />

      <FieldGroup title="Display Mode">
        <div className="flex gap-2">
          {(['latest', 'selected'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => update({ mode })}
              className={cn(
                'rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition',
                draft.mode === mode ? 'bg-ilm-navy text-white' : 'border border-ilm-navy/10 text-ilm-navy/50 hover:text-ilm-navy',
              )}
            >
              {mode === 'latest' ? 'Latest articles' : 'Selected articles'}
            </button>
          ))}
        </div>
        <p className="mt-1 text-[10px] text-ilm-navy/40">
          {draft.mode === 'latest' ? 'Automatically shows the most recently published articles.' : 'Manually choose which articles to feature.'}
        </p>
      </FieldGroup>

      <FieldGroup title="Number of Articles Shown">
        <div className="flex items-center gap-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => update({ count: n })}
              className={cn(
                'h-9 w-9 rounded-full text-sm font-semibold transition',
                draft.count === n ? 'bg-ilm-navy text-white' : 'border border-ilm-navy/10 text-ilm-navy/50 hover:text-ilm-navy',
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </FieldGroup>

      {draft.mode === 'selected' && (
        <FieldGroup title="Select Articles">
          <p className="text-[11px] text-ilm-navy/40 -mt-2">Click to toggle selection.</p>
          {publishedArticles.length === 0 && (
            <p className="text-xs text-ilm-navy/40">No published articles yet.</p>
          )}
          <div className="space-y-2">
            {publishedArticles.map((article) => {
              const selected = draft.selectedIds.includes(article.id);
              return (
                <button
                  key={article.id}
                  type="button"
                  onClick={() => toggleSelected(article.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition',
                    selected
                      ? 'border-ilm-gold bg-ilm-gold/8 text-ilm-navy'
                      : 'border-ilm-navy/8 bg-ilm-cream/40 text-ilm-navy/55 hover:border-ilm-navy/20',
                  )}
                >
                  <span className={cn('h-4 w-4 shrink-0 rounded border text-center text-[10px] leading-4', selected ? 'border-ilm-gold bg-ilm-gold text-white' : 'border-ilm-navy/20')}>
                    {selected ? '✓' : ''}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{article.title}</p>
                    <p className="text-[11px] text-ilm-navy/40">{article.author} · {article.date}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </FieldGroup>
      )}

      <SaveBar dirty={dirty} saved={saved} onSave={handleSave} onReset={() => setConfirmReset(true)} />
      <ConfirmDialog open={confirmReset} title="Reset Featured Articles?" message="This will restore featured article settings to defaults."
        onConfirm={() => { onReset(); setDraft(CM_DEFAULTS.featuredArticles); setDirty(false); setSaved(false); setConfirmReset(false); }}
        onCancel={() => setConfirmReset(false)} />
    </div>
  );
}
