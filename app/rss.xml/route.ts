import { fetchPublishedArticles } from '@/lib/public-content';
import { getSiteUrl } from '@/lib/site-url';

export const revalidate = 3600;

export async function GET() {
  const BASE = getSiteUrl();
  const articles = await fetchPublishedArticles();
  const published = articles
    .filter((a) => a.publishedAt)
    .sort(
      (a, b) =>
        new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime(),
    );

  const items = published
    .map(
      (a) => `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${BASE}/articles/${a.slug}</link>
      <guid isPermaLink="true">${BASE}/articles/${a.slug}</guid>
      <description><![CDATA[${a.excerpt}]]></description>
      <author>${a.authorName}</author>
      <category>${a.category}</category>
      <pubDate>${new Date(a.publishedAt!).toUTCString()}</pubDate>
    </item>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ILM — Islamic League of Murabbiyūn</title>
    <link>${BASE}</link>
    <description>A considered library of Islamic thought, practice, and renewal.</description>
    <language>en</language>
    <atom:link href="${BASE}/rss.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
