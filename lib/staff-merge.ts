/**
 * Builds one public Murabbiyūn directory entry.
 *
 * Source of truth: the account row in `public.profiles` (name, bio, title, photo).
 * The `site_settings.staff_profiles` override only supplies display extras that profiles has no
 * column for (long biography, focus, accent, directory link, visibility) and acts as a fallback
 * when a profile field is empty.
 */

export type StaffAccount = {
  id: string;
  full_name?: string | null;
  is_active?: boolean | null;
  role?: string | null;
  bio?: string | null;
  madhhab?: string | null;
  credentials?: string | null;
  avatar_url?: string | null;
};

export type StaffOverride = Record<string, unknown>;

const str = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

/** The account form fills `credentials` with the role name when no title is given — not a display title. */
const ROLE_LABELS = new Set(['author', 'editor', 'admin', 'administrator']);
export const displayTitle = (value: unknown) => {
  const title = str(value);
  return ROLE_LABELS.has(title.toLowerCase()) ? '' : title;
};

export function mergeStaffProfile(override: StaffOverride, account?: StaffAccount) {
  if (typeof override.id !== 'string') return null;

  const active = account ? account.is_active !== false : override.active !== false;
  // Administrator accounts run the site; they are never listed as public Murabbiyūn.
  const isAdminAccount = account?.role === 'admin';
  const showInDirectory = override.showInDirectory === true && !isAdminAccount;
  const directoryId = str(override.directoryId) || undefined;

  if (!active || !showInDirectory) return { id: override.id, directoryId, active, showInDirectory };

  const overrideBio = str(override.bio);
  const bio = str(account?.bio) || overrideBio;

  let biography = Array.isArray(override.biography)
    ? (override.biography as unknown[]).filter((p): p is string => typeof p === 'string')
    : [];
  // A biography that is just the short bio copied at creation time must follow the live bio.
  if (biography.length === 1 && biography[0].trim() === overrideBio && bio && bio !== overrideBio) {
    biography = [bio];
  }

  return {
    id: override.id,
    directoryId,
    active,
    showInDirectory,
    name: str(account?.full_name),
    staffTitle: displayTitle(account?.credentials) || str(override.staffTitle),
    bio,
    biography,
    focus: override.focus || undefined,
    accent: str(override.accent) || undefined,
    image: str(account?.avatar_url) || str(override.image),
    madhhab: str(account?.madhhab),
  };
}
