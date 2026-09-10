'use client';

import type { ArticleStatus, Role } from '@/lib/admin-data';
import { statusStyles, roleBadgeStyles, roleLabels } from '@/lib/admin-data';

export function StatusPill({ status }: { status: ArticleStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

export function RoleBadge({ role }: { role: Role }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${roleBadgeStyles[role]}`}>
      {roleLabels[role]}
    </span>
  );
}
