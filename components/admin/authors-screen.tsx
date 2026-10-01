'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Globe, Mail, Plus, UserPlus, X } from 'lucide-react';
import { roleLabels, type Role } from '@/lib/admin-data';
import { useIlm } from '@/lib/ilm-store';
import { safeScholarImage } from '@/lib/images';
import { adminSwal } from '@/lib/admin-swal';
import { adminPath } from '@/lib/admin-routes';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { contributors, addAuthor, toggleAuthorActive } = useIlm();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  // Form state
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [role, setRole]           = useState<Role>('author');
  const [madhhab, setMadhhab]     = useState<string>('Hanafi');
  const [staffTitle, setStaffTitle] = useState('');
  const [bio, setBio]             = useState('');

  const resetForm = () => {
    setName(''); setEmail(''); setRole('author');
    setMadhhab('Hanafi'); setStaffTitle(''); setBio('');
    setOpen(false);
  };

  const toggleActive = async (id: string) => {
    const person = contributors.find((r) => r.id === id);
    if (!person) return;
    const next = !person.active;
    const result = await adminSwal.confirm(
      next ? 'Activate account?' : 'Deactivate account?',
      next
        ? `${person.name} will be able to contribute again.`
        : `${person.name} will be marked inactive and cannot contribute.`,
      next ? 'Activate' : 'Deactivate',
    );
    if (!result.isConfirmed) return;
    toggleAuthorActive(id, next);
    await adminSwal.success(next ? 'Activated' : 'Deactivated', person.name);
  };

  const submitAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch('/api/admin/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: name, email, role, roleId: roleIdByUi[role] }),
      });
      const json = (await res.json()) as {
        ok?: boolean; error?: string; warning?: string; roleName?: string;
      };

      if (!res.ok || !json.ok) {
        await adminSwal.error('Could not create account', json.error || 'Request failed');
        return;
      }

      const created = addAuthor({
        name, email, role, madhhab,
        staffTitle: staffTitle || undefined,
        bio: bio || undefined,
        inviteStatus: 'active',
      });

      if (!created) {
        await adminSwal.success('Account created', json.warning || `${name} can sign in. (Already in local list.)`);
      } else if (json.warning) {
        await adminSwal.success('Account created', json.warning);
      } else {
        await adminSwal.success(
          'Account created',
          `${created.name} · ${json.roleName || roleLabels[role]}. Welcome email sent with temporary password.`,
        );
      }
      resetForm();
    } catch (err) {
      await adminSwal.error('Network error', err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setBusy(false);
    }
  };

  const list = useMemo(() => contributors, [contributors]);

  return (
    <Reveal>
      {/* Header row */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full bg-ilm-navy px-4 py-2 text-xs font-bold uppercase tracking-wide text-white"
        >
          <Plus size={14} /> Create Account
        </button>
        <button
          type="button"
          onClick={() => router.push(adminPath('staff-profiles'))}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ilm-gold-deep hover:text-ilm-navy"
        >
          Manage staff profiles <ArrowRight size={13} />
        </button>
      </div>

      {/* Create form */}
      {open && (
        <div className="mb-6 rounded-2xl border border-ilm-navy/10 bg-white p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-ilm-navy">
              <UserPlus size={16} /> New account
            </p>
            <button type="button" onClick={resetForm} className="text-ilm-navy/40 hover:text-ilm-navy" aria-label="Close">
              <X size={16} />
            </button>
          </div>
          <form onSubmit={submitAuthor} className="grid gap-3 sm:grid-cols-2">
            {/* Name */}
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-ilm-navy/45">Full name *</span>
              <input required value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Ustadh …"
                className="w-full rounded-xl border border-ilm-navy/10 bg-ilm-cream px-3 py-2.5 text-sm outline-none focus:border-ilm-gold" />
            </label>

            {/* Email */}
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-ilm-navy/45">Email *</span>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="author@ilm.org"
                className="w-full rounded-xl border border-ilm-navy/10 bg-ilm-cream px-3 py-2.5 text-sm outline-none focus:border-ilm-gold" />
            </label>

            {/* Role */}
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-ilm-navy/45">System Role *</span>
              <select value={role} onChange={(e) => setRole(e.target.value as Role)}
                className="w-full rounded-xl border border-ilm-navy/10 bg-ilm-cream px-3 py-2.5 text-sm outline-none">
                <option value="author">Author</option>
                <option value="editor">Editor</option>
                <option value="administrator">Administrator</option>
              </select>
            </label>

            {/* Madhhab */}
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-ilm-navy/45">Madhhab</span>
              <select value={madhhab} onChange={(e) => setMadhhab(e.target.value)}
                className="w-full rounded-xl border border-ilm-navy/10 bg-ilm-cream px-3 py-2.5 text-sm outline-none">
                {madhhabs.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </label>

            {/* Staff / display title */}
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-ilm-navy/45">
                Display title <span className="font-normal text-ilm-navy/30">(shown in the Murabbiyūn directory)</span>
              </span>
              <input value={staffTitle} onChange={(e) => setStaffTitle(e.target.value)}
                placeholder="e.g. Imām, Masjid al-Nur · Cambridge, MD"
                className="w-full rounded-xl border border-ilm-navy/10 bg-ilm-cream px-3 py-2.5 text-sm outline-none focus:border-ilm-gold" />
            </label>

            {/* Bio */}
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-ilm-navy/45">
                Short bio <span className="font-normal text-ilm-navy/30">(optional — 1–2 sentences)</span>
              </span>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={2}
                className="w-full rounded-xl border border-ilm-navy/10 bg-ilm-cream px-3 py-2.5 text-sm outline-none focus:border-ilm-gold" />
            </label>

            <p className="sm:col-span-2 text-[11px] text-ilm-navy/40">
              This creates a Supabase Auth user with a temporary password and sends a welcome email.
              To upload a photo, set a full biography, or enable directory visibility, use{' '}
              <button type="button" className="font-semibold text-ilm-gold-deep underline-offset-2 hover:underline"
                onClick={() => { resetForm(); router.push(adminPath('staff-profiles')); }}>
                Staff Profiles
              </button>.
            </p>

            <div className="sm:col-span-2 flex flex-wrap gap-2 pt-1">
              <button type="submit" disabled={busy}
                className="rounded-full bg-ilm-navy px-5 py-2 text-xs font-bold uppercase tracking-wide text-white disabled:opacity-60">
                {busy ? 'Creating…' : 'Create account'}
              </button>
              <button type="button" onClick={resetForm}
                className="rounded-full border border-ilm-navy/15 px-5 py-2 text-xs font-bold uppercase tracking-wide text-ilm-navy">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-ilm-navy/10 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] table-fixed text-left">
            <thead>
              <tr className="border-b border-ilm-navy/10 bg-ilm-cream/60">
                <th className="w-[35%] px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/55">Name</th>
                <th className="w-[13%] px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/55">Role</th>
                <th className="w-[13%] px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/55">Madhhab</th>
                <th className="w-[9%] px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/55">Articles</th>
                <th className="w-[10%] px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/55">Directory</th>
                <th className="w-[14%] px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/55">Status</th>
                <th className="w-[6%] px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id} className="border-b border-ilm-navy/5 last:border-0 hover:bg-ilm-cream/40">
                  {/* Name + email */}
                  <td className="px-5 py-4 align-middle">
                    <div className="flex items-center gap-3">
                      <img src={safeScholarImage(c.image)} alt=""
                        className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-ilm-cream" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ilm-navy">{c.name}</p>
                        {c.staffTitle && (
                          <p className="truncate text-[11px] text-ilm-gold-deep">{c.staffTitle}</p>
                        )}
                        <p className="flex items-center gap-1 truncate text-xs text-ilm-navy/45">
                          <Mail size={11} /> {c.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* System role */}
                  <td className="px-5 py-4 align-middle">
                    <span className={cn('rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide', rolePill[c.role])}>
                      {roleLabels[c.role]}
                    </span>
                  </td>

                  {/* Madhhab */}
                  <td className="px-5 py-4 align-middle text-sm text-ilm-navy/65">{c.madhhab}</td>

                  {/* Articles */}
                  <td className="px-5 py-4 align-middle text-sm font-semibold text-ilm-navy">{c.articles}</td>

                  {/* Directory badge */}
                  <td className="px-5 py-4 align-middle">
                    {c.showInDirectory ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-green-700">
                        <Globe size={10} /> Yes
                      </span>
                    ) : (
                      <span className="text-[11px] text-ilm-navy/30">—</span>
                    )}
                  </td>

                  {/* Active toggle */}
                  <td className="px-5 py-4 align-middle">
                    <button
                      type="button"
                      onClick={() => void toggleActive(c.id)}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide transition',
                        c.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500',
                      )}
                      aria-pressed={c.active}
                    >
                      <span className={cn('relative h-5 w-9 rounded-full transition', c.active ? 'bg-green-500' : 'bg-gray-300')}>
                        <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition', c.active ? 'left-4' : 'left-0.5')} />
                      </span>
                      {c.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>

                  {/* Row menu */}
                  <td className="px-5 py-4 align-middle text-right">
                    <RowMenu
                      label={`Actions for ${c.name}`}
                      items={[
                        { label: c.active ? 'Deactivate' : 'Activate', onClick: () => void toggleActive(c.id) },
                        { label: 'Edit profile', onClick: () => router.push(adminPath('staff-profiles')) },
                        { label: 'Copy email', onClick: () => { void navigator.clipboard.writeText(c.email); void adminSwal.success('Copied', c.email); } },
                        { label: 'Send email', onClick: () => { window.location.href = `mailto:${c.email}`; } },
                      ]}
                    />
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-ilm-navy/35">
                    No accounts yet. Click <strong>Create Account</strong> to add the first staff member.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Reveal>
  );
}
