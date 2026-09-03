'use client';

import { useState } from 'react';
import { Mail, MoreVertical, Pencil, Plus, Search, UserPlus, X } from 'lucide-react';
import { PageHeader, Card, EmptyState } from '@/components/admin/AdminUI';
import { usePermissions, roleLabels } from '@/components/admin/RoleContext';
import { authors as initialAuthors, type Role } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function AdminAuthors() {
  const perms = usePermissions();
  const [authors] = useState(initialAuthors);
  const [search, setSearch] = useState('');
  const [showInvite, setShowInvite] = useState(false);

  if (!perms.canManageUsers) {
    return (
      <div>
        <PageHeader title="Authors" description="Manage contributors" />
        <Card className="p-8 text-center">
          <p className="text-sm text-slate-500">Only Administrators can manage authors. Switch your role to Admin using the role switcher.</p>
        </Card>
      </div>
    );
  }

  const filtered = authors.filter((a) => !search || a.name.toLowerCase().includes(search.toLowerCase()));
  const roleColors: Record<Role, string> = { author: 'bg-blue-50 text-blue-700', editor: 'bg-amber-50 text-amber-700', admin: 'bg-ilm-navy/10 text-ilm-navy' };

  return (
    <div>
      <PageHeader
        title="Authors"
        description={`${authors.filter(a => a.active).length} active contributors`}
        action={
          <button onClick={() => setShowInvite(true)} className="flex items-center gap-2 rounded-lg bg-ilm-gold px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-ilm-gold-dark">
            <UserPlus size={15} /> Invite contributor
          </button>
        }
      />

      <div className="relative mb-4 w-full sm:w-64">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search authors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-ilm-gold/70"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={UserPlus} title="No authors found" description="Try a different search or invite a new contributor." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((author) => (
            <Card key={author.id} className="group p-5 transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img src={author.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                  <div>
                    <p className="font-medium text-slate-800">{author.name}</p>
                    <p className="text-xs text-slate-400">{author.credentials}</p>
                  </div>
                </div>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition hover:bg-slate-100">
                  <MoreVertical size={16} />
                </button>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-slate-500">{author.bio}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className={cn('rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide', roleColors[author.role])}>
                  {roleLabels[author.role].split(' ')[0]}
                </span>
                <span className="text-xs text-slate-400">{author.madhhab}</span>
                {!author.active && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-500">Inactive</span>}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-xs text-slate-400">{author.articleCount} articles</span>
                <div className="flex gap-1">
                  <button className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-500 transition hover:bg-slate-50">
                    <Pencil size={13} /> Edit
                  </button>
                  <button className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-500 transition hover:bg-slate-50">
                    <Mail size={13} /> Email
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Invite dialog */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={() => setShowInvite(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-ilm-navy">Invite a contributor</h2>
              <button onClick={() => setShowInvite(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Email address</label>
                <input type="email" placeholder="contributor@email.com" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-ilm-gold/70" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Role</label>
                <select className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-ilm-gold/70">
                  <option>Author (Murabbī)</option>
                  <option>Editor</option>
                  <option>Administrator</option>
                </select>
              </div>
              <p className="text-xs text-slate-400">An invitation email will be sent with a link to set up their account.</p>
              <button onClick={() => setShowInvite(false)} className="flex w-full items-center justify-center gap-2 rounded-lg bg-ilm-gold py-2.5 text-sm font-semibold text-white transition hover:bg-ilm-gold-dark">
                <Plus size={16} /> Send invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
