/**
 * Role helpers for the ILM admin workspace.
 *
 * URL shape: /admin/as/{author|editor|admin}/...
 * Real permissions come from profiles.role + Supabase RLS.
 * The path segment keeps the visible portal in sync with the role toggle.
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

/** Demo portal accounts (created/reset by `node scripts/smoke-roles.mjs`). */
export const DEMO_ACCOUNTS: Record<
  AdminRole,
  { email: string; password: string; label: string }
> = {
  [AdminRole.AUTHOR]: {
    email: 'author.smoke@ilm.test',
    password: 'author123',
    label: 'Author / Murabbī',
  },
  [AdminRole.EDITOR]: {
    email: 'editor.smoke@ilm.test',
    password: 'editor123',
    label: 'Editor',
  },
  [AdminRole.ADMIN]: {
    email: 'adminops@gmail.com',
    password: 'admin123',
    label: 'Administrator',
  },
};

export const TEMP_ROLE_KEY = 'ilm_selected_role';

export function isAdminRole(value: string | null | undefined): value is AdminRole {
  return value === 'author' || value === 'editor' || value === 'admin';
}

export function getTempRole(): AdminRole | null {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem(TEMP_ROLE_KEY);
  return isAdminRole(stored) ? stored : null;
}

export function setTempRole(role: AdminRole): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(TEMP_ROLE_KEY, role);
}

export function clearTempRole(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(TEMP_ROLE_KEY);
}

/** `/admin/as/author` */
export function roleHomePath(role: AdminRole): string {
  return `/admin/as/${role}`;
}

/** Read role from `/admin/as/{role}/...` */
export function parseRoleFromPath(pathname: string): AdminRole | null {
  const match = pathname.match(/^\/admin\/as\/(author|editor|admin)(?=\/|$)/);
  return match ? (match[1] as AdminRole) : null;
}

/**
 * Strip role segment:
 * `/admin/as/author/articles` → `/admin/articles`
 * `/admin/as/editor` → `/admin`
 */
export function stripRolePrefix(pathname: string): string {
  const match = pathname.match(/^\/admin\/as\/(author|editor|admin)(\/.*)?$/);
  if (!match) return pathname;
  return match[2] ? `/admin${match[2]}` : '/admin';
}

/**
 * Build a role-aware admin URL.
 * Accepts `/admin/articles`, `/admin/articles?status=draft`, or relative `articles`.
 */
export function withRolePath(href: string, role: AdminRole): string {
  const [rawPath, query = ''] = href.split('?');
  let path = rawPath || '/admin';

  if (!path.startsWith('/')) path = `/${path}`;
  if (path === '/admin' || path.startsWith('/admin/')) {
    // ok
  } else {
    path = `/admin${path.startsWith('/') ? path : `/${path}`}`;
  }

  const logical = stripRolePrefix(path);
  const suffix = logical === '/admin' ? '' : logical.replace(/^\/admin/, '');
  const next = `/admin/as/${role}${suffix}`;
  return query ? `${next}?${query}` : next;
}

/** Swap only the role segment, keep the rest of the path + search. */
export function swapRoleInPath(pathname: string, search: string, role: AdminRole): string {
  const logical = stripRolePrefix(pathname);
  const suffix = logical === '/admin' ? '' : logical.replace(/^\/admin/, '');
  return `/admin/as/${role}${suffix}${search || ''}`;
}
