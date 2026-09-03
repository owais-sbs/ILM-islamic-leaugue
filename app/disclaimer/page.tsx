import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { PageHero, ModernCard } from '@/components/PageHero';

export default function DisclaimerPage() {
  return (
    <main className="bg-white">
      <SiteHeader />
      <PageHero eyebrow="Legal" title="Disclaimer" />
      <section className="px-6 pb-20 md:px-12">
        <div className="mx-auto max-w-3xl">
          <ModernCard className="prose prose-slate max-w-none">
            <p className="text-sm leading-7 text-slate-600">
              The content published on ILM is for general educational and spiritual benefit. It does not constitute formal religious rulings (fatwa) unless explicitly stated and attributed to a qualified authority.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Views expressed by individual contributors are their own and do not necessarily represent the official position of the Islamic League of Murabbiyūn. Readers should consult qualified local scholars for matters requiring personal legal or spiritual guidance.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              ILM makes reasonable efforts to ensure accuracy but does not warrant that all content is complete or current. Use of this site is at your own discretion.
            </p>
          </ModernCard>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
