'use client';

/**
 * ILM Content Manager — Shared Field Components
 * Reuse the existing admin dashboard design tokens.
 */

import { Eye, EyeOff, GripVertical, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─────────────────────────── Label wrapper ─────────────────────────── */
export function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-1">
      <label className="block text-sm font-semibold text-ilm-navy/75">{children}</label>
      {hint && <p className="mt-1 text-xs leading-relaxed text-ilm-navy/45">{hint}</p>}
    </div>
  );
}

/* ─────────────────────────── TextField ─────────────────────────── */
export function TextField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  className,
}: {
  label?: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn('space-y-1', className)}>
      {label && <FieldLabel hint={hint}>{label}</FieldLabel>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-12 w-full rounded-xl border border-ilm-navy/10 bg-ilm-cream px-3.5 py-3 text-base text-ilm-navy outline-none transition-colors placeholder:text-ilm-navy/35 focus:border-ilm-gold focus:ring-2 focus:ring-ilm-gold/15"
      />
    </div>
  );
}

/* ─────────────────────────── TextareaField ─────────────────────────── */
export function TextareaField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  rows = 5,
  className,
}: {
  label?: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-1', className)}>
      {label && <FieldLabel hint={hint}>{label}</FieldLabel>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="min-h-36 w-full resize-y rounded-xl border border-ilm-navy/10 bg-ilm-cream px-3.5 py-3 text-base leading-relaxed text-ilm-navy outline-none transition-colors placeholder:text-ilm-navy/35 focus:border-ilm-gold focus:ring-2 focus:ring-ilm-gold/15"
      />
    </div>
  );
}

/* ─────────────────────────── LinkField ─────────────────────────── */
export function LinkField({
  label,
  hint,
  value,
  onChange,
  placeholder,
}: {
  label?: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      {label && <FieldLabel hint={hint}>{label}</FieldLabel>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? '/path or https://…'}
        className="min-h-12 w-full rounded-xl border border-ilm-navy/10 bg-ilm-cream px-3.5 py-3 font-mono text-sm text-ilm-navy outline-none transition-colors placeholder:text-ilm-navy/35 focus:border-ilm-gold focus:ring-2 focus:ring-ilm-gold/15"
      />
    </div>
  );
}

/* ─────────────────────────── VisibilityToggle ─────────────────────────── */
export function VisibilityToggle({
  visible,
  onChange,
  label,
}: {
  visible: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!visible)}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors',
        visible
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-ilm-navy/5 text-ilm-navy/45 border border-ilm-navy/10',
      )}
    >
      {visible ? <Eye size={11} /> : <EyeOff size={11} />}
      {label ?? (visible ? 'Visible' : 'Hidden')}
    </button>
  );
}

/* ─────────────────────────── SectionHeader ─────────────────────────── */
export function SectionHeader({
  title,
  description,
  visible,
  onVisibilityChange,
}: {
  title: string;
  description?: string;
  visible?: boolean;
  onVisibilityChange?: (v: boolean) => void;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-base font-semibold text-ilm-navy">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-ilm-navy/50">{description}</p>}
      </div>
      {onVisibilityChange !== undefined && visible !== undefined && (
        <VisibilityToggle visible={visible} onChange={onVisibilityChange} />
      )}
    </div>
  );
}

/* ─────────────────────────── SaveBar ─────────────────────────── */
export function SaveBar({
  dirty,
  saved,
  onSave,
  onReset,
}: {
  dirty: boolean;
  saved: boolean;
  onSave: () => void;
  onReset: () => void;
}) {
  return (
    <div className="sticky bottom-0 z-10 -mx-5 mt-6 border-t border-ilm-navy/8 bg-white px-5 py-3 sm:-mx-6 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <span
          className={cn(
            'text-xs transition-colors',
            dirty ? 'font-semibold text-amber-600' : saved ? 'text-green-600' : 'text-ilm-navy/35',
          )}
        >
          {dirty ? '● Unsaved changes' : saved ? '✓ Changes saved locally' : 'No changes'}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onReset}
            className="rounded-full border border-ilm-navy/10 px-3 py-1.5 text-[11px] font-semibold text-ilm-navy/60 transition hover:border-red-200 hover:text-red-600"
          >
            Reset section
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!dirty}
            className="rounded-full bg-ilm-navy px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white transition hover:-translate-y-0.5 disabled:opacity-40"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── FieldGroup ─────────────────────────── */
export function FieldGroup({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('rounded-xl border border-ilm-navy/8 bg-white p-4 sm:p-5', className)}>
      {title && (
        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.14em] text-ilm-navy/40">
          {title}
        </p>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/* ─────────────────────────── Divider ─────────────────────────── */
export function Divider() {
  return <hr className="border-ilm-navy/8" />;
}

/* ─────────────────────────── SortableRow ─────────────────────────── */
export function SortableRow({
  children,
  onMoveUp,
  onMoveDown,
  onDelete,
  showDelete = true,
  className,
}: {
  children: React.ReactNode;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-start gap-2 rounded-xl border border-ilm-navy/8 bg-ilm-cream/50 p-3',
        className,
      )}
    >
      <div className="flex flex-col gap-0.5 pt-1">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={!onMoveUp}
          className="h-5 w-5 text-ilm-navy/30 hover:text-ilm-navy disabled:opacity-20"
          title="Move up"
        >
          ▲
        </button>
        <GripVertical size={14} className="mx-auto text-ilm-navy/20" />
        <button
          type="button"
          onClick={onMoveDown}
          disabled={!onMoveDown}
          className="h-5 w-5 text-ilm-navy/30 hover:text-ilm-navy disabled:opacity-20"
          title="Move down"
        >
          ▼
        </button>
      </div>
      <div className="min-w-0 flex-1">{children}</div>
      {showDelete && onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="mt-1 shrink-0 text-ilm-navy/25 transition hover:text-red-500"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────── AddButton ─────────────────────────── */
export function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-ilm-navy/15 py-2.5 text-xs font-semibold text-ilm-navy/50 transition hover:border-ilm-gold hover:text-ilm-navy"
    >
      <Plus size={13} /> {label}
    </button>
  );
}

/* ─────────────────────────── ConfirmDialog ─────────────────────────── */
export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ilm-navy/30 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-ilm-navy/10 bg-white p-6 shadow-2xl">
        <h3 className="text-base font-semibold text-ilm-navy">{title}</h3>
        <p className="mt-2 text-sm text-ilm-navy/60">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-ilm-navy/10 px-4 py-2 text-xs font-semibold text-ilm-navy/60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-red-500 px-4 py-2 text-xs font-bold text-white"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
