/** Islamic Unsplash imagery only — mosques, Qur’an, Kaaba. No women portraits. */
export const images = {
  quranSunrise:
    'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80',
  mosqueInterior:
    'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80',
  mosqueDome:
    'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
  mosqueArch:
    'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
  quranOpen:
    'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80',
  quranClose:
    'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80',
  kaaba:
    'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
  prayerHall:
    'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1400&q=80',
  blueMosque:
    'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1200&q=80',
  mosqueCourtyard:
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
  quranHands:
    'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80',
  /** Distinct Unsplash avatars for authors / murabbiyun (Islamic scenes, no people portraits) */
  scholarQuran:
    'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&h=800&q=80',
  scholarKufi:
    'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&h=800&q=80',
  scholarBeard:
    'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&h=800&q=80',
  scholarPrayer:
    'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&h=800&q=80',
  scholarLantern:
    'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&h=800&q=80',
} as const;

/** Blocked URLs (women portraits / unsuitable stock). */
export const BLOCKED_IMAGE_SUBSTRINGS = [
  '7242908',
  'photos/7242908',
  '4126807',
  '810775',
  '5273717',
] as const;

export function isAllowedSiteImage(url: string | undefined | null) {
  if (!url) return false;
  return !BLOCKED_IMAGE_SUBSTRINGS.some((s) => url.includes(s));
}

export function safeArticleImage(url: string | undefined | null) {
  return isAllowedSiteImage(url) ? url! : images.quranSunrise;
}

export function safeScholarImage(url: string | undefined | null, fallback = images.scholarKufi) {
  return isAllowedSiteImage(url) ? url! : fallback;
}
