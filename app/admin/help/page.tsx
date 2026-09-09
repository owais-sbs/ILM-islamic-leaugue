'use client';

import { PageHeader, Card } from '@/components/admin/AdminUI';
import { BookOpen, Edit3, Send, RefreshCw, CheckCircle } from 'lucide-react';

export default function HelpPage() {
  return (
    <div>
      <PageHeader 
        title="Help & Guidelines" 
        description="Understanding your editorial workflow as an Author / Murabbī." 
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Left - The Workflow */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8">
            <h2 className="mb-6 font-display text-2xl font-semibold text-ilm-navy">
              How to Publish an Article
            </h2>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                  <Edit3 size={20} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800">1. Draft your article</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Create a new article and save it as a draft. You can continue editing your drafts at any time from your dashboard.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                  <Send size={20} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800">2. Submit for Review</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Once you are satisfied with your writing, click "Submit for review". Your article will enter the Editor's queue. You can no longer edit it while it is under review.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                  <RefreshCw size={20} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800">3. Corrections (If Returned)</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    If an editor requests changes, the article status will change to <strong>Returned</strong>. You will be able to see the editor's notes at the top of the editing screen. Make the necessary corrections and submit it again.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800">4. Approval & Publishing</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Once approved by an editor, the article will be scheduled or immediately published to the public site.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right - Guidelines */}
        <div className="space-y-6">
          <Card className="bg-[#0B1248] p-6 text-white">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <BookOpen size={20} className="text-sky-300" />
            </div>
            <h3 className="font-display text-lg font-semibold">Editorial Guidelines</h3>
            <ul className="mt-4 space-y-3 text-sm text-sky-100/80">
              <li className="flex gap-2">
                <span className="text-sky-400">•</span> Ensure all Hadith are referenced appropriately.
              </li>
              <li className="flex gap-2">
                <span className="text-sky-400">•</span> Use the built-in Arabic RTL formatting for Ayat.
              </li>
              <li className="flex gap-2">
                <span className="text-sky-400">•</span> Add footnotes for extended explanations or obscure terms.
              </li>
              <li className="flex gap-2">
                <span className="text-sky-400">•</span> Select only the most relevant category.
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
