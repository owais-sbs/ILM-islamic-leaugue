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
  image: string;
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

const sampleBody = (paragraphs: string[]) => paragraphs.join('\n\n');

export const articles: Article[] = [
  {
    id: 'a1',
    title: 'The Role of a Murabbī: Nurturing Knowledge, Character, and Faith',
    slug: 'role-of-a-murabbi-nurturing-knowledge-character-faith',
    excerpt:
      'What Murabbī means, how nurturing differs from merely teaching information, and the responsibilities of those who serve in Islamic education.',
    body: sampleBody([
      'A Murabbī is more than a transmitter of facts. The word itself carries the sense of raising, cultivating, and accompanying a person until knowledge settles into character and faith.',
      'Teaching information asks: what do you know? Tarbiyah asks: who are you becoming? One fills the mind; the other shapes the heart, manners, and the way a seeker meets Allah, people, and responsibility.',
      'A Murabbī listens before correcting, paces learning to the student’s capacity, and never separates sacred knowledge from adab. They guard sincerity, model humility, and remind the learner that understanding without practice is incomplete.',
      'Their responsibilities include clarifying intention, protecting the dignity of the student, connecting texts to lived ethics, and pointing always toward Allah rather than toward the teacher’s own status.',
      'When Islamic education recovers this role, classrooms and majālis become places of formation, not performance. Knowledge is nurtured so that faith grows, and character becomes the proof of what was learned.',
    ]),
    footnotes: '1. Reflect on classical adab literature and the practice of early teachers of this ummah.',
    seoTitle: 'The Role of a Murabbī | Knowledge, Character & Faith | ILM',
    seoDescription:
      'Understand what a Murabbī is, how nurturing differs from mere instruction, and the duties of those who guide Islamic education.',
    category: 'Islamic Education',
    author: 'Ustadh Bilal Rahman',
    authorSlug: 'bilal-rahman',
    authorInitials: 'BR',
    status: 'published',
    date: 'Sep 11, 2026',
    publishedAt: 'Sep 11, 2026',
    readTime: '7 min',
    tags: ['Murabbī', 'Islamic Education', 'Tarbiyah', 'Character', 'Knowledge'],
    image: images.mosqueInterior,
    featured: true,
    revisions: [{ version: 1, savedAt: 'Sep 11, 2026', title: 'The Role of a Murabbī: Nurturing Knowledge, Character, and Faith' }],
  },
  {
    id: 'a2',
    title: 'The Ethics of Disagreement in Islam: How to Handle Ikhtilāf with Wisdom',
    slug: 'ethics-of-disagreement-ikhtilaf-with-wisdom',
    excerpt:
      'How Muslims can approach legitimate differences of opinion with knowledge, humility, good manners, and respect, without falling into needless argument.',
    body: sampleBody([
      'Ikhtilāf, legitimate scholarly difference, has always been part of this ummah’s intellectual life. The question is not whether Muslims will differ, but how they will differ.',
      'Principled disagreement begins with knowledge: knowing the evidence, the scope of the issue, and whether the matter is open to ijtihād. Humility follows: recognizing that sincere scholars may reach different conclusions without either side leaving the fold of sincerity.',
      'Adab requires that we speak of opponents with fairness, avoid mockery, and refuse to turn every difference into a test of loyalty. Unity is not uniformity; it is holding the bond of faith while navigating disagreement with wisdom.',
      'Unnecessary argumentation, by contrast, seeks victory of the ego. It multiplies speech, hardens hearts, and confuses the public. The ethical path is to clarify when needed, stay silent when silence is safer, and keep brotherhood intact.',
      'Handled with wisdom, ikhtilāf becomes a school of patience and precision. Handled without adab, it becomes a wound. May Allah grant us knowledge that softens disagreement and manners that protect the ummah.',
    ]),
    footnotes: '1. See classical discussions on adab al-ikhtilāf and the ethics of scholarly debate.',
    seoTitle: 'Ethics of Disagreement & Ikhtilāf in Islam | ILM',
    seoDescription:
      'A guide to handling Islamic differences of opinion with knowledge, humility, adab, and respect for unity.',
    category: 'Islamic Ethics',
    author: 'Shaykh Hamza Idris',
    authorSlug: 'hamza-idris',
    authorInitials: 'HI',
    status: 'published',
    date: 'Sep 10, 2026',
    publishedAt: 'Sep 10, 2026',
    readTime: '8 min',
    tags: ['Ikhtilāf', 'Islamic Ethics', 'Adab', 'Disagreement', 'Unity'],
    image: images.blueMosque,
    revisions: [{ version: 1, savedAt: 'Sep 10, 2026', title: 'The Ethics of Disagreement in Islam: How to Handle Ikhtilāf with Wisdom' }],
  },
  {
    id: 'a3',
    title: 'Seeking Knowledge with Purpose: From Learning to Practice',
    slug: 'seeking-knowledge-with-purpose-learning-to-practice',
    excerpt:
      'Why Islamic learning should lead to understanding, character development, and action rather than simply accumulating information.',
    body: sampleBody([
      'Knowledge in Islam is not a trophy. It is a trust that asks to be understood, embodied, and acted upon. When learning stops at collection, the heart remains unchanged and the self remains untrained.',
      'Seeking with purpose begins with intention: learning to please Allah, to remove ignorance, and to benefit others. Understanding follows: not rushing through titles, but allowing meanings to settle until they reshape how we see and choose.',
      'Character is the bridge between text and life. The student of knowledge watches speech, patience, sincerity, and fairness, knowing that adab is part of the curriculum. Without it, information becomes weight without light.',
      'Practice completes the circle. Prayer improved, relationships refined, habits corrected; these are signs that learning has moved from the page into the person. Accumulation without action leaves the seeker informed yet untransformed.',
      'May Allah make our seeking purposeful, our understanding deep, and our practice sincere so that knowledge becomes a path of self-development and nearness to Him.',
    ]),
    footnotes: '1. Classical teachers repeatedly linked ‘ilm to ‘amal and tazkiyah.',
    seoTitle: 'Seeking Knowledge with Purpose | From Learning to Practice | ILM',
    seoDescription:
      'Explore why Islamic learning should produce understanding, character, and action, not mere information.',
    category: 'Knowledge & Learning',
    author: 'Ustadh Yusuf Karim',
    authorSlug: 'yusuf-karim',
    authorInitials: 'YK',
    status: 'published',
    date: 'Sep 9, 2026',
    publishedAt: 'Sep 9, 2026',
    readTime: '7 min',
    tags: ['Knowledge', 'Learning', 'Action', 'Islamic Education', 'Self-Development'],
    image: images.quranSunrise,
    revisions: [{ version: 1, savedAt: 'Sep 9, 2026', title: 'Seeking Knowledge with Purpose: From Learning to Practice' }],
  },
];

export const questions: Question[] = [
  { id: 'q1', question: 'How do I find a mentor for my teenage son?', asker: 'Anonymous', email: 'seeker@example.com', subject: 'Mentorship', category: 'Tarbiyah', date: 'Sep 10, 2026', status: 'new' },
  { id: 'q2', question: 'What books do you recommend for new Muslims?', asker: 'Aisha M.', email: 'aisha@example.com', subject: 'Books', category: 'Aqidah', date: 'Sep 9, 2026', status: 'assigned', assignedTo: 'Ustadh Bilal Rahman' },
  { id: 'q3', question: 'Can you write about balancing work and spiritual practice?', asker: 'Yusuf K.', subject: 'Practice', category: 'Spirituality', date: 'Sep 8, 2026', status: 'new' },
  { id: 'q4', question: 'How do I deal with a community conflict?', asker: 'Hassan A.', date: 'Sep 7, 2026', status: 'answered', assignedTo: 'Shaykh Hamza Idris', answerNotes: 'Begin with husn al-zann and a trusted elder.' },
  { id: 'q5', question: 'What is the role of art in Islamic education?', asker: 'Anonymous', date: 'Sep 6, 2026', status: 'assigned', assignedTo: 'Ustadh Yusuf Karim' },
];

export const contributors: Contributor[] = [
  { id: 'c1', name: 'Ustadh Bilal Rahman', email: 'bilal@ilm.org', role: 'author', initials: 'BR', madhhab: 'Maliki', articles: 1, active: true, image: images.scholarQuran },
  { id: 'c2', name: 'Shaykh Hamza Idris', email: 'hamza@ilm.org', role: 'author', initials: 'HI', madhhab: "Shafi'i", articles: 1, active: true, image: images.scholarBeard },
  { id: 'c3', name: 'Ustadh Yusuf Karim', email: 'yusuf@ilm.org', role: 'author', initials: 'YK', madhhab: 'Hanbali', articles: 1, active: true, image: images.scholarPrayer },
  { id: 'c4', name: 'Shaykh Ibrahim Al-Fadl', email: 'ibrahim@ilm.org', role: 'administrator', initials: 'IF', madhhab: 'Hanafi', articles: 0, active: true, image: images.scholarKufi },
  { id: 'c5', name: 'Ustadh Omar Khalid', email: 'omar@ilm.org', role: 'editor', initials: 'OK', madhhab: 'Hanafi', articles: 0, active: true, image: images.scholarLantern },
];

export const subscribers: Subscriber[] = [
  { id: 's1', email: 'reader1@example.com', date: 'Sep 10, 2026', active: true },
  { id: 's2', email: 'subscriber2@example.com', date: 'Sep 9, 2026', active: true },
  { id: 's3', email: 'learner3@example.com', date: 'Sep 8, 2026', active: true },
  { id: 's4', email: 'curious4@example.com', date: 'Sep 7, 2026', active: false },
  { id: 's5', email: 'seeker5@example.com', date: 'Sep 6, 2026', active: true },
];

export const activityLog: ActivityEntry[] = [
  { id: 'l1', action: 'Published', user: 'Shaykh Ibrahim Al-Fadl', target: 'The Role of a Murabbī: Nurturing Knowledge, Character, and Faith', timestamp: 'Sep 11, 2026 · 10:00 AM' },
  { id: 'l2', action: 'Published', user: 'Shaykh Ibrahim Al-Fadl', target: 'The Ethics of Disagreement in Islam: How to Handle Ikhtilāf with Wisdom', timestamp: 'Sep 10, 2026 · 2:14 PM' },
  { id: 'l3', action: 'Published', user: 'Shaykh Ibrahim Al-Fadl', target: 'Seeking Knowledge with Purpose: From Learning to Practice', timestamp: 'Sep 9, 2026 · 9:00 AM' },
];

export const notices: Notice[] = [
  { id: 'n1', title: 'New question', body: 'How do I find a mentor for my teenage son?', role: 'administrator', read: false },
  { id: 'n2', title: 'New question', body: 'How do I find a mentor for my teenage son?', role: 'editor', read: false },
  { id: 'n3', title: 'Articles live', body: 'Three core articles are published on the public site.', role: 'administrator', read: true },
];

export const categories: Category[] = [
  { id: 'cat1', name: 'Islamic Education', slug: 'islamic-education', articleCount: 1 },
  { id: 'cat2', name: 'Islamic Ethics', slug: 'islamic-ethics', articleCount: 1 },
  { id: 'cat3', name: 'Knowledge & Learning', slug: 'knowledge-learning', articleCount: 1 },
  { id: 'cat4', name: 'Tarbiyah', slug: 'tarbiyah', articleCount: 0 },
  { id: 'cat5', name: 'Aqidah', slug: 'aqidah', articleCount: 0 },
  { id: 'cat6', name: 'Fiqh', slug: 'fiqh', articleCount: 0 },
  { id: 'cat7', name: 'Spirituality', slug: 'spirituality', articleCount: 0 },
];

export const roleLabels: Record<Role, string> = {
  author: 'Author',
  editor: 'Editor',
  administrator: 'Administrator',
};

export const roleUsers: Record<Role, { name: string; initials: string; slug: string; image: string }> = {
  author: { name: 'Ustadh Bilal Rahman', initials: 'BR', slug: 'bilal-rahman', image: images.scholarQuran },
  editor: { name: 'Ustadh Omar Khalid', initials: 'OK', slug: 'omar-khalid', image: images.scholarLantern },
  administrator: { name: 'Shaykh Ibrahim Al-Fadl', initials: 'IF', slug: 'ibrahim-al-fadl', image: images.scholarKufi },
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
  author: 'bg-gray-200 text-gray-800',
  editor: 'bg-blue-100 text-blue-800',
  administrator: 'bg-ilm-gold text-ilm-navy-deep',
};

export function nowStamp() {
  return new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export function shortDate() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
