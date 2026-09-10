'use client';

import { Upload, Copy, Trash2, MailQuestion, ArrowRight, CheckCircle2 } from 'lucide-react';
import { questions } from '@/lib/admin-data';
import { Reveal, StaggerContainer, StaggerItem } from './reveal';

const mediaItems = [
  { id: 'm1', name: 'mosque-sunrise.jpg', size: '2.4 MB' },
  { id: 'm2', name: 'quran-stand.png', size: '1.1 MB' },
  { id: 'm3', name: 'community-table.jpg', size: '3.2 MB' },
  { id: 'm4', name: 'calligraphy-art.png', size: '0.8 MB' },
  { id: 'm5', name: 'mentor-portrait.jpg', size: '1.7 MB' },
  { id: 'm6', name: 'library-books.jpg', size: '2.0 MB' },
];

export function MediaQuestionsScreen() {
  return (
    <Reveal>
      <h2 className="text-2xl font-semibold text-ilm-navy mb-6 tracking-tight">Media & Questions</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-ilm-navy/40 mb-4">Media Library</h3>
          <div className="border-2 border-dashed border-ilm-navy/10 rounded-2xl p-8 text-center mb-4 cursor-pointer hover:border-ilm-gold transition-colors bg-white">
            <Upload size={24} className="mx-auto text-ilm-navy/30 mb-2" />
            <p className="text-sm text-ilm-navy/50">Click or drag to upload</p>
          </div>
          <StaggerContainer className="space-y-2">
            {mediaItems.map((media) => (
              <StaggerItem key={media.id}>
                <div className="bg-white rounded-xl border border-ilm-navy/8 p-3 flex items-center gap-3 hover:border-ilm-gold transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-ilm-cream grid place-items-center text-ilm-navy/30 shrink-0 text-[10px] font-serif">IMG</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-ilm-navy truncate">{media.name}</h4>
                    <p className="text-xs text-ilm-navy/40">{media.size}</p>
                  </div>
                  <button className="text-ilm-navy/30 hover:text-ilm-navy transition-colors"><Copy size={15} /></button>
                  <button className="text-ilm-navy/30 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-ilm-navy/40 mb-4">Question Inbox</h3>
          <StaggerContainer className="space-y-3">
            {questions.map((q) => (
              <StaggerItem key={q.id}>
                <div className="bg-white rounded-xl border border-ilm-navy/8 p-4 hover:border-ilm-gold transition-colors">
                  <div className="flex items-start gap-3">
                    <MailQuestion size={18} className="text-ilm-gold-deep shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ilm-navy">{q.question}</p>
                      <p className="text-xs text-ilm-navy/40 mt-1">{q.asker} · {q.date}</p>
                      {q.assignedTo && <p className="text-xs text-blue-600 mt-1">Assigned to {q.assignedTo}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-ilm-navy/5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${q.status === 'new' ? 'bg-ilm-gold/15 text-ilm-gold-deep' : q.status === 'assigned' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{q.status}</span>
                    {q.status !== 'answered' && <button className="ml-auto flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-ilm-gold-deep hover:text-ilm-gold transition-colors">Assign <ArrowRight size={12} /></button>}
                    {q.status === 'answered' && <CheckCircle2 size={14} className="ml-auto text-green-600" />}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </Reveal>
  );
}
