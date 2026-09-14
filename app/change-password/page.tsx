'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Brand } from '@/components/public/brand';
import { tryCreateClient } from '@/lib/supabase/client';
import { readAdminRole, writeAdminRole } from '@/lib/admin-session';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (!/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setError('New password must include letters and a number.');
      return;
    }
    if (newPassword === currentPassword) {
      setError('New password must be different from the current password.');
      return;
    }

    const supabase = tryCreateClient();
    if (!supabase) {
      setError('Authentication is not configured.');
      return;
    }

    setBusy(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.email) {
        setError('Please sign in first.');
        setBusy(false);
        return;
      }

      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (verifyError) {
        setError('Current password is incorrect.');
        setBusy(false);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) {
        setError(updateError.message);
        setBusy(false);
        return;
      }

      const flagRes = await fetch('/api/account/me', { method: 'POST' });
      if (!flagRes.ok) {
        const json = (await flagRes.json().catch(() => ({}))) as { error?: string };
        setError(json.error || 'Password updated, but could not clear must-change flag.');
        setBusy(false);
        return;
      }

      const role = readAdminRole();
      if (role) writeAdminRole(role);
      router.replace('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not change password');
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
          <h1 className="text-center text-xl font-semibold text-ilm-navy sm:text-2xl">Change Password</h1>
          <p className="mt-1.5 text-center text-xs text-ilm-navy/50 sm:text-sm">
            Enter your current password, then choose a new one.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-3.5">
            <div>
              <label className="mb-1 block text-xs text-ilm-navy/60">Current Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-ilm-navy/10 bg-ilm-cream px-3.5 py-2.5 pr-10 text-sm text-ilm-navy outline-none focus:border-ilm-gold"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ilm-navy/35"
                  aria-label="Toggle visibility"
                >
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs text-ilm-navy/60">New Password</label>
              <input
                type={show ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full rounded-xl border border-ilm-navy/10 bg-ilm-cream px-3.5 py-2.5 text-sm text-ilm-navy outline-none focus:border-ilm-gold"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-ilm-navy/60">Confirm New Password</label>
              <input
                type={show ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full rounded-xl border border-ilm-navy/10 bg-ilm-cream px-3.5 py-2.5 text-sm text-ilm-navy outline-none focus:border-ilm-gold"
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
              {busy ? 'Updating…' : 'Change Password'} <ArrowRight size={15} />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
