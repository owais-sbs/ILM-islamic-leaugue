import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-[70svh] place-items-center px-6 py-24 text-center">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ilm-gold-deep">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-ilm-navy sm:text-4xl">Page not found</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ilm-navy/55">
          This path is not part of the ILM library. Return home to continue seeking knowledge with adab.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-ilm-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ilm-navy-soft"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
