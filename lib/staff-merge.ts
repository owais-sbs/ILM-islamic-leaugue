/**
 * Builds one public Murabbiyūn directory entry.
 *
 * Source of truth: the account row in `public.profiles` (name, bio, title, photo, madhhab).
 * The `site_settings.staff_profiles` override only supplies display extras that profiles has no
 * column for (multi-paragraph biography, focus, accent, directory link, visibility) and acts as a
 * fallback when a profile field is empty.
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

/**
 * Long-form biography for the public profile page.
 * - Multi-paragraph Staff Profiles biography is kept as authored.
 * - Otherwise live `profiles.bio` wins so My Profile / account edits appear publicly.
 */
export function resolveBiography(opts: {
  accountBio: string;
  overrideBio: string;
  overrideBiography: unknown;
}) {
  const fromOverride = Array.isArray(opts.overrideBiography)
    ? (opts.overrideBiography as unknown[])
        .filter((p): p is string => typeof p === 'string')
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  // Intentional long-form CMS biography (2+ paragraphs)
  if (fromOverride.length > 1) {
    if (
      opts.accountBio &&
      opts.overrideBio &&
      fromOverride[0] === opts.overrideBio &&
      fromOverride[0] !== opts.accountBio
    ) {
      return [opts.accountBio, ...fromOverride.slice(1)];
    }
    return fromOverride;
  }

  if (opts.accountBio) return [opts.accountBio];
  if (fromOverride.length === 1) return fromOverride;
  if (opts.overrideBio) return [opts.overrideBio];
  return [];
}

export function mergeStaffProfile(override: StaffOverride, account?: StaffAccount) {
  if (typeof override.id !== 'string') return null;

  const active = account ? account.is_active !== false : override.active !== false;
  // Administrator accounts run the site; they are never listed as public Murabbiyūn.
  const isAdminAccount = account?.role === 'admin';
  const showInDirectory = override.showInDirectory === true && !isAdminAccount;
  const directoryId = str(override.directoryId) || undefined;

  if (!active || !showInDirectory) return { id: override.id, directoryId, active, showInDirectory };

  const overrideBio = str(override.bio);
  const accountBio = str(account?.bio);
  // profiles.bio wins; override is only a fallback when the account field is empty
  const bio = accountBio || overrideBio;
  const biography = resolveBiography({
    accountBio,
    overrideBio,
    overrideBiography: override.biography,
  });

  return {
    id: override.id,
    directoryId,
    active,
    showInDirectory,
    name: str(account?.full_name) || str(override.name),
    staffTitle: displayTitle(account?.credentials) || str(override.staffTitle),
    bio,
    biography,
    focus: override.focus || undefined,
    accent: str(override.accent) || undefined,
    image: str(account?.avatar_url) || str(override.image),
    madhhab: str(account?.madhhab) || str(override.madhhab),
  };
}

/** Patch the staff_profiles CMS document so directory extras stay aligned with a profiles row. */
export function syncOverrideFromAccount(
  overrides: Array<Record<string, unknown>>,
  account: {
    id: string;
    full_name?: string | null;
    email?: string | null;
    bio?: string | null;
    credentials?: string | null;
    avatar_url?: string | null;
    madhhab?: string | null;
    role?: string | null;
  },
) {
  const index = overrides.findIndex((entry) => entry.id === account.id);
  if (index < 0) return { next: overrides, changed: false };

  const current = overrides[index];
  const nextBio = str(account.bio);
  const prevBio = str(current.bio);
  const prevBiography = Array.isArray(current.biography)
    ? (current.biography as unknown[]).filter((p): p is string => typeof p === 'string').map((p) => p.trim()).filter(Boolean)
    : [];

  let biography = prevBiography;
  if (prevBiography.length <= 1) {
    biography = nextBio ? [nextBio] : [];
  } else if (nextBio && prevBio && prevBiography[0] === prevBio && prevBiography[0] !== nextBio) {
    biography = [nextBio, ...prevBiography.slice(1)];
  }

  const patched = {
    ...current,
    id: account.id,
    name: str(account.full_name) || str(current.name),
    email: str(account.email) || str(current.email),
    bio: nextBio,
    biography,
    staffTitle: displayTitle(account.credentials) || str(current.staffTitle),
    madhhab: str(account.madhhab) || str(current.madhhab),
    image: str(account.avatar_url) || str(current.image),
    role:
      account.role === 'admin'
        ? 'administrator'
        : account.role === 'editor'
          ? 'editor'
          : str(current.role) || 'author',
  };

  const next = [...overrides];
  next[index] = patched;
  return { next, changed: true };
}
