'use client';

import { useState } from 'react';
import { CheckCircle2, Eye, Pencil, RotateCcw, Upload } from 'lucide-react';
import type { Article, Role } from '@/lib/admin-data';
import { StatusPill } from './status-pill';
import { canApprove, canPublish } from '@/lib/ilm-store';
import { adminSwal } from '@/lib/admin-swal';

export function ReviewQueue({
  articles,
  role,
  onPreview,
  onEdit,
  onApprove,
  onReturn,
  onPublish,
}: {
  articles: Article[];
  role: Role;
  onPreview: (article: Article) => void;
  onEdit: (article: Article) => void;
  onApprove: (article: Article) => void;
  onReturn: (article: Article, notes: string) => void;
  onPublish: (article: Article) => void;
}) {
  const [notesFor, setNotesFor] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const isAdmin = canPublish(role);
  const reviewItems = articles.filter(
    (a) => a.status === 'submitted' || a.status === 'approved' || a.status === 'returned'
  );

  return (
    <div>
      <h2 className="mb-2 text-2xl font-semibold tracking-tight text-ilm-navy">Review Queue</h2>
      <p className="mb-5 text-sm text-ilm-navy/50">
        {isAdmin
          ? 'Approve, reject with notes, or publish approved work. Approve & Publish is available in the full editor.'
          : 'Read, edit if needed, then approve or reject with notes. Publishing is Administrator-only.'}
      </p>

      <div className="overflow-hidden rounded-2xl border border-ilm-navy/10 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead>
              <tr className="border-b border-ilm-navy/10 bg-ilm-cream/60">
                <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/55">Article</th>
                <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/55">Author</th>
                <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/55">Status</th>
                <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/55">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviewItems.map((article) => {
                const canReject =
                  canApprove(role) && (article.status === 'submitted' || (isAdmin && article.status === 'approved'));

                return (
                  <tr key={article.id} className="border-b border-ilm-navy/5 last:border-0 align-middle">
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-ilm-navy">{article.title}</p>
                      <p className="mt-0.5 text-xs text-ilm-navy/40">
                        {article.category} · {article.date}
                      </p>
                      {article.status === 'approved' && isAdmin && (
                        <p className="mt-1 text-xs font-medium text-green-700">Approved — ready to publish</p>
                      )}
                      {article.reviewNotes && (
                        <p className="mt-2 text-xs italic text-red-600/70">“{article.reviewNotes}”</p>
                      )}
                      {notesFor === article.id && (
                        <div className="mt-3 space-y-2">
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Notes are required to reject…"
                            rows={3}
                            className="w-full rounded-xl border border-red-100 bg-red-50/50 px-3 py-2 text-sm outline-none"
                          />
                          <div className="flex gap-2">
                            <button
                              disabled={!notes.trim()}
                              onClick={() => {
                                onReturn(article, notes.trim());
                                setNotesFor(null);
                                setNotes('');
                                void adminSwal.success('Returned to author', article.title);
                              }}
                              className="rounded-full bg-red-500 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white disabled:opacity-40"
                            >
                              Reject & send back
                            </button>
                            <button onClick={() => setNotesFor(null)} className="text-[11px] font-bold uppercase text-ilm-navy/40">
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-ilm-navy/60">{article.author}</td>
                    <td className="px-5 py-4">
                      <StatusPill status={article.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-nowrap items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPreview(article)}
                          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-ilm-navy/10 px-2.5 py-1.5 text-[10px] font-bold uppercase text-ilm-navy"
                        >
                          <Eye size={12} /> Preview
                        </button>
                        <button
                          onClick={() => onEdit(article)}
                          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-ilm-navy/10 px-2.5 py-1.5 text-[10px] font-bold uppercase text-ilm-navy"
                        >
                          <Pencil size={12} /> Edit
                        </button>
                        {canApprove(role) && article.status === 'submitted' && (
                          <button
                            onClick={() => {
                              onApprove(article);
                              void adminSwal.success('Approved', article.title);
                            }}
                            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green-600 px-2.5 py-1.5 text-[10px] font-bold uppercase text-white"
                          >
                            <CheckCircle2 size={12} /> Approve
                          </button>
                        )}
                        {canReject && (
                          <button
                            onClick={() => {
                              setNotesFor(article.id);
                              setNotes('');
                            }}
                            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-500 px-2.5 py-1.5 text-[10px] font-bold uppercase text-white"
                          >
                            <RotateCcw size={12} /> Reject
                          </button>
                        )}
                        {isAdmin && article.status === 'approved' && (
                          <button
                            onClick={async () => {
                              const res = await adminSwal.confirm('Publish to website?', article.title, 'Publish');
                              if (!res.isConfirmed) return;
                              onPublish(article);
                              await adminSwal.success('Published', article.title);
                            }}
                            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ilm-gold px-2.5 py-1.5 text-[10px] font-bold uppercase text-ilm-navy-deep"
                          >
                            <Upload size={12} /> Publish
                          </button>
                        )}
                        {article.status === 'approved' && !isAdmin && (
                          <span className="shrink-0 text-[10px] text-ilm-navy/40">Waiting for Admin</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {reviewItems.length === 0 && (
          <div className="py-16 text-center text-sm text-ilm-navy/30">Nothing in the review queue.</div>
        )}
      </div>
    </div>
  );
}
