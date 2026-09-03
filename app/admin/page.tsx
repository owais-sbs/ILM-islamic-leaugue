'use client';

import Link from 'next/link';
import {
  ArrowRight,
  FileText,
  CheckCircle2,
  FileEdit,
  MessageCircle,
  TrendingUp,
} from 'lucide-react';
import { PageHeader, StatCard, Card } from '@/components/admin/AdminUI';
import { StatusBadge } from '@/components/StatusBadge';
import { useRole, roleLabels } from '@/components/admin/RoleContext';
import { articles, questions, authors } from '@/lib/data';

const monthlyData = [
  { author: 'Ustadh Kareem Rahman', count: 3, color: '#0F1657' },
  { author: 'Dr. Maryam Khalid', count: 5, color: '#C9972E' },
  { author: 'Shaykh Yusuf Asad', count: 2, color: '#1a2380' },
  { author: 'Ustadha Sara Ben Omar', count: 1, color: '#4a9b6e' },
];

export default function AdminDashboard() {
  const { role } = useRole();
  const publishedThisMonth = articles.filter((a) => a.status === 'published' && a.publishedAt?.startsWith('2024-08')).length;
  const awaitingReview = articles.filter((a) => a.status === 'submitted').length;
  const myDrafts = articles.filter((a) => a.status === 'draft').length;
  const unanswered = questions.filter((q) => q.status === 'new').length;
  const recentArticles = articles.slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`Welcome back. You're viewing as ${roleLabels[role]}.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Published this month" value={publishedThisMonth} icon={CheckCircle2} trend="+2 vs last" color="emerald" />
        <StatCard label="Awaiting review" value={awaitingReview} icon={FileText} trend="needs attention" color="amber" />
        <StatCard label="My drafts" value={myDrafts} icon={FileEdit} color="blue" />
        <StatCard label="Unanswered questions" value={unanswered} icon={MessageCircle} trend="2 new today" color="rose" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Recent articles */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-ilm-navy">Recent articles</h2>
            <Link href="/admin/articles" className="flex items-center gap-1 text-xs font-medium text-ilm-gold transition hover:gap-2">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-1">
            {recentArticles.map((article) => (
              <Link
                key={article.id}
                href={`/admin/articles/${article.id}/edit`}
                className="flex items-center gap-4 rounded-lg px-3 py-3 transition hover:bg-slate-50"
              >
                <img src={article.featuredImage} alt="" className="h-12 w-16 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{article.title}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{article.authorName} · {article.updatedAt}</p>
                </div>
                <StatusBadge status={article.status} />
              </Link>
            ))}
          </div>
        </Card>

        {/* Per-author monthly contribution */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-ilm-navy">Monthly contributions</h2>
            <TrendingUp size={18} className="text-slate-300" />
          </div>
          <div className="space-y-4">
            {monthlyData.map((d) => (
              <div key={d.author}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600">{d.author}</span>
                  <span className="text-slate-400">{d.count} articles</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(d.count / 5) * 100}%`, background: d.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-center">
            <div>
              <p className="font-display text-2xl font-semibold text-ilm-navy">{articles.length}</p>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">Total</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-ilm-navy">{authors.filter(a => a.active).length}</p>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">Active authors</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-ilm-navy">{articles.reduce((sum, a) => sum + (a.views || 0), 0).toLocaleString()}</p>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">Total views</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
