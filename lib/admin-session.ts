import type { Role } from '@/lib/admin-data';

export const ADMIN_ROLE_KEY = 'ilm-admin-role';
export const ADMIN_AUTH_USER_KEY = 'ilm-admin-auth-user';

export function isRole(value: string | null): value is Role {
  return value === 'author' || value === 'editor' || value === 'administrator';
}

export function readAdminRole(): Role | null {
  if (typeof window === 'undefined') return null;
  const stored = window.sessionStorage.getItem(ADMIN_ROLE_KEY);
  return isRole(stored) ? stored : null;
}

export function readAdminAuthUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage.getItem(ADMIN_AUTH_USER_KEY);
}

/** Bind this tab's UI role to a specific auth user (never reuse another account's role). */
export function writeAdminRole(role: Role, authUserId?: string | null) {
  window.sessionStorage.setItem(ADMIN_ROLE_KEY, role);
  if (authUserId) {
    window.sessionStorage.setItem(ADMIN_AUTH_USER_KEY, authUserId);
  }
}

export function clearAdminRole() {
  window.sessionStorage.removeItem(ADMIN_ROLE_KEY);
  window.sessionStorage.removeItem(ADMIN_AUTH_USER_KEY);
}

export function mapDbRole(role: string | null | undefined): Role | null {
  if (role === 'admin') return 'administrator';
  if (role === 'editor') return 'editor';
  if (role === 'author') return 'author';
  return null;
}
