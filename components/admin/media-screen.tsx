'use client';

import { useCallback, useRef, useState } from 'react';
import { Copy, Trash2, Upload } from 'lucide-react';
import { Reveal, StaggerContainer, StaggerItem } from './reveal';
import { useIlm } from '@/lib/ilm-store';
import { adminSwal } from '@/lib/admin-swal';

export function MediaScreen() {
  const { media, addMedia, removeMedia } = useIlm();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const ingestFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
      if (!list.length) {
        await adminSwal.error('Images only', 'Upload JPG, PNG, WebP, or GIF files.');
        return;
      }
      let okCount = 0;
      for (const file of list) {
        if (file.size > 4.5 * 1024 * 1024) {
          await adminSwal.error('File too large', `${file.name} exceeds 4.5 MB.`);
          continue;
        }
        const form = new FormData();
        form.append('file', file);
        try {
          const res = await fetch('/api/admin/media', { method: 'POST', body: form });
          const json = (await res.json()) as {
            ok?: boolean;
            item?: { id: string; name: string; size: string; src: string; createdAt: string };
            error?: string;
          };
          if (!res.ok || !json.ok || !json.item) {
            await adminSwal.error('Upload failed', json.error || file.name);
            continue;
          }
          addMedia({ name: json.item.name, size: json.item.size, src: json.item.src }, json.item.id);
          okCount += 1;
        } catch {
          await adminSwal.error('Upload failed', file.name);
        }
      }
      if (okCount) await adminSwal.success('Uploaded live', `${okCount} file(s) saved to Supabase storage.`);
    },
    [addMedia],
  );

  return (
    <Reveal>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
        }}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files?.length) void ingestFiles(e.dataTransfer.files);
        }}
        className={`mb-6 cursor-pointer rounded-2xl border-2 border-dashed bg-white p-10 text-center transition-colors ${
          dragging ? 'border-ilm-gold bg-ilm-cream/40' : 'border-ilm-navy/10 hover:border-ilm-gold'
        }`}
      >
        <Upload size={28} className="mx-auto mb-3 text-ilm-navy/30" />
        <p className="text-sm text-ilm-navy/50">Click or drag files to upload</p>
        <p className="mt-1 text-xs text-ilm-navy/35">Images up to 4.5 MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) void ingestFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StaggerContainer className="contents">
          {media.map((item) => (
            <StaggerItem key={item.id}>
              <div className="rounded-2xl border border-ilm-navy/10 bg-white p-4 transition-all hover:border-ilm-gold hover:shadow-md">
                <div className="mb-3 h-32 w-full overflow-hidden rounded-xl bg-ilm-cream">
                  <img src={item.src} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-medium text-ilm-navy">{item.name}</h4>
                    <p className="text-xs text-ilm-navy/40">{item.size}</p>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <button
                      type="button"
                      title="Copy URL"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(item.src);
                          await adminSwal.success('Copied', 'Media URL copied to clipboard.');
                        } catch {
                          await adminSwal.error('Copy failed', 'Could not access the clipboard.');
                        }
                      }}
                      className="p-1 text-ilm-navy/30 transition-colors hover:text-ilm-navy"
                    >
                      <Copy size={15} />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      onClick={async () => {
                        const res = await adminSwal.confirm('Delete media?', item.name, 'Delete');
                        if (!res.isConfirmed) return;
                        removeMedia(item.id);
                      }}
                      className="p-1 text-ilm-navy/30 transition-colors hover:text-red-500"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
      {media.length === 0 && (
        <p className="py-10 text-center text-sm text-ilm-navy/35">No media yet. Upload your first image.</p>
      )}
    </Reveal>
  );
}
