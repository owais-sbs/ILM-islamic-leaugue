'use client';

import { useState } from 'react';
import { Copy, Image as ImageIcon, Trash2, Upload, X } from 'lucide-react';
import { PageHeader, Card } from '@/components/admin/AdminUI';
import { mediaItems } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function AdminMedia() {
  const [items, setItems] = useState(mediaItems);
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedItem = items.find((i) => i.id === selected);

  return (
    <div>
      <PageHeader
        title="Media library"
        description={`${items.length} files`}
        action={
          <button className="flex items-center gap-2 rounded-lg bg-ilm-gold px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-ilm-gold-dark">
            <Upload size={15} /> Upload
          </button>
        }
      />

      {/* Upload dropzone */}
      <Card className="mb-4 p-4">
        <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-8 text-slate-400 transition hover:border-ilm-gold/60 hover:bg-ilm-cream/30">
          <Upload size={24} className="mb-2" />
          <p className="text-sm font-medium">Drag and drop files here, or click to browse</p>
          <p className="mt-1 text-xs text-slate-400">PNG, JPG, GIF up to 10MB</p>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {items.map((item) => (
          <Card
            key={item.id}
            className={cn('group cursor-pointer overflow-hidden transition hover:shadow-md', selected === item.id && 'ring-2 ring-ilm-gold')}
          >
            <div onClick={() => setSelected(item.id)} className="relative aspect-square overflow-hidden">
              <img src={item.url} alt={item.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-900/40 opacity-0 transition group-hover:opacity-100">
                <button onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText(item.url); setCopied(true); setTimeout(() => setCopied(false), 1200); }} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-slate-600 transition hover:bg-white" title="Copy URL">
                  <Copy size={14} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setItems(items.filter((x) => x.id !== item.id)); }} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-rose-500 transition hover:bg-white" title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="px-3 py-2">
              <p className="truncate text-xs font-medium text-slate-700">{item.name}</p>
              <p className="text-[10px] text-slate-400">{item.size}</p>
            </div>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><ImageIcon size={26} /></span>
          <h3 className="font-display text-xl text-slate-700">No media files</h3>
          <p className="mt-2 text-sm text-slate-400">Upload images to use in your articles.</p>
        </Card>
      )}

      {/* Detail drawer */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40" onClick={() => setSelected(null)}>
          <div className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ilm-navy">File details</h2>
              <button onClick={() => setSelected(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <img src={selectedItem.url} alt={selectedItem.name} className="mb-4 w-full rounded-xl object-cover" />
            <div className="space-y-3 text-sm">
              <div><span className="text-slate-400">Name:</span> <span className="text-slate-700">{selectedItem.name}</span></div>
              <div><span className="text-slate-400">Size:</span> <span className="text-slate-700">{selectedItem.size}</span></div>
              <div><span className="text-slate-400">Uploaded:</span> <span className="text-slate-700">{selectedItem.uploadedAt}</span></div>
              <div>
                <span className="text-slate-400">URL:</span>
                <div className="mt-1 flex items-center gap-2">
                  <code className="flex-1 truncate rounded-lg bg-slate-50 px-2 py-1.5 text-xs text-slate-600">{selectedItem.url}</code>
                  <button onClick={() => { navigator.clipboard?.writeText(selectedItem.url); setCopied(true); setTimeout(() => setCopied(false), 1200); }} className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 transition hover:bg-slate-50">
                    <Copy size={13} /> {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
