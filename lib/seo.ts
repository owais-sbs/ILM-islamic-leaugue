import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/site-url';

const SITE_NAME = 'ILM — Islamic League of Murabbiyūn';
const DEFAULT_DESCRIPTION =
  'A considered library of Islamic thought, practice, and renewal. Mentors · Educators · Cultivators.';

export { SITE_NAME, DEFAULT_DESCRIPTION };

/** Build page metadata with canonical, OG, and Twitter — no UI impact. */
export function buildPageMetadata({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}): Metadata {
  const base = getSiteUrl();
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? path : `/${path}`}`;
  const ogImage = image || '/og-image.png';

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true },
    openGraph: {
      type,
      siteName: SITE_NAME,
      title,
      description,
      url,
      locale: 'en_US',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}
