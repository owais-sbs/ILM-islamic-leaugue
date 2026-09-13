export const siteConfig = {
  name: 'ILM',
  fullName: 'Islamic League of Murabbiyūn',
  title: 'ILM | Islamic League of Murabbiyūn',
  description:
    'Thoughtful Islamic learning for seekers: articles on tarbiyah, ethics, knowledge, and the role of the Murabbī. A home for soulful conversation and character-first education.',
  /** Full brand banner (landscape) */
  logo: '/ILM_Final_Logo_Design.webp',
  /** Square mark for favicon / apple touch */
  favicon: '/favicon.webp',
  /** Open Graph / Twitter share image — 1200×630 */
  ogImage: '/og-image.png',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  keywords: [
    'ILM',
    'Islamic League of Murabbiyūn',
    'Murabbi',
    'Islamic education',
    'tarbiyah',
    'ikhtilaf',
    'Islamic ethics',
    'seeking knowledge',
    'Islamic articles',
    'fiqh',
    'aqidah',
  ],
} as const;
