'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { murabbiyūn, type MurabbiDetail } from '@/lib/public-data';
import { useIlm } from '@/lib/ilm-store';
import { ArticleCard } from '@/components/public/article-card';
import { AskQuestionModal } from '@/components/public/ask-question-modal';
import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';

function DetailBlock({ block }: { block: MurabbiDetail }) {
  if (block.type === 'paragraphs') {
    return (
      <div className="space-y-3">
        {block.text.map((para) => (
          <p key={para.slice(0, 48)} className="text-[15px] leading-relaxed text-ilm-navy/65 sm:text-base">
            {para}
          </p>
        ))}
      </div>
    );
  }

  if (block.type === 'list') {
    return (
      <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-ilm-navy/65 sm:text-base">
        {block.items.map((item) => (
          <li key={item} className="break-words">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === 'meta') {
    return (
      <dl className="space-y-2 text-[15px] sm:text-base">
        {block.entries.map((entry) => (
          <div key={`${entry.label}-${entry.value}`} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
            <dt className="shrink-0 font-semibold text-ilm-navy">{entry.label}:</dt>
            <dd className="min-w-0 break-words text-ilm-navy/65">
              {entry.href ? (
                <a
                  href={entry.href}
                  className="border-b border-ilm-gold/50 text-ilm-navy transition-colors hover:text-ilm-gold-deep"
                  {...(entry.href.startsWith('http')
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {entry.value}
                </a>
              ) : (
                entry.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <div className="space-y-5">
      {block.items.map((book) => (
        <div key={book.title} className="rounded-[20px] border border-ilm-navy/[0.06] bg-ilm-cream/30 p-5">
          <h3 className="text-base font-semibold text-ilm-navy sm:text-lg">{book.title}</h3>
          <div className="mt-3 space-y-2 text-[15px] leading-relaxed text-ilm-navy/65">
            {book.paragraphs.map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MurabbiProfilePage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const person = murabbiyūn.find((m) => m.id === slug);
  const { publishedArticles } = useIlm();
  const [askOpen, setAskOpen] = useState(false);
  const works = useMemo(
    () => publishedArticles.filter((a) => a.authorSlug === slug || a.author === person?.name),
    [publishedArticles, slug, person?.name]
  );

  if (!person) {
    return (
      <main className="grid min-h-screen place-items-center pt-28">
        <SiteHeader active="murabbiyun" />
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-ilm-navy">Profile not found</h1>
          <Link href="/murabbiyun" className="mt-4 inline-flex items-center gap-2 text-ilm-gold-deep">
            <ArrowLeft size={14} /> Directory
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[100svh] flex-col pt-28">
      <SiteHeader active="murabbiyun" />
      <section className="mx-auto grid w-full max-w-[1100px] flex-1 gap-10 px-4 py-8 sm:px-6 sm:py-16 md:grid-cols-[280px_1fr]">
        <div className="text-left">
          <Link
            href="/murabbiyun"
            className="mb-6 inline-flex items-center gap-2 text-sm text-ilm-navy/50 hover:text-ilm-navy"
          >
            <ArrowLeft size={14} /> Murabbiyūn directory
          </Link>
          <div className="h-40 w-40 overflow-hidden rounded-full ring-4 ring-ilm-cream">
            <img src={person.image} alt={person.name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
          </div>
          <h1 className="mt-5 break-words text-2xl font-semibold text-ilm-navy">{person.name}</h1>
          <p className="mt-1 break-words text-ilm-gold-deep">{person.role}</p>
          <div className="mt-6 flex flex-col items-start gap-3">
            <button
              type="button"
              onClick={() => setAskOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ilm-navy px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Ask a question <ArrowRight size={15} />
            </button>
            <Link
              href="/articles"
              className="inline-flex items-center gap-1.5 border-b border-ilm-gold pb-1 text-[13px] font-semibold text-ilm-navy"
            >
              Explore the library <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ilm-gold-deep">Biography</p>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-ilm-navy/70 sm:text-lg">
            {person.biography.map((para) => (
              <p key={para.slice(0, 48)}>{para}</p>
            ))}
          </div>

          <div className="mt-10 space-y-8">
            {person.sections.map((section) => (
              <section key={section.title} className="min-w-0">
                <h2 className="text-xl font-semibold text-ilm-navy">{section.title}</h2>
                <div className="mt-4 space-y-4">
                  {section.blocks.map((block, index) => (
                    <DetailBlock key={`${section.title}-${index}`} block={block} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <h2 className="mt-12 text-xl font-semibold text-ilm-navy">Published articles</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {works.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
            {works.length === 0 && <p className="text-sm text-ilm-navy/40">No published articles yet.</p>}
          </div>
        </div>
      </section>
      <AskQuestionModal open={askOpen} onClose={() => setAskOpen(false)} />
      <SiteFooter />
    </main>
  );
}
