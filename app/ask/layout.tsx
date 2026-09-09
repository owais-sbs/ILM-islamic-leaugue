import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Ask a question',
  description:
    'Bring your question to the ILM conversation. Submit thoughtfully — our editors and Murabbiyūn review submissions with care.',
  path: '/ask',
});

export default function AskLayout({ children }: { children: React.ReactNode }) {
  return children;
}
