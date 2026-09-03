'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { SiteLogo } from '@/components/Logo';

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
          Mentors · Educators · Cultivators
        </p>
      </section>

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
              Contact the ILM team
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
