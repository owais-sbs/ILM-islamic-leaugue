import { FileText } from 'lucide-react';
import Link from 'next/link';

export function EmptyArticles({
  title = 'No articles yet',
  description = 'Published essays will appear here soon.',
  showBrowseLink = false,
}: {
  title?: string;
  description?: string;
  showBrowseLink?: boolean;
}) {
  return (
    <div className="ilm-empty">
      <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
        <FileText size={22} strokeWidth={1.5} />
      </span>
      <p className="font-display text-lg text-ilm-navy">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">{description}</p>
      {showBrowseLink && (
        <Link href="/articles" className="mt-4 inline-block text-[11px] font-semibold uppercase tracking-[.14em] text-ilm-gold hover:underline">
          Browse all articles →
        </Link>
      )}
    </div>
  );
}
