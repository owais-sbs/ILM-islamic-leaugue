/**
 * Resolves the public site URL for metadata, sitemaps, and OG tags.
 * Treats blank env values as unset (Vercel often has NEXT_PUBLIC_SITE_URL="").
 */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, '');
  }

  const vercelHost = process.env.VERCEL_URL?.trim();
  if (vercelHost) {
    return `https://${vercelHost}`;
  }

  return 'http://localhost:3000';
}

export function getMetadataBase(): URL {
  return new URL(getSiteUrl());
}
