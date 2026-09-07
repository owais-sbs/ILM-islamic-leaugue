'use client';

import { useEffect, useState } from 'react';
import { Loader2, Pencil, Search, UserPlus, X } from 'lucide-react';
import { PageHeader, Card, EmptyState } from '@/components/admin/AdminUI';
import { TableRowActions } from '@/components/admin/TableRowActions';
import { usePermissions, roleLabels } from '@/components/admin/RoleContext';
import { createClient } from '@/lib/supabase/client';
import { slugify, type DbRole, type ProfileRow } from '@/lib/supabase/types';
import { cn } from '@/lib/utils';

export default function AdminAuthors() {
  const perms = usePermissions();
  const [authors, setAuthors] = useState<ProfileRow[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editing, setEditing] = useState<ProfileRow | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<DbRole>('author');
  const [form, setForm] = useState({
    full_name: '',
    slug: '',
    title_honorific: '',
    credentials: '',
    madhhab: '',
    bio: '',
    avatar_url: '',
    email_public: '',
    role: 'author' as DbRole,
    is_active: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const roleColors: Record<DbRole, string> = {
    author: 'bg-sky-50 text-sky-700',
    editor: 'bg-amber-50 text-amber-700',
    admin:  'bg-ilm-navy/10 text-ilm-navy',
  };

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('profiles').select('*').order('display_order').order('full_name');
    setAuthors((data as ProfileRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (perms.canManageUsers) load();
    else setLoading(false);
  }, [perms.canManageUsers]);

  if (!perms.canManageUsers) {
    return (
      <div>
        <PageHeader title="Authors" description="Manage contributors" />
        <Card className="p-8 text-center">
          <p className="text-sm text-slate-500">Only Administrators can manage authors.</p>
        </Card>
      </div>
    );
  }

  const filtered = authors.filter(
    (a) =>
      !search ||
      a.full_name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()),
  );

  const openEdit = (author: ProfileRow) => {
    setEditing(author);
    setForm({
      full_name: author.full_name,
      slug: author.slug || '',
      title_honorific: author.title_honorific || '',
      credentials: author.credentials || '',
      madhhab: author.madhhab || '',
      bio: author.bio || '',
      avatar_url: author.avatar_url || '',
      email_public: author.email_public || author.email,
      role: author.role,
      is_active: author.is_active,
    });
    setError('');
    setShowEdit(true);
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    setError('');
    const supabase = createClient();
    const { error: saveError } = await supabase
      .from('profiles')
      .update({
        full_name: form.full_name.trim(),
        slug: form.slug || slugify(form.full_name),
        title_honorific: form.title_honorific,
        credentials: form.credentials,
        madhhab: form.madhhab,
        bio: form.bio,
        avatar_url: form.avatar_url,
        email_public: form.email_public,
        role: form.role,
        is_active: form.is_active,
      })
      .eq('id', editing.id);
    setSaving(false);
    if (saveError) { setError(saveError.message); return; }
    setShowEdit(false);
    await load();
  };

  const removeAuthor = async (author: ProfileRow) => {
    if (!confirm(`Deactivate ${author.full_name}? They will no longer appear as an active contributor.`)) return;
    const supabase = createClient();
    await supabase.from('profiles').update({ is_active: false }).eq('id', author.id);
    await load();
  };

  const invite = async () => {
    if (!inviteEmail.trim()) { setError('Email is required'); return; }
    setSaving(true);
    setError('');
    setSuccess('');
    const res = await fetch('/api/admin/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail, full_name: inviteName, role: inviteRole }),
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) { setError(json.error || 'Invite failed'); return; }
    setSuccess(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
    setInviteName('');
    await load();
  };

  return (
    <div>
      <PageHeader
        title="Authors"
        description={`${authors.filter((a) => a.is_active).length} active Murabbiyūn`}
        action={
          <button type="button" onClick={() => { setError(''); setSuccess(''); setShowInvite(true); }} className="flex items-center gap-2 rounded-lg bg-ilm-navy px-4 py-2.5 text-xs font-semibold text-white hover:bg-ilm-navy-light">
            <UserPlus size={15} /> Invite contributor
          </button>
        }
      />

      <div className="relative mb-4 w-full sm:w-64">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type="text" placeholder="Search authors..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-ilm-navy/40" />
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-sm text-slate-500"><Loader2 className="mr-2 animate-spin" size={18} /> Loading…</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={UserPlus} title="No authors yet" description="Invite a contributor by email to get started." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((author) => (
            <Card key={author.id} className="p-5 transition hover:shadow-md">
              <div className="flex items-center gap-3">
                <img src={author.avatar_url || 'https://images.pexels.com/photos/14819810/pexels-photo-14819810.jpeg?auto=compress&cs=tinysrgb&h=80&w=80'} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-sky-100" />
                <div>
                  <p className="font-medium text-slate-800">
                    {author.title_honorific ? `${author.title_honorific} ` : ''}
                    {author.full_name}
                  </p>
                  <p className="text-xs text-slate-400">{author.credentials || author.email}</p>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-slate-500">{author.bio || 'No bio yet'}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className={cn('rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide', roleColors[author.role])}>
                  {roleLabels[author.role].split(' ')[0]}
                </span>
                {author.madhhab && <span className="text-xs text-slate-400">{author.madhhab}</span>}
                {!author.is_active && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-500">Inactive</span>}
              </div>
              <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <TableRowActions
                  onEdit={() => openEdit(author)}
                  onDelete={author.is_active ? () => removeAuthor(author) : undefined}
                  editLabel="Edit profile"
                  deleteLabel="Deactivate author"
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ilm-navy/40 p-4" onClick={() => setShowInvite(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-ilm-navy">Invite contributor</h2>
              <button type="button" onClick={() => setShowInvite(false)}><X size={18} /></button>
            </div>
            {error && <div className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}
            {success && <div className="mb-3 rounded-lg bg-sky-50 px-3 py-2 text-sm text-ilm-navy">{success}</div>}
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Full name</label>
                <input value={inviteName} onChange={(e) => setInviteName(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-ilm-navy/40" placeholder="Ustadh …" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Email *</label>
                <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-ilm-navy/40" placeholder="contributor@email.com" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Role</label>
                <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as DbRole)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm">
                  <option value="author">Author (Murabbī)</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <p className="text-xs text-slate-400">Supabase sends a magic-link invite email so they can set a password and sign in.</p>
              <button type="button" disabled={saving} onClick={invite} className="flex w-full items-center justify-center gap-2 rounded-lg bg-ilm-navy py-2.5 text-sm font-semibold text-white hover:bg-ilm-navy-light disabled:opacity-60">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                Send invitation
              </button>
            </div>
          </div>
        </div>
      )}

      {showEdit && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ilm-navy/40 p-4" onClick={() => setShowEdit(false)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-ilm-navy">Edit author</h2>
              <button type="button" onClick={() => setShowEdit(false)}><X size={18} /></button>
            </div>
            {error && <div className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-500">Full name</label>
                <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-ilm-navy/40" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Honorific</label>
                <input value={form.title_honorific} onChange={(e) => setForm({ ...form, title_honorific: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-ilm-navy/40" placeholder="Ustadh / Dr. / Shaykh" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as DbRole })} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm">
                  <option value="author">Author</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Credentials</label>
                <input value={form.credentials} onChange={(e) => setForm({ ...form, credentials: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-ilm-navy/40" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Madhhab</label>
                <input value={form.madhhab} onChange={(e) => setForm({ ...form, madhhab: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-ilm-navy/40" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-500">Public email</label>
                <input value={form.email_public} onChange={(e) => setForm({ ...form, email_public: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-ilm-navy/40" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-500">Avatar URL</label>
                <input value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-ilm-navy/40" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-500">Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-ilm-navy/40" />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600 sm:col-span-2">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                Active contributor
              </label>
            </div>
            <button type="button" disabled={saving} onClick={saveEdit} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-ilm-navy py-2.5 text-sm font-semibold text-white hover:bg-ilm-navy-light disabled:opacity-60">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Pencil size={16} />}
              Save author
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
