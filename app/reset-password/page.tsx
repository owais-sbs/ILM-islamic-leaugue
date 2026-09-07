'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Mail, Loader2 } from 'lucide-react';
import { SiteLogo } from '@/components/Logo';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    setLoading(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setSent(true);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F4F7FB] px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-12 flex justify-center">
          <Link href="/">
            <SiteLogo size="sm" />
          </Link>
        </div>
        <div className="rounded-2xl border border-ilm-navy/10 bg-white p-7 shadow-[0_20px_60px_rgba(15,22,87,.08)] sm:p-9">
          {sent ? (
            <div className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 text-ilm-navy">
                <CheckCircle2 size={27} />
              </span>
              <h1 className="mt-5 font-display text-3xl font-semibold text-ilm-navy">Check your inbox</h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                If an account exists for that email address, you&apos;ll receive a password reset link shortly.
              </p>
              <Link
                href="/login"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-ilm-navy hover:underline"
              >
                <ArrowLeft size={15} /> Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="mb-7 inline-flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-ilm-navy"
              >
                <ArrowLeft size={14} /> Back to sign in
              </Link>
              <h1 className="font-display text-3xl font-semibold text-ilm-navy">Reset your password</h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Enter the email address associated with your account and we&apos;ll send you a secure reset link.
              </p>
              <form onSubmit={handleSubmit} className="mt-7">
                {error && (
                  <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </div>
                )}
                <label htmlFor="reset-email" className="mb-2 block text-xs font-semibold text-ilm-navy">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-ilm-navy focus:ring-2 focus:ring-ilm-navy/15"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-ilm-navy text-sm font-semibold text-white transition hover:bg-ilm-navy-light disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      Send reset link <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
        <p className="mt-7 text-center text-[10px] uppercase tracking-[.2em] text-slate-400">
          Mentors · Educators · Cultivators
        </p>
      </div>
    </main>
  );
}
