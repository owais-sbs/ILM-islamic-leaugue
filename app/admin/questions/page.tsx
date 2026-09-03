'use client';

import { useState } from 'react';
import { Archive, ArrowRight, FileText, Inbox, Search } from 'lucide-react';
import { PageHeader, Card, EmptyState } from '@/components/admin/AdminUI';
import { usePermissions } from '@/components/admin/RoleContext';
import { questions as initialQuestions, authors, type Question } from '@/lib/data';
import { cn } from '@/lib/utils';

const statusConfig: Record<Question['status'], { label: string; classes: string }> = {
  new: { label: 'New', classes: 'bg-blue-50 text-blue-700' },
  assigned: { label: 'Assigned', classes: 'bg-amber-50 text-amber-700' },
  answered: { label: 'Answered', classes: 'bg-ilm-navy/10 text-ilm-navy' },
  archived: { label: 'Archived', classes: 'bg-slate-100 text-slate-500' },
};

export default function AdminQuestions() {
  const perms = usePermissions();
  const [questions, setQuestions] = useState(initialQuestions);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Question['status'] | 'all'>('all');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = questions
    .filter((q) => filter === 'all' || q.status === filter)
    .filter((q) => !search || q.subject.toLowerCase().includes(search.toLowerCase()) || q.name.toLowerCase().includes(search.toLowerCase()));

  const selectedItem = questions.find((q) => q.id === selected);

  return (
    <div>
      <PageHeader title="Questions" description="Reader questions inbox" />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          {(['all', 'new', 'assigned', 'answered', 'archived'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium capitalize transition',
                filter === s ? 'bg-ilm-gold text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-ilm-cream'
              )}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search questions..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-ilm-gold/70" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <EmptyState icon={Inbox} title="No questions" description="When readers submit questions, they'll appear here." />
          ) : (
            filtered.map((q) => {
              const sc = statusConfig[q.status];
              return (
                <Card key={q.id} className={cn('cursor-pointer p-4 transition hover:shadow-md', selected === q.id && 'ring-2 ring-ilm-gold')} >
                  <div onClick={() => setSelected(q.id)}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-800">{q.subject}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{q.name} · {q.category} · {q.createdAt}</p>
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

        {/* Detail / actions panel */}
        <div>
          {selectedItem ? (
            <Card className="sticky top-20 p-5">
              <h3 className="mb-2 font-display text-xl font-semibold text-ilm-navy">{selectedItem.subject}</h3>
              <div className="mb-4 flex items-center gap-2 text-xs text-slate-400">
                <span>{selectedItem.name}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>{selectedItem.email}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>{selectedItem.createdAt}</span>
              </div>
              <div className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">{selectedItem.body}</div>

              <div className="mt-5 space-y-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">Assign to</label>
                  {perms.canAssignQuestions ? (
                    <select
                      value={selectedItem.assignedTo || ''}
                      onChange={(e) => setQuestions(questions.map((q) => q.id === selectedItem.id ? { ...q, assignedTo: e.target.value || null, status: e.target.value ? 'assigned' : 'new' } : q))}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-ilm-gold/70"
                    >
                      <option value="">Unassigned</option>
                      {authors.filter((a) => a.active).map((a) => <option key={a.id} value={a.name}>{a.name}</option>)}
                    </select>
                  ) : (
                    <p className="text-sm text-slate-500">{selectedItem.assignedTo || 'Unassigned'}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <button
                    onClick={() => setQuestions(questions.map((q) => q.id === selectedItem.id ? { ...q, status: 'answered' } : q))}
                    className="flex items-center gap-2 rounded-lg bg-ilm-cream px-4 py-2.5 text-sm font-semibold text-ilm-navy transition hover:bg-ilm-navy/10"
                  >
                    Mark as answered
                  </button>
                  <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
                    <ArrowRight size={15} /> Convert to draft article
                  </button>
                  <button
                    onClick={() => setQuestions(questions.map((q) => q.id === selectedItem.id ? { ...q, status: 'archived' } : q))}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50"
                  >
                    <Archive size={15} /> Archive
                  </button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center py-16 text-center">
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><FileText size={26} /></span>
              <h3 className="font-display text-xl text-slate-700">Select a question</h3>
              <p className="mt-2 text-sm text-slate-400">Choose a question from the list to see details and take action.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
