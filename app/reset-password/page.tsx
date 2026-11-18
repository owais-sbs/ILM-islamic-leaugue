'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Brand, GeometricOrnament } from '@/components/public/brand';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }

    setBusy(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; message?: string; warning?: string };

      if (!res.ok || !json.ok) {
        setError(json.error || 'Could not send the reset link. Please try again.');
        return;
      }

      setSent(true);
      setInfo(json.warning || json.message || 'If an account exists for that email, a reset link is on its way.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-ilm-cream">
      <GeometricOrnament className="absolute -right-8 top-16 hidden h-[380px] w-[240px] lg:block" />
      <header className="relative z-10 flex items-center justify-between px-6 py-7 lg:px-12">
        <Brand />
        <Link href="/login" className="text-[12px] font-semibold uppercase tracking-[0.12em] text-ilm-navy/50 hover:text-ilm-navy">
          ← Back to sign in
        </Link>
      </header>
      <div className="relative z-10 mx-auto max-w-md px-5 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[28px] border border-ilm-navy/8 bg-white p-8 shadow-[0_24px_70px_rgba(11,17,82,0.08)]"
        >
          <span className="mx-auto block h-px w-12 bg-ilm-gold" />
          <h1 className="mt-5 text-center text-2xl font-semibold text-ilm-navy">Reset password</h1>
          <p className="mt-2 text-center text-sm text-ilm-navy/50">
            Enter your email and we&apos;ll send a link to create a new password.
          </p>
          {sent ? (
            <div className="mt-8 space-y-4">
              <p className="rounded-2xl bg-ilm-cream px-4 py-5 text-center text-sm text-ilm-navy">
                {info || `If an account exists for ${email}, a reset link is on its way. Check your inbox and spam folder.`}
              </p>
              <Link
                href="/login"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-ilm-navy/15 py-3 text-[12px] font-bold uppercase tracking-[0.1em] text-ilm-navy"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <form className="mt-8 space-y-4" onSubmit={(e) => void submit(e)}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-ilm-navy/10 bg-ilm-cream px-4 py-3 text-sm outline-none focus:border-ilm-gold"
              />
              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>
              )}
              <button
                type="submit"
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-ilm-navy py-3.5 text-[13px] font-bold uppercase tracking-[0.1em] text-white disabled:opacity-60"
              >
                {busy ? 'Sending…' : 'Send reset link'} <ArrowRight size={16} />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </main>
  );
}
