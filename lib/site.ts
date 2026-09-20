export const siteConfig = {
  name: 'ILM',
  fullName: 'Islamic League of Murabbiyūn',
  title: 'ILM | Islamic League of Murabbiyūn',
  description:
    'Making beneficial Islamic knowledge accessible to Muslims in America. Reliable Islamic education rooted in the Qur’an, Sunnah, and the methodology of Ahlus-Sunnah wa-l-Jamāʿah.',
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
