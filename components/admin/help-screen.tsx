'use client';

import { Reveal } from './reveal';

const guideItems = [
  { q: 'How do I create an article?', a: 'Click "Create Article" in the sidebar. Write your title, excerpt, and body. Use the sidebar on the editor screen to set category, tags, and featured image. Click "Save Draft" to keep working, or "Submit for Review" when you are ready for an editor to review.' },
  { q: 'What happens after I submit?', a: 'Your article moves to the "Submitted" status. An editor will review it and either approve it (sending it to the administrator for publishing) or return it with notes. You will see returned articles on your dashboard with a red highlight.' },
  { q: 'Can I edit a published article?', a: 'Published articles cannot be edited directly. Contact an editor or administrator if a change is needed.' },
  { q: 'How do I add footnotes?', a: 'Use the Footnotes section in the editor sidebar. Number each footnote and reference it in your body text with the corresponding number.' },
  { q: 'What are tags for?', a: 'Tags help readers find related content. Add 2-5 relevant tags separated by commas in the Tags field.' },
];

export function HelpScreen() {
  return (
    <Reveal>
      <h2 className="text-2xl font-semibold text-ilm-navy mb-2 tracking-tight">Help & Guide</h2>
      <p className="text-ilm-navy/50 mb-8 text-sm">A short guide to using the ILM contributor portal.</p>
      <div className="space-y-4">
        {guideItems.map((item) => (
          <div key={item.q} className="bg-white rounded-2xl border border-ilm-navy/8 p-6">
            <h3 className="text-[15px] font-semibold text-ilm-navy mb-2">{item.q}</h3>
            <p className="text-sm text-ilm-navy/60 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
