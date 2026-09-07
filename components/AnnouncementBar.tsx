import Link from 'next/link';

/** Slim full-width strip above the main nav — separate from the header card. */
export function AnnouncementBar() {
  const text = 'New essays this week — read the latest from our Murabbiyūn.';

  return (
    <div
      className="border-b border-white/10 bg-[#0a1045] px-4 py-1.5 text-center text-[10px] leading-snug text-white/80 md:text-[11px]"
      role="region"
      aria-label="Site announcement"
    >
      <span className="inline-flex max-w-4xl flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
        <span className="font-semibold text-ilm-gold">ILM</span>
        <span className="hidden text-white/25 sm:inline" aria-hidden>·</span>
        <span>{text}</span>
        <Link
          href="/articles"
          className="font-semibold text-ilm-gold underline-offset-2 transition hover:text-white hover:underline"
        >
          Read now
        </Link>
      </span>
    </div>
  );
}
