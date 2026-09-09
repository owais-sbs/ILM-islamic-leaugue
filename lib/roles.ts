/**
 * Canonical role labels for the ILM admin workspace.
 * Real permissions come from profiles.role + Supabase RLS (PDF §7).
 * Never trust a client-side "view as" switch.
 */

export const AdminRole = {
  AUTHOR: 'author',
  EDITOR: 'editor',
  ADMIN: 'admin',
} as const;

export type AdminRole = (typeof AdminRole)[keyof typeof AdminRole];

export const ROLE_LABELS: Record<AdminRole, string> = {
  [AdminRole.AUTHOR]: 'Author / Murabbī',
  [AdminRole.EDITOR]: 'Editor',
  [AdminRole.ADMIN]: 'Administrator',
};

export const ALL_ROLES: AdminRole[] = [AdminRole.AUTHOR, AdminRole.EDITOR, AdminRole.ADMIN];
