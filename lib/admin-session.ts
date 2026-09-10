import type { Role } from '@/lib/admin-data';

export const ADMIN_ROLE_KEY = 'ilm-admin-role';

export function isRole(value: string | null): value is Role {
  return value === 'author' || value === 'editor' || value === 'administrator';
}

export function readAdminRole(): Role | null {
  if (typeof window === 'undefined') return null;
  const stored = window.sessionStorage.getItem(ADMIN_ROLE_KEY);
  return isRole(stored) ? stored : null;
}

export function writeAdminRole(role: Role) {
  window.sessionStorage.setItem(ADMIN_ROLE_KEY, role);
}

export function clearAdminRole() {
  window.sessionStorage.removeItem(ADMIN_ROLE_KEY);
}
