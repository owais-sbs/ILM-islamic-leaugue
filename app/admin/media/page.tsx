'use client';

import { useEffect, useState } from 'react';
import { Copy, Image as ImageIcon, Loader2, Pencil, Trash2, Upload, X } from 'lucide-react';
import { PageHeader, Card } from '@/components/admin/AdminUI';
import { fetchAdminMedia, deleteAdminMedia, uploadAdminMedia } from '@/lib/admin-api';
import { createClient } from '@/lib/supabase/client';
import { formatBytes, type MediaRow } from '@/lib/supabase/types';
import { cn } from '@/lib/utils';

export default function AdminMedia() {
  const [items, setItems] = useState<MediaRow[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [altText, setAltText] = useState('');
  const [savingAlt, setSavingAlt] = useState(false);

  const load = async () => {
    try {
      const data = await fetchAdminMedia();
      setItems((data as MediaRow[]) || []);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const upload = async (file: File) => {
    setUploading(true);
    setMessage('');
    try {
      await uploadAdminMedia(file);
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this file?')) return;
    try {
      await deleteAdminMedia(id);
      setSelected(null);
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const openDetails = (id: string) => {
    const item = items.find((i) => i.id === id);
    setSelected(id);
    setAltText(item?.alt_text || '');
  };

  const saveAltText = async () => {
    if (!selected) return;
    setSavingAlt(true);
    const supabase = createClient();
    const { error } = await supabase.from('media').update({ alt_text: altText }).eq('id', selected);
    setSavingAlt(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    await load();
  };

  const selectedItem = items.find((i) => i.id === selected);

  return (
    <div>
      <PageHeader
        title="Media library"
        description={`${items.length} files`}
        action={
          <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-ilm-navy px-4 py-2.5 text-xs font-semibold text-white hover:bg-ilm-navy-light">
            {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            Upload
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
          </label>
        }
      />

      {message && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{message}</div>}

      <Card className="mb-4 p-4">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-8 text-slate-400 transition hover:border-sky-300 hover:bg-sky-50/40">
          <Upload size={24} className="mb-2" />
          <p className="text-sm font-medium">Drag and drop or click to upload</p>
          <p className="mt-1 text-xs text-slate-400">PNG, JPG, GIF up to 5MB</p>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
        </label>
      </Card>

      {loading ? (
        <div className="flex justify-center py-16 text-sm text-slate-500"><Loader2 className="mr-2 animate-spin" size={18} /> Loading…</div>
      ) : items.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <ImageIcon size={26} />
          </span>
          <h3 className="font-display text-xl text-slate-700">No media files</h3>
          <p className="mt-2 text-sm text-slate-400">Upload images for articles and author avatars.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.map((item) => (
            <Card key={item.id} className={cn('group cursor-pointer overflow-hidden transition hover:shadow-md', selected === item.id && 'ring-2 ring-ilm-navy')}>
              <div onClick={() => openDetails(item.id)} className="relative aspect-square overflow-hidden">
                <img src={item.file_url} alt={item.alt_text || item.file_name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ilm-navy/40 opacity-0 transition group-hover:opacity-100">
                  <button type="button" onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText(item.file_url); setCopied(true); setTimeout(() => setCopied(false), 1200); }} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90"><Copy size={14} /></button>
                  <button type="button" onClick={(e) => { e.stopPropagation(); remove(item.id); }} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-rose-500"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="px-3 py-2">
                <p className="truncate text-xs font-medium text-slate-700">{item.file_name}</p>
                <p className="text-[10px] text-slate-400">{formatBytes(item.size_bytes)}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ilm-navy/40" onClick={() => setSelected(null)}>
          <div className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ilm-navy">File details</h2>
              <button type="button" onClick={() => setSelected(null)}><X size={18} /></button>
            </div>
            <img src={selectedItem.file_url} alt="" className="mb-4 w-full rounded-xl object-cover" />
            <div className="space-y-3 text-sm">
              <div><span className="text-slate-400">Name:</span> {selectedItem.file_name}</div>
              <div><span className="text-slate-400">Size:</span> {formatBytes(selectedItem.size_bytes)}</div>
              <div><span className="text-slate-400">Type:</span> {selectedItem.mime_type}</div>
              <div>
                <span className="text-slate-400">URL:</span>
                <div className="mt-1 flex items-center gap-2">
                  <code className="flex-1 truncate rounded-lg bg-slate-50 px-2 py-1.5 text-xs">{selectedItem.file_url}</code>
                  <button
                    type="button"
                    onClick={() => { navigator.clipboard?.writeText(selectedItem.file_url); setCopied(true); setTimeout(() => setCopied(false), 1200); }}
                    className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div>
                <span className="text-slate-400">Alt text:</span>
                <input
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-ilm-navy/40"
                  placeholder="Describe this image for accessibility"
                />
                <button
                  type="button"
                  disabled={savingAlt}
                  onClick={saveAltText}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-sky-50"
                >
                  {savingAlt ? <Loader2 size={14} className="animate-spin" /> : <Pencil size={14} />}
                  Save alt text
                </button>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => remove(selectedItem.id)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-rose-50 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-100"
              >
                <Trash2 size={15} /> Delete file
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
