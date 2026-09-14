'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Eye, MailQuestion, Search, Send, X } from 'lucide-react';
import { contributors } from '@/lib/admin-data';
import { useIlm } from '@/lib/ilm-store';
import { adminSwal } from '@/lib/admin-swal';
import { Reveal } from './reveal';
import type { Question, Role } from '@/lib/admin-data';

export function QuestionsScreen({ role, userName }: { role: Role; userName: string }) {
  const { questions, assignQuestion, authorSubmitAnswer, answerQuestion } = useIlm();
  const isAuthor = role === 'author';
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<Question | null>(null);
  const [assignTo, setAssignTo] = useState('');
  const [answer, setAnswer] = useState('');

  const list = useMemo(() => {
    let base = questions;
    if (isAuthor) {
      base = questions.filter(
        (item) => item.assignedTo === userName && (item.status === 'assigned' || item.status === 'author_ready'),
      );
    }
    const needle = q.trim().toLowerCase();
    const filtered = !needle
      ? base
      : base.filter((item) =>
          `${item.question} ${item.asker} ${item.email || ''} ${item.subject || ''}`.toLowerCase().includes(needle),
        );
    const rank = (s: Question['status']) =>
      s === 'new' ? 0 : s === 'author_ready' ? 1 : s === 'assigned' ? 2 : 3;
    return filtered.slice().sort((a, b) => {
      const r = rank(a.status) - rank(b.status);
      if (r !== 0) return r;
      return b.date.localeCompare(a.date);
    });
  }, [questions, q, isAuthor, userName]);

  const open = (item: Question) => {
    setSelected(item);
    setAssignTo(item.assignedTo || '');
    setAnswer(item.authorDraft || item.answerNotes || '');
  };

  const close = () => {
    setSelected(null);
    setAssignTo('');
    setAnswer('');
  };

  return (
    <Reveal>
      <p className="mb-5 text-sm text-ilm-navy/50">
        {isAuthor
          ? 'Questions assigned to you. Write your response and submit it for admin review.'
          : 'View questions, assign to a murabbi, review author drafts, and send the final reply to the seeker.'}
      </p>
      <div className="mb-4 flex items-center gap-2 rounded-2xl border border-ilm-navy/8 bg-white p-4 text-ilm-navy/40">
        <Search size={16} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search questions…"
          className="flex-1 bg-transparent text-sm text-ilm-navy outline-none"
        />
      </div>
      <div className="overflow-hidden rounded-2xl border border-ilm-navy/8 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-ilm-navy/8 bg-ilm-cream/60">
              <th className="px-5 py-3.5 text-[11px] uppercase tracking-[0.12em] text-ilm-navy/40">Question</th>
              {!isAuthor && (
                <th className="hidden px-5 py-3.5 text-[11px] uppercase tracking-[0.12em] text-ilm-navy/40 md:table-cell">Assigned</th>
              )}
              <th className="px-5 py-3.5 text-[11px] uppercase tracking-[0.12em] text-ilm-navy/40">Status</th>
              <th className="px-5 py-3.5 text-[11px] uppercase tracking-[0.12em] text-ilm-navy/40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.id} className={`border-b border-ilm-navy/5 last:border-0 ${item.status === 'new' ? 'bg-ilm-gold/5' : ''}`}>
                <td className="px-5 py-4">
                  <p className="flex items-start gap-2 text-sm text-ilm-navy">
                    <MailQuestion size={16} className="mt-0.5 shrink-0 text-ilm-gold-deep" />
                    <span className="line-clamp-2">{item.question}</span>
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-2 pl-6 text-xs text-ilm-navy/40">
                    <span>{item.asker} · {item.date}</span>
                    {!isAuthor && (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${item.source === 'contact' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'}`}>
                        {item.source === 'contact' ? 'Contact' : 'Ask'}
                      </span>
                    )}
                  </p>
                </td>
                {!isAuthor && (
                  <td className="hidden px-5 py-4 text-sm text-ilm-navy/50 md:table-cell">{item.assignedTo || '—'}</td>
                )}
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${
                    item.status === 'new' ? 'bg-ilm-gold/15 text-ilm-gold-deep'
                      : item.status === 'assigned' ? 'bg-blue-100 text-blue-700'
                      : item.status === 'author_ready' ? 'bg-amber-100 text-amber-800'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {item.status === 'author_ready' ? 'ready for review' : item.status}
                  </span>
                  {item.status === 'answered' && (
                    <span className="ml-2 inline-flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle2 size={12} />
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => open(item)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-ilm-navy/10 px-3 py-1.5 text-xs text-ilm-navy transition-colors hover:bg-ilm-cream"
                  >
                    <Eye size={13} /> {isAuthor ? 'Respond' : 'View & answer'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && (
          <div className="py-14 text-center text-sm text-ilm-navy/30">
            {isAuthor ? 'No questions assigned to you yet.' : 'No questions yet.'}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-ilm-navy/35 px-4 backdrop-blur-sm" onClick={close}>
          <div
            className="relative max-h-[90svh] w-full max-w-lg overflow-y-auto rounded-[24px] border border-ilm-navy/10 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" onClick={close} className="absolute right-4 top-4 text-ilm-navy/40 hover:text-ilm-navy" aria-label="Close">
              <X size={18} />
            </button>
            <p className="text-[10px] uppercase tracking-[0.16em] text-ilm-gold-deep">Full question</p>
            <h3 className="mt-2 text-lg text-ilm-navy">{selected.subject || 'Question from the site'}</h3>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ilm-navy/70">{selected.question}</p>
            <dl className="mt-4 grid gap-2 text-xs text-ilm-navy/50">
              <div><dt className="inline text-ilm-navy/35">From: </dt><dd className="inline">{selected.asker}</dd></div>
              {selected.email && !isAuthor && (
                <div><dt className="inline text-ilm-navy/35">Email: </dt><dd className="inline">{selected.email}</dd></div>
              )}
              {selected.category && <div><dt className="inline text-ilm-navy/35">Category: </dt><dd className="inline">{selected.category}</dd></div>}
              {selected.assignedTo && <div><dt className="inline text-ilm-navy/35">Assigned: </dt><dd className="inline">{selected.assignedTo}</dd></div>}
            </dl>

            {!isAuthor && (
              <>
                <label className="mt-6 block text-xs text-ilm-navy/50">Assign to author</label>
                <select
                  value={assignTo}
                  onChange={(e) => setAssignTo(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ilm-navy/10 bg-ilm-cream px-3 py-2.5 text-sm text-ilm-navy outline-none"
                >
                  <option value="">Unassigned</option>
                  {contributors.filter((c) => c.active && c.role === 'author').map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </>
            )}

            {selected.authorDraft && !isAuthor && (
              <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50/60 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-amber-800">Author draft</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-ilm-navy/70">{selected.authorDraft}</p>
              </div>
            )}

            <label className="mt-4 block text-xs text-ilm-navy/50">
              {isAuthor ? 'Your response (sent to admin for review)' : 'Final answer to send to seeker'}
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              placeholder={isAuthor ? 'Write your murabbi response…' : 'Edit the final reply…'}
              className="mt-1 w-full resize-none rounded-xl border border-ilm-navy/10 bg-ilm-cream px-3 py-2.5 text-sm text-ilm-navy outline-none focus:border-ilm-gold"
            />

            <div className="mt-5 flex flex-wrap gap-2">
              {!isAuthor && (
                <button
                  type="button"
                  onClick={() => {
                    if (!assignTo) {
                      void adminSwal.error('Select an author', 'Choose who should answer this question.');
                      return;
                    }
                    assignQuestion(selected.id, assignTo);
                    void adminSwal.success('Assigned', `Email sent to ${assignTo}`);
                    close();
                  }}
                  className="rounded-full border border-ilm-navy/15 px-4 py-2 text-xs text-ilm-navy hover:bg-ilm-cream"
                >
                  Assign & notify author
                </button>
              )}
              {isAuthor && selected.status === 'assigned' && (
                <button
                  type="button"
                  onClick={() => {
                    if (!answer.trim()) {
                      void adminSwal.error('Response required', 'Write your answer before submitting.');
                      return;
                    }
                    authorSubmitAnswer(selected.id, answer.trim(), userName);
                    void adminSwal.success('Submitted', 'Admin will review and send to the seeker.');
                    close();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-ilm-navy px-4 py-2 text-xs text-white"
                >
                  <Send size={13} /> Submit to admin
                </button>
              )}
              {!isAuthor && selected.status !== 'answered' && (
                <button
                  type="button"
                  onClick={() => {
                    if (!answer.trim()) {
                      void adminSwal.error('Answer required', 'Write a response before sending to the seeker.');
                      return;
                    }
                    answerQuestion(selected.id, answer.trim());
                    void adminSwal.success('Sent', 'Reply emailed to the seeker.');
                    close();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-ilm-gold px-4 py-2 text-xs font-semibold text-ilm-navy-deep"
                >
                  <Send size={13} /> Send to seeker
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </Reveal>
  );
}
