'use client';

import { useEffect, useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { PageHero, ModernCard } from '@/components/PageHero';
import { createClient } from '@/lib/supabase/client';
import type { CategoryRow } from '@/lib/supabase/types';

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
                  </div>
                </div>
                <div>
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
                </div>
                <div>
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
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
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
