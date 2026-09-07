'use client';

import { useState } from 'react';
import { CheckCircle, Loader2, Mail, Send } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { PageHero, ModernCard } from '@/components/PageHero';
import { createClient } from '@/lib/supabase/client';

const labelCls = 'mb-1.5 block text-[11px] font-semibold uppercase tracking-[.14em] text-ilm-navy/70';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error: insertError } = await supabase.from('questions').insert({
      name: name.trim(),
      email: email.trim(),
      subject: `Contact: ${name.trim()}`,
      body: message.trim(),
      status: 'new',
    });
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setSent(true);
  };

  return (
    <main className="bg-white">
      <SiteHeader />
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        description="Questions about ILM, contributor invitations, or general enquiries — we read every message."
      />
      <section className="ilm-section">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
          <ModernCard>
            <Mail size={24} className="text-ilm-gold" aria-hidden />
            <h2 className="mt-4 font-display text-2xl text-ilm-navy">Write to us</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              For editorial enquiries, partnership requests, or to request a contributor invitation, use the form
              or email hello@ilm.org.
            </p>
            <a href="mailto:hello@ilm.org" className="mt-6 inline-block text-sm font-medium text-ilm-navy transition hover:text-ilm-gold">
              hello@ilm.org
            </a>
          </ModernCard>
          <ModernCard>
            {sent ? (
              <div className="py-8 text-center">
                <CheckCircle size={36} className="mx-auto text-ilm-gold" strokeWidth={1.5} aria-hidden />
                <p className="mt-4 font-display text-xl text-ilm-navy">Message sent</p>
                <p className="mt-2 text-sm text-slate-500">We will be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">
                    {error}
                  </div>
                )}
                <div>
                  <label htmlFor="contact-name" className={labelCls}>Your name</label>
                  <input
                    id="contact-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ahmed Hassan"
                    className="ilm-input"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className={labelCls}>Email address</label>
                  <input
                    id="contact-email"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="ilm-input"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className={labelCls}>Message</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help?"
                    className="ilm-textarea"
                  />
                </div>
                <button type="submit" disabled={loading} className="ilm-btn-primary w-full">
                  {loading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      Send message <Send size={15} />
                    </>
                  )}
                </button>
              </form>
            )}
          </ModernCard>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
