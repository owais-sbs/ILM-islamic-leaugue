'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { PageHero, ModernCard } from '@/components/PageHero';
import { categories } from '@/lib/data';

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
      <section className="px-6 pb-20 md:px-12">
        <div className="mx-auto max-w-2xl">
          {submitted ? (
            <ModernCard className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ilm-cream text-ilm-gold">
                <Send size={22} />
              </span>
              <h2 className="mt-5 font-display text-2xl text-ilm-navy">Thank you</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Your question has been received. If it is selected for a response, you will hear from us by email.
              </p>
            </ModernCard>
          ) : (
            <ModernCard>
              <form
                onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                className="space-y-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-xs font-semibold text-ilm-navy">Your name</label>
                    <input id="name" required className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-ilm-gold focus:ring-2 focus:ring-ilm-gold/15" />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-xs font-semibold text-ilm-navy">Email</label>
                    <input id="email" type="email" required className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-ilm-gold focus:ring-2 focus:ring-ilm-gold/15" />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="mb-2 block text-xs font-semibold text-ilm-navy">Subject</label>
                  <input id="subject" required className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-ilm-gold focus:ring-2 focus:ring-ilm-gold/15" />
                </div>
                <div>
                  <label htmlFor="category" className="mb-2 block text-xs font-semibold text-ilm-navy">Category</label>
                  <select id="category" className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-ilm-gold">
                    {categories.map((c) => (
                      <option key={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="body" className="mb-2 block text-xs font-semibold text-ilm-navy">Your question</label>
                  <textarea id="body" required rows={6} className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-ilm-gold focus:ring-2 focus:ring-ilm-gold/15" placeholder="Share as much context as helps…" />
                </div>
                <button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-ilm-gold text-sm font-semibold text-white transition hover:bg-ilm-gold-dark">
                  Submit question <Send size={16} />
                </button>
              </form>
            </ModernCard>
          )}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
