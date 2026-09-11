/** Canonical admin section slugs → `/admin/[section]` */
export const ADMIN_SECTIONS = [
  'dashboard',
  'my-articles',
  'create-article',
  'my-profile',
  'help',
  'review-queue',
  'categories-tags',
  'articles',
  'authors',
  'media',
  'questions',
  'subscribers',
  'settings',
  'activity-log',
] as const;

export type AdminSection = (typeof ADMIN_SECTIONS)[number];

export function isAdminSection(value: string): value is AdminSection {
  return (ADMIN_SECTIONS as readonly string[]).includes(value);
}

export function normalizeAdminSection(value: string | undefined | null): AdminSection {
  if (value && isAdminSection(value)) return value;
  return 'dashboard';
}

export function adminPath(section: AdminSection | string) {
  return `/admin/${normalizeAdminSection(section)}`;
}
