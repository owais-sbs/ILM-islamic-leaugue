'use client';

import { useEffect, useRef, useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export type RowMenuItem = {
  label: string;
  onClick: () => void;
  danger?: boolean;
};

export function RowMenu({ items, label = 'More actions' }: { items: RowMenuItem[]; label?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-1.5 text-ilm-navy/35 transition-colors hover:bg-ilm-cream hover:text-ilm-navy"
        aria-label={label}
        aria-expanded={open}
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-1 min-w-[160px] overflow-hidden rounded-xl border border-ilm-navy/10 bg-white py-1 shadow-lg">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setOpen(false);
                item.onClick();
              }}
              className={cn(
                'block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-ilm-cream',
                item.danger ? 'text-red-600' : 'text-ilm-navy',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
