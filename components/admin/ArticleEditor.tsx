'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Bold,
  Code,
  Eye,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo,
  Save,
  Underline,
  Undo,
  Upload,
  X,
} from 'lucide-react';
import { Card } from '@/components/admin/AdminUI';
import { StatusBadge } from '@/components/StatusBadge';
import { usePermissions } from '@/components/admin/RoleContext';
import { categories, tags, images, type ArticleStatus } from '@/lib/data';
import { cn } from '@/lib/utils';

const toolbarButtons = [
  { icon: Bold, label: 'Bold' },
  { icon: Italic, label: 'Italic' },
  { icon: Underline, label: 'Underline' },
  { icon: Link2, label: 'Link' },
  { divider: true },
  { icon: Heading2, label: 'Heading 2' },
  { icon: Heading3, label: 'Heading 3' },
  { icon: Quote, label: 'Blockquote' },
  { icon: List, label: 'Bullet list' },
  { icon: ListOrdered, label: 'Numbered list' },
  { icon: ImageIcon, label: 'Insert image' },
  { icon: Code, label: 'Code' },
];

export default function ArticleEditor({ articleId }: { articleId?: string }) {
  const perms = usePermissions();
  const [title, setTitle] = useState(articleId ? 'The quiet architecture of a life well-lived' : '');
  const [slug, setSlug] = useState(articleId ? 'quiet-architecture-of-a-life-well-lived' : '');
  const [excerpt, setExcerpt] = useState(articleId ? 'On attention, intention, and the small daily practices that make room for what matters.' : '');
  const [status, setStatus] = useState<ArticleStatus>(articleId ? 'published' : 'draft');
  const [selectedCategory, setSelectedCategory] = useState(categories[1].name);
  const [selectedTags, setSelectedTags] = useState<string[]>(['intention', 'knowledge']);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [featuredImage, setFeaturedImage] = useState(articleId ? images.quranWarm : '');
  const [body, setBody] = useState(articleId ? '<p>Begin writing here...</p>' : '');
  const [footnotes, setFootnotes] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [autosave, setAutosave] = useState('Saved');

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    setAutosave('Saving...');
    setTimeout(() => setAutosave('Saved just now'), 800);
  };

  return (
    <div>
      {/* Top bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/articles" className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50">
            <X size={18} />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-semibold text-ilm-navy">{articleId ? 'Edit article' : 'New article'}</h1>
            <div className="mt-1 flex items-center gap-3">
              <StatusBadge status={status} />
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className={cn('h-1.5 w-1.5 rounded-full', autosave === 'Saved just now' ? 'bg-ilm-gold' : 'bg-amber-400 animate-pulse')} />
                {autosave}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowPreview(!showPreview)} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50">
            <Eye size={15} /> Preview
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50">
            <Save size={15} /> Save draft
          </button>
          {status === 'draft' && (
            <button onClick={() => setStatus('submitted')} className="flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-blue-700">
              Submit for review
            </button>
          )}
          {perms.canPublish && status === 'approved' && (
            <button onClick={() => setStatus('published')} className="flex items-center gap-2 rounded-lg bg-ilm-gold px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-ilm-gold-dark">
              Publish
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Main editor */}
        <div className="space-y-4">
          <Card className="p-5">
            <input
              type="text"
              placeholder="Article title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full border-none bg-transparent font-display text-3xl font-semibold text-ilm-navy outline-none placeholder:text-slate-300"
            />
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="text-slate-400">/articles/</span>
              <input
                type="text"
                placeholder="auto-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 border-none bg-transparent text-slate-600 outline-none"
              />
            </div>
          </Card>

          <Card className="p-5">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">Excerpt</label>
            <textarea
              placeholder="A short summary shown in article cards and search results..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-200 p-3 text-sm text-slate-700 outline-none transition focus:border-ilm-gold/70"
            />
          </Card>

          {/* Rich text editor */}
          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 px-3 py-2">
              <button className="flex h-8 w-8 items-center justify-center rounded text-slate-500 transition hover:bg-slate-100"><Undo size={15} /></button>
              <button className="flex h-8 w-8 items-center justify-center rounded text-slate-500 transition hover:bg-slate-100"><Redo size={15} /></button>
              <span className="mx-1 h-5 w-px bg-slate-200" />
              {toolbarButtons.map((btn, i) =>
                'divider' in btn ? (
                  <span key={i} className="mx-1 h-5 w-px bg-slate-200" />
                ) : (
                  <button key={i} className="flex h-8 w-8 items-center justify-center rounded text-slate-500 transition hover:bg-ilm-cream hover:text-ilm-gold" title={btn.label}>
                    <btn.icon size={15} />
                  </button>
                )
              )}
              <span className="ml-auto flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-ilm-gold/70" /> RTL support · Arabic + diacritics
              </span>
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              className="article-body min-h-[400px] p-6 outline-none"
              dangerouslySetInnerHTML={{ __html: body || '<p style="color:#94a3b8">Start writing your article...</p>' }}
            />
          </Card>

          <Card className="p-5">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">Footnotes</label>
            <textarea
              placeholder="Add footnotes here, one per line. They will be numbered automatically."
              value={footnotes}
              onChange={(e) => setFootnotes(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-lg border border-slate-200 p-3 text-sm text-slate-700 outline-none transition focus:border-ilm-gold/70"
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Status</h3>
            <div className="flex items-center justify-between">
              <StatusBadge status={status} />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ArticleStatus)}
                className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-600 outline-none"
              >
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
                <option value="published">Published</option>
                <option value="returned">Returned</option>
              </select>
            </div>
            {articleId && (
              <p className="mt-3 text-xs text-slate-400">Last updated: 24 Aug 2024, 14:32</p>
            )}
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Category</h3>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-ilm-gold/70"
            >
              {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Tags</h3>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {selectedTags.map((t) => (
                <span key={t} className="flex items-center gap-1 rounded-full bg-ilm-cream px-2.5 py-1 text-xs font-medium text-ilm-navy">
                  {t}
                  <button onClick={() => setSelectedTags(selectedTags.filter((x) => x !== t))} className="text-ilm-gold/70 hover:text-ilm-gold">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.filter((t) => !selectedTags.includes(t.name)).slice(0, 5).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTags([...selectedTags, t.name])}
                  className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-500 transition hover:border-ilm-gold/60 hover:bg-ilm-cream"
                >
                  + {t.name}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Featured image</h3>
            {featuredImage ? (
              <div className="relative overflow-hidden rounded-lg">
                <img src={featuredImage} alt="" className="aspect-video w-full object-cover" />
                <button onClick={() => setFeaturedImage('')} className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-slate-600 shadow-sm transition hover:bg-white">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 py-8 text-slate-400 transition hover:border-ilm-gold/60 hover:bg-ilm-cream">
                <Upload size={22} className="mb-2" />
                <span className="text-xs font-medium">Upload image</span>
              </button>
            )}
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">SEO</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-slate-500">SEO title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Defaults to article title"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-ilm-gold/70"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Meta description</label>
                <textarea
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  placeholder="Defaults to excerpt"
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-ilm-gold/70"
                />
                <p className="mt-1 text-[10px] text-slate-400">{seoDesc.length}/160 characters</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={() => setShowPreview(false)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-ilm-navy">Preview</h2>
              <button onClick={() => setShowPreview(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <article className="article-body">
              <h1 className="font-display text-4xl font-semibold text-ilm-navy">{title || 'Untitled'}</h1>
              <p className="mt-3 text-slate-500">{excerpt}</p>
              {featuredImage && <img src={featuredImage} alt="" className="mt-6 w-full rounded-xl object-cover" />}
              <div dangerouslySetInnerHTML={{ __html: body }} />
            </article>
          </div>
        </div>
      )}
    </div>
  );
}
