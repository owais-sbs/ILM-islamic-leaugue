import type { MetadataRoute } from 'next';
import { articles } from '@/lib/admin-data';
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
  const staticEntries = paths.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: now,
    changeFrequency: (path === '/' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
    priority: path === '/' ? 1 : 0.7,
  }));

  const articleEntries = articles
    .filter((a) => a.status === 'published')
    .map((a) => ({
      url: `${siteConfig.url}/articles/${a.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

  return [...staticEntries, ...articleEntries];
}
