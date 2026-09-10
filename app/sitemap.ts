import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

const paths = [
  '/',
  '/about',
  '/articles',
  '/murabbiyun',
  '/contact',
  '/ask',
  '/search',
  '/library',
  '/disclaimer',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return paths.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.7,
  }));
}
