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
export const LATEST_PUBLISH_KEY = 'ilm-latest-published-slug';

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
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

function readPersisted(): {
  articles?: Article[];
  questions?: Question[];
  notices?: Notice[];
  activity?: ActivityEntry[];
} | null {
  try {
    const raw = localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function IlmProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>(seedArticles);
  const [questions, setQuestions] = useState<Question[]>(seedQuestions);
  const [notices, setNotices] = useState<Notice[]>(seedNotices);
  const [activity, setActivity] = useState<ActivityEntry[]>(seedLog);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const parsed = readPersisted();
    if (parsed) {
      if (Array.isArray(parsed.articles)) setArticles(parsed.articles);
      if (Array.isArray(parsed.questions)) setQuestions(parsed.questions);
      if (Array.isArray(parsed.notices)) setNotices(parsed.notices);
      if (Array.isArray(parsed.activity)) setActivity(parsed.activity);
    }
    setReady(true);

    // Live / Vercel: merge published articles from Supabase so cards work for every visitor
    void (async () => {
      try {
        const res = await fetch('/api/articles/published', { cache: 'no-store' });
        if (!res.ok) return;
        const json = (await res.json()) as { ok?: boolean; articles?: Article[] };
        if (!json.ok || !Array.isArray(json.articles) || json.articles.length === 0) return;
        setArticles((prev) => {
          const bySlug = new Map(prev.map((a) => [a.slug, a]));
          for (const remote of json.articles!) {
            const local = bySlug.get(remote.slug);
            bySlug.set(remote.slug, local ? { ...local, ...remote, status: 'published' } : remote);
          }
          return Array.from(bySlug.values());
        });
      } catch {
        /* offline / misconfigured — keep local demo */
      }
    })();
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
    publishedArticles: articles
      .filter((a) => a.status === 'published')
      .slice()
      .sort((a, b) => {
        const ta = a.publishedAt || a.date || '';
        const tb = b.publishedAt || b.date || '';
        return tb.localeCompare(ta);
      }),
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
      const publishedStamp = shortDate();
      setArticles((prev) =>
        prev.map((a) => {
          if (a.id === id) {
            return {
              ...a,
              status: 'published' as const,
              publishedAt: publishedStamp,
              date: publishedStamp,
              featured: true,
            };
          }
          if (a.status === 'published' && a.featured) {
            return { ...a, featured: false };
          }
          return a;
        }),
      );
      try {
        localStorage.setItem(LATEST_PUBLISH_KEY, article.slug);
      } catch {
        /* ignore */
      }
      // Sync to Supabase so the live site shows the article for all users
      void (async () => {
        try {
          const minutes = Number.parseInt(String(article.readTime), 10) || 5;
          await fetch('/api/articles/publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: article.title,
              slug: article.slug,
              excerpt: article.excerpt,
              body: article.body,
              footnotes: article.footnotes,
              seoTitle: article.seoTitle,
              seoDescription: article.seoDescription,
              category: article.category,
              image: article.image,
              readingMinutes: minutes,
            }),
          });
        } catch {
          /* local publish still works */
        }
      })();
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
      patch(id, (a) => ({ ...a, status: 'approved', featured: false }));
      log('Unpublished', actor, article.title);
    },
    addQuestion: (q) => {
      setQuestions((prev) => [
        { ...q, id: `q${Date.now()}`, date: shortDate(), status: 'new' },
        ...prev,
      ]);
      void (async () => {
        try {
          await fetch('/api/questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: q.asker,
              email: q.email,
              subject: q.subject || 'Question from the site',
              body: q.question,
              category: q.category,
            }),
          });
        } catch {
          /* local queue still works */
        }
      })();
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
