'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
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
import { murabbiyūn } from '@/lib/public-data';

const directoryProfileContributors: Contributor[] = murabbiyūn.map((person) => ({
  id: person.id,
  name: person.name,
  email: '',
  role: 'author',
  initials: person.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase(),
  madhhab: person.madhhab || '',
  articles: 0,
  active: true,
  image: person.image,
  bio: person.bio,
  staffTitle: person.role,
  biography: person.biography,
  focus: person.focus,
  accent: person.accent,
  showInDirectory: true,
  directoryOnly: true,
}));

const KEY = 'ilm-demo-state-v13';
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
  'ilm-demo-state-v10',
  'ilm-demo-state-v11',
  'ilm-demo-state-v12',
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
  deleteArticle: (id: string, slug: string, actor: string) => Promise<{ ok: boolean; error?: string }>;
  addQuestion: (q: Omit<Question, 'id' | 'date' | 'status'>) => void;
  syncQuestions: () => Promise<void>;
  assignQuestion: (id: string, assignee: Pick<Contributor, 'name' | 'email' | 'role'>) => Promise<{ ok: boolean; emailSent: boolean; error?: string }>;
  authorSubmitAnswer: (id: string, draft: string, authorName: string) => void;
  answerQuestion: (id: string, answerNotes: string) => void;
  profiles: Record<Role, UserProfile>;
  updateProfile: (role: Role, patch: Partial<UserProfile>) => void;
  addCategory: (name: string) => Promise<{ ok: boolean; category?: Category; localOnly?: boolean; error?: string }>;
  removeCategory: (id: string) => Promise<{ ok: boolean; localOnly?: boolean; error?: string }>;
  addTag: (name: string) => Promise<{ ok: boolean; localOnly?: boolean; error?: string }>;
  removeTag: (name: string) => Promise<{ ok: boolean; localOnly?: boolean; error?: string }>;
  addSubscriber: (email: string) => Promise<{ ok: boolean; localOnly?: boolean; error?: string }>;
  syncSubscribers: () => Promise<void>;
  toggleSubscriber: (id: string, active: boolean) => void;
  addAuthor: (input: {
    name: string;
    email: string;
    role?: Role;
    madhhab?: string;
    bio?: string;
    staffTitle?: string;
    inviteToken?: string;
    inviteExpiresAt?: number;
    inviteStatus?: 'pending' | 'active';
  }) => Contributor | null;
  activateInvitedAuthor: (email: string) => void;
  markInviteResent: (id: string, token: string, expiresAt: number) => void;
  toggleAuthorActive: (id: string, active: boolean) => void;
  updateContributorProfile: (id: string, patch: Partial<Pick<Contributor, 'staffTitle' | 'bio' | 'biography' | 'focus' | 'accent' | 'image' | 'showInDirectory'>>, fallback?: Contributor) => Promise<{ ok: boolean; localOnly?: boolean; error?: string }>;
  markNoticeRead: (id: string) => void;
  markAllNoticesRead: (role: Role, authorName?: string) => void;
  addMedia: (item: Omit<MediaItem, 'id' | 'createdAt'>, id?: string) => MediaItem | null;
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
  deletedArticleIds?: string[];
  deletedArticleSlugs?: string[];
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
  deletedArticleIds?: string[];
  deletedArticleSlugs?: string[];
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
  const [contributors, setContributors] = useState<Contributor[]>([...seedContributors, ...directoryProfileContributors]);
  const [profiles, setProfiles] = useState<Record<Role, UserProfile>>(defaultProfiles);
  const [media, setMedia] = useState<MediaItem[]>(seedMedia);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [newlyPublishedSlugs, setNewlyPublishedSlugs] = useState<string[]>([]);
  const [deletedArticleIds, setDeletedArticleIds] = useState<Set<string>>(new Set());
  const [deletedArticleSlugs, setDeletedArticleSlugs] = useState<Set<string>>(new Set());
  const deletedArticleSlugsRef = useRef<Set<string>>(new Set());
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
      'role-of-a-murabbi-nurturing-knowledge-character-faith',
      'ethics-of-disagreement-ikhtilaf-with-wisdom',
      'seeking-knowledge-with-purpose-learning-to-practice',
    ]);
    const seedBySlug = new Map(seedArticles.map((a) => [a.slug, a]));
    const withSafeImages = () => seedArticles.map((a) => ({ ...a, image: safeArticleImage(a.image) }));

    const parsed = readPersisted();
    // Always start from the current seed catalog so public articles never vanish after a content swap.
    // BUT honour any deliberately deleted seed articles.
    const deletedIds = new Set<string>(Array.isArray(parsed?.deletedArticleIds) ? parsed!.deletedArticleIds : []);
    const deletedSlugs = new Set<string>(Array.isArray(parsed?.deletedArticleSlugs) ? parsed!.deletedArticleSlugs : []);
    deletedArticleSlugsRef.current = deletedSlugs;
    if (deletedIds.size > 0) setDeletedArticleIds(deletedIds);
    if (deletedSlugs.size > 0) setDeletedArticleSlugs(deletedSlugs);

    let nextArticles = withSafeImages().filter((a) => !deletedIds.has(a.id) && !deletedSlugs.has(a.slug));
    if (parsed) {
      if (Array.isArray(parsed.articles)) {
        const extras = parsed.articles
          .filter((a) => a?.slug && !OLD_ARTICLE_SLUGS.has(a.slug) && !seedBySlug.has(a.slug) && !deletedIds.has(a.id) && !deletedSlugs.has(a.slug))
          .map((a) => ({ ...a, image: safeArticleImage(a.image) }));
        nextArticles = [...withSafeImages().filter((a) => !deletedIds.has(a.id) && !deletedSlugs.has(a.slug)), ...extras];
      }
      if (Array.isArray(parsed.categories)) {
        // Prefer the current seed category list so new topics (Purification, Prayer) are never dropped.
        const bySlug = new Map(seedCategories.map((c) => [c.slug, { ...c }]));
        for (const c of parsed.categories) {
          if (!c?.slug || bySlug.has(c.slug)) continue;
          bySlug.set(c.slug, c);
        }
        setCategories(Array.from(bySlug.values()));
      }
      if (Array.isArray(parsed.tags)) setTags(parsed.tags);
      if (Array.isArray(parsed.questions)) setQuestions(parsed.questions);
      if (Array.isArray(parsed.notices)) setNotices(parsed.notices);
      if (Array.isArray(parsed.activity)) setActivity(parsed.activity);
      if (Array.isArray(parsed.subscribers)) setSubscribers(parsed.subscribers);
      if (Array.isArray(parsed.contributors)) {
        setContributors((prev) => {
          const byId = new Map(prev.map((person) => [person.id, person]));
          for (const person of parsed.contributors!) {
            byId.set(person.id, {
              ...byId.get(person.id),
              ...person,
              image: safeScholarImage(person.image),
            });
          }
          return Array.from(byId.values());
        });
      }
      if (parsed.profiles) {
        setProfiles((prev) => ({ ...prev, ...parsed.profiles! }));
      }
      if (Array.isArray(parsed.media) && parsed.media.length) setMedia(parsed.media);
      if (parsed.siteSettings) {
        const settings = { ...defaultSiteSettings, ...parsed.siteSettings };
        // Keep featured on the current seed featured article when the saved id is stale.
        const featuredId = nextArticles.some((a) => a.id === settings.featuredArticleId)
          ? settings.featuredArticleId
          : defaultSiteSettings.featuredArticleId;
        setSiteSettings({ ...settings, featuredArticleId: featuredId });
        nextArticles = nextArticles.map((a) => ({
          ...a,
          featured: a.id === featuredId && a.status === 'published',
        }));
      }
    }
    setArticles(nextArticles);
    setReady(true);

    // Live merge on Vercel/production: published articles, categories, settings from Supabase.
    // Seeds always win for their slugs; remote fills everything else. Disable with NEXT_PUBLIC_MERGE_REMOTE=0.
    const mergeRemote = process.env.NEXT_PUBLIC_MERGE_REMOTE !== '0';
    if (mergeRemote) {
      void (async () => {
        try {
          const [artsRes, workflowRes, catsRes, settingsRes, staffProfilesRes, subscribersRes] = await Promise.all([
            fetch('/api/articles/published', { cache: 'no-store' }),
            fetch('/api/articles/workflow', { cache: 'no-store' }),
            fetch('/api/admin/categories', { cache: 'no-store' }),
            fetch('/api/admin/settings', { cache: 'no-store' }),
            fetch('/api/staff-profiles', { cache: 'no-store' }),
            fetch('/api/subscribers', { cache: 'no-store' }),
          ]);

          const mergeRemoteArticles = (remoteArticles: Article[], forceStatus?: Article['status']) => {
            setArticles((prev) => {
              const bySlug = new Map(prev.map((a) => [a.slug, a]));
              for (const remote of remoteArticles) {
                if (!remote?.slug || OLD_ARTICLE_SLUGS.has(remote.slug)) continue;
                if (seedBySlug.has(remote.slug)) continue;
                if (deletedArticleSlugsRef.current.has(remote.slug)) continue;
                if (!remote.title?.trim()) continue;
                const local = bySlug.get(remote.slug);
                const status = forceStatus || remote.status;
                bySlug.set(
                  remote.slug,
                  local
                    ? { ...local, ...remote, status, image: safeArticleImage(remote.image || local.image) }
                    : { ...remote, status, image: safeArticleImage(remote.image) },
                );
              }
              return Array.from(bySlug.values());
            });
          };

          if (artsRes.ok) {
            const json = (await artsRes.json()) as { ok?: boolean; articles?: Article[] };
            if (json.ok && Array.isArray(json.articles) && json.articles.length > 0) {
              mergeRemoteArticles(json.articles, 'published');
            }
          }

          if (workflowRes.ok) {
            const json = (await workflowRes.json()) as { ok?: boolean; articles?: Article[] };
            if (json.ok && Array.isArray(json.articles) && json.articles.length > 0) {
              mergeRemoteArticles(json.articles);
            }
          }

          if (catsRes.ok) {
            const json = (await catsRes.json()) as {
              ok?: boolean;
              categories?: Category[];
              tags?: string[];
            };
            if (json.ok && Array.isArray(json.categories) && json.categories.length > 0) {
              setCategories((prev) => {
                const bySlug = new Map(prev.map((c) => [c.slug, c]));
                for (const remote of json.categories!) {
                  if (!remote?.slug) continue;
                  const local = bySlug.get(remote.slug);
                  bySlug.set(remote.slug, local ? { ...local, ...remote, name: remote.name || local.name } : remote);
                }
                return Array.from(bySlug.values());
              });
            }
            if (json.ok && Array.isArray(json.tags) && json.tags.length > 0) {
              setTags((prev) => Array.from(new Set([...prev, ...json.tags!.map((t) => t.toLowerCase())])));
            }
          }

          if (settingsRes.ok) {
            const json = (await settingsRes.json()) as {
              ok?: boolean;
              settings?: Partial<SiteSettings>;
            };
            if (json.ok && json.settings) {
              setSiteSettings((prev) => ({ ...prev, ...json.settings }));
            }
          }

          if (staffProfilesRes.ok) {
            const json = (await staffProfilesRes.json()) as {
              ok?: boolean;
              profiles?: Array<Partial<Contributor> & { id: string }>;
            };
            if (json.ok && Array.isArray(json.profiles)) {
              setContributors((prev) => {
                const byId = new Map(prev.map((person) => [person.id, person]));
                for (const profile of json.profiles!) {
                  const local = byId.get(profile.id);
                  if (!local && !profile.name) continue;
                  const name = profile.name || local!.name;
                  const initials = name
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join('')
                    .toUpperCase();
                  byId.set(profile.id, {
                    ...(local || {
                      id: profile.id,
                      name,
                      email: '',
                      role: profile.role || 'author',
                      initials: initials || 'ILM',
                      madhhab: profile.madhhab || '',
                      articles: 0,
                      active: true,
                      image: safeScholarImage(profile.image),
                      directoryOnly: true,
                    }),
                    ...profile,
                    initials: initials || local?.initials || 'ILM',
                    image: profile.image ? safeScholarImage(profile.image) : local?.image || safeScholarImage(''),
                    staffTitle: profile.staffTitle ?? local?.staffTitle,
                    bio: profile.bio ?? local?.bio,
                    biography: profile.biography ?? local?.biography,
                    focus: profile.focus ?? local?.focus,
                    accent: profile.accent ?? local?.accent,
                    showInDirectory: profile.showInDirectory ?? local?.showInDirectory,
                    active: profile.active ?? local?.active ?? true,
                  });
                }
                return Array.from(byId.values());
              });
            }
          }

          if (subscribersRes.ok) {
            const json = (await subscribersRes.json()) as {
              ok?: boolean;
              subscribers?: Subscriber[];
            };
            if (json.ok && Array.isArray(json.subscribers)) {
              // Remote list is source of truth for newsletter (drop demo seed emails).
              setSubscribers(
                json.subscribers
                  .map((s) => ({ ...s, email: s.email.toLowerCase() }))
                  .sort((a, b) => b.date.localeCompare(a.date)),
              );
            }
          }

          const mediaRes = await fetch('/api/admin/media', { cache: 'no-store' });
          if (mediaRes.ok) {
            const json = (await mediaRes.json()) as {
              ok?: boolean;
              media?: MediaItem[];
            };
            if (json.ok && Array.isArray(json.media) && json.media.length > 0) {
              setMedia((prev) => {
                const byId = new Map(prev.map((m) => [m.id, m]));
                for (const remote of json.media!) {
                  byId.set(remote.id, remote);
                }
                return Array.from(byId.values());
              });
            }
          }
        } catch {
          /* offline / misconfigured — keep local */
        }
      })();
    }
  }, []);

  useEffect(() => {
    if (ready) persist({ articles, categories, tags, questions, notices, activity, subscribers, contributors, profiles, media, siteSettings, deletedArticleIds: [...deletedArticleIds], deletedArticleSlugs: [...deletedArticleSlugs] });
  }, [articles, categories, tags, questions, notices, activity, subscribers, contributors, profiles, media, siteSettings, deletedArticleIds, deletedArticleSlugs, ready]);

  const log = useCallback((action: string, user: string, target: string) => {
    setActivity((prev) => [{ id: `l${Date.now()}`, action, user, target, timestamp: nowStamp() }, ...prev]);
  }, []);

  const notify = useCallback((n: Omit<Notice, 'id'>) => {
    setNotices((prev) => [{ ...n, id: `n${Date.now()}`, read: false }, ...prev]);
  }, []);

  const syncArticleWorkflow = useCallback(
    (article: Article, action: 'submit' | 'approve' | 'return' | 'unpublish' | 'save', reviewNotes?: string) => {
      const minutes = Number.parseInt(String(article.readTime), 10) || 5;
      void fetch('/api/articles/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
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
          reviewNotes,
          status: article.status,
        }),
      }).catch(() => undefined);
    },
    [],
  );

  const saveArticle = useCallback(
    (article: Article, actor: string, asSubmit?: boolean) => {
      const exists = articles.some((a) => a.id === article.id);
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
      setArticles((prev) => {
        const already = prev.some((a) => a.id === next.id);
        return already ? prev.map((a) => (a.id === next.id ? next : a)) : [next, ...prev];
      });
      if (next.status === 'published') {
        // Admin may save while published — keep content live via publish API
        void fetch('/api/articles/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: next.title,
            slug: next.slug,
            excerpt: next.excerpt,
            body: next.body,
            footnotes: next.footnotes,
            seoTitle: next.seoTitle,
            seoDescription: next.seoDescription,
            category: next.category,
            image: next.image,
            readingMinutes: Number.parseInt(String(next.readTime), 10) || 5,
          }),
        }).catch(() => undefined);
      } else {
        syncArticleWorkflow(next, asSubmit ? 'submit' : 'save');
      }
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
    [articles, log, notify, syncArticleWorkflow],
  );

  const submitArticle = useCallback(
    (id: string, actor: string) => {
      const article = articles.find((a) => a.id === id);
      if (!article) return;
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'submitted' as const, reviewNotes: undefined } : a)),
      );
      syncArticleWorkflow({ ...article, status: 'submitted' }, 'submit');
      log('Submitted', actor, article.title);
      notify({ title: 'Article submitted', body: `${article.title} is waiting for review.`, role: 'editor' });
    },
    [articles, log, notify, syncArticleWorkflow],
  );

  const approveArticle = useCallback(
    (id: string, actor: string) => {
      const article = articles.find((a) => a.id === id);
      if (!article) return;
      setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'approved' as const } : a)));
      syncArticleWorkflow({ ...article, status: 'approved' }, 'approve');
      log('Approved', actor, article.title);
      notify({
        title: 'Your article was approved',
        body: `“${article.title}” was approved by the editor and is awaiting the Administrator’s publish.`,
        role: 'author',
        authorName: article.author,
      });
      notify({
        title: 'Ready to publish',
        body: `“${article.title}” is approved and waiting for publication.`,
        role: 'administrator',
      });
    },
    [articles, log, notify, syncArticleWorkflow],
  );

  const returnArticle = useCallback(
    (id: string, actor: string, notes: string) => {
      const article = articles.find((a) => a.id === id);
      if (!article) return;
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'returned' as const, reviewNotes: notes } : a)),
      );
      syncArticleWorkflow({ ...article, status: 'returned', reviewNotes: notes }, 'return', notes);
      log('Returned', actor, article.title);
      notify({
        title: 'Article returned',
        body: `“${article.title}” was returned. Notes: ${notes}`,
        role: 'author',
        authorName: article.author,
      });
    },
    [articles, log, notify, syncArticleWorkflow],
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
      const article = articles.find((a) => a.id === id);
      if (!article) return;
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'approved' as const, featured: false } : a)),
      );
      syncArticleWorkflow({ ...article, status: 'approved' }, 'unpublish');
      log('Unpublished', actor, article.title);
    },
    [articles, log, syncArticleWorkflow],
  );

  const deleteArticle = useCallback(
    async (id: string, slug: string, actor: string) => {
      const article = articles.find((item) => item.id === id || item.slug === slug);
      let response: Response;
      let result: { ok?: boolean; localOnly?: boolean; error?: string };
      try {
        response = await fetch(`/api/articles/delete?slug=${encodeURIComponent(slug)}`, { method: 'DELETE' });
        result = (await response.json()) as typeof result;
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : 'Could not reach the delete service' };
      }

      if (!response.ok && !(response.status === 503 && result.localOnly)) {
        return { ok: false, error: result.error || `Delete failed (${response.status})` };
      }
      if (response.ok && !result.ok) {
        return { ok: false, error: result.error || 'The delete service rejected the request' };
      }

      deletedArticleSlugsRef.current = new Set([...deletedArticleSlugsRef.current, slug]);
      setDeletedArticleIds((prev) => new Set([...prev, id]));
      setDeletedArticleSlugs((prev) => new Set([...prev, slug]));
      setArticles((prev) => prev.filter((item) => item.id !== id && item.slug !== slug));
      if (article) {
        log('Deleted', actor, article.title);
        notify({ title: 'Article deleted', body: article.title, role: 'administrator' });
      }
      return { ok: true };
    },
    [articles, log, notify],
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
    async (id: string, assignee: Pick<Contributor, 'name' | 'email' | 'role'>) => {
      const item = questions.find((question) => question.id === id);
      if (!item) return { ok: false, emailSent: false, error: 'Question not found' };

      try {
        const response = await fetch('/api/questions/assign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id,
            assigneeName: assignee.name,
            assigneeEmail: assignee.email,
            asker: item.asker,
            subject: item.subject,
            question: item.question,
          }),
        });
        const result = (await response.json()) as { ok?: boolean; emailSent?: boolean; error?: string };
        if (!response.ok || !result.ok) {
          return { ok: false, emailSent: false, error: result.error || `Assignment failed (${response.status})` };
        }

        setQuestions((prev) =>
          prev.map((question) =>
            question.id === id
              ? { ...question, assignedTo: assignee.name, status: 'assigned' as const }
              : question,
          ),
        );
        notify({
          title: 'Question assigned to you',
          body: item.question.slice(0, 100) || 'Open Questions in your ILM dashboard.',
          role: assignee.role,
          authorName: assignee.name,
        });
        return { ok: true, emailSent: Boolean(result.emailSent) };
      } catch (error) {
        return {
          ok: false,
          emailSent: false,
          error: error instanceof Error ? error.message : 'Could not reach the assignment service',
        };
      }
    },
    [notify, questions],
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
    async (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return { ok: false, error: 'Enter a category name.' };
      const slug = slugify(trimmed);
      if (!slug) return { ok: false, error: 'Enter a valid category name.' };
      if (categories.some((c) => c.slug === slug || c.name.toLowerCase() === trimmed.toLowerCase())) {
        return { ok: false, error: 'That category already exists.' };
      }

      const localCategory: Category = { id: `cat${Date.now()}`, name: trimmed, slug, articleCount: 0 };
      let category = localCategory;
      let localOnly = false;
      try {
        const response = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: trimmed, type: 'category' }),
        });
        const result = (await response.json()) as { ok?: boolean; category?: Category; localOnly?: boolean; error?: string };
        if (response.ok && result.ok && result.category) {
          category = result.category;
        } else if (response.status === 503 || result.localOnly) {
          localOnly = true;
        } else {
          return { ok: false, error: result.error || `Could not save category (HTTP ${response.status}).` };
        }
      } catch {
        localOnly = true;
      }

      setCategories((prev) => {
        const existingIndex = prev.findIndex((item) => item.slug === slug);
        if (existingIndex < 0) return [...prev, category];
        return prev.map((item, index) => index === existingIndex ? category : item);
      });
      log('Added category', 'Administrator', trimmed);
      return { ok: true, category, localOnly };
    },
    [categories, log],
  );

  const removeCategory = useCallback(
    async (id: string) => {
      const target = categories.find((category) => category.id === id);
      if (!target) return { ok: false, error: 'Category not found.' };
      let localOnly = false;
      try {
        const params = new URLSearchParams({ type: 'category', slug: target.slug });
        if (/^[0-9a-f-]{36}$/i.test(id)) params.set('id', id);
        const response = await fetch(`/api/admin/categories?${params.toString()}`, { method: 'DELETE' });
        const result = (await response.json()) as { ok?: boolean; localOnly?: boolean; error?: string };
        if ((!response.ok || !result.ok) && response.status !== 503 && !result.localOnly) {
          return { ok: false, error: result.error || `Could not remove category (HTTP ${response.status}).` };
        }
        localOnly = response.status === 503 || result.localOnly === true;
      } catch {
        localOnly = true;
      }
      setCategories((prev) => prev.filter((category) => category.id !== id && category.slug !== target.slug));
      log('Removed category', 'Administrator', target.name);
      return { ok: true, localOnly };
    },
    [categories, log],
  );

  const addTag = useCallback(async (name: string) => {
    const trimmed = name.trim().toLowerCase();
    if (!trimmed) return { ok: false, error: 'Enter a tag name.' };
    if (tags.includes(trimmed)) return { ok: false, error: 'That tag already exists.' };
    let localOnly = false;
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed, type: 'tag' }),
      });
      const result = (await response.json()) as { ok?: boolean; localOnly?: boolean; error?: string };
      if (!response.ok || !result.ok) {
        if (response.status === 503 || result.localOnly) localOnly = true;
        else return { ok: false, error: result.error || `Could not save tag (HTTP ${response.status}).` };
      }
    } catch {
      localOnly = true;
    }
    setTags((prev) => prev.includes(trimmed) ? prev : [...prev, trimmed]);
    return { ok: true, localOnly };
  }, [tags]);

  const removeTag = useCallback(async (name: string) => {
    const trimmed = name.trim();
    const slug = slugify(trimmed);
    let localOnly = false;
    try {
      const params = new URLSearchParams({ type: 'tag', name: trimmed, slug });
      const response = await fetch(`/api/admin/categories?${params.toString()}`, { method: 'DELETE' });
      const result = (await response.json()) as { ok?: boolean; localOnly?: boolean; error?: string };
      if ((!response.ok || !result.ok) && response.status !== 503 && !result.localOnly) {
        return { ok: false, error: result.error || `Could not remove tag (HTTP ${response.status}).` };
      }
      localOnly = response.status === 503 || result.localOnly === true;
    } catch {
      localOnly = true;
    }
    setTags((prev) => prev.filter((tag) => tag.toLowerCase() !== trimmed.toLowerCase()));
    return { ok: true, localOnly };
  }, []);

  const addSubscriber = useCallback(async (email: string) => {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !normalized.includes('@')) {
      return { ok: false, error: 'Enter a valid email address.' };
    }

    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalized }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        subscriber?: Subscriber;
        localOnly?: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok || !result.subscriber) {
        return {
          ok: false,
          error: result.error || `Could not save subscriber (HTTP ${response.status}).`,
        };
      }

      setSubscribers((prev) => {
        const next = prev.filter((s) => s.email.toLowerCase() !== normalized);
        return [result.subscriber!, ...next];
      });
      notify({ title: 'New subscriber', body: normalized, role: 'administrator' });
      notify({ title: 'New subscriber', body: normalized, role: 'editor' });
      log('New subscriber', 'Public site', normalized);
      return { ok: true, localOnly: result.localOnly === true };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Network error while saving subscriber.',
      };
    }
  }, [log, notify]);

  const syncSubscribers = useCallback(async () => {
    try {
      const res = await fetch('/api/subscribers', { cache: 'no-store' });
      if (!res.ok) return;
      const json = (await res.json()) as {
        ok?: boolean;
        subscribers?: Subscriber[];
      };
      if (!json.ok || !Array.isArray(json.subscribers)) return;
      setSubscribers(
        json.subscribers
          .map((s) => ({ ...s, email: s.email.toLowerCase() }))
          .sort((a, b) => b.date.localeCompare(a.date)),
      );
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

  const addMedia = useCallback((item: Omit<MediaItem, 'id' | 'createdAt'>, id?: string) => {
    const created: MediaItem = {
      ...item,
      id: id || `m${Date.now()}`,
      createdAt: shortDate(),
    };
    setMedia((prev) => [created, ...prev.filter((m) => m.id !== created.id)]);
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
      void fetch(`/api/admin/media?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => undefined);
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
      void fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      }).catch(() => undefined);
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
      staffTitle?: string;
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
        staffTitle: input.staffTitle,
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

  const updateContributorProfile = useCallback(
    async (
      id: string,
      patch: Partial<Pick<Contributor, 'staffTitle' | 'bio' | 'biography' | 'focus' | 'accent' | 'image' | 'showInDirectory'>>,
      fallback?: Contributor,
    ) => {
      let response: Response;
      let result: { ok?: boolean; localOnly?: boolean; error?: string };
      try {
        response = await fetch('/api/admin/staff-profiles', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, patch: { ...patch, focus: patch.focus ?? null } }),
        });
        result = (await response.json()) as typeof result;
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : 'Could not reach the profile service' };
      }

      const localOnly = !response.ok && result.localOnly === true;
      if (!response.ok && !localOnly) {
        return { ok: false, error: result.error || `Profile save failed (${response.status})` };
      }
      if (response.ok && !result.ok) {
        return { ok: false, error: result.error || 'The profile service rejected the changes' };
      }

      setContributors((prev) => {
        const existing = prev.find((person) => person.id === id);
        const base = existing || fallback;
        if (!base) return prev;
        const updated = {
          ...base,
          ...patch,
          staffTitle: patch.staffTitle || undefined,
          bio: patch.bio || undefined,
          focus: patch.focus || undefined,
        };
        return existing
          ? prev.map((person) => person.id === id ? updated : person)
          : [...prev, updated];
      });
      return { ok: true, localOnly };
    },
    [],
  );

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
      updateContributorProfile,
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
      updateContributorProfile,
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
