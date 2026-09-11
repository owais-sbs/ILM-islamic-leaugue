'use client';

import { AlertCircle, CheckCircle2, FileText, MailQuestion, TrendingUp } from 'lucide-react';
import type { Article, Role } from '@/lib/admin-data';
import { roleUsers } from '@/lib/admin-data';
import { useIlm } from '@/lib/ilm-store';
import { StaggerContainer, StaggerItem, Reveal } from './reveal';
import { StatusPill } from './status-pill';

export function DashboardScreen({
  role,
  articles,
  onOpen,
}: {
  role: Role;
  articles: Article[];
  onOpen?: (article: Article) => void;
}) {
  const { questions, contributors } = useIlm();
  const mine = articles.filter((a) => a.author === roleUsers[role].name);
  const pool = role === 'author' ? mine : articles;
  const published = articles.filter((a) => a.status === 'published');
  const submitted = articles.filter((a) => a.status === 'submitted');
  const returned = pool.filter((a) => a.status === 'returned');
  const drafts = pool.filter((a) => a.status === 'draft');
  const unanswered = questions.filter((q) => q.status === 'new');
  const user = roleUsers[role];

  const stats =
    role === 'author'
      ? [
          { label: 'My Drafts', value: String(drafts.length).padStart(2, '0'), note: 'In progress', icon: FileText, tone: 'text-ilm-navy' },
          { label: 'Submitted', value: String(mine.filter((a) => a.status === 'submitted').length).padStart(2, '0'), note: 'Awaiting review', icon: CheckCircle2, tone: 'text-blue-600' },
          { label: 'Returned', value: String(returned.length).padStart(2, '0'), note: returned.length > 0 ? 'Needs attention' : 'All clear', icon: AlertCircle, tone: returned.length > 0 ? 'text-red-500' : 'text-ilm-navy' },
        ]
      : role === 'editor'
        ? [
            { label: 'Review Queue', value: String(submitted.length).padStart(2, '0'), note: 'Awaiting your eye', icon: CheckCircle2, tone: 'text-blue-600' },
            { label: 'Approved (awaiting Admin)', value: String(articles.filter((a) => a.status === 'approved').length).padStart(2, '0'), note: 'Cannot publish', icon: FileText, tone: 'text-ilm-navy' },
            { label: 'Returned', value: String(articles.filter((a) => a.status === 'returned').length).padStart(2, '0'), note: 'Sent back to authors', icon: AlertCircle, tone: 'text-red-500' },
          ]
        : [
            { label: 'Published', value: String(published.length).padStart(2, '0'), note: 'Live on the public site', icon: TrendingUp, tone: 'text-green-600' },
            { label: 'Awaiting review', value: String(submitted.length).padStart(2, '0'), note: 'Needs attention', icon: CheckCircle2, tone: 'text-blue-600' },
            { label: 'Ready to publish', value: String(articles.filter((a) => a.status === 'approved').length).padStart(2, '0'), note: `${unanswered.length} open questions`, icon: MailQuestion, tone: 'text-ilm-gold-deep' },
          ];

  const recent =
    role === 'author'
      ? mine.slice(0, 5)
      : role === 'editor'
        ? articles.filter((a) => a.status === 'submitted' || a.status === 'approved').slice(0, 5)
        : articles.slice(0, 5);

  return (
    <div>
      <Reveal>
        <h2 className="text-3xl font-semibold tracking-tight text-ilm-navy">Welcome back, {user.name.split(' ')[0]}.</h2>
        <p className="mt-2 text-ilm-navy/50">
          {role === 'author' && 'Create, edit, and submit your own work. You cannot publish.'}
          {role === 'editor' && 'Review, edit, approve or return. You cannot publish; the Director has final authority.'}
          {role === 'administrator' && 'Final publishing authority. Live articles appear on the public website.'}
        </p>
      </Reveal>

      <StaggerContainer className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <StaggerItem key={stat.label}>
            <div className="rounded-2xl border border-ilm-navy/8 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <stat.icon size={20} className={stat.tone} />
              <div className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-ilm-navy/40">{stat.label}</div>
              <div className="mt-1 text-4xl font-semibold tracking-tight text-ilm-navy">{stat.value}</div>
              <div className="mt-1 text-xs text-ilm-gold-deep">{stat.note}</div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {role === 'author' && returned.length > 0 && (
        <Reveal delay={0.15}>
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-5">
            <AlertCircle size={20} className="mt-0.5 shrink-0 text-red-500" />
            <div>
              <h3 className="text-sm font-bold text-red-700">An article was returned to you</h3>
              <p className="mt-1 text-xs text-red-600/70">Open it from My Articles, read the notes, edit, and submit again.</p>
            </div>
          </div>
        </Reveal>
      )}

      <Reveal delay={0.12}>
        <div className="mt-6 overflow-hidden rounded-2xl border border-ilm-navy/8 bg-white">
          <div className="border-b border-ilm-navy/8 px-6 py-4">
            <h3 className="text-lg font-semibold text-ilm-navy">
              {role === 'author' ? 'Your recent work' : role === 'editor' ? 'Needs your review' : 'Recent articles'}
            </h3>
          </div>
          <table className="w-full text-left">
            <tbody>
              {recent.map((article) => (
                <tr
                  key={article.id}
                  className="cursor-pointer border-b border-ilm-navy/5 last:border-0 hover:bg-ilm-cream/50"
                  onClick={() => onOpen?.(article)}
                >
                  <td className="px-6 py-3.5">
                    <p className="text-sm font-semibold text-ilm-navy">{article.title}</p>
                    <p className="text-xs text-ilm-navy/40">{article.author} · {article.date}</p>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <StatusPill status={article.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      {role === 'administrator' && (
        <Reveal delay={0.18}>
          <div className="mt-6 rounded-2xl border border-ilm-navy/8 bg-white p-6">
            <h3 className="mb-5 text-lg font-semibold text-ilm-navy">Contribution by author</h3>
            <div className="space-y-3">
              {contributors.filter((c) => c.role === 'author').map((c) => (
                <div key={c.id} className="flex items-center gap-4">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-ilm-cream font-serif text-[10px] text-ilm-navy/50">{c.initials}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ilm-navy">{c.name}</p>
                    <div className="mt-1 h-1.5 rounded-full bg-ilm-cream">
                      <div className="h-full rounded-full bg-ilm-gold" style={{ width: `${Math.min(100, articles.filter((a) => a.author === c.name).length * 18)}%` }} />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-ilm-navy">{articles.filter((a) => a.author === c.name).length}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      )}
    </div>
  );
}
