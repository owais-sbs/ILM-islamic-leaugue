'use client';

import { useState } from 'react';
import { Loader2, Mail, Send } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { PageHero, ModernCard } from '@/components/PageHero';
import { createClient } from '@/lib/supabase/client';

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
    // Stored in questions inbox so admin can see contact messages too
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
      <section className="px-6 pb-20 md:px-12">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
          <ModernCard>
            <Mail size={24} className="text-ilm-gold" />
            <h2 className="mt-4 font-display text-2xl text-ilm-navy">Write to us</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              For editorial enquiries, partnership requests, or to request a contributor invitation, use the form
              or email hello@ilm.org.
            </p>
            <p className="mt-6 text-sm font-medium text-ilm-navy">hello@ilm.org</p>
          </ModernCard>
          <ModernCard>
            {sent ? (
              <p className="py-8 text-center text-slate-600">Message sent. We will be in touch soon.</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </div>
                )}
                <input
                  required
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-ilm-gold"
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-ilm-gold"
                />
                <textarea
                  required
                  rows={5}
                  placeholder="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-ilm-gold"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-ilm-gold text-sm font-semibold text-white hover:bg-ilm-gold-dark disabled:opacity-60"
                >
                  {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                  Send
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
