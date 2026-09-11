'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, Eye, Save, Send, Upload } from 'lucide-react';
import { Reveal } from './reveal';
import type { Article, Role } from '@/lib/admin-data';
import { canApprove, canPublish } from '@/lib/ilm-store';
import { categories } from '@/lib/admin-data';
import { images } from '@/lib/images';
import { adminSwal } from '@/lib/admin-swal';

const covers = [images.quranSunrise, images.quranClose, images.mosqueArch, images.mosqueDome, images.kaaba, images.blueMosque];

export function ArticleEditor({
  article,
  role,
  onBack,
  onPreview,
  onSave,
  onPublish,
  onApproveAndPublish,
}: {
  article: Article;
  role: Role;
  onBack: () => void;
  onPreview: (article: Article) => void;
  onSave: (article: Article, submit?: boolean) => void;
  onPublish?: (article: Article) => void;
  onApproveAndPublish?: (article: Article) => void;
}) {
  const [draft, setDraft] = useState(article);
  const [saved, setSaved] = useState('');

  useEffect(() => setDraft(article), [article]);

  const update = (patch: Partial<Article>) => setDraft((d) => ({ ...d, ...patch }));

  const slugify = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const persist = (submit = false) => {
    const next = {
      ...draft,
      slug: draft.slug || slugify(draft.title || 'untitled'),
      seoTitle: draft.seoTitle || draft.title,
    };
    onSave(next, submit);
    setSaved(submit ? 'Submitted' : 'Saved just now');
  };

  return (
    <Reveal>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-ilm-navy/60 hover:text-ilm-navy">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex flex-wrap items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1.5 text-xs text-ilm-navy/40">
              <Clock size={12} /> {saved}
            </span>
          )}
          <button
            onClick={() => onPreview(draft)}
            className="inline-flex items-center gap-2 rounded-full border border-ilm-navy/15 px-4 py-2 text-xs font-bold uppercase tracking-wide text-ilm-navy"
          >
            <Eye size={14} /> Preview
          </button>
          <button
            onClick={() => persist(false)}
            className="inline-flex items-center gap-2 rounded-full border border-ilm-navy/15 px-4 py-2 text-xs font-bold uppercase tracking-wide text-ilm-navy"
          >
            <Save size={14} /> Save
          </button>
          {draft.status !== 'published' && (
            <button
              onClick={() => persist(true)}
              className="inline-flex items-center gap-2 rounded-full bg-ilm-navy px-5 py-2 text-xs font-bold uppercase tracking-wide text-white"
            >
              <Send size={14} /> Submit for review
            </button>
          )}
          {canPublish(role) && draft.status === 'submitted' && onApproveAndPublish && (
            <button
              onClick={async () => {
                const res = await adminSwal.confirm('Approve & publish?', draft.title || 'Untitled article', 'Approve & Publish');
                if (!res.isConfirmed) return;
                const next = {
                  ...draft,
                  slug: draft.slug || slugify(draft.title || 'untitled'),
                  seoTitle: draft.seoTitle || draft.title,
                };
                onApproveAndPublish(next);
                await adminSwal.success('Published', next.title);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-ilm-gold px-5 py-2 text-xs font-bold uppercase tracking-wide text-ilm-navy-deep"
            >
              <CheckCircle2 size={14} /> Approve & Publish
            </button>
          )}
          {canPublish(role) && (draft.status === 'approved' || draft.status === 'published') && onPublish && (
            <button
              onClick={() => onPublish(draft)}
              className="inline-flex items-center gap-2 rounded-full bg-ilm-gold px-5 py-2 text-xs font-bold uppercase tracking-wide text-ilm-navy-deep"
            >
              <Upload size={14} /> {draft.status === 'published' ? 'Update live' : 'Publish to site'}
            </button>
          )}
          {canApprove(role) && !canPublish(role) && draft.status === 'submitted' && (
            <span className="text-[11px] text-ilm-navy/40">Open Review to approve</span>
          )}
        </div>
      </div>

      {draft.status === 'returned' && draft.reviewNotes && (
        <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-red-600">Returned: review notes</p>
          <p className="mt-1 text-sm italic text-red-700/80">“{draft.reviewNotes}”</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-ilm-navy/10 bg-white p-5 sm:p-8">
          <input
            value={draft.title}
            onChange={(e) => update({ title: e.target.value, slug: slugify(e.target.value) })}
            placeholder="Article title…"
            className="mb-4 w-full border-0 bg-transparent text-2xl font-semibold text-ilm-navy outline-none placeholder:text-ilm-navy/20 sm:text-3xl"
          />
          <input
            value={draft.excerpt}
            onChange={(e) => update({ excerpt: e.target.value })}
            placeholder="Write a short excerpt…"
            className="mb-6 w-full border-0 border-b border-ilm-navy/8 bg-transparent pb-3 text-sm text-ilm-navy/60 outline-none placeholder:text-ilm-navy/25"
          />
          <textarea
            value={draft.body}
            onChange={(e) => update({ body: e.target.value })}
            placeholder="Begin writing…"
            className="min-h-[420px] w-full resize-none border-0 bg-transparent text-[15px] leading-relaxed text-ilm-navy/80 outline-none placeholder:text-ilm-navy/25"
          />
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-ilm-navy/8 bg-white p-6">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-ilm-navy/40">Publishing</h3>
            <label className="mb-2 block text-sm text-ilm-navy/70">Category</label>
            <select
              value={draft.category}
              onChange={(e) => update({ category: e.target.value })}
              className="mb-4 w-full rounded-lg border border-ilm-navy/10 bg-ilm-cream px-3 py-2 text-sm outline-none"
            >
              {categories.map((c) => (
                <option key={c.id}>{c.name}</option>
              ))}
            </select>
            <label className="mb-2 block text-sm text-ilm-navy/70">Tags</label>
            <input
              value={draft.tags.join(', ')}
              onChange={(e) => update({ tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
              placeholder="adab, knowledge"
              className="mb-4 w-full rounded-lg border border-ilm-navy/10 bg-ilm-cream px-3 py-2 text-sm outline-none"
            />
            <label className="mb-2 block text-sm text-ilm-navy/70">Slug</label>
            <input
              value={draft.slug}
              onChange={(e) => update({ slug: e.target.value })}
              className="mb-4 w-full rounded-lg border border-ilm-navy/10 bg-ilm-cream px-3 py-2 text-sm outline-none"
            />
            <label className="mb-2 block text-sm text-ilm-navy/70">Featured image</label>
            <div className="grid grid-cols-3 gap-2">
              {covers.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => update({ image: src })}
                  className={`overflow-hidden rounded-lg border-2 ${draft.image === src ? 'border-ilm-gold' : 'border-transparent'}`}
                >
                  <img src={src} alt="" className="h-14 w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-ilm-navy/8 bg-white p-6">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-ilm-navy/40">SEO</h3>
            <label className="mb-2 block text-sm text-ilm-navy/70">SEO title</label>
            <input
              value={draft.seoTitle}
              onChange={(e) => update({ seoTitle: e.target.value })}
              className="mb-4 w-full rounded-lg border border-ilm-navy/10 bg-ilm-cream px-3 py-2 text-sm outline-none"
            />
            <label className="mb-2 block text-sm text-ilm-navy/70">SEO description</label>
            <textarea
              value={draft.seoDescription}
              onChange={(e) => update({ seoDescription: e.target.value })}
              rows={3}
              className="w-full resize-none rounded-lg border border-ilm-navy/10 bg-ilm-cream px-3 py-2 text-sm outline-none"
            />
          </div>
          <div className="rounded-2xl border border-ilm-navy/8 bg-white p-6">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-ilm-navy/40">Footnotes</h3>
            <textarea
              value={draft.footnotes}
              onChange={(e) => update({ footnotes: e.target.value })}
              rows={4}
              className="w-full resize-none rounded-lg border border-ilm-navy/10 bg-ilm-cream px-3 py-2 text-sm outline-none"
            />
            {draft.revisions.length > 0 && (
              <p className="mt-3 text-[11px] text-ilm-navy/35">
                {draft.revisions.length} revision snapshot{draft.revisions.length === 1 ? '' : 's'} saved
              </p>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
