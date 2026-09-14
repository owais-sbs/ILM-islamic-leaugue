'use client';

import { AlertCircle, CheckCircle2, FileText, MailQuestion, TrendingUp, Users } from 'lucide-react';
import type { Article, Role } from '@/lib/admin-data';
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
  const { questions, contributors, subscribers, profiles } = useIlm();
  const profile = profiles[role];
  const mine = articles.filter((a) => a.author === profile.name);
  const pool = role === 'author' ? mine : articles;
  const published = articles.filter((a) => a.status === 'published');
  const submitted = articles.filter((a) => a.status === 'submitted');
  const returned = pool.filter((a) => a.status === 'returned');
  const drafts = pool.filter((a) => a.status === 'draft');
  const unanswered = questions.filter((q) => q.status === 'new' || q.status === 'assigned' || q.status === 'author_ready');
  const newQuestions = questions.filter((q) => q.status === 'new');
  const contactLeads = questions.filter((q) => q.source === 'contact' && q.status !== 'answered');
  const askLeads = questions.filter((q) => (q.source === 'ask' || !q.source) && q.status !== 'answered');
  const activeSubs = subscribers.filter((s) => s.active);

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
            { label: 'Open questions', value: String(unanswered.length).padStart(2, '0'), note: `${askLeads.length} ask · ${contactLeads.length} contact`, icon: MailQuestion, tone: 'text-ilm-gold-deep' },
            { label: 'Returned', value: String(articles.filter((a) => a.status === 'returned').length).padStart(2, '0'), note: 'Sent back to authors', icon: AlertCircle, tone: 'text-red-500' },
          ]
        : [
            { label: 'Published', value: String(published.length).padStart(2, '0'), note: 'Live on the public site', icon: TrendingUp, tone: 'text-green-600' },
            { label: 'Awaiting review', value: String(submitted.length).padStart(2, '0'), note: 'Needs attention', icon: CheckCircle2, tone: 'text-blue-600' },
            { label: 'Open leads', value: String(unanswered.length).padStart(2, '0'), note: `${newQuestions.length} unread · ${activeSubs.length} subscribers`, icon: MailQuestion, tone: 'text-ilm-gold-deep' },
          ];

  const recent =
    role === 'author'
      ? mine.slice(0, 5)
      : role === 'editor'
        ? articles.filter((a) => a.status === 'submitted' || a.status === 'approved').slice(0, 5)
        : articles.slice(0, 5);

  const inbox = (role === 'author'
    ? questions.filter((q) => q.assignedTo === profile.name && q.status !== 'answered')
    : questions.filter((q) => q.status !== 'answered')
  )
    .slice()
    .sort((a, b) => {
      const rank = (s: typeof a.status) => (s === 'new' ? 0 : s === 'author_ready' ? 1 : 2);
      return rank(a.status) - rank(b.status);
    })
    .slice(0, 5);

  return (
    <div>
      <Reveal>
        <h2 className="text-2xl font-normal tracking-tight text-ilm-navy">
          Welcome back, {profile.name.split(' ')[0]}.
        </h2>
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

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Reveal delay={0.12}>
          <div className="overflow-hidden rounded-2xl border border-ilm-navy/8 bg-white">
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
                      <p className="text-xs text-ilm-navy/40">
                        {article.author} · {article.date}
                      </p>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <StatusPill status={article.status} />
                    </td>
                  </tr>
                ))}
                {recent.length === 0 && (
                  <tr>
                    <td className="px-6 py-8 text-sm text-ilm-navy/35">No articles in this view yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="overflow-hidden rounded-2xl border border-ilm-navy/8 bg-white">
            <div className="border-b border-ilm-navy/8 px-6 py-4">
              <h3 className="text-lg font-semibold text-ilm-navy">
                {role === 'author' ? 'Assigned questions' : 'Unread & open questions'}
              </h3>
            </div>
            <ul className="divide-y divide-ilm-navy/5">
              {inbox.map((q) => (
                <li key={q.id} className={`px-6 py-3.5 ${q.status === 'new' ? 'bg-ilm-gold/5' : ''}`}>
                  <p className="line-clamp-2 text-sm text-ilm-navy">{q.question}</p>
                  <p className="mt-1 text-xs text-ilm-navy/40">
                    {q.status === 'new' ? 'Unread · ' : ''}
                    {q.asker} · {q.date}
                    {q.status === 'author_ready' ? ' · ready for review' : ''}
                  </p>
                </li>
              ))}
              {inbox.length === 0 && (
                <li className="px-6 py-8 text-sm text-ilm-navy/35">No open questions right now.</li>
              )}
            </ul>
          </div>
        </Reveal>
      </div>

      {role === 'administrator' && (
        <Reveal delay={0.18}>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-ilm-navy/8 bg-white p-6">
              <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold text-ilm-navy">
                <Users size={18} /> Contribution by author
              </h3>
              <div className="space-y-3">
                {contributors
                  .filter((c) => c.role === 'author')
                  .map((c) => {
                    const count = articles.filter((a) => a.author === c.name).length;
                    return (
                      <div key={c.id} className="flex items-center gap-4">
                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-ilm-cream font-serif text-[10px] text-ilm-navy/50">
                          {c.initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-ilm-navy">{c.name}</p>
                          <div className="mt-1 h-1.5 rounded-full bg-ilm-cream">
                            <div
                              className="h-full rounded-full bg-ilm-gold"
                              style={{ width: `${Math.min(100, count * 18)}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-ilm-navy">{count}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="rounded-2xl border border-ilm-navy/8 bg-white p-6">
              <h3 className="mb-2 text-lg font-semibold text-ilm-navy">Newsletter</h3>
              <p className="text-sm text-ilm-navy/50">
                <strong className="text-2xl font-semibold text-ilm-navy">{activeSubs.length}</strong> active subscribers
              </p>
              <ul className="mt-4 space-y-2">
                {subscribers.slice(0, 5).map((s) => (
                  <li key={s.id} className="flex justify-between text-sm">
                    <span className="truncate text-ilm-navy">{s.email}</span>
                    <span className={s.active ? 'text-green-600' : 'text-ilm-navy/35'}>
                      {s.active ? 'Active' : 'Off'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      )}
    </div>
  );
}
