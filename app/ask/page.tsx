'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { categories } from '@/lib/admin-data';
import { useIlm } from '@/lib/ilm-store';
import { publicSwal } from '@/lib/public-swal';
import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';

export default function AskPage() {
  const { addQuestion } = useIlm();
  const [busy, setBusy] = useState(false);

  return (
    <main className="min-h-screen pt-28">
      <SiteHeader active="connect" />
      <section className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ilm-gold-deep">Ask with adab</p>
        <h1 className="mt-3 text-4xl font-semibold text-ilm-navy">Ask a question</h1>
        <p className="mt-3 text-sm leading-relaxed text-ilm-navy/55">
          Your question is stored for editors and administrators. Visitors cannot read the question inbox.
        </p>
        <form
          className="mt-8 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            const data = new FormData(e.currentTarget);
            const payload = {
              asker: String(data.get('name') || 'Anonymous'),
              email: String(data.get('email') || ''),
              subject: String(data.get('subject') || 'Question from the site'),
              category: String(data.get('category') || ''),
              question: String(data.get('question') || ''),
              source: 'ask' as const,
            };
            if (!payload.email || !payload.question.trim()) {
              await publicSwal.error('Missing details', 'Please enter your email and question.');
              setBusy(false);
              return;
            }
            try {
              addQuestion(payload);
              e.currentTarget.reset();
              await publicSwal.sent(
                'Question sent successfully',
                'Your question was delivered to the ILM team. Please wait — a murabbi will respond by email.',
              );
            } catch {
              await publicSwal.error('Could not send', 'Please try again in a moment.');
            } finally {
              setBusy(false);
            }
          }}
        >
          <input name="name" placeholder="Name" className="w-full rounded-2xl border border-ilm-navy/10 bg-white px-4 py-3 text-sm outline-none focus:border-ilm-gold" />
          <input name="email" type="email" required placeholder="Email" className="w-full rounded-2xl border border-ilm-navy/10 bg-white px-4 py-3 text-sm outline-none focus:border-ilm-gold" />
          <input name="subject" placeholder="Subject" className="w-full rounded-2xl border border-ilm-navy/10 bg-white px-4 py-3 text-sm outline-none focus:border-ilm-gold" />
          <select name="category" className="w-full rounded-2xl border border-ilm-navy/10 bg-white px-4 py-3 text-sm outline-none">
            {categories.map((c) => (
              <option key={c.id}>{c.name}</option>
            ))}
          </select>
          <textarea name="question" required rows={6} placeholder="Your question…" className="w-full resize-none rounded-2xl border border-ilm-navy/10 bg-white px-4 py-3 text-sm outline-none focus:border-ilm-gold" />
          <button disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-ilm-navy px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
            {busy ? 'Sending…' : 'Send question'} <Send size={14} />
          </button>
        </form>
      </section>
      <SiteFooter />
    </main>
  );
}
