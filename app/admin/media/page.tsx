'use client';

<<<<<<< HEAD
import { useEffect, useState } from 'react';
import { Copy, Image as ImageIcon, Loader2, Trash2, Upload, X } from 'lucide-react';
import { PageHeader, Card } from '@/components/admin/AdminUI';
import { useAuth } from '@/components/admin/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { formatBytes, type MediaRow } from '@/lib/supabase/types';
import { cn } from '@/lib/utils';

export default function AdminMedia() {
  const { user } = useAuth();
  const [items, setItems] = useState<MediaRow[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false });
    setItems((data as MediaRow[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const upload = async (file: File) => {
    setUploading(true);
    setMessage('');
    const supabase = createClient();
    const path = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const { error } = await supabase.storage.from('media').upload(path, file);
    if (error) { setMessage(error.message); setUploading(false); return; }
    const { data } = supabase.storage.from('media').getPublicUrl(path);
    await supabase.from('media').insert({
      file_name: file.name,
      file_path: path,
      file_url: data.publicUrl,
      mime_type: file.type || 'image/jpeg',
      size_bytes: file.size,
      alt_text: file.name.replace(/\.[^.]+$/, ''),
      uploaded_by: user?.id,
    });
    setUploading(false);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this file?')) return;
    const supabase = createClient();
    await supabase.from('media').delete().eq('id', id);
    setSelected(null);
    await load();
  };
=======
import { useRef, useState } from 'react';
import { Copy, Image as ImageIcon, Trash2, Upload, X } from 'lucide-react';
import { PageHeader, Card } from '@/components/admin/AdminUI';
import { mediaItems as initialItems, type MediaItem } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function AdminMedia() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items,    setItems]    = useState(initialItems);
  const [selected, setSelected] = useState<string | null>(null);
  const [copied,   setCopied]   = useState(false);
  const [dragging, setDragging] = useState(false);
>>>>>>> 03a3145bf8aa2b0217bde3a2111ce6e5470555b0

  const selectedItem = items.find((i) => i.id === selected);

  const copyURL = (url: string) => {
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((x) => x.id !== id));
    if (selected === id) setSelected(null);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const url = URL.createObjectURL(file);
      const newItem: MediaItem = {
        id:         `m${Date.now()}-${Math.random()}`,
        name:       file.name,
        url,
        type:       'image',
        size:       `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploadedAt: new Date().toISOString().slice(0, 10),
      };
      setItems((prev) => [newItem, ...prev]);
    });
  };

  return (
    <div>
      <PageHeader
        title="Media library"
        description={`${items.length} files — upload, browse, copy URL, delete`}
        action={
<<<<<<< HEAD
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
=======
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-lg bg-ilm-gold px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-ilm-gold-dark"
          >
            <Upload size={14} /> Upload
          </button>
        }
      />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Dropzone */}
      <Card className="mb-4 p-4">
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-8 text-slate-400 transition',
            dragging
              ? 'border-ilm-gold bg-ilm-cream/50 text-ilm-gold'
              : 'border-slate-200 hover:border-ilm-gold/60 hover:bg-ilm-cream/20',
          )}
        >
          <Upload size={22} className="mb-2" />
          <p className="text-sm font-medium">Drag and drop images here, or click to browse</p>
          <p className="mt-1 text-xs text-slate-400">PNG, JPG, GIF, WebP up to 10 MB each</p>
        </div>
      </Card>

      {/* Grid */}
      {items.length === 0 ? (
>>>>>>> 03a3145bf8aa2b0217bde3a2111ce6e5470555b0
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <ImageIcon size={26} />
          </span>
          <h3 className="font-display text-xl text-slate-700">No media files</h3>
          <p className="mt-2 text-sm text-slate-400">Upload images for articles and author avatars.</p>
        </Card>
      ) : (
<<<<<<< HEAD
        <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.map((item) => (
            <Card key={item.id} className={cn('group cursor-pointer overflow-hidden transition hover:shadow-md', selected === item.id && 'ring-2 ring-ilm-navy')}>
              <div onClick={() => setSelected(item.id)} className="relative aspect-square overflow-hidden">
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
=======
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelected(item.id)}
              className={cn(
                'group cursor-pointer overflow-hidden rounded-xl border border-slate-100 bg-white transition hover:shadow-md',
                selected === item.id && 'ring-2 ring-ilm-gold',
              )}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={item.url}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/40 opacity-0 transition group-hover:opacity-100">
                  <button
                    onClick={(e) => { e.stopPropagation(); copyURL(item.url); }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-slate-600 transition hover:bg-white"
                    title="Copy URL"
                  >
                    <Copy size={13} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-rose-500 transition hover:bg-white"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="px-2.5 py-2">
                <p className="truncate text-xs font-medium text-slate-700">{item.name}</p>
                <p className="text-[10px] text-slate-400">{item.size}</p>
              </div>
            </div>
>>>>>>> 03a3145bf8aa2b0217bde3a2111ce6e5470555b0
          ))}
        </div>
      )}

      {selectedItem && (
<<<<<<< HEAD
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
                  <button type="button" onClick={() => { navigator.clipboard?.writeText(selectedItem.file_url); setCopied(true); setTimeout(() => setCopied(false), 1200); }} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs">
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
=======
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="h-full w-full max-w-sm overflow-y-auto bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg text-ilm-navy">File details</h2>
              <button
                onClick={() => setSelected(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-hidden rounded-xl">
              <img src={selectedItem.url} alt={selectedItem.name} className="w-full object-cover" />
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex gap-2">
                <span className="w-20 shrink-0 text-slate-400">Name</span>
                <span className="text-slate-700">{selectedItem.name}</span>
              </div>
              <div className="flex gap-2">
                <span className="w-20 shrink-0 text-slate-400">Size</span>
                <span className="text-slate-700">{selectedItem.size}</span>
              </div>
              <div className="flex gap-2">
                <span className="w-20 shrink-0 text-slate-400">Uploaded</span>
                <span className="text-slate-700">{selectedItem.uploadedAt}</span>
>>>>>>> 03a3145bf8aa2b0217bde3a2111ce6e5470555b0
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                URL
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 truncate rounded-lg bg-slate-50 px-2.5 py-2 text-xs text-slate-600">
                  {selectedItem.url}
                </code>
              </div>
              <button
                onClick={() => copyURL(selectedItem.url)}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <Copy size={13} /> {copied ? 'Copied!' : 'Copy URL'}
              </button>
            </div>

            <button
              onClick={() => deleteItem(selectedItem.id)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-rose-50 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
            >
              <Trash2 size={13} /> Delete file
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
