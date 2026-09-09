/**
 * Canonical role definitions for the ILM admin workspace.
 *
 * STEP 1 (current): selectedRole is a temporary client-side value stored in
 * sessionStorage after login. It does NOT touch Supabase Auth, the profiles
 * table, or any RLS policy.
 *
 * STEP 2+ (future): Replace the sessionStorage read with the real
 * `profiles.role` value returned from Supabase so the rest of the app can
 * stay exactly the same.
 */

export const AdminRole = {
  AUTHOR: 'author',
  EDITOR: 'editor',
  ADMIN: 'admin',
} as const;

export type AdminRole = (typeof AdminRole)[keyof typeof AdminRole];

/** Human-readable labels shown in the UI. */
export const ROLE_LABELS: Record<AdminRole, string> = {
  [AdminRole.AUTHOR]: 'Author / Murabbī',
  [AdminRole.EDITOR]: 'Editor',
  [AdminRole.ADMIN]: 'Administrator',
};

/** All roles in display order. */
export const ALL_ROLES: AdminRole[] = [AdminRole.AUTHOR, AdminRole.EDITOR, AdminRole.ADMIN];

/** sessionStorage key used to persist the temporary role across the session. */
export const TEMP_ROLE_KEY = 'ilm_selected_role';

/** Read the temporary role from sessionStorage (client-side only). */
export function getTempRole(): AdminRole | null {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem(TEMP_ROLE_KEY);
  if (stored && (Object.values(AdminRole) as string[]).includes(stored)) {
    return stored as AdminRole;
  }
  return null;
}

/** Persist the temporary role to sessionStorage (client-side only). */
export function setTempRole(role: AdminRole): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(TEMP_ROLE_KEY, role);
}
