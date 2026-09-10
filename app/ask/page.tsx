'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { categories } from '@/lib/admin-data';
import { useIlm } from '@/lib/ilm-store';
import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';

export default function AskPage() {
  const { addQuestion } = useIlm();
  const [sent, setSent] = useState(false);

  return (
    <main className="min-h-screen pt-28">
      <SiteHeader active="connect" />
      <section className="mx-auto max-w-xl px-6 py-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ilm-gold-deep">Ask with adab</p>
        <h1 className="mt-3 text-4xl font-semibold text-ilm-navy">Ask a question</h1>
        <p className="mt-3 text-sm leading-relaxed text-ilm-navy/55">
          Your question is stored for editors and administrators. Visitors cannot read the question inbox.
        </p>
        {sent ? (
          <p className="mt-8 rounded-2xl bg-ilm-cream px-5 py-6 text-ilm-navy">Received. A murabbi will sit with it.</p>
        ) : (
          <form
            className="mt-8 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              addQuestion({
                asker: String(data.get('name') || 'Anonymous'),
                email: String(data.get('email') || ''),
                subject: String(data.get('subject') || ''),
                category: String(data.get('category') || ''),
                question: String(data.get('question') || ''),
              });
              setSent(true);
            }}
          >
            <input name="name" placeholder="Name" className="w-full rounded-2xl border border-ilm-navy/10 bg-white px-4 py-3 text-sm outline-none focus:border-ilm-gold" />
            <input name="email" type="email" placeholder="Email" className="w-full rounded-2xl border border-ilm-navy/10 bg-white px-4 py-3 text-sm outline-none focus:border-ilm-gold" />
            <input name="subject" placeholder="Subject" className="w-full rounded-2xl border border-ilm-navy/10 bg-white px-4 py-3 text-sm outline-none focus:border-ilm-gold" />
            <select name="category" className="w-full rounded-2xl border border-ilm-navy/10 bg-white px-4 py-3 text-sm outline-none">
              {categories.map((c) => (
                <option key={c.id}>{c.name}</option>
              ))}
            </select>
            <textarea name="question" required rows={6} placeholder="Your question…" className="w-full resize-none rounded-2xl border border-ilm-navy/10 bg-white px-4 py-3 text-sm outline-none focus:border-ilm-gold" />
            <button className="inline-flex items-center gap-2 rounded-full bg-ilm-navy px-5 py-3 text-sm font-semibold text-white">
              Send question <Send size={14} />
            </button>
          </form>
        )}
      </section>
      <SiteFooter />
    </main>
  );
}
