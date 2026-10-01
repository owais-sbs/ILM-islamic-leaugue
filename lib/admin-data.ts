import { images } from './images';
import { seedArticles } from './seed-articles';

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
  source?: 'ask' | 'contact';
  preferredAuthor?: string;
  date: string;
  createdAt?: number;
  status: 'new' | 'assigned' | 'author_ready' | 'answered';
  assignedTo?: string;
  authorDraft?: string;
  answerNotes?: string;
}

export interface UserProfile {
  role: Role;
  name: string;
  email: string;
  bio: string;
  madhhab: string;
  credentials: string;
  image?: string;
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
  inviteStatus?: 'pending' | 'active';
  inviteToken?: string;
  inviteExpiresAt?: number;
  bio?: string;
  /** Staff Profiles — extra fields for Murabbiyūn directory */
  staffTitle?: string;          // display title e.g. "Imām, Masjid al-Nur"
  biography?: string[];         // full bio paragraphs for profile page
  focus?: 'Studies' | 'Fiqh' | 'Spiritual' | 'Arabic';
  accent?: string;              // CSS classes e.g. "bg-sky-100 text-sky-700"
  showInDirectory?: boolean;    // true → appears in Murabbiyūn section on homepage
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

export interface MediaItem {
  id: string;
  name: string;
  size: string;
  src: string;
  createdAt: string;
}

export interface SiteSettings {
  siteTitle: string;
  contactEmail: string;
  disclaimerText: string;
  featuredArticleId: string;
  announcementBanner: string;
}

export const defaultSiteSettings: SiteSettings = {
  siteTitle: 'Islamic League of Murabbiyūn',
  contactEmail: 'salam@ilm.org',
  disclaimerText:
    'The content on this site is for educational and spiritual guidance purposes. Always consult qualified scholars for specific religious rulings.',
  featuredArticleId: 'a1',
  announcementBanner: '',
};

export const seedMedia: MediaItem[] = [
  { id: 'm1', name: 'mosque-sunrise.jpg', size: '2.4 MB', src: images.mosqueArch, createdAt: 'Sep 1, 2026' },
  { id: 'm2', name: 'open-quran.jpg', size: '1.1 MB', src: images.quranOpen, createdAt: 'Sep 1, 2026' },
  { id: 'm3', name: 'blue-mosque.jpg', size: '3.2 MB', src: images.blueMosque, createdAt: 'Sep 1, 2026' },
  { id: 'm4', name: 'kaaba-makkah.jpg', size: '0.8 MB', src: images.kaaba, createdAt: 'Sep 1, 2026' },
  { id: 'm5', name: 'mosque-interior.jpg', size: '1.7 MB', src: images.mosqueInterior, createdAt: 'Sep 1, 2026' },
  { id: 'm6', name: 'mosque-dome.jpg', size: '2.0 MB', src: images.mosqueDome, createdAt: 'Sep 1, 2026' },
];

export const articles: Article[] = seedArticles as Article[];

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
  { id: 'n3', title: 'Articles live', body: 'Three articles by Najeeb al-Anjelesi are published on the public site.', role: 'administrator', read: true },
];

export const categories: Category[] = [
  { id: 'cat1', name: 'Islamic Education', slug: 'islamic-education', articleCount: 0 },
  { id: 'cat2', name: 'Islamic Ethics', slug: 'islamic-ethics', articleCount: 0 },
  { id: 'cat3', name: 'Knowledge & Learning', slug: 'knowledge-learning', articleCount: 0 },
  { id: 'cat4', name: 'Tarbiyah', slug: 'tarbiyah', articleCount: 0 },
  { id: 'cat5', name: 'Aqidah', slug: 'aqidah', articleCount: 0 },
  { id: 'cat6', name: 'Fiqh', slug: 'fiqh', articleCount: 0 },
  { id: 'cat8', name: 'Purification', slug: 'purification', articleCount: 1 },
  { id: 'cat9', name: 'Prayer', slug: 'prayer', articleCount: 2 },
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
  icon: 'dashboard' | 'articles' | 'create' | 'profile' | 'help' | 'review' | 'categories' | 'media' | 'authors' | 'questions' | 'subscribers' | 'settings' | 'activity' | 'content-manager' | 'staff-profiles';
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
      { label: 'Assigned to me', key: 'questions', icon: 'questions' },
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
      { label: 'Content Manager', key: 'content-manager', icon: 'content-manager' },
      { label: 'Articles', key: 'articles', icon: 'articles' },
      { label: 'Review', key: 'review-queue', icon: 'review' },
      { label: 'Categories & Tags', key: 'categories-tags', icon: 'categories' },
    ]},
    { label: 'People', items: [
      { label: 'Authors', key: 'authors', icon: 'authors' },
      { label: 'Staff Profiles', key: 'staff-profiles', icon: 'staff-profiles' },
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
    { label: 'Account', items: [
      { label: 'My Profile', key: 'my-profile', icon: 'profile' },
      { label: 'Help', key: 'help', icon: 'help' },
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
