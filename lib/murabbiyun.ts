'use client';

import { useEffect, useState } from 'react';
import { murabbiyūn as staticMurabbiyun, type Murabbi } from '@/lib/public-data';
import { images, isAllowedSiteImage } from '@/lib/images';

/** One entry from GET /api/staff-profiles (public fields only). */
export type DirectoryProfile = {
  id: string;
  /** Slug of a built-in profile in lib/public-data.ts this account fills in. */
  directoryId?: string;
  name?: string;
  staffTitle?: string;
  bio?: string;
  biography?: string[];
  focus?: Murabbi['focus'];
  accent?: string;
  image?: string;
  madhhab?: string;
  active: boolean;
  showInDirectory: boolean;
};

type OrderItem = { id: string; visible: boolean; order: number };

const MADHHABS = new Set(['Hanafi', 'Maliki', "Shafi'i", 'Hanbali']);
const DEFAULT_ACCENT = 'bg-sky-100 text-sky-700';

export const staticMurabbiIds = new Set(staticMurabbiyun.map((m) => m.id));
export const staticMurabbiOptions = staticMurabbiyun.map((m) => ({ id: m.id, name: m.name }));

const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '');
const paragraphs = (value: unknown) =>
  Array.isArray(value) ? value.map(text).filter(Boolean) : [];

/** Which built-in profile (if any) a remote entry belongs to. */
function staticTarget(profile: DirectoryProfile) {
  if (profile.directoryId && staticMurabbiIds.has(profile.directoryId)) return profile.directoryId;
  return staticMurabbiIds.has(profile.id) ? profile.id : null;
}

/** Fill a profile with whatever the admin has saved; empty admin fields keep the existing value. */
function applyProfile(base: Murabbi, profile: DirectoryProfile): Murabbi {
  const bio = text(profile.bio);
  const biography = paragraphs(profile.biography);
  const madhhab = text(profile.madhhab);
  return {
    ...base,
    role: text(profile.staffTitle) || base.role,
    bio: bio || base.bio,
    biography: biography.length ? biography : bio && !base.biography.length ? [bio] : base.biography,
    madhhab: MADHHABS.has(madhhab) ? (madhhab as Murabbi['madhhab']) : base.madhhab,
    focus: profile.focus || base.focus,
    accent: text(profile.accent) || base.accent,
    image: isAllowedSiteImage(text(profile.image)) ? text(profile.image) : base.image,
  };
}

/**
 * Merge built-in profiles with admin-managed ones.
 * Returns every visible murabbi plus a map from account ids to the slug used in profile URLs.
 */
export function buildMurabbiyun(remote: DirectoryProfile[]) {
  const byId = new Map<string, Murabbi>(staticMurabbiyun.map((m) => [m.id, m]));
  const hidden = new Set<string>();
  const aliases = new Map<string, string>();
  const dynamicIds: string[] = [];

  for (const profile of remote) {
    if (!profile?.id) continue;
    const target = staticTarget(profile);
    const visible = profile.active !== false && profile.showInDirectory === true;

    if (target) {
      aliases.set(profile.id, target);
      if (!visible) {
        hidden.add(target);
        continue;
      }
      byId.set(target, applyProfile(byId.get(target)!, profile));
      continue;
    }

    const name = text(profile.name);
    if (!visible || !name) continue;
    const bio = text(profile.bio);
    byId.set(
      profile.id,
      applyProfile(
        {
          id: profile.id,
          name,
          role: '',
          bio: bio || `${name} is one of the murabbiyūn of ILM.`,
          biography: [],
          // Same illustrated portrait as the built-in profiles until a photo is uploaded.
          image: images.murabbiPortrait,
          accent: DEFAULT_ACCENT,
          sections: [],
        },
        profile,
      ),
    );
    dynamicIds.push(profile.id);
  }

  const list = [...staticMurabbiyun.map((m) => m.id), ...dynamicIds]
    .filter((id) => !hidden.has(id))
    .map((id) => byId.get(id)!)
    .map((m) => (m.biography.length ? m : { ...m, biography: [m.bio] }));

  return { list, aliases };
}

/**
 * Apply the Content Manager order. Configured entries come first in their saved order;
 * everything not configured yet (new accounts, newly added built-in profiles) follows,
 * so a new murabbi never silently disappears.
 */
export function orderMurabbiyun(list: Murabbi[], items: OrderItem[]) {
  const configured = new Map(items.map((item) => [item.id, item]));
  const ordered = items
    .filter((item) => item.visible)
    .sort((a, b) => a.order - b.order)
    .map((item) => list.find((m) => m.id === item.id))
    .filter(Boolean) as Murabbi[];
  const rest = list.filter((m) => !configured.has(m.id));
  return [...ordered, ...rest];
}

let cache: DirectoryProfile[] | null = null;
let pending: Promise<DirectoryProfile[]> | null = null;

function loadProfiles() {
  if (cache) return Promise.resolve(cache);
  pending ??= fetch('/api/staff-profiles', { cache: 'no-store' })
    .then((res) => (res.ok ? res.json() : { ok: false }))
    .then((json: { ok?: boolean; profiles?: DirectoryProfile[] }) => {
      cache = json.ok && Array.isArray(json.profiles) ? json.profiles : [];
      return cache;
    })
    .catch(() => [] as DirectoryProfile[])
    .finally(() => {
      pending = null;
    });
  return pending;
}

/** Public murabbiyūn list: built-in profiles merged with what admins saved in Staff Profiles. */
export function usePublicMurabbiyun() {
  const [state, setState] = useState(() => ({ ...buildMurabbiyun(cache || []), loading: !cache }));

  useEffect(() => {
    let cancelled = false;
    void loadProfiles().then((profiles) => {
      if (!cancelled) setState({ ...buildMurabbiyun(profiles), loading: false });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
