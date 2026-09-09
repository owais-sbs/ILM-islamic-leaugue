import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { PageHero, SectionLabel } from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Disclaimer — ILM',
  description: 'Editorial disclaimer covering authorship, ikhtilāf, the no-fatwa policy, and corrections.',
};

const sections = [
  {
    title: 'General disclaimer',
    body: [
      'The content published on the Islamic League of Murabbiyūn (ILM) website is provided for general educational and spiritual benefit only. It does not constitute formal legal, medical, financial, or professional advice of any kind.',
      'While ILM makes every reasonable effort to ensure the accuracy and quality of its content, no warranty is given that all information is complete, current, or free from error. Readers rely on the content at their own discretion.',
    ],
  },
  {
    title: 'Authorship & individual views',
    body: [
      'Every article published on ILM is attributed to a named contributor writing under their own scholarly identity. The views expressed are the personal opinions of the named author and do not necessarily represent the institutional position of the Islamic League of Murabbiyūn, its editorial board, or any other contributor.',
      'ILM does not accept anonymous or pseudonymous contributions. All contributors are vetted scholars, researchers, or educators prior to publication.',
    ],
  },
  {
    title: 'Ikhtilāf — principled scholarly disagreement',
    body: [
      'Ikhtilāf (اختلاف) — the tradition of principled disagreement among qualified scholars — is a legitimate and respected feature of Islamic intellectual life. Where valid scholarly differences of opinion exist, ILM aims to present these positions fairly and without enforcing a single institutional view.',
      'Contributors are required to disclose their school of thought (madhhab) and methodological framework where relevant. Articles presenting minority or contested positions are clearly identified as such. Readers are always encouraged to consult a qualified local scholar for personal guidance.',
    ],
  },
  {
    title: 'No fatwa service',
    body: [
      'ILM is an educational publication. Nothing on this platform constitutes a formal religious ruling (fatwā) unless explicitly stated as such and attributed to a qualified issuing authority.',
      'For matters of personal religious obligation, rulings on worship, transactions, family law, or any other area requiring a personal fatwā, readers must consult a recognised qualified scholar in their local community or jurisdiction.',
    ],
  },
  {
    title: 'External links & third-party content',
    body: [
      'ILM may link to external websites or reference third-party sources for informational purposes. Such links do not constitute endorsement of the linked content, organisation, or individual. ILM has no control over the content of external websites and accepts no responsibility for them.',
    ],
  },
  {
    title: 'Corrections policy',
    body: [
      'Factual errors in published articles are corrected promptly upon verification. Corrections are noted transparently within the original article with a date stamp. ILM does not silently revise published content without acknowledgement.',
      'To report a factual error or request a correction, please contact hello@ilm.org.',
    ],
  },
  {
    title: 'Copyright',
    body: [
      'All content published on ILM — including articles, essays, and editorial material — is the intellectual property of the respective authors and the Islamic League of Murabbiyūn. Content may not be reproduced, distributed, or adapted without explicit written permission, except for brief quotation with attribution.',
    ],
  },
];

export default function DisclaimerPage() {
  return (
    <main className="bg-white">
      <SiteHeader />
      <PageHero
        eyebrow="Legal"
        title="Disclaimer"
        description="This page sets out the editorial, authorship, and legal disclaimers governing all content published on ILM."
      />

      <section className="px-6 py-12 md:px-12 md:py-14">
        <div className="mx-auto max-w-3xl">

          {/* Last updated */}
          <p className="mb-8 text-[12px] text-slate-400">
            Last updated: September 2026
          </p>

          <div className="space-y-10">
            {sections.map((s, i) => (
              <div key={s.title}>
                {/* Section number + title */}
                <div className="mb-4 flex items-start gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ilm-gold/10 text-[11px] font-bold text-ilm-gold">
                    {i + 1}
                  </span>
                  <h2 className="font-display text-[1.2rem] text-ilm-navy">
                    {s.title}
                  </h2>
                </div>
                <div className="ml-11 space-y-3">
                  {s.body.map((para, j) => (
                    <p key={j} className="text-[14px] leading-7 text-slate-600">
                      {para}
                    </p>
                  ))}
                </div>
                {i < sections.length - 1 && (
                  <div className="ml-11 mt-8 h-px bg-slate-100" />
                )}
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-12 rounded-xl border border-ilm-gold/20 bg-[#F9F8F5] p-5">
            <p className="text-[13px] leading-6 text-slate-600">
              Questions about this disclaimer may be directed to{' '}
              <a href="mailto:hello@ilm.org" className="font-medium text-ilm-navy transition hover:text-ilm-gold">
                hello@ilm.org
              </a>
              . For the full contact form and authorship details, visit the{' '}
              <Link href="/contact" className="font-medium text-ilm-navy transition hover:text-ilm-gold">
                Contact page
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
