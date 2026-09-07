'use client';

<<<<<<< HEAD
import { useEffect, useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { PageHero, ModernCard } from '@/components/PageHero';
import { createClient } from '@/lib/supabase/client';
import type { CategoryRow } from '@/lib/supabase/types';
=======
import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { PageHero } from '@/components/PageHero';
import { categories } from '@/lib/data';
>>>>>>> 03a3145bf8aa2b0217bde3a2111ce6e5470555b0

const inputCls = 'ilm-input';
const labelCls = 'mb-1.5 block text-[11px] font-semibold uppercase tracking-[.14em] text-ilm-navy/70';

export default function AskPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('categories').select('*').order('display_order');
      const rows = (data as CategoryRow[]) || [];
      setCategories(rows);
      if (rows[0]) setCategoryId(rows[0].id);
    };
    void load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error: insertError } = await supabase.from('questions').insert({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      body: body.trim(),
      category_id: categoryId || null,
      status: 'new',
    });
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setSubmitted(true);
  };

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
<<<<<<< HEAD
            <ModernCard>
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </div>
                )}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-xs font-semibold text-ilm-navy">
                      Your name
                    </label>
                    <input
                      id="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-ilm-gold focus:ring-2 focus:ring-ilm-gold/15"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-xs font-semibold text-ilm-navy">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-ilm-gold focus:ring-2 focus:ring-ilm-gold/15"
                    />
=======
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
>>>>>>> 03a3145bf8aa2b0217bde3a2111ce6e5470555b0
                  </div>
                </div>

                <div>
<<<<<<< HEAD
                  <label htmlFor="subject" className="mb-2 block text-xs font-semibold text-ilm-navy">
                    Subject
                  </label>
                  <input
                    id="subject"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-ilm-gold focus:ring-2 focus:ring-ilm-gold/15"
                  />
=======
                  <label htmlFor="subject" className={labelCls}>Subject</label>
                  <input id="subject" required className={inputCls} placeholder="Brief subject line" />
>>>>>>> 03a3145bf8aa2b0217bde3a2111ce6e5470555b0
                </div>

                <div>
<<<<<<< HEAD
                  <label htmlFor="category" className="mb-2 block text-xs font-semibold text-ilm-navy">
                    Category
                  </label>
                  <select
                    id="category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-ilm-gold"
                  >
                    {categories.length === 0 && <option value="">Loading…</option>}
=======
                  <label htmlFor="category" className={labelCls}>Category</label>
                  <select id="category" className={`${inputCls} cursor-pointer bg-white`}>
>>>>>>> 03a3145bf8aa2b0217bde3a2111ce6e5470555b0
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
<<<<<<< HEAD
                  <label htmlFor="body" className="mb-2 block text-xs font-semibold text-ilm-navy">
                    Your question
                  </label>
                  <textarea
                    id="body"
                    required
                    rows={6}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-ilm-gold focus:ring-2 focus:ring-ilm-gold/15"
                    placeholder="Share as much context as helps…"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-ilm-gold text-sm font-semibold text-white transition hover:bg-ilm-gold-dark disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      Submit question <Send size={16} />
                    </>
                  )}
=======
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
>>>>>>> 03a3145bf8aa2b0217bde3a2111ce6e5470555b0
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
