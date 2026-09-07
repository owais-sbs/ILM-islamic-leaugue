'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Archive, ArrowRight, FileText, Inbox, Loader2, Pencil, Search, Trash2 } from 'lucide-react';
import { PageHeader, Card, EmptyState } from '@/components/admin/AdminUI';
import { TableRowActions } from '@/components/admin/TableRowActions';
import { usePermissions } from '@/components/admin/RoleContext';
import { useAuth } from '@/components/admin/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { logActivity } from '@/lib/supabase/admin-helpers';
import { slugify, type CategoryRow, type DbQuestionStatus, type ProfileRow, type QuestionRow } from '@/lib/supabase/types';
import { cn } from '@/lib/utils';

const statusConfig: Record<DbQuestionStatus, { label: string; classes: string }> = {
  new:      { label: 'New',      classes: 'bg-sky-50 text-sky-700' },
  assigned: { label: 'Assigned', classes: 'bg-amber-50 text-amber-700' },
  answered: { label: 'Answered', classes: 'bg-ilm-navy/10 text-ilm-navy' },
  archived: { label: 'Archived', classes: 'bg-slate-100 text-slate-500' },
};

export default function AdminQuestions() {
  const router = useRouter();
  const perms = usePermissions();
  const { user, profile } = useAuth();
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [authors, setAuthors] = useState<ProfileRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<DbQuestionStatus | 'all'>('all');
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({ subject: '', name: '', email: '', body: '' });

  const load = async () => {
    setLoadError('');
    const supabase = createClient();
    const [{ data: qs, error: qErr }, { data: profiles }, { data: cats }] = await Promise.all([
      supabase.from('questions').select('*, categories(name), profiles:assigned_to(full_name)').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').eq('is_active', true).order('full_name'),
      supabase.from('categories').select('*').order('display_order'),
    ]);
    if (qErr) setLoadError(qErr.message);
    setQuestions((qs as QuestionRow[]) || []);
    setAuthors((profiles as ProfileRow[]) || []);
    setCategories((cats as CategoryRow[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Auto-refresh inbox every 20s
  useEffect(() => {
    const id = window.setInterval(() => { void load(); }, 20000);
    return () => window.clearInterval(id);
  }, []);

  const updateQuestion = async (id: string, patch: Record<string, unknown>) => {
    const supabase = createClient();
    await supabase.from('questions').update(patch).eq('id', id);
    await load();
  };

  const openEdit = (q: QuestionRow) => {
    setEditForm({ subject: q.subject, name: q.name, email: q.email, body: q.body });
    setSelected(q.id);
    setShowEdit(true);
  };

  const saveEdit = async () => {
    if (!selected) return;
    await updateQuestion(selected, editForm);
    setShowEdit(false);
  };

  const removeQuestion = async (id: string) => {
    if (!confirm('Delete this question permanently?')) return;
    const supabase = createClient();
    const { error } = await supabase.from('questions').delete().eq('id', id);
    if (error) {
      alert(error.message);
      return;
    }
    if (selected === id) setSelected(null);
    await load();
  };

  const convertToDraft = async (q: QuestionRow) => {
    setConverting(true);
    const supabase = createClient();
    const title = q.subject;
    const { data, error } = await supabase
      .from('articles')
      .insert({
        title,
        slug: slugify(title) + '-' + Date.now().toString().slice(-4),
        excerpt: q.body.slice(0, 180),
        body_html: `<p>${q.body.replace(/\n/g, '</p><p>')}</p>`,
        author_id: q.assigned_to || user?.id,
        category_id: q.category_id,
        status: 'draft',
      })
      .select('id')
      .single();

    if (!error && data) {
      await supabase.from('questions').update({ linked_article_id: data.id, status: 'answered' }).eq('id', q.id);
      await logActivity({
        actorId: user?.id,
        actorName: profile?.full_name,
        action: 'converted question to draft',
        entityType: 'article',
        entityId: data.id,
        entityLabel: title,
      });
      router.push(`/admin/articles/${data.id}/edit`);
    }
    setConverting(false);
  };

  const filtered = questions
    .filter((q) => filter === 'all' || q.status === filter)
    .filter((q) =>
      !search ||
      q.subject.toLowerCase().includes(search.toLowerCase()) ||
      q.name.toLowerCase().includes(search.toLowerCase()),
    );

  const selectedItem = questions.find((q) => q.id === selected);

  return (
    <div>
      <PageHeader
        title="Questions"
        description="Reader questions inbox — assign, answer, or convert to a draft article"
        action={
          <button
            type="button"
            onClick={() => { setLoading(true); void load(); }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-sky-50"
          >
            Refresh
          </button>
        }
      />

      {loadError && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Could not load questions: {loadError}. Make sure your profile role is admin/editor (run npm run db:create-admin).
        </div>
      )}

      {/* Filter + search bar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          {(['all', 'new', 'assigned', 'answered', 'archived'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium capitalize transition',
                filter === s
                  ? 'bg-ilm-navy text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-sky-50',
              )}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-ilm-navy/40"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-sm text-slate-500">
          <Loader2 className="mr-2 animate-spin" size={18} /> Loading…
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <EmptyState icon={Inbox} title="No questions" description="When readers submit questions, they'll appear here." />
            ) : (
              filtered.map((q) => {
                const sc = statusConfig[q.status];
                return (
                  <Card key={q.id} className={cn('p-4 transition hover:shadow-md', selected === q.id && 'ring-2 ring-ilm-navy')}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setSelected(q.id)}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-slate-800">{q.subject}</p>
                            <p className="mt-0.5 text-xs text-slate-400">
                              {q.name} · {q.categories?.name || 'General'} · {new Date(q.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold', sc.classes)}>{sc.label}</span>
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm text-slate-500">{q.body}</p>
                      </div>
                      <TableRowActions
                        onEdit={() => openEdit(q)}
                        onDelete={perms.canManageUsers ? () => removeQuestion(q.id) : undefined}
                        editLabel="Edit question"
                        deleteLabel="Delete question"
                      />
                    </div>
                  </Card>
                );
              })
            )}
          </div>

          <div>
            {selectedItem ? (
              <Card className="sticky top-20 p-5">
                <h3 className="mb-2 font-display text-xl font-semibold text-ilm-navy">{selectedItem.subject}</h3>
                <div className="mb-4 flex flex-wrap gap-2 text-xs text-slate-400">
                  <span>{selectedItem.name}</span><span>·</span><span>{selectedItem.email}</span>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">{selectedItem.body}</div>

                <div className="mt-5 space-y-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">Assign to</label>
                    {perms.canAssignQuestions ? (
                      <select
                        value={selectedItem.assigned_to || ''}
                        onChange={(e) =>
                          updateQuestion(selectedItem.id, {
                            assigned_to: e.target.value || null,
                            status: e.target.value ? 'assigned' : 'new',
                          })
                        }
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-ilm-navy/40"
                      >
                        <option value="">Unassigned</option>
                        {authors.map((a) => <option key={a.id} value={a.id}>{a.full_name}</option>)}
                      </select>
                    ) : (
                      <p className="text-sm text-slate-500">{selectedItem.profiles?.full_name || 'Unassigned'}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">Category</label>
                    <select
                      value={selectedItem.category_id || ''}
                      onChange={(e) => updateQuestion(selectedItem.id, { category_id: e.target.value || null })}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-ilm-navy/40"
                    >
                      <option value="">None</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => updateQuestion(selectedItem.id, { status: 'answered' })}
                    className="flex w-full items-center gap-2 rounded-lg bg-sky-50 px-4 py-2.5 text-sm font-semibold text-ilm-navy hover:bg-sky-100"
                  >
                    Mark as answered
                  </button>
                  <button
                    type="button"
                    disabled={converting}
                    onClick={() => convertToDraft(selectedItem)}
                    className="flex w-full items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                  >
                    {converting ? <Loader2 size={15} className="animate-spin" /> : <ArrowRight size={15} />}
                    Convert to draft article
                  </button>
                  <button
                    type="button"
                    onClick={() => updateQuestion(selectedItem.id, { status: 'archived' })}
                    className="flex w-full items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50"
                  >
                    <Archive size={15} /> Archive
                  </button>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => openEdit(selectedItem)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-sky-50"
                    >
                      <Pencil size={15} /> Edit
                    </button>
                    {perms.canManageUsers && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(selectedItem.id)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-100"
                      >
                        <Trash2 size={15} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="flex flex-col items-center justify-center py-16 text-center">
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><FileText size={26} /></span>
                <h3 className="font-display text-xl text-slate-700">Select a question</h3>
                <p className="mt-2 text-sm text-slate-400">Choose a question to assign, answer, or convert.</p>
              </Card>
            )}
          </div>
        </div>
      )}

      {showEdit && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ilm-navy/40 p-4" onClick={() => setShowEdit(false)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-4 font-display text-xl font-semibold text-ilm-navy">Edit question</h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Subject</label>
                <input value={editForm.subject} onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-ilm-navy/40" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Name</label>
                  <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-ilm-navy/40" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Email</label>
                  <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-ilm-navy/40" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Message</label>
                <textarea value={editForm.body} onChange={(e) => setEditForm({ ...editForm, body: e.target.value })} rows={5} className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-ilm-navy/40" />
              </div>
              <button type="button" onClick={saveEdit} className="flex w-full items-center justify-center gap-2 rounded-lg bg-ilm-navy py-2.5 text-sm font-semibold text-white hover:bg-ilm-navy-light">
                <Pencil size={15} /> Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
