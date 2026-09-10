'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, X } from 'lucide-react';
import { useIlm } from '@/lib/ilm-store';

export function AskQuestionModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addQuestion } = useIlm();
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [question, setQuestion] = useState('');

  const reset = () => {
    setSent(false);
    setBusy(false);
    setError('');
    setName('');
    setQuestion('');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-center bg-ilm-navy/40 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            onClose();
            reset();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-[28px] border border-ilm-navy/8 bg-white p-8 shadow-2xl"
          >
            <button
              onClick={() => {
                onClose();
                reset();
              }}
              className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full text-ilm-navy/40 hover:bg-ilm-cream"
              aria-label="Close"
            >
              <X size={16} />
            </button>
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-ilm-gold-deep">
              <span className="h-px w-6 bg-ilm-gold" /> Ask with adab
            </p>
            <h2 className="mt-3 font-serif text-3xl text-ilm-navy">Ask a question</h2>
            <p className="mt-2 text-sm leading-relaxed text-ilm-navy/55">
              Share what is on your heart. A murabbi will sit with it and reply with care.
            </p>
            {sent ? (
              <p className="mt-8 rounded-2xl bg-ilm-cream px-4 py-5 text-sm text-ilm-navy">
                Received. We will return to you with something thoughtful.
              </p>
            ) : (
              <form
                className="mt-6 space-y-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setBusy(true);
                  setError('');
                  try {
                    addQuestion({
                      asker: name.trim() || 'Anonymous',
                      email: 'visitor@ilm.local',
                      question: question.trim(),
                      subject: 'Question from the site',
                    });
                    setSent(true);
                  } catch {
                    setError('Could not send. Please try again.');
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name (optional to stay anonymous)"
                  className="w-full rounded-2xl border border-ilm-navy/10 bg-ilm-cream px-4 py-3 text-sm outline-none focus:border-ilm-gold"
                />
                <textarea
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={5}
                  placeholder="Your question…"
                  className="w-full resize-none rounded-2xl border border-ilm-navy/10 bg-ilm-cream px-4 py-3 text-sm outline-none focus:border-ilm-gold"
                />
                {error && <p className="text-xs text-red-600">{error}</p>}
                <button
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-full bg-ilm-navy px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {busy ? 'Sending…' : 'Send question'} {busy ? null : <Send size={14} />}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
