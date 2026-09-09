'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle, Loader2, Mail, Send, ShieldCheck } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { PageHero, ModernCard, SectionLabel } from '@/components/PageHero';
import { createClient } from '@/lib/supabase/client';

const labelCls = 'mb-1.5 block text-[11px] font-semibold uppercase tracking-[.14em] text-ilm-navy/70';

export default function ContactPage() {
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error: insertError } = await supabase.from('questions').insert({
      name:    name.trim(),
      email:   email.trim(),
      subject: `Contact: ${name.trim()}`,
      body:    message.trim(),
      status:  'new',
    });
    setLoading(false);
    if (insertError) { setError(insertError.message); return; }
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

      {/* ── Contact form section ─────────────────── */}
      <section className="px-6 py-12 md:px-12 md:py-14">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
          {/* Info card */}
          <ModernCard>
            <Mail size={24} className="text-ilm-gold" aria-hidden />
            <h2 className="mt-4 font-display text-2xl text-ilm-navy">Write to us</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              For editorial enquiries, partnership requests, or to request a contributor invitation,
              use the form or email us directly.
            </p>
            <a
              href="mailto:hello@ilm.org"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ilm-navy transition hover:text-ilm-gold"
            >
              <Mail size={15} /> hello@ilm.org
            </a>
          </ModernCard>

          {/* Form card */}
          <ModernCard>
            {sent ? (
              <div className="py-8 text-center">
                <CheckCircle size={36} className="mx-auto text-ilm-gold" strokeWidth={1.5} />
                <p className="mt-4 font-display text-xl text-ilm-navy">Message sent</p>
                <p className="mt-2 text-sm text-slate-500">We will be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    <AlertCircle size={15} className="mt-0.5 shrink-0" />
                    {error}
                  </div>
                )}
                <div>
                  <label htmlFor="contact-name" className={labelCls}>Your name</label>
                  <input id="contact-name" required value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ahmed Hassan" className="ilm-input" />
                </div>
                <div>
                  <label htmlFor="contact-email" className={labelCls}>Email address</label>
                  <input id="contact-email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" className="ilm-input" />
                </div>
                <div>
                  <label htmlFor="contact-message" className={labelCls}>Message</label>
                  <textarea id="contact-message" required rows={5} value={message} onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help?" className="ilm-textarea" />
                </div>
                <button type="submit" disabled={loading}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-ilm-gold text-[11px] font-semibold uppercase tracking-[.14em] text-white transition hover:bg-ilm-gold-dark disabled:opacity-60">
                  {loading ? <><Loader2 size={15} className="animate-spin" /> Sending…</> : <><Send size={15} /> Send message</>}
                </button>
              </form>
            )}
          </ModernCard>
        </div>
      </section>

      {/* ── Authorship & Ikhtilāf Disclaimer ────── */}
      <section className="border-t border-slate-100 bg-[#F9F8F5] px-6 py-12 md:px-12 md:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ilm-navy text-ilm-gold">
              <ShieldCheck size={20} strokeWidth={1.5} />
            </span>
            <div>
              <SectionLabel className="mb-0">Editorial disclaimer</SectionLabel>
              <h2 className="font-display text-[1.5rem] text-ilm-navy">
                Authorship &amp; Ikhtilāf
              </h2>
            </div>
          </div>

          <div className="space-y-6 rounded-2xl border border-slate-100 bg-white p-7 shadow-[0_2px_20px_rgba(15,22,87,0.05)] md:p-9">

            {/* Authorship */}
            <div>
              <h3 className="font-display text-[1.1rem] text-ilm-navy">Attribution of authorship</h3>
              <div className="mt-3 h-px w-8 bg-ilm-gold/50" />
              <p className="mt-3 text-[14px] leading-7 text-slate-600">
                Every article published on ILM is attributed to a named contributor. Contributors
                are vetted scholars, researchers, or educators who write under their own
                professional identity. Anonymous or pseudonymous contributions are not accepted.
              </p>
              <p className="mt-3 text-[14px] leading-7 text-slate-600">
                The views expressed in each article are the personal scholarly opinion of the named
                author and do not necessarily represent the institutional position of the Islamic
                League of Murabbiyūn, its editorial board, or any other contributor.
              </p>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Ikhtilāf */}
            <div>
              <h3 className="font-display text-[1.1rem] text-ilm-navy">
                Ikhtilāf — scholarly disagreement
              </h3>
              <div className="mt-3 h-px w-8 bg-ilm-gold/50" />
              <p className="mt-3 text-[14px] leading-7 text-slate-600">
                <em>Ikhtilāf</em> (اختلاف) — the tradition of principled scholarly disagreement —
                is a recognised and respected feature of Islamic intellectual life. Where legitimate
                difference of opinion exists among qualified scholars, ILM presents these positions
                fairly without imposing a single view.
              </p>
              <p className="mt-3 text-[14px] leading-7 text-slate-600">
                Contributors are required to disclose their school of thought (madhhab) and
                methodological framework where relevant. Articles that present a minority or
                contested opinion are clearly marked. Readers are encouraged to consult qualified
                local scholars for personal religious guidance.
              </p>
            </div>

            <div className="h-px bg-slate-100" />

            {/* No fatwa */}
            <div>
              <h3 className="font-display text-[1.1rem] text-ilm-navy">No fatwa service</h3>
              <div className="mt-3 h-px w-8 bg-ilm-gold/50" />
              <p className="mt-3 text-[14px] leading-7 text-slate-600">
                ILM is an educational publication. Nothing published on this platform constitutes
                a formal religious ruling (fatwā) unless it is explicitly stated as such and
                attributed to a qualified issuing authority. For matters requiring a personal
                ruling, please consult a recognised scholar in your local community.
              </p>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Corrections */}
            <div>
              <h3 className="font-display text-[1.1rem] text-ilm-navy">Corrections</h3>
              <div className="mt-3 h-px w-8 bg-ilm-gold/50" />
              <p className="mt-3 text-[14px] leading-7 text-slate-600">
                Factual errors are corrected promptly. Corrections are noted transparently within
                the article. We do not silently rewrite published content. To report an inaccuracy,
                contact{' '}
                <a href="mailto:hello@ilm.org" className="font-medium text-ilm-navy transition hover:text-ilm-gold">
                  hello@ilm.org
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
