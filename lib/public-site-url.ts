import { siteConfig } from '@/lib/site';

const productionFallback = 'https://ilm-islamic-leaugue.vercel.app';

export function getPublicSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
    siteConfig.url,
    productionFallback,
  ];

  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (!value) continue;

    try {
      const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
      if (url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '::1') continue;
      return `https://${url.host}`;
    } catch {
      continue;
    }
  }

  return productionFallback;
}
