'use client';

import { useMemo, useState } from 'react';
import { Mail, Plus, UserPlus, X } from 'lucide-react';
import { roleLabels, type Role } from '@/lib/admin-data';
import { useIlm } from '@/lib/ilm-store';
import { safeScholarImage } from '@/lib/images';
import { adminSwal } from '@/lib/admin-swal';
import { Reveal } from './reveal';
import { RowMenu } from './row-menu';
import { cn } from '@/lib/utils';

const rolePill: Record<Role, string> = {
  author: 'bg-gray-200 text-gray-800',
  editor: 'bg-blue-100 text-blue-800',
  administrator: 'bg-ilm-gold text-ilm-navy-deep',
};

const madhhabs = ['Hanafi', 'Maliki', "Shafi'i", 'Hanbali'] as const;

const roleIdByUi: Record<Role, number> = {
  author: 1,
  editor: 2,
  administrator: 3,
};

export function AuthorsScreen() {
  const { contributors, addAuthor, toggleAuthorActive } = useIlm();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('author');
  const [madhhab, setMadhhab] = useState<string>('Hanafi');
  const [bio, setBio] = useState('');

  const toggleActive = async (id: string) => {
    const person = contributors.find((r) => r.id === id);
    if (!person) return;
    const next = !person.active;
    const result = await adminSwal.confirm(
      next ? 'Activate author?' : 'Deactivate author?',
      next
        ? `${person.name} will be able to contribute again.`
        : `${person.name} will be marked inactive and cannot publish.`,
      next ? 'Activate' : 'Deactivate',
    );
    if (!result.isConfirmed) return;
    toggleAuthorActive(id, next);
    await adminSwal.success(next ? 'Author activated' : 'Author deactivated', person.name);
  };

  const submitAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch('/api/admin/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name,
          email,
          role,
          roleId: roleIdByUi[role],
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        warning?: string;
        emailOk?: boolean;
        roleName?: string;
      };

      if (!res.ok || !json.ok) {
        await adminSwal.error('Could not create account', json.error || 'Request failed');
        return;
      }

      const created = addAuthor({
        name,
        email,
        role,
        madhhab,
        bio: bio || undefined,
        inviteStatus: 'active',
      });
      if (!created) {
        await adminSwal.success(
          'Account created in Supabase',
          json.warning ||
            `${name} can sign in with the temporary password. (Local list may already include this email.)`,
        );
      } else if (json.warning) {
        await adminSwal.success('Account created', json.warning);
      } else {
        await adminSwal.success(
          'Account created',
          `${created.name} · ${json.roleName || roleLabels[role]}. Welcome email sent. Temporary password is in the email.`,
        );
      }

      setOpen(false);
      setName('');
      setEmail('');
      setRole('author');
      setMadhhab('Hanafi');
      setBio('');
    } catch (err) {
      await adminSwal.error('Could not create account', err instanceof Error ? err.message : 'Network error');
    } finally {
      setBusy(false);
    }
  };

  const list = useMemo(() => contributors, [contributors]);

  return (
    <Reveal>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-ilm-navy px-4 py-2 text-xs font-bold uppercase tracking-wide text-white"
        >
          <Plus size={14} /> Create Account
        </button>
      </div>

      {open && (
        <div className="mb-6 rounded-2xl border border-ilm-navy/10 bg-white p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-ilm-navy">
              <UserPlus size={16} /> New account
            </p>
            <button type="button" onClick={() => setOpen(false)} className="text-ilm-navy/40 hover:text-ilm-navy" aria-label="Close">
              <X size={16} />
            </button>
          </div>
          <form onSubmit={submitAuthor} className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-ilm-navy/45">Full name</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ustadh …"
                className="w-full rounded-xl border border-ilm-navy/10 bg-ilm-cream px-3 py-2.5 text-sm outline-none focus:border-ilm-gold"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-ilm-navy/45">Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="author@ilm.org"
                className="w-full rounded-xl border border-ilm-navy/10 bg-ilm-cream px-3 py-2.5 text-sm outline-none focus:border-ilm-gold"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-ilm-navy/45">Role</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full rounded-xl border border-ilm-navy/10 bg-ilm-cream px-3 py-2.5 text-sm outline-none"
              >
                <option value="author">Author</option>
                <option value="editor">Editor</option>
                <option value="administrator">Administrator</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-ilm-navy/45">Madhhab</span>
              <select
                value={madhhab}
                onChange={(e) => setMadhhab(e.target.value)}
                className="w-full rounded-xl border border-ilm-navy/10 bg-ilm-cream px-3 py-2.5 text-sm outline-none"
              >
                {madhhabs.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-ilm-navy/45">Bio (optional)</span>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-ilm-navy/10 bg-ilm-cream px-3 py-2.5 text-sm outline-none focus:border-ilm-gold"
              />
            </label>
            <p className="sm:col-span-2 text-xs text-ilm-navy/45">
              Creates a Supabase Auth user with a temporary password, maps the role via role_master, and sends a welcome email.
            </p>
            <div className="sm:col-span-2 flex flex-wrap gap-2 pt-1">
              <button
                type="submit"
                disabled={busy}
                className="rounded-full bg-ilm-navy px-5 py-2 text-xs font-bold uppercase tracking-wide text-white disabled:opacity-60"
              >
                {busy ? 'Creating…' : 'Create account'}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-ilm-navy/15 px-5 py-2 text-xs font-bold uppercase tracking-wide text-ilm-navy"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-ilm-navy/10 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] table-fixed text-left">
            <thead>
              <tr className="border-b border-ilm-navy/10 bg-ilm-cream/60">
                <th className="w-[34%] px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/55">Name</th>
                <th className="w-[14%] px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/55">Role</th>
                <th className="w-[14%] px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/55">Madhhab</th>
                <th className="w-[12%] px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/55">Articles</th>
                <th className="w-[18%] px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/55">Status</th>
                <th className="w-[8%] px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id} className="border-b border-ilm-navy/5 last:border-0 hover:bg-ilm-cream/40">
                  <td className="px-5 py-4 align-middle">
                    <div className="flex items-center gap-3">
                      <img
                        src={safeScholarImage(c.image)}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-ilm-cream"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ilm-navy">{c.name}</p>
                        <p className="flex items-center gap-1 truncate text-xs text-ilm-navy/45">
                          <Mail size={11} /> {c.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <span className={cn('rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide', rolePill[c.role])}>
                      {roleLabels[c.role]}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-middle text-sm text-ilm-navy/65">{c.madhhab}</td>
                  <td className="px-5 py-4 align-middle text-sm font-semibold text-ilm-navy">{c.articles}</td>
                  <td className="px-5 py-4 align-middle">
                    <button
                      type="button"
                      onClick={() => toggleActive(c.id)}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide transition',
                        c.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500',
                      )}
                      aria-pressed={c.active}
                    >
                      <span className={cn('relative h-5 w-9 rounded-full transition', c.active ? 'bg-green-500' : 'bg-gray-300')}>
                        <span
                          className={cn(
                            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition',
                            c.active ? 'left-4' : 'left-0.5',
                          )}
                        />
                      </span>
                      {c.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-5 py-4 align-middle text-right">
                    <RowMenu
                      label={`Actions for ${c.name}`}
                      items={[
                        {
                          label: c.active ? 'Deactivate' : 'Activate',
                          onClick: () => void toggleActive(c.id),
                        },
                        {
                          label: 'Copy email',
                          onClick: () => {
                            void navigator.clipboard.writeText(c.email);
                            void adminSwal.success('Copied', c.email);
                          },
                        },
                        {
                          label: 'Send email',
                          onClick: () => {
                            window.location.href = `mailto:${c.email}`;
                          },
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Reveal>
  );
}
