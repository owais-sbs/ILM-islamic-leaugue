'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  articles as seedArticles,
  questions as seedQuestions,
  notices as seedNotices,
  activityLog as seedLog,
  roleUsers,
  shortDate,
  nowStamp,
  type Article,
  type ArticleStatus,
  type Notice,
  type Question,
  type ActivityEntry,
  type Role,
} from '@/lib/admin-data';
import { images } from '@/lib/images';

const KEY = 'ilm-demo-state-v1';

interface Store {
  articles: Article[];
  questions: Question[];
  notices: Notice[];
  activity: ActivityEntry[];
  publishedArticles: Article[];
  saveArticle: (article: Article, actor: string, asSubmit?: boolean) => void;
  submitArticle: (id: string, actor: string) => void;
  approveArticle: (id: string, actor: string) => void;
  returnArticle: (id: string, actor: string, notes: string) => void;
  publishArticle: (id: string, actor: string) => void;
  unpublishArticle: (id: string, actor: string) => void;
  addQuestion: (q: Omit<Question, 'id' | 'date' | 'status'>) => void;
  markNoticeRead: (id: string) => void;
}

const IlmContext = createContext<Store | null>(null);

function persist(data: { articles: Article[]; questions: Question[]; notices: Notice[]; activity: ActivityEntry[] }) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function IlmProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>(seedArticles);
  const [questions, setQuestions] = useState<Question[]>(seedQuestions);
  const [notices, setNotices] = useState<Notice[]>(seedNotices);
  const [activity, setActivity] = useState<ActivityEntry[]>(seedLog);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.articles)) setArticles(parsed.articles);
        if (Array.isArray(parsed.questions)) setQuestions(parsed.questions);
        if (Array.isArray(parsed.notices)) setNotices(parsed.notices);
        if (Array.isArray(parsed.activity)) setActivity(parsed.activity);
      }
    } catch {
      /* keep seed */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) persist({ articles, questions, notices, activity });
  }, [articles, questions, notices, activity, ready]);

  const log = (action: string, user: string, target: string) => {
    setActivity((prev) => [{ id: `l${Date.now()}`, action, user, target, timestamp: nowStamp() }, ...prev]);
  };

  const notify = (n: Omit<Notice, 'id'>) => {
    setNotices((prev) => [{ ...n, id: `n${Date.now()}`, read: false }, ...prev]);
  };

  const patch = (id: string, fn: (a: Article) => Article) => {
    setArticles((prev) => prev.map((a) => (a.id === id ? fn(a) : a)));
  };

  const value = useMemo<Store>(() => ({
    articles,
    questions,
    notices,
    activity,
    publishedArticles: articles.filter((a) => a.status === 'published'),
    saveArticle: (article, actor, asSubmit) => {
      const status: ArticleStatus = asSubmit ? 'submitted' : article.status === 'published' ? 'published' : article.id.startsWith('new') || !articles.find((a) => a.id === article.id) ? (asSubmit ? 'submitted' : 'draft') : article.status === 'returned' && !asSubmit ? 'returned' : article.status;
      const next: Article = {
        ...article,
        status: asSubmit ? 'submitted' : status,
        reviewNotes: asSubmit ? undefined : article.reviewNotes,
        revisions: [
          ...article.revisions,
          { version: article.revisions.length + 1, savedAt: nowStamp(), title: article.title },
        ],
      };
      setArticles((prev) => {
        const exists = prev.some((a) => a.id === next.id);
        return exists ? prev.map((a) => (a.id === next.id ? next : a)) : [next, ...prev];
      });
      log(asSubmit ? 'Submitted' : 'Saved', actor, next.title);
      if (asSubmit) {
        notify({ title: 'Article submitted', body: `${next.title} is in the review queue.`, role: 'editor' });
        notify({ title: 'Submitted for review', body: `You submitted “${next.title}”. An editor will review it.`, role: 'author', authorName: next.author });
      }
    },
    submitArticle: (id, actor) => {
      const article = articles.find((a) => a.id === id);
      if (!article) return;
      patch(id, (a) => ({ ...a, status: 'submitted', reviewNotes: undefined }));
      log('Submitted', actor, article.title);
      notify({ title: 'Article submitted', body: `${article.title} is waiting for review.`, role: 'editor' });
    },
    approveArticle: (id, actor) => {
      const article = articles.find((a) => a.id === id);
      if (!article) return;
      patch(id, (a) => ({ ...a, status: 'approved' }));
      log('Approved', actor, article.title);
      notify({
        title: 'Your article was approved',
        body: `“${article.title}” was approved by the editor and is awaiting the Administrator’s publish.`,
        role: 'author',
        authorName: article.author,
      });
      notify({ title: 'Ready to publish', body: `“${article.title}” is approved and waiting for publication.`, role: 'administrator' });
    },
    returnArticle: (id, actor, notes) => {
      const article = articles.find((a) => a.id === id);
      if (!article) return;
      patch(id, (a) => ({ ...a, status: 'returned', reviewNotes: notes }));
      log('Returned', actor, article.title);
      notify({
        title: 'Article returned',
        body: `“${article.title}” was returned. Notes: ${notes}`,
        role: 'author',
        authorName: article.author,
      });
    },
    publishArticle: (id, actor) => {
      const article = articles.find((a) => a.id === id);
      if (!article) return;
      patch(id, (a) => ({
        ...a,
        status: 'published',
        publishedAt: a.publishedAt || shortDate(),
        date: a.publishedAt || shortDate(),
      }));
      log('Published', actor, article.title);
      notify({
        title: 'Your article is live',
        body: `“${article.title}” is now published on the ILM website.`,
        role: 'author',
        authorName: article.author,
      });
    },
    unpublishArticle: (id, actor) => {
      const article = articles.find((a) => a.id === id);
      if (!article) return;
      patch(id, (a) => ({ ...a, status: 'approved' }));
      log('Unpublished', actor, article.title);
    },
    addQuestion: (q) => {
      setQuestions((prev) => [
        { ...q, id: `q${Date.now()}`, date: shortDate(), status: 'new' },
        ...prev,
      ]);
      notify({ title: 'New question', body: q.question, role: 'editor' });
      notify({ title: 'New question', body: q.question, role: 'administrator' });
    },
    markNoticeRead: (id) => setNotices((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n))),
  }), [articles, questions, notices, activity]);

  return <IlmContext.Provider value={value}>{children}</IlmContext.Provider>;
}

export function useIlm() {
  const ctx = useContext(IlmContext);
  if (!ctx) throw new Error('useIlm must be used within IlmProvider');
  return ctx;
}

export function emptyArticle(role: Role): Article {
  const user = roleUsers[role];
  return {
    id: `a${Date.now()}`,
    title: '',
    slug: '',
    excerpt: '',
    body: '',
    footnotes: '',
    seoTitle: '',
    seoDescription: '',
    category: 'Tarbiyah',
    author: user.name,
    authorSlug: user.slug,
    authorInitials: user.initials,
    status: 'draft',
    date: shortDate(),
    readTime: '5 min',
    tags: [],
    image: images.quranSunrise,
    revisions: [],
  };
}

export function canEditArticle(role: Role, article: Article, userName: string) {
  if (role === 'editor' || role === 'administrator') return true;
  return article.author === userName;
}

export function canApprove(role: Role) {
  return role === 'editor' || role === 'administrator';
}

export function canPublish(role: Role) {
  return role === 'administrator';
}
