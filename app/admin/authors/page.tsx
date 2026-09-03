'use client';

import { useRef, useState } from 'react';
import { Check, Mail, Pencil, Plus, Search, UserMinus, UserPlus, X } from 'lucide-react';
import { PageHeader, Card, EmptyState } from '@/components/admin/AdminUI';
import { usePermissions, roleLabels } from '@/components/admin/RoleContext';
import { authors as initialAuthors, type Role } from '@/lib/data';
import { cn } from '@/lib/utils';

type Author = typeof initialAuthors[number];

const roleColors: Record<Role, string> = {
  author: 'bg-blue-50 text-blue-700',
  editor: 'bg-amber-50 text-amber-700',
  admin:  'bg-ilm-navy/10 text-ilm-navy',
};

export default function AdminAuthors() {
  const perms = usePermissions();
  const [authors,     setAuthors]     = useState(initialAuthors);
  const [search,      setSearch]      = useState('');
  const [showInvite,  setShowInvite]  = useState(false);
  const [editingId,   setEditingId]   = useState<string | null>(null);
  const [editData,    setEditData]    = useState<Partial<Author>>({});
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole,  setInviteRole]  = useState<Role>('author');
  const [inviteSent,  setInviteSent]  = useState(false);

  if (!perms.canManageUsers) {
    return (
      <div>
        <PageHeader title="Authors" description="Manage contributors" />
        <Card className="p-8 text-center">
          <p className="text-sm text-slate-500">
            Only Administrators can manage authors. Switch your role to Admin.
          </p>
        </Card>
      </div>
    );
  }

  const filtered = authors.filter(
    (a) => !search || a.name.toLowerCase().includes(search.toLowerCase()),
  );

  const startEdit = (a: Author) => {
    setEditingId(a.id);
    setEditData({ name: a.name, credentials: a.credentials, bio: a.bio, role: a.role });
  };

  const saveEdit = () => {
    setAuthors(authors.map((a) => a.id === editingId ? { ...a, ...editData } : a));
    setEditingId(null);
    setEditData({});
  };

  const toggleActive = (id: string) =>
    setAuthors(authors.map((a) => a.id === id ? { ...a, active: !a.active } : a));

  const sendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteSent(true);
    setTimeout(() => { setInviteSent(false); setShowInvite(false); setInviteEmail(''); }, 1800);
  };

  return (
    <div>
      <PageHeader
        title="Authors"
        description={`${authors.filter((a) => a.active).length} active contributors`}
        action={
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 rounded-lg bg-ilm-gold px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-ilm-gold-dark"
          >
            <UserPlus size={14} /> Invite contributor
          </button>
        }
      />

      <div className="relative mb-4 w-full sm:w-64">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search authors…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-ilm-gold/70"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={UserPlus} title="No authors found" description="Try a different search or invite a new contributor." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((author) => (
            <Card key={author.id} className={cn('flex flex-col p-5 transition', !author.active && 'opacity-60')}>
              {editingId === author.id ? (
                /* ── Inline edit mode ── */
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">Name</label>
                    <input
                      value={editData.name ?? ''}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-ilm-gold/70"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">Credentials</label>
                    <input
                      value={editData.credentials ?? ''}
                      onChange={(e) => setEditData({ ...editData, credentials: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-ilm-gold/70"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">Role</label>
                    <select
                      value={editData.role ?? 'author'}
                      onChange={(e) => setEditData({ ...editData, role: e.target.value as Role })}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-ilm-gold/70"
                    >
                      <option value="author">Author (Murabbī)</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">Bio</label>
                    <textarea
                      rows={3}
                      value={editData.bio ?? ''}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                      className="w-full resize-none rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-ilm-gold/70"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-ilm-gold py-2 text-xs font-semibold text-white hover:bg-ilm-gold-dark">
                      <Check size={13} /> Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
                      <X size={13} />
                    </button>
                  </div>
                </div>
              ) : (
                /* ── View mode ── */
                <>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img src={author.avatar} alt={author.name} className="h-12 w-12 rounded-full object-cover" />
                      <div>
                        <p className="font-medium text-slate-800">{author.name}</p>
                        <p className="text-xs text-slate-400">{author.credentials}</p>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 line-clamp-2 flex-1 text-sm text-slate-500">{author.bio}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className={cn('rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide', roleColors[author.role])}>
                      {roleLabels[author.role].split(' ')[0]}
                    </span>
                    <span className="text-xs text-slate-400">{author.madhhab}</span>
                    {!author.active && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-500">
                        Inactive
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
                    <span className="text-xs text-slate-400">{author.articleCount} articles</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(author)}
                        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-slate-500 transition hover:bg-slate-50 hover:text-ilm-gold"
                        title="Edit profile"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        onClick={() => toggleActive(author.id)}
                        className={cn(
                          'flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition',
                          author.active
                            ? 'text-slate-500 hover:bg-rose-50 hover:text-rose-600'
                            : 'text-slate-500 hover:bg-ilm-cream hover:text-ilm-gold',
                        )}
                        title={author.active ? 'Deactivate' : 'Reactivate'}
                      >
                        {author.active ? <><UserMinus size={12} /> Deactivate</> : <><UserPlus size={12} /> Reactivate</>}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Invite modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowInvite(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl text-ilm-navy">Invite a contributor</h2>
              <button onClick={() => setShowInvite(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                <X size={16} />
              </button>
            </div>

            {inviteSent ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <Mail size={32} className="text-ilm-gold" />
                <p className="font-medium text-ilm-navy">Invitation sent to {inviteEmail}</p>
              </div>
            ) : (
              <form onSubmit={sendInvite} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">Email address</label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="contributor@email.com"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-ilm-gold/70"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as Role)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-ilm-gold/70"
                  >
                    <option value="author">Author (Murabbī)</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <p className="text-xs text-slate-400">An invitation email will be sent with a link to set up their account.</p>
                <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-ilm-gold py-2.5 text-sm font-semibold text-white transition hover:bg-ilm-gold-dark">
                  <Mail size={15} /> Send invitation
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
