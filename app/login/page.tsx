'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { SiteLogo } from '@/components/Logo';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="grid min-h-screen bg-ilm-cream lg:grid-cols-[.85fr_1.15fr]">
      <section className="relative hidden overflow-hidden border-r border-ilm-navy/10 bg-white p-10 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full border border-ilm-gold/20" />
        <div className="absolute -bottom-32 -left-20 h-[420px] w-[420px] rounded-full border border-ilm-navy/10" />
        <Link href="/" className="relative"><SiteLogo size="sm" /></Link>
        <div className="relative max-w-md">
          <span className="gold-rule mb-6 block w-16" />
          <h1 className="font-display text-5xl leading-tight text-ilm-navy">A considered space for the work of becoming.</h1>
          <p className="mt-6 max-w-sm text-sm leading-7 text-slate-600">Welcome back to the ILM editorial workspace. Write with care. Publish with purpose.</p>
        </div>
        <p className="relative text-[10px] uppercase tracking-[.2em] text-slate-400">Mentors · Educators · Cultivators</p>
      </section>

      <section className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <Link href="/"><SiteLogo size="sm" /></Link>
          </div>
          <div className="mb-8">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[.25em] text-ilm-gold">Editorial workspace</p>
            <h2 className="font-display text-4xl font-semibold text-ilm-navy">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">Sign in to continue to your workspace.</p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-ilm-gold/30 bg-ilm-cream p-5 text-sm leading-6 text-ilm-navy">That demo sign-in was accepted. Backend access can be connected later.</div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-xs font-semibold text-ilm-navy">Email address</label>
                <div className="relative">
                  <Mail size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input id="email" type="email" required placeholder="you@example.com" className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-ilm-gold focus:ring-2 focus:ring-ilm-gold/15" />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="block text-xs font-semibold text-ilm-navy">Password</label>
                  <Link href="/reset-password" className="text-xs font-medium text-ilm-gold hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <LockKeyhole size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input id="password" type={showPassword ? 'text' : 'password'} required placeholder="Enter your password" className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-11 text-sm outline-none transition focus:border-ilm-gold focus:ring-2 focus:ring-ilm-gold/15" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ilm-navy" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-ilm-gold text-sm font-semibold text-white transition hover:bg-ilm-gold-dark">
                Sign in <ArrowRight size={16} />
              </button>
            </form>
          )}
          <p className="mt-8 text-center text-xs text-slate-400">
            Need an invitation? <Link href="/contact" className="font-medium text-ilm-gold hover:underline">Contact the ILM team</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
