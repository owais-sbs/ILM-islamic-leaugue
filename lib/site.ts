export const siteConfig = {
  name: 'ILM',
  fullName: 'Islamic League of Murabbiyūn',
  title: 'ILM | Islamic League of Murabbiyūn',
  description:
    'A home for thoughtful learning, soulful conversation, and the people who help us become more fully human.',
  /** Official logo asset used for favicon + Open Graph */
  logo: '/ILM_Final_Logo_Design.webp',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
} as const;
