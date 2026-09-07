'use client';

import Link from 'next/link';
import { FileEdit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type TableRowActionsProps = {
  editHref?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  editLabel?: string;
  deleteLabel?: string;
  className?: string;
};

export function TableRowActions({
  editHref,
  onEdit,
  onDelete,
  editLabel = 'Edit',
  deleteLabel = 'Delete',
  className,
}: TableRowActionsProps) {
  return (
    <div className={cn('flex items-center justify-end gap-1', className)}>
      {editHref ? (
        <Link
          href={editHref}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-sky-50 hover:text-ilm-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ilm-navy/20"
          title={editLabel}
        >
          <FileEdit size={15} />
        </Link>
      ) : onEdit ? (
        <button
          type="button"
          onClick={onEdit}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-sky-50 hover:text-ilm-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ilm-navy/20"
          title={editLabel}
        >
          <FileEdit size={15} />
        </button>
      ) : null}
      {onDelete ? (
        <button
          type="button"
          onClick={onDelete}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
          title={deleteLabel}
        >
          <Trash2 size={15} />
        </button>
      ) : null}
    </div>
  );
}
