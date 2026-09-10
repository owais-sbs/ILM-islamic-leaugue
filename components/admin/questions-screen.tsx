'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, MailQuestion, Search } from 'lucide-react';
import { contributors } from '@/lib/admin-data';
import { useIlm } from '@/lib/ilm-store';
import { Reveal } from './reveal';

export function QuestionsScreen({ assignedOnly = false, assignee = '' }: { assignedOnly?: boolean; assignee?: string }) {
  const { questions } = useIlm();
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    return questions.filter((item) => {
      if (assignedOnly && item.assignedTo !== assignee) return false;
      if (!q) return true;
      return `${item.question} ${item.asker}`.toLowerCase().includes(q.toLowerCase());
    });
  }, [questions, assignedOnly, assignee, q]);

  return (
    <Reveal>
      <h2 className="mb-2 text-2xl font-semibold tracking-tight text-ilm-navy">
        {assignedOnly ? 'Assigned questions' : 'Questions'}
      </h2>
      <p className="mb-5 text-sm text-ilm-navy/50">
        {assignedOnly
          ? 'You only see questions assigned to you. You cannot browse the full inbox.'
          : 'Assign to a Murabbī, mark answered, or convert into an article draft.'}
      </p>
      <div className="mb-4 flex items-center gap-2 rounded-2xl border border-ilm-navy/8 bg-white p-4 text-ilm-navy/40">
        <Search size={16} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions…" className="flex-1 bg-transparent text-sm text-ilm-navy outline-none" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-ilm-navy/8 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-ilm-navy/8 bg-ilm-cream/60">
              <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/40">Question</th>
              <th className="hidden px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/40 md:table-cell">Assigned</th>
              <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/40">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.id} className="border-b border-ilm-navy/5 last:border-0">
                <td className="px-5 py-4">
                  <p className="flex items-start gap-2 text-sm font-medium text-ilm-navy">
                    <MailQuestion size={16} className="mt-0.5 shrink-0 text-ilm-gold-deep" />
                    {item.question}
                  </p>
                  <p className="mt-1 pl-6 text-xs text-ilm-navy/40">{item.asker} · {item.date}</p>
                </td>
                <td className="hidden px-5 py-4 text-sm text-ilm-navy/50 md:table-cell">{item.assignedTo || '-'}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${item.status === 'new' ? 'bg-ilm-gold/15 text-ilm-gold-deep' : item.status === 'assigned' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {item.status}
                  </span>
                  {item.status === 'answered' && (
                    <span className="ml-2 inline-flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle2 size={12} />
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <div className="py-14 text-center text-sm text-ilm-navy/30">No questions in this view.</div>}
      </div>
      {!assignedOnly && (
        <p className="mt-3 text-xs text-ilm-navy/35">Assign targets: {contributors.filter((c) => c.role === 'author').map((c) => c.name).join(' · ')}</p>
      )}
    </Reveal>
  );
}
