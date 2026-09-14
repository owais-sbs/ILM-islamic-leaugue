'use client';

import Link from 'next/link';
import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-24 sm:pt-28">
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-4 pb-14 pt-6 sm:px-6 sm:pb-20 sm:pt-12">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ilm-gold-deep">Legal</p>
        <h1 className="mt-3 text-3xl font-semibold text-ilm-navy sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-ilm-navy/45">Last updated: September 2026</p>
        <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ilm-navy/65 sm:text-base">
          <p>
            ILM respects your privacy. This policy explains what information we collect when you use the public site,
            how we use it, and the choices available to you.
          </p>
          <h2 className="pt-2 text-lg font-semibold text-ilm-navy">Information we collect</h2>
          <p>
            When you ask a question, write via the contact form, or subscribe to updates, you may provide a name, email
            address, and message content. We also receive standard technical data such as browser type and approximate
            usage logs needed to keep the site reliable.
          </p>
          <h2 className="pt-2 text-lg font-semibold text-ilm-navy">How we use information</h2>
          <p>
            We use contact details to reply to questions and correspondence, to operate the contributor portal, and to send
            newsletter notes only when you have subscribed. We do not sell personal information.
          </p>
          <h2 className="pt-2 text-lg font-semibold text-ilm-navy">Storage and access</h2>
          <p>
            Submissions may be stored in our systems so administrators, editors, and assigned Murabbiyūn can respond.
            Access is limited to people who need it to serve the request.
          </p>
          <h2 className="pt-2 text-lg font-semibold text-ilm-navy">Cookies and local storage</h2>
          <p>
            The site may use cookies or browser storage for session preferences and demo/admin state. You can clear these
            through your browser settings.
          </p>
          <h2 className="pt-2 text-lg font-semibold text-ilm-navy">Contact</h2>
          <p>
            For privacy requests, write to <strong className="font-medium text-ilm-navy">salam@ilm.org</strong> or use the{' '}
            <Link href="/contact" className="border-b border-ilm-gold text-ilm-navy">
              contact page
            </Link>
            .
          </p>
        </div>
        <div className="mt-10 flex flex-wrap gap-5 text-sm font-semibold text-ilm-navy">
          <Link href="/disclaimer" className="border-b border-ilm-gold pb-1">
            Disclaimer
          </Link>
          <Link href="/terms" className="border-b border-ilm-gold pb-1">
            Terms &amp; Conditions
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
