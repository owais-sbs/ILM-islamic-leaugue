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
  Trash2,
  Underline,
  Undo,
  Upload,
  X,
} from 'lucide-react';
import { Card } from '@/components/admin/AdminUI';
import { StatusBadge } from '@/components/StatusBadge';
import { usePermissions, useRole } from '@/components/admin/RoleContext';
import { useAuth } from '@/components/admin/AuthProvider';
import {
  fetchAdminArticle,
  fetchAdminMeta,
  deleteAdminArticle,
  saveAdminArticle,
  uploadAdminMedia,
} from '@/lib/admin-api';
import { slugify, type CategoryRow, type DbArticleStatus, type TagRow } from '@/lib/supabase/types';
import Swal from 'sweetalert2';
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
  const { role } = useRole();
  const { user } = useAuth();
  const bodyRef = useRef<HTMLDivElement>(null);
  const editorInitialized = useRef(false);
  const [editorEmpty, setEditorEmpty] = useState(true);
  const [currentId, setCurrentId] = useState(articleId);

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
    setCurrentId(articleId);
  }, [articleId]);

  useEffect(() => {
    const load = async () => {
      try {
        const meta = await fetchAdminMeta();
        setCategories((meta.categories as CategoryRow[]) || []);
        setTags((meta.tags as TagRow[]) || []);
        if (meta.categories?.[0] && !currentId) {
          setSelectedCategory((meta.categories[0] as CategoryRow).id);
        }

        if (currentId) {
          const { article, tagNames } = await fetchAdminArticle(currentId);
          setTitle(article.title);
          setSlug(article.slug);
          setExcerpt(article.excerpt);
          setStatus(article.status);
          setSelectedCategory(article.category_id || '');
          setFeaturedImage(article.featured_image_url || '');
          setBodyHtml(article.body_html || '');
          setFootnotes(article.footnotes || '');
          setSeoTitle(article.seo_title || '');
          setSeoDesc(article.seo_description || '');
          setReviewNotes(article.review_notes || '');
          setSelectedTags(tagNames);
        }
      } catch (err) {
        setMessage(err instanceof Error ? err.message : 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentId]);

  useEffect(() => {
    editorInitialized.current = false;
    setEditorEmpty(true);
  }, [currentId]);

  useEffect(() => {
    if (loading || !bodyRef.current || editorInitialized.current) return;
    bodyRef.current.innerHTML = bodyHtml || '';
    setEditorEmpty(!bodyRef.current.textContent?.trim());
    editorInitialized.current = true;
  }, [loading, bodyHtml]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!currentId || !slug) setSlug(slugify(val));
    setAutosave('Editing…');
  };

  const saveArticle = async (nextStatus?: DbArticleStatus) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      await Swal.fire({
        icon: 'warning',
        title: 'Title required',
        text: 'Please add a title before saving.',
        confirmButtonColor: '#0F1657',
      });
      return;
    }
    setSaving(true);
    setMessage('');
    const html = bodyRef.current?.innerHTML || bodyHtml;
    const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
    const finalStatus = nextStatus || status;
    const payload: Record<string, unknown> = {
      title: trimmedTitle,
      slug: slug || slugify(trimmedTitle),
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
      const result = await saveAdminArticle(payload, currentId, selectedTags);
      const savedId = result.article.id;
      setCurrentId(savedId);
      setStatus(result.status);
      setAutosave('Saved just now');

      if (finalStatus === 'published') {
        await Swal.fire({
          icon: 'success',
          title: 'Published!',
          text: `"${title}" is now live on the site.`,
          confirmButtonColor: '#0F1657',
          timer: 2800,
          showConfirmButton: true,
        });
      } else if (finalStatus === 'submitted') {
        await Swal.fire({
          icon: 'success',
          title: 'Submitted for review',
          text: 'Editors will review your article shortly.',
          confirmButtonColor: '#0F1657',
        });
      } else {
        await Swal.fire({
          icon: 'success',
          title: 'Draft saved',
          text: 'Your changes have been saved.',
          confirmButtonColor: '#0F1657',
          timer: 2000,
          showConfirmButton: false,
        });
      }

      if (!articleId && savedId) {
        router.replace(`/admin/articles/${savedId}/edit`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      setMessage(msg);
      await Swal.fire({
        icon: 'error',
        title: finalStatus === 'published' ? 'Publish failed' : 'Save failed',
        text: msg,
        confirmButtonColor: '#0F1657',
      });
    } finally {
      setSaving(false);
    }
  };

  const pickImage = async (file: File) => {
    try {
      const { publicUrl } = await uploadAdminMedia(file);
      setFeaturedImage(publicUrl);
      await Swal.fire({
        icon: 'success',
        title: 'Image uploaded',
        timer: 1500,
        showConfirmButton: false,
        confirmButtonColor: '#0F1657',
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setMessage(msg);
      await Swal.fire({
        icon: 'error',
        title: 'Upload failed',
        text: msg,
        confirmButtonColor: '#0F1657',
      });
    }
  };

  const canDelete =
    currentId &&
    (role === 'admin' || role === 'editor' || (status === 'draft' || status === 'returned'));

  const removeArticle = async () => {
    if (!currentId) return;
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete article?',
      text: 'This cannot be undone.',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Delete',
    });
    if (!result.isConfirmed) return;
    try {
      await deleteAdminArticle(currentId);
      await Swal.fire({
        icon: 'success',
        title: 'Deleted',
        timer: 1500,
        showConfirmButton: false,
      });
      router.push('/admin/articles');
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Delete failed',
        text: err instanceof Error ? err.message : 'Could not delete article',
        confirmButtonColor: '#0F1657',
      });
    }
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
              {currentId ? 'Edit article' : 'New article'}
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
            disabled={saving || loading}
            onClick={() => saveArticle('draft')}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save draft
          </button>
          {(status === 'draft' || status === 'returned') && (
            <button
              type="button"
              disabled={saving || loading}
              onClick={() => saveArticle('submitted')}
              className="flex items-center gap-2 rounded-lg bg-sky-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-sky-700"
            >
              Submit for review
            </button>
          )}
          {perms.canPublish && (
            <button
              type="button"
              disabled={saving || loading}
              onClick={() => saveArticle('published')}
              className="flex items-center gap-2 rounded-lg bg-ilm-navy px-3.5 py-2 text-xs font-semibold text-white hover:bg-ilm-navy-light"
            >
              Publish
            </button>
          )}
          {canDelete && (
            <button
              type="button"
              onClick={removeArticle}
              className="flex items-center gap-2 rounded-lg border border-rose-200 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
            >
              <Trash2 size={15} /> Delete
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
              autoComplete="off"
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
              onChange={(e) => {
                setExcerpt(e.target.value);
                setAutosave('Editing…');
              }}
              autoComplete="off"
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
            <div className="relative">
              {editorEmpty && (
                <p className="pointer-events-none absolute left-6 top-6 text-sm text-slate-400">
                  Start writing…
                </p>
              )}
              <div
                ref={bodyRef}
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => {
                  const el = e.currentTarget;
                  setBodyHtml(el.innerHTML);
                  setEditorEmpty(!el.textContent?.trim());
                  setAutosave('Editing…');
                }}
                className="article-body min-h-[380px] max-w-none p-6 outline-none"
              />
            </div>
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
            {currentId && (
              <Link
                href={`/admin/review/${currentId}`}
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
