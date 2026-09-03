'use client';

import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { PageHero } from '@/components/PageHero';
import { categories } from '@/lib/data';

const inputCls = 'ilm-input';
const labelCls = 'mb-1.5 block text-[11px] font-semibold uppercase tracking-[.14em] text-ilm-navy/70';

export default function AskPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="bg-white">
      <SiteHeader />
      <PageHero
        eyebrow="Ask a question"
        title="Carrying a question?"
        description="Bring it to the conversation. Our Murabbiyūn review questions with care and respond when they can offer something genuinely useful."
      />

      <section className="px-6 pb-20 pt-10 md:px-12 md:pt-12">
        <div className="mx-auto max-w-xl">
          {submitted ? (
            <div className="rounded-2xl border border-slate-100 bg-[#F9F8F5] px-8 py-14 text-center shadow-sm">
              <CheckCircle size={40} className="mx-auto text-ilm-gold" strokeWidth={1.5} />
              <h2 className="mt-5 font-display text-2xl text-ilm-navy">Thank you</h2>
              <p className="mt-3 text-[14px] leading-7 text-slate-500">
                Your question has been received. If it is selected for a response, you will hear from us by email.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 text-[11px] font-semibold uppercase tracking-[.14em] text-ilm-gold underline"
              >
                Ask another question
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-100 bg-white p-7 shadow-[0_2px_24px_rgba(15,22,87,0.06)] md:p-9">
              <form
                onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                className="space-y-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={labelCls}>Your name</label>
                    <input id="name" required className={inputCls} placeholder="e.g. Ahmed Hassan" />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelCls}>Email address</label>
                    <input id="email" type="email" required className={inputCls} placeholder="you@example.com" />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className={labelCls}>Subject</label>
                  <input id="subject" required className={inputCls} placeholder="Brief subject line" />
                </div>

                <div>
                  <label htmlFor="category" className={labelCls}>Category</label>
                  <select id="category" className={`${inputCls} cursor-pointer bg-white`}>
                    {categories.map((c) => (
                      <option key={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="body" className={labelCls}>Your question</label>
                  <textarea
                    id="body"
                    required
                    rows={7}
                    className="ilm-textarea"
                    placeholder="Share as much context as helps. The more detail you provide, the better we can respond…"
                  />
                </div>

                <button
                  type="submit"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-ilm-gold text-[11px] font-semibold uppercase tracking-[.14em] text-white transition hover:bg-ilm-gold-dark"
                >
                  Submit question <Send size={14} />
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
