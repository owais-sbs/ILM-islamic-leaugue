'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, ShieldCheck, PencilLine, UserRound } from 'lucide-react';
import { Brand, GeometricOrnament } from '@/components/public/brand';
import { writeAdminRole } from '@/lib/admin-session';
import type { Role } from '@/lib/admin-data';
import { roleLabels } from '@/lib/admin-data';
import { DEMO_ACCOUNTS } from '@/types/database';
import { tryCreateClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const roles: { key: Role; icon: typeof ShieldCheck; hint: string; demoKey: keyof typeof DEMO_ACCOUNTS }[] = [
  { key: 'author', icon: UserRound, hint: 'Draft & submit', demoKey: 'author' },
  { key: 'editor', icon: PencilLine, hint: 'Review & shape', demoKey: 'editor' },
  { key: 'administrator', icon: ShieldCheck, hint: 'Full publishing', demoKey: 'admin' },
];

function demoForRole(role: Role) {
  if (role === 'administrator') return DEMO_ACCOUNTS.admin;
  if (role === 'editor') return DEMO_ACCOUNTS.editor;
  return DEMO_ACCOUNTS.author;
}

function mapDbRole(role: string | null | undefined): Role | null {
  if (role === 'admin') return 'administrator';
  if (role === 'editor') return 'editor';
  if (role === 'author') return 'author';
  return null;
}

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('administrator');
  const initial = demoForRole('administrator');
  const [email, setEmail] = useState<string>(initial.email);
  const [password, setPassword] = useState<string>(initial.password);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const applyRole = (next: Role) => {
    setRole(next);
    const demo = demoForRole(next);
    setEmail(demo.email);
    setPassword(demo.password);
    setError('');
  };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');

    const supabase = tryCreateClient();
    if (supabase) {
      try {
        const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;

        const uid = data.user?.id;
        let nextRole: Role = role;
        if (uid) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, is_active')
            .eq('id', uid)
            .maybeSingle();
          const mapped = mapDbRole(profile?.role);
          if (profile && !profile.is_active) {
            throw new Error('This account is inactive. Contact an administrator.');
          }
          if (mapped) nextRole = mapped;
        }

        writeAdminRole(nextRole);
        router.push('/admin');
        return;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Sign-in failed';
        // Fall through to local demo if credentials match demo accounts
        const demo = demoForRole(role);
        if (email === demo.email && password === demo.password) {
          writeAdminRole(role);
          router.push('/admin');
          return;
        }
        setError(message);
        setBusy(false);
        return;
      }
    }

    // No Supabase env — local demo portal (also works if Vercel env is incomplete)
    writeAdminRole(role);
    router.push('/admin');
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-ilm-cream">
      <GeometricOrnament className="absolute -right-8 top-16 hidden h-[420px] w-[280px] lg:block" />
      <div className="pointer-events-none absolute -left-40 top-20 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(199,154,61,0.12),transparent_60%)]" />

      <header className="relative z-10 flex items-center justify-between px-6 py-7 lg:px-12">
        <Brand />
        <Link href="/" className="text-[12px] font-semibold uppercase tracking-[0.12em] text-ilm-navy/50 hover:text-ilm-navy">
          ← Back to ILM
        </Link>
      </header>

      <div className="relative z-10 mx-auto flex max-w-md flex-col justify-center px-5 pb-20 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
          className="rounded-[28px] border border-ilm-navy/8 bg-white p-8 shadow-[0_24px_70px_rgba(11,17,82,0.08)]"
        >
          <div className="mb-6 text-center">
            <div className="flex justify-center">
              <Brand compact />
            </div>
            <span className="mx-auto mt-4 block h-px w-12 bg-ilm-gold" />
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ilm-navy">Sign in to ILM Admin</h1>
            <p className="mt-2 text-sm text-ilm-navy/50">
              Choose a role — demo email & password fill automatically for the client walkthrough.
            </p>
          </div>

          <form onSubmit={signIn} className="space-y-5">
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-ilm-navy/40">Workspace</label>
              <div className="grid grid-cols-3 rounded-full bg-ilm-cream p-1">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const active = role === r.key;
                  return (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => applyRole(r.key)}
                      className={cn(
                        'flex flex-col items-center gap-1 rounded-full px-2 py-2.5 text-[11px] font-semibold transition-all',
                        active ? 'bg-ilm-gold text-ilm-navy-deep shadow-sm' : 'text-ilm-navy/50 hover:text-ilm-navy'
                      )}
                    >
                      <Icon size={15} />
                      {roleLabels[r.key] === 'Administrator' ? 'Admin' : roleLabels[r.key]}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-center text-[11px] text-ilm-navy/40">{roles.find((r) => r.key === role)?.hint}</p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-ilm-navy/60">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                className="w-full rounded-xl border border-ilm-navy/10 bg-ilm-cream px-4 py-3 text-sm text-ilm-navy outline-none focus:border-ilm-gold"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-ilm-navy/60">Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-ilm-navy/10 bg-ilm-cream px-4 py-3 pr-11 text-sm text-ilm-navy outline-none focus:border-ilm-gold"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ilm-navy/35"
                  aria-label="Toggle password"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-ilm-navy/8 bg-ilm-cream/80 px-4 py-3 text-left text-[11px] leading-relaxed text-ilm-navy/70">
              <p className="mb-1.5 font-bold uppercase tracking-[0.12em] text-ilm-navy/50">Demo credentials</p>
              <ul className="space-y-1 font-mono text-[11px]">
                <li>Admin · {DEMO_ACCOUNTS.admin.email} / {DEMO_ACCOUNTS.admin.password}</li>
                <li>Editor · {DEMO_ACCOUNTS.editor.email} / {DEMO_ACCOUNTS.editor.password}</li>
                <li>Author · {DEMO_ACCOUNTS.author.email} / {DEMO_ACCOUNTS.author.password}</li>
              </ul>
            </div>

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>
            )}

            <div className="flex justify-end">
              <Link href="/reset-password" className="text-xs font-semibold text-ilm-gold-deep hover:text-ilm-gold">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-ilm-navy py-3.5 text-[13px] font-bold uppercase tracking-[0.1em] text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {busy ? 'Signing in…' : `Sign in as ${roleLabels[role]}`} <ArrowRight size={16} />
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
