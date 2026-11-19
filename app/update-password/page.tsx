'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Brand } from '@/components/public/brand';
import { tryCreateClient } from '@/lib/supabase/client';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const verifyStarted = useRef(false);

  useEffect(() => {
    const cancelled = false;

    const establishRecoverySession = async () => {
      const supabase = tryCreateClient();
      if (!supabase) {
        if (!cancelled) {
          setError('Authentication is not configured.');
          setChecking(false);
        }
        return;
      }

      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const tokenHash = url.searchParams.get('token_hash');
        const type = url.searchParams.get('type');

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        } else if (tokenHash && (type === 'recovery' || type === 'magiclink')) {
          const { error: otpError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type === 'magiclink' ? 'magiclink' : 'recovery',
          });
          if (otpError) throw otpError;
        } else if (url.hash.includes('access_token')) {
          // Implicit flow: createBrowserClient / GoTrueClient parses the hash on init
          await new Promise((r) => setTimeout(r, 250));
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (cancelled) return;

        if (!session) {
          setError('This reset link is invalid or has expired. Request a new one from the sign-in page.');
          setChecking(false);
          return;
        }

        setReady(true);
        setChecking(false);

        // Clean sensitive tokens from the address bar
        window.history.replaceState({}, '', '/update-password');
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not verify the reset link.');
          setChecking(false);
        }
      }
    };

    // The token is single-use: React dev strict mode runs effects twice, so verify only once.
    if (verifyStarted.current) return;
    verifyStarted.current = true;
    void establishRecoverySession();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !confirm) {
      setError('Please fill in both password fields.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setError('Password must include letters and a number.');
      return;
    }

    const supabase = tryCreateClient();
    if (!supabase) {
      setError('Authentication is not configured.');
      return;
    }

    setBusy(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      // Clear first-login must-change flag when present
      try {
        await fetch('/api/account/me', { method: 'POST' });
      } catch {
        /* optional */
      }

      setDone(true);
      setTimeout(() => {
        router.replace('/login');
      }, 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative flex min-h-[100svh] flex-col overflow-hidden bg-gradient-to-br from-ilm-cream via-white to-[#f0e8dc]">
      <header className="relative z-10 flex items-center justify-between px-5 py-4 sm:px-8">
        <Brand />
        <Link href="/login" className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ilm-navy/50 hover:text-ilm-navy">
          ← Sign in
        </Link>
      </header>

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 pb-8">
        <div className="w-full max-w-[420px] rounded-[24px] border border-ilm-navy/8 bg-white/95 p-6 shadow-[0_20px_60px_rgba(11,17,82,0.08)] sm:p-7">
          <span className="mx-auto block h-px w-12 bg-ilm-gold" />
          <h1 className="mt-5 text-center text-xl font-semibold text-ilm-navy sm:text-2xl">Choose a new password</h1>
          <p className="mt-2 text-center text-sm text-ilm-navy/50">
            Create a strong password for your ILM admin account.
          </p>

          {checking && (
            <p className="mt-8 rounded-2xl bg-ilm-cream px-4 py-5 text-center text-sm text-ilm-navy/60">
              Verifying your reset link…
            </p>
          )}

          {!checking && error && !ready && (
            <div className="mt-8 space-y-4">
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>
              <Link
                href="/reset-password"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-ilm-navy py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-white"
              >
                Request a new link <ArrowRight size={15} />
              </Link>
            </div>
          )}

          {done && (
            <p className="mt-8 rounded-2xl bg-green-50 px-4 py-5 text-center text-sm text-green-800">
              Password updated. Redirecting you to sign in…
            </p>
          )}

          {ready && !done && (
            <form className="mt-6 space-y-3.5" onSubmit={(e) => void submit(e)}>
              <div>
                <label className="mb-1 block text-xs text-ilm-navy/60">New password</label>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-ilm-navy/10 bg-ilm-cream px-3.5 py-2.5 pr-10 text-sm outline-none focus:border-ilm-gold"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ilm-navy/35"
                    aria-label="Toggle password visibility"
                  >
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-ilm-navy/60">Confirm password</label>
                <input
                  type={show ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-ilm-navy/10 bg-ilm-cream px-3.5 py-2.5 text-sm outline-none focus:border-ilm-gold"
                />
              </div>
              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>
              )}
              <button
                type="submit"
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-ilm-navy py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-white disabled:opacity-60"
              >
                {busy ? 'Saving…' : 'Save new password'} <ArrowRight size={15} />
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
