'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Archive, ArrowRight, FileText, Inbox, Search } from 'lucide-react';
import { PageHeader, Card, EmptyState } from '@/components/admin/AdminUI';
import { usePermissions } from '@/components/admin/RoleContext';
import { questions as initialQuestions, authors, type Question } from '@/lib/data';
import { cn } from '@/lib/utils';

const statusConfig: Record<Question['status'], { label: string; classes: string }> = {
  new:      { label: 'New',      classes: 'bg-blue-50 text-blue-700' },
  assigned: { label: 'Assigned', classes: 'bg-amber-50 text-amber-700' },
  answered: { label: 'Answered', classes: 'bg-ilm-navy/10 text-ilm-navy' },
  archived: { label: 'Archived', classes: 'bg-slate-100 text-slate-500' },
};

export default function AdminQuestions() {
  const router   = useRouter();
  const perms    = usePermissions();
  const [questions, setQuestions] = useState(initialQuestions);
  const [search,    setSearch]    = useState('');
  const [filter,    setFilter]    = useState<Question['status'] | 'all'>('all');
  const [selected,  setSelected]  = useState<string | null>(null);
  const [converted, setConverted] = useState<string | null>(null);

  const filtered = questions
    .filter((q) => filter === 'all' || q.status === filter)
    .filter((q) =>
      !search ||
      q.subject.toLowerCase().includes(search.toLowerCase()) ||
      q.name.toLowerCase().includes(search.toLowerCase()),
    );

  const selectedItem = questions.find((q) => q.id === selected);

  const markAnswered = (id: string) =>
    setQuestions(questions.map((q) => q.id === id ? { ...q, status: 'answered' } : q));

  const archiveQ = (id: string) =>
    setQuestions(questions.map((q) => q.id === id ? { ...q, status: 'archived' } : q));

  const assign = (id: string, val: string) =>
    setQuestions(questions.map((q) =>
      q.id === id ? { ...q, assignedTo: val || null, status: val ? 'assigned' : 'new' } : q,
    ));

  const convertToDraft = (q: Question) => {
    setConverted(q.id);
    // Navigate to new article pre-filled with question subject
    setTimeout(() => {
      router.push(`/admin/articles/new?from=question&subject=${encodeURIComponent(q.subject)}`);
    }, 800);
  };

  return (
    <div>
      <PageHeader title="Questions" description="Reader questions inbox" />

      {/* Filter + search bar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          {(['all', 'new', 'assigned', 'answered', 'archived'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium capitalize transition',
                filter === s
                  ? 'bg-ilm-gold text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-ilm-cream',
              )}
            >
              {s === 'all' ? `All (${questions.length})` : `${s} (${questions.filter((q) => q.status === s).length})`}
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-ilm-gold/70"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Question list */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <EmptyState icon={Inbox} title="No questions" description="When readers submit questions, they'll appear here." />
          ) : (
            filtered.map((q) => {
              const sc = statusConfig[q.status];
              return (
                <Card
                  key={q.id}
                  className={cn(
                    'cursor-pointer p-4 transition hover:shadow-md',
                    selected === q.id && 'ring-2 ring-ilm-gold',
                  )}
                  onClick={() => setSelected(q.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-800 line-clamp-1">{q.subject}</p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {q.name} · {q.category} · {q.createdAt}
                      </p>
                    </div>
                    <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold', sc.classes)}>
                      {sc.label}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">{q.body}</p>
                </Card>
              );
            })
          )}
        </div>

        {/* Detail / actions */}
        <div>
          {selectedItem ? (
            <Card className="sticky top-20 p-5">
              <h3 className="font-display text-lg text-ilm-navy">{selectedItem.subject}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span>{selectedItem.name}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>{selectedItem.email}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>{selectedItem.createdAt}</span>
              </div>

              <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                {selectedItem.body}
              </div>

              {/* Assign */}
              <div className="mt-5">
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Assign to Murabbī
                </label>
                {perms.canAssignQuestions ? (
                  <select
                    value={selectedItem.assignedTo || ''}
                    onChange={(e) => assign(selectedItem.id, e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-ilm-gold/70"
                  >
                    <option value="">Unassigned</option>
                    {authors.filter((a) => a.active).map((a) => (
                      <option key={a.id} value={a.name}>{a.name}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-slate-500">{selectedItem.assignedTo || 'Unassigned'}</p>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 grid gap-2">
                <button
                  onClick={() => markAnswered(selectedItem.id)}
                  disabled={selectedItem.status === 'answered'}
                  className="flex items-center justify-center gap-2 rounded-lg bg-ilm-cream px-4 py-2.5 text-sm font-semibold text-ilm-navy transition hover:bg-ilm-navy/10 disabled:opacity-40"
                >
                  Mark as answered
                </button>

                <button
                  onClick={() => convertToDraft(selectedItem)}
                  disabled={converted === selectedItem.id}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
                >
                  {converted === selectedItem.id ? (
                    <>
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-ilm-gold" />
                      Opening editor…
                    </>
                  ) : (
                    <>
                      <FileText size={14} /> Convert to draft article
                    </>
                  )}
                </button>

                <button
                  onClick={() => archiveQ(selectedItem.id)}
                  disabled={selectedItem.status === 'archived'}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50 disabled:opacity-40"
                >
                  <Archive size={14} /> Archive
                </button>
              </div>
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center py-16 text-center">
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <FileText size={26} />
              </span>
              <h3 className="font-display text-xl text-slate-700">Select a question</h3>
              <p className="mt-2 text-sm text-slate-400">Choose a question from the list to view details and take action.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
