export const siteConfig = {
  name: 'ILM',
  fullName: 'Islamic League of Murabbiyūn',
  title: 'ILM | Islamic League of Murabbiyūn',
  description:
    'A home for thoughtful learning, soulful conversation, and the people who help us become more fully human.',
  /** Official logo — favicon + default Open Graph */
  logo: '/ILM_Final_Logo_Design.webp',
  /** Social share card (article-style mosque / Qur’an scene) */
  ogImage:
    'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&h=630&q=80',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
} as const;
