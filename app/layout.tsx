import './globals.css';
import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import { getMetadataBase } from '@/lib/site-url';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const display = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap', weight: ['400', '500', '600'] });

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: 'ILM — Islamic League of Murabbiyūn',
  description: 'A considered library of Islamic thought, practice, and renewal. Mentors · Educators · Cultivators.',
  applicationName: 'ILM',
  themeColor: '#0F1657',
  icons: {
    icon: [
      { url: '/ILM_Final_Logo_Icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/ILM_Final_Logo_Icon.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/ILM_Final_Logo_Icon.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'ILM — Islamic League of Murabbiyūn',
    title: 'ILM — Islamic League of Murabbiyūn',
    description: 'Mentors · Educators · Cultivators — a considered library of Islamic thought, practice, and renewal.',
    locale: 'en_US',
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
    title: 'ILM — Islamic League of Murabbiyūn',
    description: 'Mentors · Educators · Cultivators',
    images: [{ url: '/og-image.png', alt: 'Islamic League of Murabbiyūn — ILM' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
