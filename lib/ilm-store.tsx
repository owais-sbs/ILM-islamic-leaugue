'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
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

/** Bump when seed media/content changes so stale session cache cannot keep old images. */
const KEY = 'ilm-demo-state-v2';
const LEGACY_KEYS = ['ilm-demo-state-v1'];

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
      LEGACY_KEYS.forEach((k) => sessionStorage.removeItem(k));
      const raw = sessionStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.articles)) {
          const seedById = new Map(seedArticles.map((a) => [a.id, a]));
          setArticles(
            parsed.articles.map((article: Article) => {
              const seed = seedById.get(article.id);
              if (!seed) return article;
              // Refresh known seed media so cached portraits / URLs cannot stick around
              return {
                ...article,
                image: seed.image,
                excerpt: seed.excerpt || article.excerpt,
              };
            })
          );
        }
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

  const log = useCallback((action: string, user: string, target: string) => {
    setActivity((prev) => [{ id: `l${Date.now()}`, action, user, target, timestamp: nowStamp() }, ...prev]);
  }, []);

  const notify = useCallback((n: Omit<Notice, 'id'>) => {
    setNotices((prev) => [{ ...n, id: `n${Date.now()}`, read: false }, ...prev]);
  }, []);

  const saveArticle = useCallback(
    (article: Article, actor: string, asSubmit?: boolean) => {
      setArticles((prev) => {
        const exists = prev.some((a) => a.id === article.id);
        const status: ArticleStatus = asSubmit
          ? 'submitted'
          : article.status === 'published'
            ? 'published'
            : !exists
              ? 'draft'
              : article.status === 'returned' && !asSubmit
                ? 'returned'
                : article.status;
        const next: Article = {
          ...article,
          status: asSubmit ? 'submitted' : status,
          reviewNotes: asSubmit ? undefined : article.reviewNotes,
          revisions: [
            ...article.revisions,
            { version: article.revisions.length + 1, savedAt: nowStamp(), title: article.title },
          ],
        };
        return exists ? prev.map((a) => (a.id === next.id ? next : a)) : [next, ...prev];
      });
      log(asSubmit ? 'Submitted' : 'Saved', actor, article.title || 'Untitled');
      if (asSubmit) {
        notify({ title: 'Article submitted', body: `${article.title} is in the review queue.`, role: 'editor' });
        notify({
          title: 'Submitted for review',
          body: `You submitted “${article.title}”. An editor will review it.`,
          role: 'author',
          authorName: article.author,
        });
      }
    },
    [log, notify]
  );

  const submitArticle = useCallback(
    (id: string, actor: string) => {
      let title = '';
      setArticles((prev) => {
        const article = prev.find((a) => a.id === id);
        if (!article) return prev;
        title = article.title;
        return prev.map((a) => (a.id === id ? { ...a, status: 'submitted' as const, reviewNotes: undefined } : a));
      });
      if (!title) return;
      log('Submitted', actor, title);
      notify({ title: 'Article submitted', body: `${title} is waiting for review.`, role: 'editor' });
    },
    [log, notify]
  );

  const approveArticle = useCallback(
    (id: string, actor: string) => {
      let title = '';
      let author = '';
      setArticles((prev) => {
        const article = prev.find((a) => a.id === id);
        if (!article) return prev;
        title = article.title;
        author = article.author;
        return prev.map((a) => (a.id === id ? { ...a, status: 'approved' as const } : a));
      });
      if (!title) return;
      log('Approved', actor, title);
      notify({
        title: 'Your article was approved',
        body: `“${title}” was approved by the editor and is awaiting the Administrator’s publish.`,
        role: 'author',
        authorName: author,
      });
      notify({ title: 'Ready to publish', body: `“${title}” is approved and waiting for publication.`, role: 'administrator' });
    },
    [log, notify]
  );

  const returnArticle = useCallback(
    (id: string, actor: string, notes: string) => {
      let title = '';
      let author = '';
      setArticles((prev) => {
        const article = prev.find((a) => a.id === id);
        if (!article) return prev;
        title = article.title;
        author = article.author;
        return prev.map((a) => (a.id === id ? { ...a, status: 'returned' as const, reviewNotes: notes } : a));
      });
      if (!title) return;
      log('Returned', actor, title);
      notify({
        title: 'Article returned',
        body: `“${title}” was returned. Notes: ${notes}`,
        role: 'author',
        authorName: author,
      });
    },
    [log, notify]
  );

  const publishArticle = useCallback(
    (id: string, actor: string) => {
      let title = '';
      let author = '';
      setArticles((prev) => {
        const article = prev.find((a) => a.id === id);
        if (!article) return prev;
        title = article.title;
        author = article.author;
        const stamped = article.publishedAt || shortDate();
        return prev.map((a) =>
          a.id === id
            ? {
                ...a,
                status: 'published' as const,
                publishedAt: stamped,
                date: stamped,
              }
            : a
        );
      });
      if (!title) return;
      log('Published', actor, title);
      notify({
        title: 'Your article is live',
        body: `“${title}” is now published on the ILM website.`,
        role: 'author',
        authorName: author,
      });
    },
    [log, notify]
  );

  const unpublishArticle = useCallback(
    (id: string, actor: string) => {
      let title = '';
      setArticles((prev) => {
        const article = prev.find((a) => a.id === id);
        if (!article) return prev;
        title = article.title;
        return prev.map((a) => (a.id === id ? { ...a, status: 'approved' as const } : a));
      });
      if (!title) return;
      log('Unpublished', actor, title);
    },
    [log]
  );

  const addQuestion = useCallback(
    (q: Omit<Question, 'id' | 'date' | 'status'>) => {
      setQuestions((prev) => [{ ...q, id: `q${Date.now()}`, date: shortDate(), status: 'new' }, ...prev]);
      notify({ title: 'New question', body: q.question, role: 'editor' });
      notify({ title: 'New question', body: q.question, role: 'administrator' });
    },
    [notify]
  );

  const markNoticeRead = useCallback((id: string) => {
    setNotices((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const value = useMemo<Store>(
    () => ({
      articles,
      questions,
      notices,
      activity,
      publishedArticles: articles.filter((a) => a.status === 'published'),
      saveArticle,
      submitArticle,
      approveArticle,
      returnArticle,
      publishArticle,
      unpublishArticle,
      addQuestion,
      markNoticeRead,
    }),
    [
      articles,
      questions,
      notices,
      activity,
      saveArticle,
      submitArticle,
      approveArticle,
      returnArticle,
      publishArticle,
      unpublishArticle,
      addQuestion,
      markNoticeRead,
    ]
  );

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
