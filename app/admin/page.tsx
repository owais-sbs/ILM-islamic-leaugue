'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  FileText,
  CheckCircle2,
  FileEdit,
  MessageCircle,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { PageHeader, StatCard, Card } from '@/components/admin/AdminUI';
import { StatusBadge } from '@/components/StatusBadge';
import { useRole, roleLabels } from '@/components/admin/RoleContext';
import { createClient } from '@/lib/supabase/client';
import type { ArticleRow, ProfileRow, QuestionRow } from '@/lib/supabase/types';

export default function AdminDashboard() {
  const { role } = useRole();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [authors, setAuthors] = useState<ProfileRow[]>([]);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const [{ data: arts }, { data: qs }, { data: profiles }] = await Promise.all([
        supabase.from('articles').select('*, profiles(full_name, avatar_url)').order('updated_at', { ascending: false }),
        supabase.from('questions').select('*'),
        supabase.from('profiles').select('*').eq('is_active', true),
      ]);
      setArticles((arts as ArticleRow[]) || []);
      setQuestions((qs as QuestionRow[]) || []);
      setAuthors((profiles as ProfileRow[]) || []);
      setLoading(false);
    };
    load();
  }, []);

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const publishedThisMonth = articles.filter(
    (a) => a.status === 'published' && a.published_at?.startsWith(thisMonth),
  ).length;
  const awaitingReview = articles.filter((a) => a.status === 'submitted').length;
  const myDrafts = articles.filter((a) => a.status === 'draft').length;
  const unanswered = questions.filter((q) => q.status === 'new').length;
  const recentArticles = articles.slice(0, 5);

  const byAuthor = authors
    .map((a) => ({
      author: a.full_name,
      count: articles.filter(
        (art) =>
          art.author_id === a.id &&
          art.status === 'published' &&
          art.published_at?.startsWith(thisMonth),
      ).length,
    }))
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex justify-center py-24 text-sm text-slate-500">
        <Loader2 className="mr-2 animate-spin" size={18} /> Loading dashboard…
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`Welcome back. Signed in as ${roleLabels[role]}.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Published this month" value={publishedThisMonth} icon={CheckCircle2} color="emerald" />
        <StatCard label="Awaiting review" value={awaitingReview} icon={FileText} trend={awaitingReview ? 'needs attention' : undefined} color="amber" />
        <StatCard label="Drafts" value={myDrafts} icon={FileEdit} color="blue" />
        <StatCard label="Unanswered questions" value={unanswered} icon={MessageCircle} color="rose" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-ilm-navy">Recent articles</h2>
            <Link href="/admin/articles" className="flex items-center gap-1 text-xs font-medium text-ilm-navy hover:gap-2">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {recentArticles.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              No articles yet.{' '}
              <Link href="/admin/articles/new" className="font-medium text-ilm-navy hover:underline">Create one</Link>
            </p>
          ) : (
            <div className="space-y-1">
              {recentArticles.map((article) => (
                <Link key={article.id} href={`/admin/articles/${article.id}/edit`} className="flex items-center gap-4 rounded-lg px-3 py-3 hover:bg-sky-50/60">
                  {article.featured_image_url ? (
                    <img src={article.featured_image_url} alt="" className="h-12 w-16 rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-sky-50 text-[10px] text-sky-400">No img</div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">{article.title || 'Untitled'}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {article.profiles?.full_name || 'Unknown'} · {new Date(article.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={article.status} />
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-ilm-navy">Monthly contributions</h2>
            <TrendingUp size={18} className="text-slate-300" />
          </div>
          {byAuthor.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No publishes this month yet.</p>
          ) : (
            <div className="space-y-4">
              {byAuthor.map((d) => (
                <div key={d.author}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-600">{d.author}</span>
                    <span className="text-slate-400">{d.count} articles</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-ilm-navy"
                      style={{ width: `${(d.count / Math.max(...byAuthor.map((x) => x.count), 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-center">
            <div>
              <p className="font-display text-2xl font-semibold text-ilm-navy">{articles.length}</p>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">Total</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-ilm-navy">{authors.length}</p>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">Authors</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-ilm-navy">
                {articles.reduce((sum, a) => sum + (a.views || 0), 0).toLocaleString()}
              </p>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">Views</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
