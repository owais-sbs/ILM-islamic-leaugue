'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { useIlm } from '@/lib/ilm-store';
import { publicSwal } from '@/lib/public-swal';
import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';

export default function ContactPage() {
  const { addQuestion } = useIlm();
  const [busy, setBusy] = useState(false);

  return (
    <main className="min-h-screen pt-24 sm:pt-28">
      <SiteHeader active="connect" />
      <section className="mx-auto max-w-xl px-4 pb-14 pt-4 sm:px-6 sm:pb-20 sm:pt-10">
        <p className="text-[11px] uppercase tracking-[0.18em] text-ilm-gold-deep">Contact</p>
        <h1 className="mt-3 text-4xl font-semibold text-ilm-navy">Write to ILM</h1>
        <p className="mt-4 leading-relaxed text-ilm-navy/60">
          For general correspondence: <strong className="font-medium text-ilm-navy">salam@ilm.org</strong>
        </p>
        <p className="mt-2 text-sm text-ilm-navy/50">
          Questions about sacred knowledge belong on the Ask a Question page so they can be assigned to a murabbi.
        </p>

        <form
          className="mt-8 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            const data = new FormData(e.currentTarget);
            const payload = {
              asker: String(data.get('name') || 'Visitor'),
              email: String(data.get('email') || ''),
              subject: String(data.get('subject') || 'Contact from ILM site'),
              question: String(data.get('message') || ''),
              category: 'Contact',
              source: 'contact' as const,
            };
            try {
              addQuestion(payload);
              e.currentTarget.reset();
              await publicSwal.sent(
                'Message sent successfully',
                'Your contact form was delivered to the ILM admin team. Please wait for a thoughtful reply by email.',
              );
            } catch {
              await publicSwal.error('Could not send', 'Please try again in a moment.');
            } finally {
              setBusy(false);
            }
          }}
        >
          <input
            name="name"
            required
            placeholder="Your name"
            className="w-full rounded-2xl border border-ilm-navy/10 bg-white px-4 py-3 text-sm outline-none focus:border-ilm-gold"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="w-full rounded-2xl border border-ilm-navy/10 bg-white px-4 py-3 text-sm outline-none focus:border-ilm-gold"
          />
          <input
            name="subject"
            placeholder="Subject"
            className="w-full rounded-2xl border border-ilm-navy/10 bg-white px-4 py-3 text-sm outline-none focus:border-ilm-gold"
          />
          <textarea
            name="message"
            required
            rows={5}
            placeholder="Message"
            className="w-full resize-none rounded-2xl border border-ilm-navy/10 bg-white px-4 py-3 text-sm outline-none focus:border-ilm-gold"
          />
          <button
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full bg-ilm-navy px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {busy ? 'Sending…' : 'Send message'} <Send size={14} />
          </button>
        </form>
      </section>
      <SiteFooter />
    </main>
  );
}
