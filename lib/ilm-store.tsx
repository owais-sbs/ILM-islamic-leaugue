'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  articles as seedArticles,
  categories as seedCategories,
  questions as seedQuestions,
  notices as seedNotices,
  activityLog as seedLog,
  subscribers as seedSubscribers,
  contributors as seedContributors,
  seedMedia,
  defaultSiteSettings,
  roleUsers,
  shortDate,
  nowStamp,
  type Article,
  type ArticleStatus,
  type Category,
  type Notice,
  type Question,
  type ActivityEntry,
  type Subscriber,
  type Contributor,
  type Role,
  type UserProfile,
  type MediaItem,
  type SiteSettings,
} from '@/lib/admin-data';

const SEED_TAGS = [
  'spirituality',
  'growth',
  'patience',
  'education',
  'youth',
  'mentorship',
  'community',
  'belonging',
  'leadership',
  'listening',
  'communication',
  'mindfulness',
  'mercy',
  'curiosity',
  'sustainability',
] as const;
import { images, safeArticleImage, safeScholarImage } from '@/lib/images';

const KEY = 'ilm-demo-state-v10';
export const LATEST_PUBLISH_KEY = 'ilm-latest-published-slug';
const LEGACY_KEYS = [
  'ilm-demo-state-v1',
  'ilm-demo-state-v2',
  'ilm-demo-state-v3',
  'ilm-demo-state-v4',
  'ilm-demo-state-v5',
  'ilm-demo-state-v6',
  'ilm-demo-state-v7',
  'ilm-demo-state-v8',
  'ilm-demo-state-v9',
];

interface Store {
  articles: Article[];
  categories: Category[];
  tags: string[];
  questions: Question[];
  notices: Notice[];
  activity: ActivityEntry[];
  subscribers: Subscriber[];
  contributors: Contributor[];
  media: MediaItem[];
  siteSettings: SiteSettings;
  publishedArticles: Article[];
  newlyPublishedSlugs: string[];
  saveArticle: (article: Article, actor: string, asSubmit?: boolean) => void;
  submitArticle: (id: string, actor: string) => void;
  approveArticle: (id: string, actor: string) => void;
  returnArticle: (id: string, actor: string, notes: string) => void;
  publishArticle: (id: string, actor: string) => void;
  unpublishArticle: (id: string, actor: string) => void;
  deleteArticle: (id: string, actor: string) => void;
  addQuestion: (q: Omit<Question, 'id' | 'date' | 'status'>) => void;
  syncQuestions: () => Promise<void>;
  assignQuestion: (id: string, assignee: string) => void;
  authorSubmitAnswer: (id: string, draft: string, authorName: string) => void;
  answerQuestion: (id: string, answerNotes: string) => void;
  profiles: Record<Role, UserProfile>;
  updateProfile: (role: Role, patch: Partial<UserProfile>) => void;
  addCategory: (name: string) => Category | null;
  removeCategory: (id: string) => void;
  addTag: (name: string) => boolean;
  removeTag: (name: string) => void;
  addSubscriber: (email: string) => boolean;
  syncSubscribers: () => Promise<void>;
  toggleSubscriber: (id: string, active: boolean) => void;
  addAuthor: (input: {
    name: string;
    email: string;
    role?: Role;
    madhhab?: string;
    bio?: string;
    inviteToken?: string;
    inviteExpiresAt?: number;
    inviteStatus?: 'pending' | 'active';
  }) => Contributor | null;
  activateInvitedAuthor: (email: string) => void;
  markInviteResent: (id: string, token: string, expiresAt: number) => void;
  toggleAuthorActive: (id: string, active: boolean) => void;
  markNoticeRead: (id: string) => void;
  markAllNoticesRead: (role: Role, authorName?: string) => void;
  addMedia: (item: Omit<MediaItem, 'id' | 'createdAt'>) => MediaItem | null;
  removeMedia: (id: string) => void;
  updateSiteSettings: (patch: Partial<SiteSettings>, actor: string) => void;
}

const IlmContext = createContext<Store | null>(null);

function questionSortKey(q: Question) {
  const rank = q.status === 'new' ? 0 : q.status === 'author_ready' ? 1 : q.status === 'assigned' ? 2 : 3;
  const ts =
    typeof q.createdAt === 'number'
      ? q.createdAt
      : Number.parseInt(String(q.id).replace(/\D/g, ''), 10) || 0;
  return { rank, ts };
}

export function sortQuestions(list: Question[]) {
  return list.slice().sort((a, b) => {
    const ka = questionSortKey(a);
    const kb = questionSortKey(b);
    if (ka.rank !== kb.rank) return ka.rank - kb.rank;
    return kb.ts - ka.ts;
  });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function persist(data: {
  articles: Article[];
  categories: Category[];
  tags: string[];
  questions: Question[];
  notices: Notice[];
  activity: ActivityEntry[];
  subscribers: Subscriber[];
  contributors: Contributor[];
  profiles: Record<Role, UserProfile>;
  media: MediaItem[];
  siteSettings: SiteSettings;
}) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* ignore quota */
  }
}

function readPersisted(): {
  articles?: Article[];
  categories?: Category[];
  tags?: string[];
  questions?: Question[];
  notices?: Notice[];
  activity?: ActivityEntry[];
  subscribers?: Subscriber[];
  contributors?: Contributor[];
  profiles?: Record<Role, UserProfile>;
  media?: MediaItem[];
  siteSettings?: SiteSettings;
} | null {
  try {
    const raw = localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function defaultProfiles(): Record<Role, UserProfile> {
  return {
    author: {
      role: 'author',
      name: roleUsers.author.name,
      email: 'bilal@ilm.org',
      bio: 'Educator and writer focused on spiritual growth and community building.',
      madhhab: 'Maliki',
      credentials: 'Traditional studies · Fiqh',
      image: roleUsers.author.image,
    },
    editor: {
      role: 'editor',
      name: roleUsers.editor.name,
      email: 'omar@ilm.org',
      bio: 'Editor shaping the ILM library with care for language, sources, and the reader’s heart.',
      madhhab: 'Hanafi',
      credentials: 'MA Arabic & Islamic Studies',
      image: roleUsers.editor.image,
    },
    administrator: {
      role: 'administrator',
      name: roleUsers.administrator.name,
      email: 'ibrahim@ilm.org',
      bio: 'Director of the league, stewarding publishing, people, and the public voice of ILM.',
      madhhab: 'Hanafi',
      credentials: 'Imam & Educator',
      image: roleUsers.administrator.image,
    },
  };
}

export function IlmProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>(seedArticles);
  const [categories, setCategories] = useState<Category[]>(seedCategories);
  const [tags, setTags] = useState<string[]>([...SEED_TAGS]);
  const [questions, setQuestions] = useState<Question[]>(seedQuestions);
  const [notices, setNotices] = useState<Notice[]>(seedNotices);
  const [activity, setActivity] = useState<ActivityEntry[]>(seedLog);
  const [subscribers, setSubscribers] = useState<Subscriber[]>(seedSubscribers);
  const [contributors, setContributors] = useState<Contributor[]>(seedContributors);
  const [profiles, setProfiles] = useState<Record<Role, UserProfile>>(defaultProfiles);
  const [media, setMedia] = useState<MediaItem[]>(seedMedia);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [newlyPublishedSlugs, setNewlyPublishedSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      LEGACY_KEYS.forEach((k) => {
        localStorage.removeItem(k);
        sessionStorage.removeItem(k);
      });
    } catch {
      /* ignore */
    }
    const OLD_ARTICLE_SLUGS = new Set([
      'etiquette-of-seeking-sacred-knowledge',
      'understanding-ikhtilaf-with-grace',
      'cultivating-the-heart-in-an-age-of-noise',
      'foundations-of-aqidah-for-seekers',
      'the-language-of-care',
      'on-mercy-and-its-demands',
      'leading-with-a-softer-voice',
      'the-art-of-asking-better-questions',
      'the-prophet-life',
    ]);
    const seedBySlug = new Map(seedArticles.map((a) => [a.slug, a]));

    const parsed = readPersisted();
    if (parsed) {
      if (Array.isArray(parsed.articles)) {
        const extras = parsed.articles
          .filter((a) => a?.slug && !OLD_ARTICLE_SLUGS.has(a.slug) && !seedBySlug.has(a.slug))
          .map((a) => ({ ...a, image: safeArticleImage(a.image) }));
        setArticles([...seedArticles.map((a) => ({ ...a, image: safeArticleImage(a.image) })), ...extras]);
      }
      if (Array.isArray(parsed.categories)) setCategories(parsed.categories);
      if (Array.isArray(parsed.tags)) setTags(parsed.tags);
      if (Array.isArray(parsed.questions)) setQuestions(parsed.questions);
      if (Array.isArray(parsed.notices)) setNotices(parsed.notices);
      if (Array.isArray(parsed.activity)) setActivity(parsed.activity);
      if (Array.isArray(parsed.subscribers)) setSubscribers(parsed.subscribers);
      if (Array.isArray(parsed.contributors)) {
        setContributors(
          parsed.contributors.map((c) => ({
            ...c,
            image: safeScholarImage(c.image),
          })),
        );
      }
      if (parsed.profiles) {
        setProfiles((prev) => ({ ...prev, ...parsed.profiles! }));
      }
      if (Array.isArray(parsed.media) && parsed.media.length) setMedia(parsed.media);
      if (parsed.siteSettings) {
        const settings = { ...defaultSiteSettings, ...parsed.siteSettings };
        setSiteSettings(settings);
        if (settings.featuredArticleId) {
          setArticles((arts) =>
            arts.map((a) => ({
              ...a,
              featured: a.id === settings.featuredArticleId && a.status === 'published',
            })),
          );
        }
      }
    }
    setReady(true);

    // After HMR / stale client state, always re-assert the current seed catalog
    setArticles((prev) => {
      const hasLegacy = prev.some((a) => OLD_ARTICLE_SLUGS.has(a.slug));
      const missingSeed = seedArticles.some((s) => !prev.some((p) => p.slug === s.slug));
      if (!hasLegacy && !missingSeed) return prev;
      const extras = prev.filter(
        (a) => a?.slug && !OLD_ARTICLE_SLUGS.has(a.slug) && !seedBySlug.has(a.slug),
      );
      return [
        ...seedArticles.map((a) => ({ ...a, image: safeArticleImage(a.image) })),
        ...extras.map((a) => ({ ...a, image: safeArticleImage(a.image) })),
      ];
    });

    // Optional remote merge (disabled by default — Supabase demo rows were polluting the library)
    if (process.env.NEXT_PUBLIC_MERGE_REMOTE === '1') {
      void (async () => {
        try {
          const res = await fetch('/api/articles/published', { cache: 'no-store' });
          if (!res.ok) return;
          const json = (await res.json()) as { ok?: boolean; articles?: Article[] };
          if (!json.ok || !Array.isArray(json.articles) || json.articles.length === 0) return;
          setArticles((prev) => {
            const bySlug = new Map(prev.map((a) => [a.slug, a]));
            for (const remote of json.articles!) {
              if (!remote?.slug || OLD_ARTICLE_SLUGS.has(remote.slug)) continue;
              if (seedBySlug.has(remote.slug)) continue;
              if (!remote.title?.trim()) continue;
              const local = bySlug.get(remote.slug);
              bySlug.set(
                remote.slug,
                local
                  ? { ...local, ...remote, status: 'published', image: safeArticleImage(remote.image || local.image) }
                  : { ...remote, status: 'published', image: safeArticleImage(remote.image) },
              );
            }
            return Array.from(bySlug.values());
          });
        } catch {
          /* offline / misconfigured — keep local demo */
        }
      })();
    }
  }, []);

  useEffect(() => {
    if (ready) persist({ articles, categories, tags, questions, notices, activity, subscribers, contributors, profiles, media, siteSettings });
  }, [articles, categories, tags, questions, notices, activity, subscribers, contributors, profiles, media, siteSettings, ready]);

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
    [log, notify],
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
    [log, notify],
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
    [log, notify],
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
    [log, notify],
  );

  const publishArticle = useCallback(
    (id: string, actor: string) => {
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
      setNewlyPublishedSlugs((prev) => [article.slug, ...prev.filter((s) => s !== article.slug)].slice(0, 12));
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
    [articles, log, notify],
  );

  const unpublishArticle = useCallback(
    (id: string, actor: string) => {
      let title = '';
      setArticles((prev) => {
        const article = prev.find((a) => a.id === id);
        if (!article) return prev;
        title = article.title;
        return prev.map((a) => (a.id === id ? { ...a, status: 'approved' as const, featured: false } : a));
      });
      if (!title) return;
      log('Unpublished', actor, title);
    },
    [log],
  );

  const deleteArticle = useCallback(
    (id: string, actor: string) => {
      let title = '';
      setArticles((prev) => {
        const article = prev.find((a) => a.id === id);
        if (!article) return prev;
        title = article.title;
        return prev.filter((a) => a.id !== id);
      });
      if (!title) return;
      log('Deleted', actor, title);
      notify({ title: 'Article deleted', body: title, role: 'administrator' });
    },
    [log, notify],
  );

  const addQuestion = useCallback(
    (q: Omit<Question, 'id' | 'date' | 'status'>) => {
      const source = q.source || 'ask';
      const label = source === 'contact' ? 'New contact message' : 'New question';
      setQuestions((prev) => [
        { ...q, source, id: `q${Date.now()}`, date: shortDate(), createdAt: Date.now(), status: 'new' },
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
              subject: q.subject || (source === 'contact' ? 'Contact from ILM site' : 'Question from the site'),
              body: q.question,
              category: q.category,
              preferredAuthor: q.preferredAuthor,
              source,
            }),
          });
        } catch {
          /* local queue still works */
        }
      })();
      notify({ title: label, body: q.question.slice(0, 120), role: 'editor' });
      notify({ title: label, body: q.question.slice(0, 120), role: 'administrator' });
    },
    [notify],
  );

  const syncQuestions = useCallback(async () => {
    try {
      const res = await fetch('/api/questions', { cache: 'no-store' });
      if (!res.ok) return;
      const json = (await res.json()) as { ok?: boolean; questions?: Question[] };
      if (!json.ok || !Array.isArray(json.questions)) return;
      setQuestions((prev) => {
        const byId = new Map(prev.map((q) => [q.id, q]));
        for (const remote of json.questions!) {
          const local = byId.get(remote.id);
          byId.set(remote.id, local ? { ...local, ...remote } : remote);
        }
        return sortQuestions(Array.from(byId.values()));
      });
    } catch {
      /* ignore */
    }
  }, []);

  const markNoticeRead = useCallback((id: string) => {
    setNotices((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const assignQuestion = useCallback(
    (id: string, assignee: string) => {
      const item = questions.find((q) => q.id === id);
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, assignedTo: assignee, status: 'assigned' as const } : q)),
      );
      const contributor = contributors.find((c) => c.name === assignee);
      notify({
        title: 'Question assigned to you',
        body: item?.question.slice(0, 100) || 'Open Assigned to me.',
        role: 'author',
        authorName: assignee,
      });
      if (contributor?.email) {
        void fetch('/api/questions/assign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id,
            assigneeName: assignee,
            assigneeEmail: contributor.email,
            asker: item?.asker,
            subject: item?.subject,
            question: item?.question,
          }),
        });
      }
    },
    [contributors, notify, questions],
  );

  const authorSubmitAnswer = useCallback(
    (id: string, draft: string, authorName: string) => {
      const item = questions.find((q) => q.id === id);
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === id ? { ...q, authorDraft: draft, status: 'author_ready' as const } : q,
        ),
      );
      notify({ title: 'Author answer ready', body: `${authorName} submitted a draft.`, role: 'editor' });
      notify({ title: 'Author answer ready', body: `${authorName} submitted a draft.`, role: 'administrator' });
      void fetch('/api/questions/author-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          authorName,
          asker: item?.asker,
          subject: item?.subject,
          draft,
        }),
      });
    },
    [notify, questions],
  );

  const updateProfile = useCallback(
    (role: Role, patch: Partial<UserProfile>) => {
      setProfiles((prev) => {
        const before = prev[role];
        const next = { ...before, ...patch, role };
        if (before.name !== next.name) {
          setArticles((arts) =>
            arts.map((a) => (a.author === before.name ? { ...a, author: next.name } : a)),
          );
          setQuestions((qs) =>
            qs.map((q) => (q.assignedTo === before.name ? { ...q, assignedTo: next.name } : q)),
          );
        }
        setContributors((cs) =>
          cs.map((c) => {
            const matchEmail = before.email && c.email.toLowerCase() === before.email.toLowerCase();
            const matchRoleSlot = c.role === role && c.name === before.name;
            if (!matchEmail && !matchRoleSlot) return c;
            return {
              ...c,
              name: next.name,
              email: next.email || c.email,
              madhhab: next.madhhab || c.madhhab,
              image: next.image || c.image,
              initials:
                next.name
                  .split(/\s+/)
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((p) => p[0])
                  .join('')
                  .toUpperCase() || c.initials,
            };
          }),
        );
        return { ...prev, [role]: next };
      });
      log('Updated profile', patch.name || roleUsers[role].name, role);
    },
    [log],
  );

  const markAllNoticesRead = useCallback((role: Role, authorName?: string) => {
    setNotices((prev) =>
      prev.map((n) => {
        const mine =
          n.role === role || n.role === 'all' || (n.role === 'author' && n.authorName === authorName);
        return mine ? { ...n, read: true } : n;
      }),
    );
  }, []);

  const answerQuestion = useCallback(
    (id: string, answerNotes: string) => {
      const item = questions.find((q) => q.id === id);
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, answerNotes, status: 'answered' as const } : q)),
      );
      log('Answered question', 'Staff', answerNotes.slice(0, 80));
      if (item?.email) {
        void fetch('/api/questions/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id,
            email: item.email,
            name: item.asker,
            question: item.question,
            answer: answerNotes,
          }),
        });
      }
    },
    [log, questions],
  );

  const addCategory = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return null;
      const slug = slugify(trimmed);
      if (!slug) return null;
      let created: Category | null = null;
      setCategories((prev) => {
        if (prev.some((c) => c.slug === slug || c.name.toLowerCase() === trimmed.toLowerCase())) return prev;
        created = { id: `cat${Date.now()}`, name: trimmed, slug, articleCount: 0 };
        return [...prev, created];
      });
      if (created) log('Added category', 'Administrator', trimmed);
      return created;
    },
    [log],
  );

  const removeCategory = useCallback(
    (id: string) => {
      setCategories((prev) => {
        const target = prev.find((c) => c.id === id);
        if (target) log('Removed category', 'Administrator', target.name);
        return prev.filter((c) => c.id !== id);
      });
    },
    [log],
  );

  const addTag = useCallback((name: string) => {
    const trimmed = name.trim().toLowerCase();
    if (!trimmed) return false;
    let added = false;
    setTags((prev) => {
      if (prev.includes(trimmed)) return prev;
      added = true;
      return [...prev, trimmed];
    });
    return added;
  }, []);

  const removeTag = useCallback((name: string) => {
    const trimmed = name.trim().toLowerCase();
    setTags((prev) => prev.filter((t) => t !== trimmed));
  }, []);

  const addSubscriber = useCallback((email: string) => {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !normalized.includes('@')) return false;
    let added = false;
    setSubscribers((prev) => {
      const existing = prev.find((s) => s.email.toLowerCase() === normalized);
      if (existing) {
        if (!existing.active) {
          added = true;
          return prev.map((s) => (s.id === existing.id ? { ...s, active: true, date: shortDate() } : s));
        }
        return prev;
      }
      added = true;
      return [{ id: `s${Date.now()}`, email: normalized, date: shortDate(), active: true }, ...prev];
    });
    if (added) {
      notify({ title: 'New subscriber', body: normalized, role: 'administrator' });
      notify({ title: 'New subscriber', body: normalized, role: 'editor' });
      log('New subscriber', 'Public site', normalized);
      void fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalized }),
      }).catch(() => undefined);
    }
    return added;
  }, [log, notify]);

  const syncSubscribers = useCallback(async () => {
    try {
      const res = await fetch('/api/subscribers', { cache: 'no-store' });
      if (!res.ok) return;
      const json = (await res.json()) as {
        ok?: boolean;
        subscribers?: { id: string; email: string; date: string; active: boolean }[];
      };
      if (!json.ok || !Array.isArray(json.subscribers)) return;
      setSubscribers((prev) => {
        const byEmail = new Map(prev.map((s) => [s.email.toLowerCase(), s]));
        for (const remote of json.subscribers!) {
          const key = remote.email.toLowerCase();
          const local = byEmail.get(key);
          byEmail.set(key, local ? { ...local, ...remote, email: key } : { ...remote, email: key });
        }
        return Array.from(byEmail.values()).sort((a, b) => b.date.localeCompare(a.date));
      });
    } catch {
      /* ignore */
    }
  }, []);

  const toggleSubscriber = useCallback((id: string, active: boolean) => {
    setSubscribers((prev) => {
      const target = prev.find((s) => s.id === id);
      if (target?.email) {
        void fetch('/api/subscribers', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: target.email, active }),
        }).catch(() => undefined);
      }
      return prev.map((s) => (s.id === id ? { ...s, active } : s));
    });
  }, []);

  const addMedia = useCallback((item: Omit<MediaItem, 'id' | 'createdAt'>) => {
    const created: MediaItem = {
      ...item,
      id: `m${Date.now()}`,
      createdAt: shortDate(),
    };
    setMedia((prev) => [created, ...prev]);
    log('Uploaded media', 'Staff', created.name);
    return created;
  }, [log]);

  const removeMedia = useCallback(
    (id: string) => {
      setMedia((prev) => {
        const target = prev.find((m) => m.id === id);
        if (target) log('Deleted media', 'Staff', target.name);
        return prev.filter((m) => m.id !== id);
      });
    },
    [log],
  );

  const updateSiteSettings = useCallback(
    (patch: Partial<SiteSettings>, actor: string) => {
      setSiteSettings((prev) => {
        const next = { ...prev, ...patch };
        if (patch.featuredArticleId) {
          setArticles((arts) =>
            arts.map((a) => ({
              ...a,
              featured: a.id === patch.featuredArticleId && a.status === 'published',
            })),
          );
        }
        return next;
      });
      log('Updated settings', actor, Object.keys(patch).join(', '));
    },
    [log],
  );

  const addAuthor = useCallback(
    (input: {
      name: string;
      email: string;
      role?: Role;
      madhhab?: string;
      bio?: string;
      inviteToken?: string;
      inviteExpiresAt?: number;
      inviteStatus?: 'pending' | 'active';
    }) => {
      const name = input.name.trim();
      const email = input.email.trim().toLowerCase();
      if (!name || !email || !email.includes('@')) return null;
      if (contributors.some((c) => c.email.toLowerCase() === email)) return null;

      const parts = name.split(/\s+/).filter(Boolean);
      const initials = ((parts[0]?.[0] || 'A') + (parts[1]?.[0] || parts[0]?.[1] || 'U')).toUpperCase();
      const avatarPool = [
        images.scholarQuran,
        images.scholarBeard,
        images.scholarPrayer,
        images.scholarKufi,
        images.scholarLantern,
      ];
      const pending = input.inviteStatus === 'pending' || Boolean(input.inviteToken);
      const created: Contributor = {
        id: `c${Date.now()}`,
        name,
        email,
        role: input.role || 'author',
        initials,
        madhhab: input.madhhab || 'Hanafi',
        articles: 0,
        active: !pending,
        image: avatarPool[contributors.length % avatarPool.length],
        bio: input.bio,
        inviteStatus: pending ? 'pending' : 'active',
        inviteToken: input.inviteToken,
        inviteExpiresAt: input.inviteExpiresAt,
      };

      setContributors((prev) => [created, ...prev]);
      notify({
        title: pending ? 'Invite sent' : 'Author added',
        body: pending ? `${name} invited — awaiting password setup.` : `${name} can now contribute.`,
        role: 'administrator',
      });
      log(pending ? 'Invited author' : 'Added author', 'Administrator', name);
      return created;
    },
    [contributors, log, notify],
  );

  const activateInvitedAuthor = useCallback((email: string) => {
    const normalized = email.trim().toLowerCase();
    setContributors((prev) =>
      prev.map((c) =>
        c.email.toLowerCase() === normalized
          ? {
              ...c,
              active: true,
              inviteStatus: 'active',
              inviteToken: undefined,
              inviteExpiresAt: undefined,
            }
          : c,
      ),
    );
  }, []);

  const markInviteResent = useCallback((id: string, token: string, expiresAt: number) => {
    setContributors((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, inviteToken: token, inviteExpiresAt: expiresAt, inviteStatus: 'pending', active: false }
          : c,
      ),
    );
  }, []);
  const toggleAuthorActive = useCallback((id: string, active: boolean) => {
    setContributors((prev) => prev.map((c) => (c.id === id ? { ...c, active } : c)));
  }, []);

  const value = useMemo<Store>(
    () => ({
      articles,
      categories,
      tags,
      questions: sortQuestions(questions),
      notices,
      activity,
      subscribers,
      contributors,
      media,
      siteSettings,
      newlyPublishedSlugs,
      publishedArticles: articles
        .filter((a) => a.status === 'published')
        .slice()
        .sort((a, b) => {
          const ta = a.publishedAt || a.date || '';
          const tb = b.publishedAt || b.date || '';
          return tb.localeCompare(ta);
        }),
      saveArticle,
      submitArticle,
      approveArticle,
      returnArticle,
      publishArticle,
      unpublishArticle,
      deleteArticle,
      addQuestion,
      syncQuestions,
      assignQuestion,
      authorSubmitAnswer,
      answerQuestion,
      profiles,
      updateProfile,
      addCategory,
      removeCategory,
      addTag,
      removeTag,
      addSubscriber,
      syncSubscribers,
      toggleSubscriber,
      addAuthor,
      activateInvitedAuthor,
      markInviteResent,
      toggleAuthorActive,
      markNoticeRead,
      markAllNoticesRead,
      addMedia,
      removeMedia,
      updateSiteSettings,
    }),
    [
      articles,
      categories,
      tags,
      questions,
      notices,
      activity,
      subscribers,
      contributors,
      media,
      siteSettings,
      profiles,
      newlyPublishedSlugs,
      saveArticle,
      submitArticle,
      approveArticle,
      returnArticle,
      publishArticle,
      unpublishArticle,
      deleteArticle,
      addQuestion,
      syncQuestions,
      assignQuestion,
      authorSubmitAnswer,
      answerQuestion,
      updateProfile,
      addCategory,
      removeCategory,
      addTag,
      removeTag,
      addSubscriber,
      syncSubscribers,
      toggleSubscriber,
      addAuthor,
      activateInvitedAuthor,
      markInviteResent,
      toggleAuthorActive,
      markNoticeRead,
      markAllNoticesRead,
      addMedia,
      removeMedia,
      updateSiteSettings,
    ],
  );

  return <IlmContext.Provider value={value}>{children}</IlmContext.Provider>;
}

export function useIlm() {
  const ctx = useContext(IlmContext);
  if (!ctx) throw new Error('useIlm must be used within IlmProvider');
  return ctx;
}

export function emptyArticle(role: Role, profile?: UserProfile): Article {
  const user = roleUsers[role];
  const name = profile?.name || user.name;
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase() || user.initials;
  return {
    id: `a${Date.now()}`,
    title: '',
    slug: '',
    excerpt: '',
    body: '',
    footnotes: '',
    seoTitle: '',
    seoDescription: '',
    category: 'Islamic Education',
    author: name,
    authorSlug: user.slug,
    authorInitials: initials,
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
