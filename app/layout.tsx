import './globals.css';
import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import { getMetadataBase, getSiteUrl } from '@/lib/site-url';
import { DEFAULT_DESCRIPTION, SITE_NAME } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const display = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: SITE_NAME,
    template: '%s — ILM',
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: 'ILM',
  authors: [{ name: 'Islamic League of Murabbiyūn' }],
  creator: 'Islamic League of Murabbiyūn',
  publisher: 'Islamic League of Murabbiyūn',
  themeColor: '#0F1657',
  formatDetection: { telephone: false, email: false, address: false },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/ILM_Final_Logo_Icon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.svg' }, { url: '/ILM_Final_Logo_Icon.png' }],
    shortcut: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    locale: 'en_US',
    url: getSiteUrl(),
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Islamic League of Murabbiyūn — ILM',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: 'Mentors · Educators · Cultivators',
    images: [{ url: '/og-image.png', alt: 'Islamic League of Murabbiyūn — ILM' }],
  },
  alternates: {
    canonical: getSiteUrl(),
    types: {
      'application/rss+xml': `${getSiteUrl()}/rss.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const base = getSiteUrl();

  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Islamic League of Murabbiyūn',
    alternateName: 'ILM',
    url: base,
    logo: `${base}/ILM_Final_Logo_Icon.png`,
    description: DEFAULT_DESCRIPTION,
    sameAs: [],
  };

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: base,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${base}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <head>
        <link rel="preconnect" href="https://images.pexels.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.pexels.com" />
      </head>
      <body className="font-sans antialiased">
        <JsonLd data={organizationLd} />
        <JsonLd data={websiteLd} />
        {children}
      </body>
    </html>
  );
}
