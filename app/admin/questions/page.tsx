'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Archive, ArrowRight, FileText, Inbox, Loader2, Search } from 'lucide-react';
import { PageHeader, Card, EmptyState } from '@/components/admin/AdminUI';
import { usePermissions } from '@/components/admin/RoleContext';
import { useAuth } from '@/components/admin/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { logActivity } from '@/lib/supabase/admin-helpers';
import { slugify, type CategoryRow, type DbQuestionStatus, type ProfileRow, type QuestionRow } from '@/lib/supabase/types';
import { cn } from '@/lib/utils';

const statusConfig: Record<DbQuestionStatus, { label: string; classes: string }> = {
  new: { label: 'New', classes: 'bg-sky-50 text-sky-700' },
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
    .filter((q) => !search || q.subject.toLowerCase().includes(search.toLowerCase()) || q.name.toLowerCase().includes(search.toLowerCase()));

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

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          {(['all', 'new', 'assigned', 'answered', 'archived'] as const).map((s) => (
            <button key={s} type="button" onClick={() => setFilter(s)} className={cn('rounded-full px-3 py-1.5 text-xs font-medium capitalize transition', filter === s ? 'bg-ilm-navy text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-sky-50')}>
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search questions..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-ilm-navy/40" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-sm text-slate-500"><Loader2 className="mr-2 animate-spin" size={18} /> Loading…</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <EmptyState icon={Inbox} title="No questions" description="When readers submit questions, they'll appear here." />
            ) : (
              filtered.map((q) => {
                const sc = statusConfig[q.status];
                return (
                  <Card key={q.id} className={cn('cursor-pointer p-4 transition hover:shadow-md', selected === q.id && 'ring-2 ring-ilm-navy')}>
                    <div onClick={() => setSelected(q.id)}>
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

                  <button type="button" onClick={() => updateQuestion(selectedItem.id, { status: 'answered' })} className="flex w-full items-center gap-2 rounded-lg bg-sky-50 px-4 py-2.5 text-sm font-semibold text-ilm-navy hover:bg-sky-100">
                    Mark as answered
                  </button>
                  <button type="button" disabled={converting} onClick={() => convertToDraft(selectedItem)} className="flex w-full items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60">
                    {converting ? <Loader2 size={15} className="animate-spin" /> : <ArrowRight size={15} />}
                    Convert to draft article
                  </button>
                  <button type="button" onClick={() => updateQuestion(selectedItem.id, { status: 'archived' })} className="flex w-full items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50">
                    <Archive size={15} /> Archive
                  </button>
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
    </div>
  );
}
