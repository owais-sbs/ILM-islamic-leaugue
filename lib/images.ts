/** Islamic imagery: mosques, Qur’an, Kaaba, and male scholars only. */
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
  /** Male Islamic scholars / teachers for murabbiyun & authors */
  scholarQuran:
    'https://images.pexels.com/photos/810775/pexels-photo-810775.jpeg?auto=compress&cs=tinysrgb&h=800&w=800',
  scholarKufi:
    'https://images.pexels.com/photos/5273717/pexels-photo-5273717.jpeg?auto=compress&cs=tinysrgb&h=800&w=800',
  scholarBeard:
    'https://images.pexels.com/photos/4126807/pexels-photo-4126807.jpeg?auto=compress&cs=tinysrgb&h=800&w=800',
  scholarPrayer:
    'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
} as const;

/** Blocked portrait URLs (women / unsuitable for this site). */
export const BLOCKED_IMAGE_SUBSTRINGS = [
  '7242908', // hijab portrait previously used
  'photos/7242908',
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
