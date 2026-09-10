import { images } from './images';

export type Role = 'author' | 'editor' | 'administrator';
export type ArticleStatus = 'draft' | 'submitted' | 'approved' | 'published' | 'returned';

export interface ArticleRevision {
  version: number;
  savedAt: string;
  title: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  footnotes: string;
  seoTitle: string;
  seoDescription: string;
  category: string;
  author: string;
  authorSlug: string;
  authorInitials: string;
  status: ArticleStatus;
  date: string;
  publishedAt?: string;
  readTime: string;
  reviewNotes?: string;
  tags: string[];
  image: string;
  featured?: boolean;
  revisions: ArticleRevision[];
}

export interface Question {
  id: string;
  question: string;
  asker: string;
  email?: string;
  subject?: string;
  category?: string;
  date: string;
  status: 'new' | 'assigned' | 'answered';
  assignedTo?: string;
  answerNotes?: string;
}

export interface Contributor {
  id: string;
  name: string;
  email: string;
  role: Role;
  initials: string;
  madhhab: string;
  articles: number;
  active: boolean;
}

export interface Subscriber {
  id: string;
  email: string;
  date: string;
  active: boolean;
}

export interface ActivityEntry {
  id: string;
  action: string;
  user: string;
  target: string;
  timestamp: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  articleCount: number;
}

export interface Notice {
  id: string;
  title: string;
  body: string;
  role?: Role | 'all';
  authorName?: string;
  read?: boolean;
}

const sampleBody = (lead: string) =>
  `${lead}

Sacred knowledge was never meant to be gathered the way one gathers possessions. The early teachers of this ummah treated learning as an act of worship — begun in sincerity, held with humility, and completed in character.

The first adab is intention. A student asks: am I seeking this to be seen as learned, or to become more pleasing to Allah? That question is itself a lesson.

The second is respect for the teacher and the text. We sit with a book the way we sit with a person of knowledge — attentive, unhurried, and ready to be changed.

May Allah make what we write a means of light, not a means of pride.`;

export const articles: Article[] = [
  {
    id: 'a1',
    title: 'The Etiquette of Seeking Sacred Knowledge',
    slug: 'etiquette-of-seeking-sacred-knowledge',
    excerpt: 'How the early Murabbiyūn approached learning as an act of worship, not mere accumulation of facts.',
    body: sampleBody('How the early Murabbiyūn approached learning as an act of worship, not mere accumulation of facts.'),
    footnotes: '1. Imam al-Nawawi, al-Majmu‘.\n2. Ibn Jama‘ah, Tadhkirat al-Sami‘.',
    seoTitle: 'The Etiquette of Seeking Sacred Knowledge | ILM',
    seoDescription: 'Adab of seeking knowledge from the early teachers of this ummah.',
    category: 'Tarbiyah',
    author: 'Ustadha Maryam Yusuf',
    authorSlug: 'maryam-yusuf',
    authorInitials: 'MY',
    status: 'published',
    date: 'Sep 2, 2026',
    publishedAt: 'Sep 2, 2026',
    readTime: '7 min',
    tags: ['tarbiyah', 'adab', 'knowledge'],
    image: images.quranSunrise,
    featured: true,
    revisions: [{ version: 1, savedAt: 'Sep 1, 2026', title: 'The Etiquette of Seeking Sacred Knowledge' }],
  },
  {
    id: 'a2',
    title: 'Understanding Ikhtilaf with Grace',
    slug: 'understanding-ikhtilaf-with-grace',
    excerpt: 'A gentle framework for engaging scholarly disagreement without losing brotherhood or dignity.',
    body: sampleBody('A gentle framework for engaging scholarly disagreement without losing brotherhood or dignity.'),
    footnotes: '1. Ibn Taymiyyah, Raf‘ al-Malam.',
    seoTitle: 'Understanding Ikhtilaf with Grace | ILM',
    seoDescription: 'How to hold scholarly difference without losing brotherhood.',
    category: 'Fiqh',
    author: 'Ustadha Maryam Yusuf',
    authorSlug: 'maryam-yusuf',
    authorInitials: 'MY',
    status: 'published',
    date: 'Aug 28, 2026',
    publishedAt: 'Aug 28, 2026',
    readTime: '9 min',
    tags: ['fiqh', 'ikhtilaf', 'adab'],
    image: images.quranOpen,
    revisions: [{ version: 1, savedAt: 'Aug 27, 2026', title: 'Understanding Ikhtilaf with Grace' }],
  },
  {
    id: 'a3',
    title: 'Cultivating the Heart in an Age of Noise',
    slug: 'cultivating-the-heart-in-an-age-of-noise',
    excerpt: 'Practical reflections on tazkiyah — purification of the self — drawn from classical sources.',
    body: sampleBody('Practical reflections on tazkiyah — purification of the self — drawn from classical sources.'),
    footnotes: '1. Imam al-Ghazali, Ihya ‘Ulum al-Din.',
    seoTitle: 'Cultivating the Heart in an Age of Noise | ILM',
    seoDescription: 'Tazkiyah for a noisy age.',
    category: 'Spirituality',
    author: 'Shaykh Hamza Idris',
    authorSlug: 'hamza-idris',
    authorInitials: 'HI',
    status: 'published',
    date: 'Aug 21, 2026',
    publishedAt: 'Aug 21, 2026',
    readTime: '6 min',
    tags: ['tazkiyah', 'spirituality'],
    image: images.mosqueInterior,
    revisions: [{ version: 1, savedAt: 'Aug 20, 2026', title: 'Cultivating the Heart in an Age of Noise' }],
  },
  {
    id: 'a4',
    title: 'Foundations of Aqidah for Seekers',
    slug: 'foundations-of-aqidah-for-seekers',
    excerpt: 'A clear introduction to creed that steadies the heart without overwhelming the beginner.',
    body: sampleBody('A clear introduction to creed that steadies the heart without overwhelming the beginner.'),
    footnotes: '1. Imam al-Tahawi, al-‘Aqidah al-Tahawiyyah.',
    seoTitle: 'Foundations of Aqidah for Seekers | ILM',
    seoDescription: 'A beginner’s map of creed.',
    category: 'Aqidah',
    author: 'Ustadh Yusuf Karim',
    authorSlug: 'yusuf-karim',
    authorInitials: 'YK',
    status: 'submitted',
    date: 'Sep 9, 2026',
    readTime: '8 min',
    tags: ['aqidah', 'creed'],
    image: images.mosqueDome,
    revisions: [{ version: 1, savedAt: 'Sep 9, 2026', title: 'Foundations of Aqidah for Seekers' }],
  },
  {
    id: 'a5',
    title: 'The Language of Care',
    slug: 'the-language-of-care',
    excerpt: 'How the words we choose shape the relationships we build in community and in teaching.',
    body: sampleBody('How the words we choose shape the relationships we build in community and in teaching.'),
    footnotes: '',
    seoTitle: 'The Language of Care | ILM',
    seoDescription: 'Speech as a trust.',
    category: 'Tarbiyah',
    author: 'Shaykh Hamza Idris',
    authorSlug: 'hamza-idris',
    authorInitials: 'HI',
    status: 'submitted',
    date: 'Sep 10, 2026',
    readTime: '9 min',
    tags: ['tarbiyah', 'speech'],
    image: images.prayerHall,
    revisions: [{ version: 1, savedAt: 'Sep 10, 2026', title: 'The Language of Care' }],
  },
  {
    id: 'a6',
    title: 'On Mercy and Its Demands',
    slug: 'on-mercy-and-its-demands',
    excerpt: 'Mercy is not soft. It asks more of us than justice ever could.',
    body: sampleBody('Mercy is not soft. It asks more of us than justice ever could.'),
    footnotes: '1. Qur’an 21:107.',
    seoTitle: 'On Mercy and Its Demands | ILM',
    seoDescription: 'Rahmah as a way of living.',
    category: 'Spirituality',
    author: 'Ustadha Maryam Yusuf',
    authorSlug: 'maryam-yusuf',
    authorInitials: 'MY',
    status: 'approved',
    date: 'Sep 6, 2026',
    readTime: '12 min',
    tags: ['mercy', 'akhlaq'],
    image: images.kaaba,
    revisions: [{ version: 2, savedAt: 'Sep 8, 2026', title: 'On Mercy and Its Demands' }],
  },
  {
    id: 'a7',
    title: 'Leading with a Softer Voice',
    slug: 'leading-with-a-softer-voice',
    excerpt: 'A reflection on influence, responsibility, and the strength of listening well.',
    body: sampleBody('A reflection on influence, responsibility, and the strength of listening well.'),
    footnotes: '',
    seoTitle: 'Leading with a Softer Voice | ILM',
    seoDescription: 'Leadership as listening.',
    category: 'Tarbiyah',
    author: 'Ustadha Maryam Yusuf',
    authorSlug: 'maryam-yusuf',
    authorInitials: 'MY',
    status: 'returned',
    date: 'Sep 7, 2026',
    readTime: '7 min',
    reviewNotes: 'The third paragraph could use a concrete example from a classroom or majlis. Otherwise strong work — please resubmit.',
    tags: ['leadership', 'listening'],
    image: images.quranHands,
    revisions: [{ version: 1, savedAt: 'Sep 7, 2026', title: 'Leading with a Softer Voice' }],
  },
  {
    id: 'a8',
    title: 'The Art of Asking Better Questions',
    slug: 'the-art-of-asking-better-questions',
    excerpt: 'Why curiosity is the first virtue of a learner and a mentor alike.',
    body: sampleBody('Why curiosity is the first virtue of a learner and a mentor alike.'),
    footnotes: '',
    seoTitle: 'The Art of Asking Better Questions | ILM',
    seoDescription: 'Curiosity as worship.',
    category: 'Tarbiyah',
    author: 'Ustadha Maryam Yusuf',
    authorSlug: 'maryam-yusuf',
    authorInitials: 'MY',
    status: 'draft',
    date: 'Sep 10, 2026',
    readTime: '4 min',
    tags: ['education', 'curiosity'],
    image: images.mosqueArch,
    revisions: [{ version: 1, savedAt: 'Sep 10, 2026', title: 'The Art of Asking Better Questions' }],
  },
];

export const questions: Question[] = [
  { id: 'q1', question: 'How do I find a mentor for my teenage son?', asker: 'Anonymous', email: 'seeker@example.com', subject: 'Mentorship', category: 'Tarbiyah', date: 'Sep 10, 2026', status: 'new' },
  { id: 'q2', question: 'What books do you recommend for new Muslims?', asker: 'Aisha M.', email: 'aisha@example.com', subject: 'Books', category: 'Aqidah', date: 'Sep 9, 2026', status: 'assigned', assignedTo: 'Ustadha Maryam Yusuf' },
  { id: 'q3', question: 'Can you write about balancing work and spiritual practice?', asker: 'Yusuf K.', subject: 'Practice', category: 'Spirituality', date: 'Sep 8, 2026', status: 'new' },
  { id: 'q4', question: 'How do I deal with a community conflict?', asker: 'Hassan A.', date: 'Sep 7, 2026', status: 'answered', assignedTo: 'Shaykh Hamza Idris', answerNotes: 'Begin with husn al-zann and a trusted elder.' },
  { id: 'q5', question: 'What is the role of art in Islamic education?', asker: 'Anonymous', date: 'Sep 6, 2026', status: 'assigned', assignedTo: 'Ustadh Yusuf Karim' },
];

export const contributors: Contributor[] = [
  { id: 'c1', name: 'Ustadha Maryam Yusuf', email: 'maryam@ilm.org', role: 'author', initials: 'MY', madhhab: 'Maliki', articles: 4, active: true },
  { id: 'c2', name: 'Shaykh Hamza Idris', email: 'hamza@ilm.org', role: 'author', initials: 'HI', madhhab: "Shafi'i", articles: 2, active: true },
  { id: 'c3', name: 'Ustadh Yusuf Karim', email: 'yusuf@ilm.org', role: 'author', initials: 'YK', madhhab: 'Hanbali', articles: 1, active: true },
  { id: 'c4', name: 'Shaykh Ibrahim Al-Fadl', email: 'ibrahim@ilm.org', role: 'administrator', initials: 'IF', madhhab: 'Hanafi', articles: 1, active: true },
  { id: 'c5', name: 'Fatima Noor', email: 'fatima@ilm.org', role: 'editor', initials: 'FN', madhhab: 'Hanafi', articles: 0, active: true },
];

export const subscribers: Subscriber[] = [
  { id: 's1', email: 'reader1@example.com', date: 'Sep 10, 2026', active: true },
  { id: 's2', email: 'subscriber2@example.com', date: 'Sep 9, 2026', active: true },
  { id: 's3', email: 'learner3@example.com', date: 'Sep 8, 2026', active: true },
  { id: 's4', email: 'curious4@example.com', date: 'Sep 7, 2026', active: false },
  { id: 's5', email: 'seeker5@example.com', date: 'Sep 6, 2026', active: true },
];

export const activityLog: ActivityEntry[] = [
  { id: 'l1', action: 'Published', user: 'Shaykh Ibrahim Al-Fadl', target: 'The Etiquette of Seeking Sacred Knowledge', timestamp: 'Sep 2, 2026 · 2:14 PM' },
  { id: 'l2', action: 'Approved', user: 'Fatima Noor', target: 'On Mercy and Its Demands', timestamp: 'Sep 8, 2026 · 10:30 AM' },
  { id: 'l3', action: 'Returned', user: 'Fatima Noor', target: 'Leading with a Softer Voice', timestamp: 'Sep 7, 2026 · 4:45 PM' },
  { id: 'l4', action: 'Submitted', user: 'Ustadh Yusuf Karim', target: 'Foundations of Aqidah for Seekers', timestamp: 'Sep 9, 2026 · 9:00 AM' },
];

export const notices: Notice[] = [
  { id: 'n1', title: 'Article returned', body: 'Leading with a Softer Voice was returned with review notes.', role: 'author', authorName: 'Ustadha Maryam Yusuf' },
  { id: 'n2', title: 'New question assigned', body: 'What books do you recommend for new Muslims?', role: 'author', authorName: 'Ustadha Maryam Yusuf' },
  { id: 'n3', title: 'Review queue', body: 'Two articles are waiting for editorial review.', role: 'editor' },
  { id: 'n4', title: 'Ready to publish', body: 'On Mercy and Its Demands is approved and awaiting publication.', role: 'administrator' },
];

export const categories: Category[] = [
  { id: 'cat1', name: 'Aqidah', slug: 'aqidah', articleCount: 3 },
  { id: 'cat2', name: 'Fiqh', slug: 'fiqh', articleCount: 4 },
  { id: 'cat3', name: 'Tarbiyah', slug: 'tarbiyah', articleCount: 6 },
  { id: 'cat4', name: 'History', slug: 'history', articleCount: 2 },
  { id: 'cat5', name: 'Spirituality', slug: 'spirituality', articleCount: 5 },
];

export const roleLabels: Record<Role, string> = {
  author: 'Author',
  editor: 'Editor',
  administrator: 'Administrator',
};

export const roleUsers: Record<Role, { name: string; initials: string; slug: string }> = {
  author: { name: 'Ustadha Maryam Yusuf', initials: 'MY', slug: 'maryam-yusuf' },
  editor: { name: 'Fatima Noor', initials: 'FN', slug: 'fatima-noor' },
  administrator: { name: 'Shaykh Ibrahim Al-Fadl', initials: 'IF', slug: 'ibrahim-al-fadl' },
};

export interface NavItem {
  label: string;
  key: string;
  icon: 'dashboard' | 'articles' | 'create' | 'profile' | 'help' | 'review' | 'categories' | 'media' | 'authors' | 'questions' | 'subscribers' | 'settings' | 'activity';
}
export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navConfig: Record<Role, NavGroup[]> = {
  author: [
    { label: '', items: [
      { label: 'Dashboard', key: 'dashboard', icon: 'dashboard' },
      { label: 'My Articles', key: 'my-articles', icon: 'articles' },
      { label: 'Create Article', key: 'create-article', icon: 'create' },
      { label: 'Assigned Questions', key: 'questions', icon: 'questions' },
    ]},
    { label: 'Account', items: [
      { label: 'My Profile', key: 'my-profile', icon: 'profile' },
      { label: 'Help', key: 'help', icon: 'help' },
    ]},
  ],
  editor: [
    { label: 'Editorial', items: [
      { label: 'Dashboard', key: 'dashboard', icon: 'dashboard' },
      { label: 'Articles', key: 'articles', icon: 'articles' },
      { label: 'Review Queue', key: 'review-queue', icon: 'review' },
      { label: 'My Articles', key: 'my-articles', icon: 'articles' },
    ]},
    { label: 'Engagement', items: [
      { label: 'Questions', key: 'questions', icon: 'questions' },
      { label: 'Media', key: 'media', icon: 'media' },
    ]},
    { label: 'Account', items: [
      { label: 'My Profile', key: 'my-profile', icon: 'profile' },
      { label: 'Help', key: 'help', icon: 'help' },
    ]},
  ],
  administrator: [
    { label: 'Content', items: [
      { label: 'Dashboard', key: 'dashboard', icon: 'dashboard' },
      { label: 'Articles', key: 'articles', icon: 'articles' },
      { label: 'Review', key: 'review-queue', icon: 'review' },
      { label: 'Categories & Tags', key: 'categories-tags', icon: 'categories' },
    ]},
    { label: 'People', items: [
      { label: 'Authors', key: 'authors', icon: 'authors' },
    ]},
    { label: 'Engagement', items: [
      { label: 'Media', key: 'media', icon: 'media' },
      { label: 'Questions', key: 'questions', icon: 'questions' },
      { label: 'Subscribers', key: 'subscribers', icon: 'subscribers' },
    ]},
    { label: 'System', items: [
      { label: 'Settings', key: 'settings', icon: 'settings' },
      { label: 'Activity Log', key: 'activity-log', icon: 'activity' },
    ]},
  ],
};

export const statusStyles: Record<ArticleStatus, string> = {
  draft: 'bg-gray-100 text-gray-600',
  submitted: 'bg-blue-100 text-blue-700',
  approved: 'bg-amber-100 text-amber-700',
  published: 'bg-green-100 text-green-700',
  returned: 'bg-red-100 text-red-700',
};

export const roleBadgeStyles: Record<Role, string> = {
  author: 'bg-gray-100 text-gray-600',
  editor: 'bg-blue-100 text-blue-700',
  administrator: 'bg-amber-100 text-amber-800',
};

export function nowStamp() {
  return new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export function shortDate() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
