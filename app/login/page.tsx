'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
<<<<<<< HEAD
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Loader2 } from 'lucide-react';
=======
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
>>>>>>> 03a3145bf8aa2b0217bde3a2111ce6e5470555b0
import { SiteLogo } from '@/components/Logo';
import { createClient } from '@/lib/supabase/client';

<<<<<<< HEAD
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/admin';

  const [email, setEmail] = useState('adminops@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="email" className="mb-2 block text-xs font-semibold text-ilm-navy">
          Email address
        </label>
        <div className="relative">
          <Mail size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-ilm-navy focus:ring-2 focus:ring-ilm-navy/15"
          />
        </div>
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="password" className="block text-xs font-semibold text-ilm-navy">
            Password
          </label>
          <Link href="/reset-password" className="text-xs font-medium text-ilm-navy hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <LockKeyhole size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-11 text-sm outline-none transition focus:border-ilm-navy focus:ring-2 focus:ring-ilm-navy/15"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ilm-navy"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-ilm-navy text-sm font-semibold text-white transition hover:bg-ilm-navy-light disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Signing in…
          </>
        ) : (
          <>
            Sign in <ArrowRight size={16} />
          </>
        )}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-[#F4F7FB] lg:grid-cols-[.85fr_1.15fr]">
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#0B1248] via-[#0F1657] to-[#1a2380] p-10 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full border border-sky-300/20" />
        <div className="absolute -bottom-32 -left-20 h-[420px] w-[420px] rounded-full border border-white/10" />
        <Link href="/" className="relative">
          <SiteLogo size="sm" onDark className="brightness-110" />
        </Link>
        <div className="relative max-w-md">
          <span className="mb-6 block h-px w-16 bg-sky-300/60" />
          <h1 className="font-display text-5xl leading-tight text-white">
            A considered space for the work of becoming.
          </h1>
          <p className="mt-6 max-w-sm text-sm leading-7 text-sky-100/70">
            Welcome back to the ILM editorial workspace. Write with care. Publish with purpose.
          </p>
        </div>
        <p className="relative text-[10px] uppercase tracking-[.2em] text-sky-200/40">
=======
export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/admin');
    }, 800);
  }

  const inputCls =
    'h-12 w-full rounded-xl border border-slate-200 bg-white text-[14px] text-slate-800 ' +
    'placeholder:text-slate-400 outline-none transition ' +
    'focus:border-ilm-gold focus:ring-2 focus:ring-ilm-gold/15';

  return (
    <main className="grid min-h-screen lg:grid-cols-[1fr_1.15fr]">

      {/* ── Left: brand panel ───────────────────────── */}
      <section className="relative hidden overflow-hidden bg-ilm-navy lg:flex lg:flex-col lg:justify-between p-12">
        {/* Very subtle geometric texture — no circles */}
        <div className="pattern-geo-gold pointer-events-none absolute inset-0 opacity-80" aria-hidden />

        {/* Logo — golden, large */}
        <Link href="/" className="relative z-10">
          <img
            src="/ILM_Final_Logo_Design.png"
            alt="Islamic League of Murabbiyūn"
            className="h-24 w-auto object-contain object-left"
            style={{ filter: 'brightness(0) saturate(100%) invert(74%) sepia(45%) saturate(600%) hue-rotate(5deg) brightness(95%)' }}
          />
        </Link>

        {/* Headline */}
        <div className="relative z-10 max-w-sm">
          <div className="mb-5 h-px w-10 bg-ilm-gold" />
          <h1 className="font-display text-[2.6rem] leading-[1.12] text-white">
            A considered space for the{' '}
            <em className="not-italic text-ilm-gold">work of becoming.</em>
          </h1>
          <p className="mt-5 text-[14px] leading-7 text-white/90">
            Welcome back to the ILM editorial workspace. Write with care. Publish with purpose.
          </p>
        </div>

        <p className="relative z-10 text-[9px] uppercase tracking-[.24em] text-white/50">
>>>>>>> 03a3145bf8aa2b0217bde3a2111ce6e5470555b0
          Mentors · Educators · Cultivators
        </p>
      </section>

<<<<<<< HEAD
      <section className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <Link href="/">
              <SiteLogo size="sm" />
            </Link>
          </div>
          <div className="mb-8">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[.25em] text-ilm-navy">
              Editorial workspace
            </p>
            <h2 className="font-display text-4xl font-semibold text-ilm-navy">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">Sign in to continue to your workspace.</p>
          </div>

          <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-slate-100" />}>
            <LoginForm />
          </Suspense>

          <p className="mt-8 text-center text-xs text-slate-400">
            Need an invitation?{' '}
            <Link href="/contact" className="font-medium text-ilm-navy hover:underline">
=======
      {/* ── Right: form panel ───────────────────────── */}
      <section className="flex flex-col items-center justify-center bg-[#F9F8F5] px-6 py-14 sm:px-12">
        <div className="w-full max-w-[380px]">

          {/* Mobile logo */}
          <div className="mb-10 flex justify-center lg:hidden">
            <Link href="/"><SiteLogo size="header" /></Link>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-px w-5 bg-ilm-gold" />
              <p className="text-[9px] font-semibold uppercase tracking-[.28em] text-ilm-gold">
                Editorial workspace
              </p>
            </div>
            <h2 className="font-display text-[2.1rem] leading-tight text-ilm-navy">
              Welcome back
            </h2>
            <p className="mt-2 text-[13.5px] text-slate-500">
              Sign in to continue to your workspace.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-7 shadow-[0_4px_28px_rgba(15,22,87,0.08)]">
            {error && (
              <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-[12.5px] text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[11px] font-semibold uppercase tracking-[.14em] text-ilm-navy/70"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={`${inputCls} pl-10`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-[11px] font-semibold uppercase tracking-[.14em] text-ilm-navy/70"
                  >
                    Password
                  </label>
                  <Link
                    href="/reset-password"
                    className="text-[11px] font-medium text-ilm-gold transition hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <LockKeyhole
                    size={15}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className={`${inputCls} pl-10 pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-ilm-navy"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-ilm-gold text-[11px] font-semibold uppercase tracking-[.16em] text-white transition hover:bg-ilm-gold-dark disabled:opacity-60"
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>Sign in <ArrowRight size={14} /></>
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-[12px] text-slate-400">
            Need access?{' '}
            <Link href="/contact" className="font-medium text-ilm-gold transition hover:underline">
>>>>>>> 03a3145bf8aa2b0217bde3a2111ce6e5470555b0
              Contact the ILM team
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
