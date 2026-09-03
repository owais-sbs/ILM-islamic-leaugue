import { articles } from '@/lib/data';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ilm.org';

export function GET() {
  const published = articles
    .filter((a) => a.status === 'published' && a.publishedAt)
    .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime());

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
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
