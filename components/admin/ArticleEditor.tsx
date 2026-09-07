'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Loader2,
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
import { useAuth } from '@/components/admin/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { logActivity } from '@/lib/supabase/admin-helpers';
import { slugify, type ArticleRow, type CategoryRow, type DbArticleStatus, type TagRow } from '@/lib/supabase/types';
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
  const router = useRouter();
  const perms = usePermissions();
  const { user, profile } = useAuth();
  const supabase = createClient();
  const bodyRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(!!articleId);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [tags, setTags] = useState<TagRow[]>([]);
  const [reviewNotes, setReviewNotes] = useState('');

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [status, setStatus] = useState<DbArticleStatus>('draft');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [footnotes, setFootnotes] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [autosave, setAutosave] = useState('Ready');

  useEffect(() => {
    const load = async () => {
      const [{ data: cats }, { data: tagRows }] = await Promise.all([
        supabase.from('categories').select('*').order('display_order'),
        supabase.from('tags').select('*').order('name'),
      ]);
      setCategories((cats as CategoryRow[]) || []);
      setTags((tagRows as TagRow[]) || []);
      if (cats?.[0] && !articleId) setSelectedCategory(cats[0].id);

      if (articleId) {
        const { data } = await supabase
          .from('articles')
          .select('*, article_tags(tags(id, name, slug))')
          .eq('id', articleId)
          .maybeSingle();
        if (data) {
          const row = data as ArticleRow;
          setTitle(row.title);
          setSlug(row.slug);
          setExcerpt(row.excerpt);
          setStatus(row.status);
          setSelectedCategory(row.category_id || '');
          setFeaturedImage(row.featured_image_url || '');
          setBodyHtml(row.body_html || '');
          setFootnotes(row.footnotes || '');
          setSeoTitle(row.seo_title || '');
          setSeoDesc(row.seo_description || '');
          setReviewNotes(row.review_notes || '');
          setSelectedTags(
            (row.article_tags || []).map((t) => t.tags?.name).filter(Boolean) as string[],
          );
        }
        setLoading(false);
      }
    };
    load();
  }, [articleId]);

  useEffect(() => {
    if (!loading && bodyRef.current && articleId) {
      bodyRef.current.innerHTML = bodyHtml || '';
    }
  }, [loading, articleId, bodyHtml]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!articleId || !slug) setSlug(slugify(val));
    setAutosave('Editing…');
  };

  const syncTags = async (articleUuid: string, tagNames: string[]) => {
    await supabase.from('article_tags').delete().eq('article_id', articleUuid);
    const matched = tags.filter((t) => tagNames.includes(t.name));
    if (matched.length === 0) return;
    await supabase.from('article_tags').insert(
      matched.map((t) => ({ article_id: articleUuid, tag_id: t.id })),
    );
  };

  const saveArticle = async (nextStatus?: DbArticleStatus) => {
    if (!title.trim()) {
      setMessage('Please add a title before saving.');
      return;
    }
    setSaving(true);
    setMessage('');
    const html = bodyRef.current?.innerHTML || bodyHtml;
    const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
    const finalStatus = nextStatus || status;
    const payload: Record<string, unknown> = {
      title: title.trim(),
      slug: slug || slugify(title),
      excerpt,
      body_html: html,
      footnotes,
      category_id: selectedCategory || null,
      author_id: user?.id || null,
      status: finalStatus,
      featured_image_url: featuredImage,
      seo_title: seoTitle,
      seo_description: seoDesc,
      reading_minutes: Math.max(1, Math.ceil(words / 200)),
    };

    if (finalStatus === 'submitted') payload.submitted_at = new Date().toISOString();
    if (finalStatus === 'published') {
      payload.published_at = new Date().toISOString();
    }
    if (finalStatus === 'draft' && status === 'returned') {
      payload.review_notes = '';
    }

    try {
      if (articleId) {
        const { error } = await supabase.from('articles').update(payload).eq('id', articleId);
        if (error) throw error;
        await syncTags(articleId, selectedTags);
        await logActivity({
          actorId: user?.id,
          actorName: profile?.full_name,
          action: nextStatus === 'published' ? 'published' : nextStatus === 'submitted' ? 'submitted for review' : 'updated',
          entityType: 'article',
          entityId: articleId,
          entityLabel: title,
        });
        setStatus(finalStatus);
        setAutosave('Saved just now');
        setMessage('Article saved.');
      } else {
        const { data, error } = await supabase.from('articles').insert(payload).select('id').single();
        if (error) throw error;
        await syncTags(data.id, selectedTags);
        await logActivity({
          actorId: user?.id,
          actorName: profile?.full_name,
          action: 'created draft',
          entityType: 'article',
          entityId: data.id,
          entityLabel: title,
        });
        setAutosave('Saved just now');
        router.push(`/admin/articles/${data.id}/edit`);
      }
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const pickImage = async (file: File) => {
    const path = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const { error } = await supabase.storage.from('media').upload(path, file);
    if (error) {
      setMessage(error.message);
      return;
    }
    const { data } = supabase.storage.from('media').getPublicUrl(path);
    setFeaturedImage(data.publicUrl);
    await supabase.from('media').insert({
      file_name: file.name,
      file_path: path,
      file_url: data.publicUrl,
      mime_type: file.type || 'image/jpeg',
      size_bytes: file.size,
      alt_text: file.name,
      uploaded_by: user?.id,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-slate-500">
        <Loader2 className="mr-2 animate-spin" size={18} /> Loading article…
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
          >
            <X size={18} />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-semibold text-ilm-navy">
              {articleId ? 'Edit article' : 'New article'}
            </h1>
            <div className="mt-1 flex items-center gap-3">
              <StatusBadge status={status} />
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span
                  className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    autosave.includes('Saved') ? 'bg-sky-500' : 'bg-amber-400 animate-pulse',
                  )}
                />
                {autosave}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <Eye size={15} /> Preview
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => saveArticle('draft')}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save draft
          </button>
          {(status === 'draft' || status === 'returned') && (
            <button
              type="button"
              disabled={saving}
              onClick={() => saveArticle('submitted')}
              className="flex items-center gap-2 rounded-lg bg-sky-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-sky-700"
            >
              Submit for review
            </button>
          )}
          {perms.canPublish && (
            <button
              type="button"
              disabled={saving}
              onClick={() => saveArticle('published')}
              className="flex items-center gap-2 rounded-lg bg-ilm-navy px-3.5 py-2 text-xs font-semibold text-white hover:bg-ilm-navy-light"
            >
              Publish
            </button>
          )}
        </div>
      </div>

      {status === 'returned' && reviewNotes && (
        <Card className="mb-4 border-rose-100 bg-rose-50/60 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-rose-500">
            Returned — editor notes
          </p>
          <p className="mt-1 text-sm leading-6 text-rose-800">{reviewNotes}</p>
        </Card>
      )}

      {message && (
        <div className="mb-4 rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-ilm-navy">
          {message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card className="p-5">
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">
              Title
            </label>
            <input
              type="text"
              placeholder="Article title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full border-none bg-transparent font-display text-3xl font-semibold text-ilm-navy outline-none placeholder:text-slate-300"
            />
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm">
              <span className="text-slate-400">/articles/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 border-none bg-transparent text-slate-600 outline-none"
              />
            </div>
          </Card>

          <Card className="p-5">
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">
              Excerpt
            </label>
            <textarea
              placeholder="Short summary for cards and search…"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-ilm-navy/40"
            />
          </Card>

          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 bg-slate-50/80 px-3 py-2">
              <button type="button" className="flex h-8 w-8 items-center justify-center rounded text-slate-500 hover:bg-white">
                <Undo size={15} />
              </button>
              <button type="button" className="flex h-8 w-8 items-center justify-center rounded text-slate-500 hover:bg-white">
                <Redo size={15} />
              </button>
              <span className="mx-1 h-5 w-px bg-slate-200" />
              {toolbarButtons.map((btn, i) =>
                'divider' in btn ? (
                  <span key={i} className="mx-1 h-5 w-px bg-slate-200" />
                ) : (
                  <button
                    key={i}
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded text-slate-500 hover:bg-sky-50 hover:text-ilm-navy"
                    title={btn.label}
                  >
                    <btn.icon size={15} />
                  </button>
                ),
              )}
              <span className="ml-auto text-[10px] text-slate-400">RTL · Arabic + diacritics</span>
            </div>
            <div
              ref={bodyRef}
              contentEditable
              suppressContentEditableWarning
              onInput={() => setAutosave('Editing…')}
              className="article-body min-h-[380px] max-w-none p-6 outline-none"
              dangerouslySetInnerHTML={
                articleId ? undefined : { __html: '<p style="color:#94a3b8">Start writing…</p>' }
              }
            />
          </Card>

          <Card className="p-5">
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">
              Footnotes
            </label>
            <textarea
              placeholder="One footnote per line"
              value={footnotes}
              onChange={(e) => setFootnotes(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-ilm-navy/40"
            />
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">Status</h3>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as DbArticleStatus)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-ilm-navy/40"
            >
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="published">Published</option>
              <option value="returned">Returned</option>
            </select>
            {articleId && (
              <Link
                href={`/admin/review/${articleId}`}
                className="mt-3 block text-center text-xs font-medium text-ilm-navy hover:underline"
              >
                Open review screen →
              </Link>
            )}
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">Category</h3>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-ilm-navy/40"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">Tags</h3>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {selectedTags.map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-ilm-navy"
                >
                  {t}
                  <button type="button" onClick={() => setSelectedTags(selectedTags.filter((x) => x !== t))}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags
                .filter((t) => !selectedTags.includes(t.name))
                .map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTags([...selectedTags, t.name])}
                    className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-500 hover:border-sky-300 hover:bg-sky-50"
                  >
                    + {t.name}
                  </button>
                ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">
              Featured image
            </h3>
            {featuredImage ? (
              <div className="relative overflow-hidden rounded-lg">
                <img src={featuredImage} alt="" className="aspect-video w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setFeaturedImage('')}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/90"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 py-8 text-slate-400 hover:border-sky-300 hover:bg-sky-50/50">
                <Upload size={22} className="mb-2" />
                <span className="text-xs font-medium">Upload image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) pickImage(file);
                  }}
                />
              </label>
            )}
            <input
              type="url"
              placeholder="Or paste image URL"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-ilm-navy/40"
            />
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">SEO</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-slate-500">SEO title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-ilm-navy/40"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Meta description</label>
                <textarea
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-ilm-navy/40"
                />
                <p className="mt-1 text-[10px] text-slate-400">{seoDesc.length}/160</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {showPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ilm-navy/40 p-4"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-ilm-navy">Preview</h2>
              <button type="button" onClick={() => setShowPreview(false)}>
                <X size={18} />
              </button>
            </div>
            <article className="article-body max-w-none">
              <h1 className="font-display text-4xl font-semibold text-ilm-navy">{title || 'Untitled'}</h1>
              <p className="mt-3 text-slate-500">{excerpt}</p>
              {featuredImage && <img src={featuredImage} alt="" className="mt-6 w-full rounded-xl" />}
              <div dangerouslySetInnerHTML={{ __html: bodyRef.current?.innerHTML || bodyHtml }} />
            </article>
          </div>
        </div>
      )}
    </div>
  );
}
