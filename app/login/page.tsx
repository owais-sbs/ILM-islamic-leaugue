'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, ShieldCheck, PencilLine, UserRound } from 'lucide-react';
import { Brand } from '@/components/public/brand';
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
  const [showDemo, setShowDemo] = useState(false);
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
        let mustChangePassword = false;

        if (uid) {
          let roleFromMapping: Role | null = null;
          const meRes = await fetch(`/api/account/me?authUserId=${encodeURIComponent(uid)}`, {
            cache: 'no-store',
          });
          if (meRes.ok) {
            const me = (await meRes.json()) as {
              ok?: boolean;
              mustChangePassword?: boolean;
              role?: Role | null;
            };
            if (me.role) roleFromMapping = me.role;
            mustChangePassword = Boolean(me.mustChangePassword);
          }

          const { data: profile } = await supabase
            .from('profiles')
            .select('role, is_active')
            .eq('id', uid)
            .maybeSingle();
          const mapped = mapDbRole(profile?.role);
          if (profile && !profile.is_active) {
            throw new Error('This account is inactive. Contact an administrator.');
          }
          nextRole = roleFromMapping || mapped || role;
        }

        writeAdminRole(nextRole);
        router.push(mustChangePassword ? '/change-password' : '/admin/dashboard');
        return;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Sign-in failed';
        const demo = demoForRole(role);
        if (email === demo.email && password === demo.password) {
          writeAdminRole(role);
          router.push('/admin/dashboard');
          return;
        }
        setError(message);
        setBusy(false);
        return;
      }
    }

    writeAdminRole(role);
    router.push('/admin/dashboard');
  };

  return (
    <main className="relative flex h-[100svh] flex-col overflow-hidden bg-gradient-to-br from-ilm-cream via-white to-[#f0e8dc]">
      <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(199,154,61,0.14),transparent_65%)]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(11,17,82,0.06),transparent_65%)]" />

      <header className="relative z-10 flex shrink-0 items-center justify-between px-5 py-4 sm:px-8">
        <Brand />
        <Link href="/" className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ilm-navy/50 hover:text-ilm-navy">
          ← Back to ILM
        </Link>
      </header>

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 pb-5 sm:px-6">
        <div className="w-full max-w-[420px] rounded-[24px] border border-ilm-navy/8 bg-white/95 p-6 shadow-[0_20px_60px_rgba(11,17,82,0.08)] backdrop-blur sm:p-7">
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-tight text-ilm-navy sm:text-2xl">Sign in to ILM Admin</h1>
            <p className="mt-1.5 text-xs text-ilm-navy/50 sm:text-sm">Choose a role — demo credentials fill automatically.</p>
          </div>

          <form onSubmit={signIn} className="mt-5 space-y-3.5">
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-ilm-navy/40">Workspace</label>
              <div className="inline-flex w-full rounded-full bg-ilm-cream p-0.5">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const active = role === r.key;
                  return (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => applyRole(r.key)}
                      className={cn(
                        'flex flex-1 items-center justify-center gap-1 rounded-full px-2 py-1.5 text-[10px] transition-all',
                        active ? 'bg-ilm-gold text-ilm-navy-deep' : 'text-ilm-navy/45 hover:text-ilm-navy'
                      )}
                    >
                      <Icon size={12} />
                      {roleLabels[r.key] === 'Administrator' ? 'Admin' : roleLabels[r.key]}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1 text-center text-[10px] text-ilm-navy/40">{roles.find((r) => r.key === role)?.hint}</p>
            </div>

            <div>
              <label className="mb-1 block text-xs text-ilm-navy/60">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                className="w-full rounded-xl border border-ilm-navy/10 bg-ilm-cream px-3.5 py-2.5 text-sm text-ilm-navy outline-none focus:border-ilm-gold"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-ilm-navy/60">Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-ilm-navy/10 bg-ilm-cream px-3.5 py-2.5 pr-10 text-sm text-ilm-navy outline-none focus:border-ilm-gold"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ilm-navy/35"
                  aria-label="Toggle password"
                >
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowDemo((v) => !v)}
              className="w-full text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-ilm-gold-deep hover:text-ilm-gold"
            >
              {showDemo ? 'Hide demo credentials' : 'Show demo credentials'}
            </button>
            {showDemo && (
              <div className="rounded-xl border border-ilm-navy/8 bg-ilm-cream/80 px-3 py-2.5 text-[10px] leading-relaxed text-ilm-navy/70">
                <ul className="space-y-0.5 font-mono">
                  <li>Admin · {DEMO_ACCOUNTS.admin.email}</li>
                  <li>Editor · {DEMO_ACCOUNTS.editor.email}</li>
                  <li>Author · {DEMO_ACCOUNTS.author.email}</li>
                </ul>
              </div>
            )}

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>
            )}

            <div className="flex items-center justify-between pt-0.5">
              <Link href="/reset-password" className="text-[11px] font-semibold text-ilm-gold-deep hover:text-ilm-gold">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-ilm-navy py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {busy ? 'Signing in…' : `Sign in as ${roleLabels[role]}`} <ArrowRight size={15} />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
