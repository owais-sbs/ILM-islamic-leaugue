export interface MockAuthor {
  id: string;
  fullName: string;
  honorific: string;
  bio: string;
  credentials: string;
  madhhab: string;
  email: string;
  role: 'author' | 'editor' | 'admin';
  isActive: boolean;
  avatarUrl: string;
  publishedCount?: number;
}

export interface MockArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: string;
  status: 'draft' | 'submitted' | 'returned' | 'approved' | 'published';
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  featuredImageUrl: string | null;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  readingTime: number;
  authorId?: string;
}

export interface MockReviewNote {
  id: string;
  articleId: string;
  editorId: string;
  editorName: string;
  note: string;
  createdAt: string;
}

export interface MockCategory {
  id: string;
  name: string;
  slug: string;
}

export interface MockTag {
  id: string;
  name: string;
}

export interface MockQuestion {
  id: string;
  subject: string;
  body: string;
  status: 'new' | 'assigned' | 'answered' | 'archived';
  submittedBy: string;
  submittedAt: string;
  assignedTo?: string;
  answerNotes?: string;
}

export interface MockMedia {
  id: string;
  filename: string;
  url: string;
  altText: string;
  uploadedAt: string;
}

export const mockAuthors: MockAuthor[] = [
  {
    id: 'author-1',
    fullName: 'Abdullah ibn Tariq',
    honorific: 'Shaykh',
    bio: 'Student of knowledge focusing on Fiqh and Usul.',
    credentials: 'MA Islamic Studies, University of Madinah',
    madhhab: 'Hanafi',
    email: 'abdullah@example.com',
    role: 'author',
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=crop',
    publishedCount: 12,
  },
  {
    id: 'author-2',
    fullName: 'Fatima Al-Zahra',
    honorific: 'Ustadha',
    bio: 'Specialist in Quranic exegesis and family law.',
    credentials: 'PhD Tafsir, Al-Azhar University',
    madhhab: 'Shafi\'i',
    email: 'fatima@example.com',
    role: 'author',
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&h=256&auto=format&fit=crop',
    publishedCount: 34,
  },
  {
    id: 'editor-1',
    fullName: 'Ahmad Al-Faruqi',
    honorific: 'Dr.',
    bio: 'Chief Editor of ILM.',
    credentials: 'PhD Islamic History',
    madhhab: 'Maliki',
    email: 'ahmad@example.com',
    role: 'editor',
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&h=256&auto=format&fit=crop',
    publishedCount: 5,
  }
];

export const mockAuthor = mockAuthors[0];
export const mockEditor = mockAuthors[2];

export const mockCategories: MockCategory[] = [
  { id: 'cat-1', name: 'Fiqh', slug: 'fiqh' },
  { id: 'cat-2', name: 'Aqidah', slug: 'aqidah' },
  { id: 'cat-3', name: 'Seerah', slug: 'seerah' },
  { id: 'cat-4', name: 'Tafsir', slug: 'tafsir' },
];

export const mockTags: MockTag[] = [
  { id: 'tag-1', name: 'Ramadan' },
  { id: 'tag-2', name: 'Prayer' },
  { id: 'tag-3', name: 'Marriage' },
];

export const mockArticles: MockArticle[] = [
  {
    id: 'art-1',
    title: 'The Importance of Seeking Knowledge in the Modern Age',
    slug: 'importance-of-seeking-knowledge',
    excerpt: 'An exploration of why seeking sacred knowledge remains crucial today.',
    content: '<p>Seeking knowledge is an obligation upon every Muslim. In this modern age, we find ourselves surrounded by distractions...</p>',
    categoryId: 'cat-1',
    status: 'draft',
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-08T09:00:00Z',
    publishedAt: null,
    featuredImageUrl: 'https://images.unsplash.com/photo-1584285404553-90d5756bc9d6?q=80&w=800&auto=format&fit=crop',
    seoTitle: 'Seeking Knowledge',
    seoDescription: 'Why we must seek knowledge today.',
    tags: ['tag-1'],
    readingTime: 5,
    authorId: 'author-1',
  },
  {
    id: 'art-2',
    title: 'Understanding the Foundations of Aqidah',
    slug: 'foundations-of-aqidah',
    excerpt: 'A comprehensive guide to the core beliefs of a Muslim.',
    content: '<p>The foundations of our faith rest upon clear, unambiguous tenets...</p>',
    categoryId: 'cat-2',
    status: 'submitted',
    createdAt: '2026-08-15T14:30:00Z',
    updatedAt: '2026-08-20T11:20:00Z',
    publishedAt: null,
    featuredImageUrl: null,
    seoTitle: '',
    seoDescription: '',
    tags: ['tag-2'],
    readingTime: 8,
    authorId: 'author-2',
  },
  {
    id: 'art-3',
    title: 'Reflections on the Life of the Prophet ﷺ',
    slug: 'reflections-on-prophet-life',
    excerpt: 'Key lessons we can extract from the Seerah for our daily lives.',
    content: '<p>Looking at the life of the Messenger of Allah ﷺ, we find perfect examples for every situation...</p>',
    categoryId: 'cat-3',
    status: 'returned',
    createdAt: '2026-08-01T09:15:00Z',
    updatedAt: '2026-08-10T16:45:00Z',
    publishedAt: null,
    featuredImageUrl: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=800&auto=format&fit=crop',
    seoTitle: 'Reflections on Seerah',
    seoDescription: 'Lessons from the life of the Prophet.',
    tags: ['tag-3'],
    readingTime: 12,
    authorId: 'author-1',
  },
  {
    id: 'art-4',
    title: 'The Etiquette of Fasting in Ramadan',
    slug: 'etiquette-of-fasting',
    excerpt: 'Beyond staying away from food and drink, the spiritual etiquette of the fasting person.',
    content: '<p>Fasting is a shield, and its true reality extends beyond mere physical abstention...</p>',
    categoryId: 'cat-1',
    status: 'published',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-10T09:00:00Z',
    publishedAt: '2026-03-15T12:00:00Z',
    featuredImageUrl: null,
    seoTitle: '',
    seoDescription: '',
    tags: ['tag-1'],
    readingTime: 6,
    authorId: 'author-1',
  },
  {
    id: 'art-5',
    title: 'Principles of Tafsir',
    slug: 'principles-of-tafsir',
    excerpt: 'How scholars approach the exegesis of the Quran.',
    content: '<p>Interpreting the word of Allah requires strict adherence to methodology...</p>',
    categoryId: 'cat-4',
    status: 'approved',
    createdAt: '2026-09-02T10:00:00Z',
    updatedAt: '2026-09-05T09:00:00Z',
    publishedAt: null,
    featuredImageUrl: null,
    seoTitle: '',
    seoDescription: '',
    tags: [],
    readingTime: 15,
    authorId: 'author-2',
  }
];

export const mockReviewNotes: MockReviewNote[] = [
  {
    id: 'note-1',
    articleId: 'art-3',
    editorId: 'editor-1',
    editorName: 'Ahmad Al-Faruqi',
    note: 'Please clarify the second section regarding the incident of Taif. Ensure you provide the required references from Ibn Hisham.',
    createdAt: '2026-08-11T10:30:00Z',
  }
];

export const mockQuestions: MockQuestion[] = [
  {
    id: 'q-1',
    subject: 'Ruling on combining prayers while traveling',
    body: 'Is it permissible to combine prayers if the journey is less than 80km?',
    status: 'new',
    submittedBy: 'user123@example.com',
    submittedAt: '2026-09-07T14:00:00Z',
  },
  {
    id: 'q-2',
    subject: 'Zakat on business inventory',
    body: 'How do I calculate Zakat on items I intend to sell?',
    status: 'assigned',
    submittedBy: 'merchant@example.com',
    submittedAt: '2026-09-05T09:00:00Z',
    assignedTo: 'author-1',
  },
  {
    id: 'q-3',
    subject: 'Meaning of a Hadith',
    body: 'Can you explain the Hadith about the one who points to good?',
    status: 'answered',
    submittedBy: 'student@example.com',
    submittedAt: '2026-08-20T10:00:00Z',
    assignedTo: 'author-2',
    answerNotes: 'Provided the explanation from Sahih Muslim.',
  }
];

export const mockMedia: MockMedia[] = [
  {
    id: 'media-1',
    filename: 'masjid-nabawi.jpg',
    url: 'https://images.unsplash.com/photo-1584285404553-90d5756bc9d6?q=80&w=800&auto=format&fit=crop',
    altText: 'Masjid Nabawi',
    uploadedAt: '2026-08-10T10:00:00Z',
  },
  {
    id: 'media-2',
    filename: 'quran-pages.jpg',
    url: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=800&auto=format&fit=crop',
    altText: 'Quran pages',
    uploadedAt: '2026-08-12T14:30:00Z',
  }
];

// ── Revision history ──────────────────────────────────────────────────────

export interface MockRevision {
  id: string;
  articleId: string;
  version: number;
  editedBy: string;
  editedAt: string;
  summary: string;
  bodySnapshot: string;
}

export const mockRevisions: MockRevision[] = [
  {
    id: 'rev-1',
    articleId: 'art-1',
    version: 1,
    editedBy: 'Abdullah ibn Tariq',
    editedAt: '2026-09-01T10:00:00Z',
    summary: 'Initial draft created',
    bodySnapshot: '<p>Seeking knowledge is an obligation upon every Muslim…</p>',
  },
  {
    id: 'rev-2',
    articleId: 'art-1',
    version: 2,
    editedBy: 'Abdullah ibn Tariq',
    editedAt: '2026-09-04T14:22:00Z',
    summary: 'Expanded introduction, added second paragraph',
    bodySnapshot: '<p>Seeking knowledge is an obligation upon every Muslim. In this modern age…</p>',
  },
  {
    id: 'rev-3',
    articleId: 'art-1',
    version: 3,
    editedBy: 'Ahmad Al-Faruqi',
    editedAt: '2026-09-07T09:11:00Z',
    summary: 'Editor corrections: references added in section 2',
    bodySnapshot: '<p>Seeking knowledge is an obligation upon every Muslim. In this modern age, we find ourselves…</p>',
  },
];

// ── Subscribers ────────────────────────────────────────────────────────────

export interface MockSubscriber {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  confirmedAt: string;
  source: string;
}

export const mockSubscribers: MockSubscriber[] = [
  { id: 'sub-1', email: 'reader1@example.com', status: 'active', confirmedAt: '2026-08-01', source: 'homepage' },
  { id: 'sub-2', email: 'student2@example.com', status: 'active', confirmedAt: '2026-08-05', source: 'article' },
  { id: 'sub-3', email: 'seeker3@example.com', status: 'active', confirmedAt: '2026-08-10', source: 'homepage' },
  { id: 'sub-4', email: 'mused4@example.com', status: 'unsubscribed', confirmedAt: '2026-08-12', source: 'footer' },
  { id: 'sub-5', email: 'wanderer5@example.com', status: 'active', confirmedAt: '2026-09-01', source: 'ask-page' },
];

// ── Activity log ───────────────────────────────────────────────────────────

export interface MockActivity {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  entity: string;
  entityType: 'article' | 'user' | 'category' | 'tag' | 'setting';
  details?: string;
}

export const mockActivity: MockActivity[] = [
  { id: 'act-1', timestamp: '2026-09-08T09:15:00Z', actor: 'Ahmad Al-Faruqi', action: 'Approved', entity: 'Principles of Tafsir', entityType: 'article' },
  { id: 'act-2', timestamp: '2026-09-07T16:30:00Z', actor: 'Ahmad Al-Faruqi', action: 'Returned to author', entity: 'Reflections on the Prophet ﷺ', entityType: 'article', details: 'Needs additional references in section 2.' },
  { id: 'act-3', timestamp: '2026-09-06T11:00:00Z', actor: 'Abdullah ibn Tariq', action: 'Submitted for review', entity: 'Understanding the Foundations of Aqidah', entityType: 'article' },
  { id: 'act-4', timestamp: '2026-09-05T14:45:00Z', actor: 'Admin', action: 'Invited', entity: 'newcontributor@example.com', entityType: 'user', details: 'Role: Author' },
  { id: 'act-5', timestamp: '2026-09-04T10:20:00Z', actor: 'Admin', action: 'Published', entity: 'The Etiquette of Fasting in Ramadan', entityType: 'article' },
  { id: 'act-6', timestamp: '2026-09-03T09:00:00Z', actor: 'Admin', action: 'Updated category', entity: 'Fiqh', entityType: 'category' },
  { id: 'act-7', timestamp: '2026-09-02T13:30:00Z', actor: 'Fatima Al-Zahra', action: 'Created draft', entity: 'Principles of Tafsir', entityType: 'article' },
];
