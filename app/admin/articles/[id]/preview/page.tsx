'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { fetchAdminArticle } from '@/lib/admin-api';
import type { ArticleRow } from '@/lib/supabase/types';

export default function ArticlePreviewPage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<ArticleRow | null>(null);
  const [tagNames, setTagNames] = useState<string[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    fetchAdminArticle(params.id)
      .then(({ article: row, tagNames: tags }) => {
        setArticle(row);
        setTagNames(tags);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load article'))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F7FB] text-slate-500">
        <Loader2 className="mr-2 animate-spin" size={24} />
        <p>Loading preview…</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#F4F7FB] text-slate-500">
        <p>{error || 'Article not found.'}</p>
        <Link href="/admin/articles" className="text-sm font-medium text-ilm-navy hover:underline">
          Return to Articles
        </Link>
      </div>
    );
  }

  const categoryName  = article.categories?.name || 'Uncategorised';
  const authorName    = article.profiles?.full_name || 'ILM Contributor';
  const authorAvatar  = article.profiles?.avatar_url || '';

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-24">
      {/* Preview topbar */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link
            href="/admin/articles"
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-ilm-navy"
          >
            <ArrowLeft size={16} /> Back to Articles
          </Link>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              Preview Mode
            </span>
            {(article.status === 'draft' || article.status === 'returned') && (
              <Link
                href={`/admin/articles/${article.id}/edit`}
                className="rounded-lg bg-ilm-navy px-4 py-2 text-xs font-semibold text-white hover:bg-ilm-navy-light"
              >
                Edit Article
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Article content */}
      <main className="mx-auto mt-12 max-w-3xl px-6">
        <article className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm md:p-12 lg:p-16">
          {/* Header */}
          <header className="mb-10 text-center">
            <div className="mb-4 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[.15em] text-sky-600">
              <span>{categoryName}</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500">{article.reading_minutes} min read</span>
            </div>

            <h1 className="mb-6 font-display text-4xl font-semibold leading-[1.15] text-[#0f172a] md:text-5xl">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-500">
                {article.excerpt}
              </p>
            )}

            <div className="mt-8 flex items-center justify-center gap-3 border-t border-slate-100 pt-8">
              {authorAvatar ? (
                <img src={authorAvatar} alt={authorName} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-400 text-sm font-bold">
                  {authorName[0]}
                </div>
              )}
              <div className="text-left">
                <p className="font-medium text-slate-800">{authorName}</p>
                <p className="text-sm text-slate-500">
                  {new Date(article.updated_at).toLocaleDateString('en-GB', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </header>

          {/* Featured image */}
          {article.featured_image_url && (
            <div className="mb-12 overflow-hidden rounded-xl">
              <img
                src={article.featured_image_url}
                alt={article.title}
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Body — ~70ch line length, prose typography */}
          <div
            className="article-body mx-auto max-w-[68ch]"
            dangerouslySetInnerHTML={{ __html: article.body_html || '' }}
          />

          {/* Footnotes */}
          {article.footnotes && (
            <div className="mt-10 border-t border-slate-100 pt-6 text-sm text-slate-500 whitespace-pre-wrap">
              {article.footnotes}
            </div>
          )}

          {/* Tags */}
          {tagNames.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-slate-100 pt-6">
              {tagNames.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </main>
    </div>
  );
}
