'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Loader2 } from 'lucide-react';
import { SiteLogo } from '@/components/Logo';
import { createClient } from '@/lib/supabase/client';
import { AdminRole, ALL_ROLES, ROLE_LABELS, setTempRole } from '@/lib/roles';

// ---------------------------------------------------------------------------
// Role selector
// ---------------------------------------------------------------------------

interface RoleSelectorProps {
  selected: AdminRole;
  onChange: (role: AdminRole) => void;
}

function RoleSelector({ selected, onChange }: RoleSelectorProps) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-ilm-navy" id="role-selector-label">
        Sign in as
      </p>
      <div
        role="radiogroup"
        aria-labelledby="role-selector-label"
        className="flex w-full rounded-xl border border-slate-200 bg-white p-1 gap-1"
      >
        {ALL_ROLES.map((role) => {
          const isSelected = selected === role;
          return (
            <button
              key={role}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(role)}
              className={[
                'flex-1 rounded-lg px-2 py-2.5 text-xs font-semibold leading-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ilm-navy/40',
                isSelected
                  ? 'bg-ilm-navy text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-ilm-navy',
              ].join(' ')}
            >
              {ROLE_LABELS[role]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Login form
// ---------------------------------------------------------------------------

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/admin';

  const [email, setEmail] = useState('adminops@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Default to AUTHOR so a role is always selected before the user touches it.
  const [selectedRole, setSelectedRole] = useState<AdminRole>(AdminRole.AUTHOR);

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
      // Persist temporary role for the next development step.
      // This does NOT modify Supabase Auth, the profiles table, or any RLS policy.
      setTempRole(selectedRole);
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

      {/* Role selector — ABOVE the email/password fields */}
      <RoleSelector selected={selectedRole} onChange={setSelectedRole} />

      {/* Email */}
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

      {/* Password */}
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

      {/* Role selector — temporary testing toggle, Step 1 only — moved above */}

      {/* Submit */}
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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

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
          Mentors · Educators · Cultivators
        </p>
      </section>

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
              Contact the ILM team
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
