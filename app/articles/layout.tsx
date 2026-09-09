import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Article library',
  description:
    'Browse essays on Qur’an, spirituality, history, character, and contemporary questions — written with care by qualified Murabbiyūn.',
  path: '/articles',
});

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
