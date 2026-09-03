export type ArticleStatus = 'draft' | 'submitted' | 'approved' | 'published' | 'returned';

export type Role = 'author' | 'editor' | 'admin';

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorAvatar: string;
  status: ArticleStatus;
  featuredImage: string;
  publishedAt: string | null;
  updatedAt: string;
  readTime: string;
  reviewNotes?: string;
  views?: number;
}

export interface Author {
  id: string;
  slug: string;
  name: string;
  credentials: string;
  madhhab: string;
  bio: string;
  avatar: string;
  articleCount: number;
  role: Role;
  email: string;
  active: boolean;
  joinedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  articleCount: number;
  color: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  articleCount: number;
}

export interface Question {
  id: string;
  name: string;
  email: string;
  subject: string;
  category: string;
  body: string;
  status: 'new' | 'assigned' | 'answered' | 'archived';
  assignedTo: string | null;
  createdAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
}

export interface ActivityEntry {
  id: string;
  actor: string;
  action: string;
  entity: string;
  timestamp: string;
  type: 'create' | 'update' | 'delete' | 'publish' | 'review' | 'auth';
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document';
  size: string;
  uploadedAt: string;
}

const IMG = {
  quran: 'https://images.pexels.com/photos/8164532/pexels-photo-8164532.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  quranWarm: 'https://images.pexels.com/photos/36516083/pexels-photo-36516083.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  reading: 'https://images.pexels.com/photos/33750569/pexels-photo-33750569.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  arches: 'https://images.pexels.com/photos/15129765/pexels-photo-15129765.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  arches2: 'https://images.pexels.com/photos/19213544/pexels-photo-19213544.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  arches3: 'https://images.pexels.com/photos/15234829/pexels-photo-15234829.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  scholar1: 'https://images.pexels.com/photos/14819810/pexels-photo-14819810.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
  scholar2: 'https://images.pexels.com/photos/16029777/pexels-photo-16029777.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
  scholar3: 'https://images.pexels.com/photos/8763278/pexels-photo-8763278.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
  scholar4: 'https://images.pexels.com/photos/34619489/pexels-photo-34619489.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
};

export const images = IMG;

export const authors: Author[] = [
  { id: 'a1', slug: 'kareem-rahman', name: 'Ustadh Kareem Rahman', credentials: 'BA Islamic Studies, Al-Azhar', madhhab: 'Hanafi', bio: 'A teacher of Arabic and Islamic sciences with a focus on spiritual formation and character education.', avatar: IMG.scholar1, articleCount: 18, role: 'author', email: 'kareem@ilm.org', active: true, joinedAt: '2023-06-12' },
  { id: 'a2', slug: 'maryam-khalid', name: 'Dr. Maryam Khalid', credentials: 'PhD Qur\'anic Sciences, IIUM', madhhab: 'Shafi\'i', bio: 'Researcher in tafsir and Qur\'anic hermeneutics, with publications on gender and ethics in the Islamic tradition.', avatar: IMG.scholar4, articleCount: 24, role: 'editor', email: 'maryam@ilm.org', active: true, joinedAt: '2023-04-03' },
  { id: 'a3', slug: 'yusuf-asad', name: 'Shaykh Yusuf Asad', credentials: 'MA Hadith Sciences, Umm al-Qura', madhhab: 'Maliki', bio: 'Imam and educator specializing in hadith methodology, fiqh, and the living tradition of West Africa.', avatar: IMG.scholar2, articleCount: 31, role: 'author', email: 'yusuf@ilm.org', active: true, joinedAt: '2023-02-18' },
  { id: 'a4', slug: 'sara-ben-omar', name: 'Ustadha Sara Ben Omar', credentials: 'MA Islamic History, SOAS', madhhab: 'Hanbali', bio: 'Historian of early Islam and the transmission of knowledge across the Muslim world.', avatar: IMG.scholar4, articleCount: 12, role: 'author', email: 'sara@ilm.org', active: true, joinedAt: '2024-01-09' },
  { id: 'a5', slug: 'ismail-diallo', name: 'Ustadh Ismail Diallo', credentials: 'BSc Computer Science, Qarawiyyin', madhhab: 'Hanafi', bio: 'Software engineer and student of the Islamic rationalist tradition, writing at the intersection of faith and reason.', avatar: IMG.scholar3, articleCount: 7, role: 'author', email: 'ismail@ilm.org', active: false, joinedAt: '2024-03-15' },
];

export const categories: Category[] = [
  { id: 'c1', name: 'Qur\'an & Tafsir', slug: 'quran-tafsir', description: 'Revelation, recitation, and reflection on the Book of Allah.', articleCount: 42, color: '#0F1657' },
  { id: 'c2', name: 'Spirituality', slug: 'spirituality', description: 'The inner life, the heart\'s work, and the path of purification.', articleCount: 28, color: '#C9972E' },
  { id: 'c3', name: 'Islamic History', slug: 'islamic-history', description: 'Memory, people, and places across the centuries.', articleCount: 19, color: '#1a2380' },
  { id: 'c4', name: 'Character & Practice', slug: 'character-practice', description: 'The art of living with ihsan, day by day.', articleCount: 36, color: '#0F1657' },
  { id: 'c5', name: 'Law & Methodology', slug: 'law-methodology', description: 'Usul al-fiqh, legal reasoning, and the schools of thought.', articleCount: 15, color: '#C9972E' },
  { id: 'c6', name: 'Contemporary Issues', slug: 'contemporary-issues', description: 'Faith in conversation with the modern world.', articleCount: 22, color: '#1a2380' },
];

export const tags: Tag[] = [
  { id: 't1', name: 'intention', slug: 'intention', articleCount: 8 },
  { id: 't2', name: 'ramadan', slug: 'ramadan', articleCount: 12 },
  { id: 't3', name: 'prophetic-example', slug: 'prophetic-example', articleCount: 19 },
  { id: 't4', name: 'knowledge', slug: 'knowledge', articleCount: 15 },
  { id: 't5', name: 'community', slug: 'community', articleCount: 9 },
  { id: 't6', name: 'prayer', slug: 'prayer', articleCount: 11 },
  { id: 't7', name: 'patience', slug: 'patience', articleCount: 6 },
  { id: 't8', name: 'gratitude', slug: 'gratitude', articleCount: 7 },
];

const articleBody = `<p>In a world that moves quickly and asks much of us, the prophetic teaching offers a remarkably different instruction: begin with the inward. The foundation of all action is <span dir="rtl">نية</span> — intention — and it is the place where the work of becoming truly begins.</p>
<h2>The architecture of intention</h2>
<p>The Prophet Muhammad ﷺ said, "Actions are but by intentions, and every person shall have only that which they intended." This is not merely a legal maxim. It is a statement about the inner architecture of a life.</p>
<blockquote>An intention is not a thought you have once. It is the direction your heart keeps returning to, even when no one is watching.</blockquote>
<p>When we attend to our intentions, we attend to the quality of our action itself. The same deed — feeding the hungry, visiting the sick, speaking the truth — becomes something different depending on what the heart has set itself toward.</p>
<h3>Three practices for the inward</h3>
<ul><li>Begin each day with a moment of stillness before the first task.</li><li>Ask yourself: who am I doing this for, and what am I hoping it becomes?</li><li>Return to that question when the work feels heavy or invisible.</li></ul>
<p class="footnote"><sup>1</sup> This essay draws on the collection of forty hadith on the topic of intention and sincerity, as compiled by Imam al-Nawawi.</p>`;

export const articles: Article[] = [
  { id: '1', slug: 'quiet-architecture-of-a-life-well-lived', title: 'The quiet architecture of a life well-lived', excerpt: 'On attention, intention, and the small daily practices that make room for what matters.', body: articleBody, category: 'Spirituality', tags: ['intention', 'knowledge'], authorId: 'a1', authorName: 'Ustadh Kareem Rahman', authorAvatar: IMG.scholar1, status: 'published', featuredImage: IMG.quranWarm, publishedAt: '2024-08-24', updatedAt: '2024-08-24', readTime: '8 min read', views: 1240 },
  { id: '2', slug: 'what-it-means-to-read-with-your-whole-self', title: 'What it means to read with your whole self', excerpt: 'A return to the Quran as a living conversation — not only a text to be completed.', body: articleBody, category: 'Qur\'an & Tafsir', tags: ['knowledge', 'prayer'], authorId: 'a2', authorName: 'Dr. Maryam Khalid', authorAvatar: IMG.scholar4, status: 'published', featuredImage: IMG.quran, publishedAt: '2024-08-18', updatedAt: '2024-08-18', readTime: '11 min read', views: 890 },
  { id: '3', slug: 'the-discipline-of-becoming-gentle', title: 'The discipline of becoming gentle', excerpt: 'Strength in the prophetic tradition is not loud. It is patient, measured, and deeply awake.', body: articleBody, category: 'Character & Practice', tags: ['prophetic-example', 'patience'], authorId: 'a3', authorName: 'Shaykh Yusuf Asad', authorAvatar: IMG.scholar2, status: 'published', featuredImage: IMG.arches, publishedAt: '2024-08-11', updatedAt: '2024-08-11', readTime: '6 min read', views: 2100 },
  { id: '4', slug: 'on-the-transmission-of-knowledge', title: 'On the transmission of knowledge', excerpt: 'How the chain of teachers carries not only information but an entire way of being.', body: articleBody, category: 'Islamic History', tags: ['knowledge', 'community'], authorId: 'a4', authorName: 'Ustadha Sara Ben Omar', authorAvatar: IMG.scholar4, status: 'published', featuredImage: IMG.arches2, publishedAt: '2024-08-05', updatedAt: '2024-08-05', readTime: '9 min read', views: 670 },
  { id: '5', slug: 'ramadan-as-a-teacher-of-time', title: 'Ramadan as a teacher of time', excerpt: 'The month of fasting reshapes our relationship with time, body, and meaning.', body: articleBody, category: 'Spirituality', tags: ['ramadan', 'patience'], authorId: 'a1', authorName: 'Ustadh Kareem Rahman', authorAvatar: IMG.scholar1, status: 'published', featuredImage: IMG.reading, publishedAt: '2024-07-28', updatedAt: '2024-07-28', readTime: '7 min read', views: 1530 },
  { id: '6', slug: 'the-grammar-of-gratitude', title: 'The grammar of gratitude', excerpt: 'Shukr is not just a feeling. It is a practice with structure, rhythm, and consequence.', body: articleBody, category: 'Character & Practice', tags: ['gratitude', 'intention'], authorId: 'a3', authorName: 'Shaykh Yusuf Asad', authorAvatar: IMG.scholar2, status: 'published', featuredImage: IMG.arches3, publishedAt: '2024-08-02', updatedAt: '2024-08-27', readTime: '5 min read', views: 740 },
  { id: '7', slug: 'usul-al-fiqh-for-the-curious', title: 'Usul al-fiqh for the curious', excerpt: 'A gentle introduction to the principles of Islamic legal reasoning for the everyday reader.', body: articleBody, category: 'Law & Methodology', tags: ['knowledge'], authorId: 'a2', authorName: 'Dr. Maryam Khalid', authorAvatar: IMG.scholar4, status: 'published', featuredImage: IMG.arches, publishedAt: '2024-07-15', updatedAt: '2024-08-26', readTime: '14 min read', views: 520 },
  { id: '8', slug: 'faith-and-reason-in-conversation', title: 'Faith and reason in conversation', excerpt: 'On the Islamic intellectual tradition that never saw a contradiction between the two.', body: articleBody, category: 'Contemporary Issues', tags: ['knowledge', 'community'], authorId: 'a5', authorName: 'Ustadh Ismail Diallo', authorAvatar: IMG.scholar3, status: 'published', featuredImage: IMG.quranWarm, publishedAt: '2024-07-08', updatedAt: '2024-08-28', readTime: '10 min read', views: 610 },
  { id: '11', slug: 'prayer-as-orientation', title: 'Prayer as orientation', excerpt: 'Salah is not only ritual — it is the daily re-centering of a life around what is ultimate.', body: articleBody, category: 'Spirituality', tags: ['prayer', 'intention'], authorId: 'a1', authorName: 'Ustadh Kareem Rahman', authorAvatar: IMG.scholar1, status: 'published', featuredImage: IMG.arches2, publishedAt: '2024-07-12', updatedAt: '2024-07-12', readTime: '7 min read', views: 1120 },
  { id: '12', slug: 'holding-knowledge-lightly', title: 'Holding knowledge lightly', excerpt: 'The scholar who knows most is often the one most aware of how much remains unknown.', body: articleBody, category: 'Qur\'an & Tafsir', tags: ['knowledge', 'intention'], authorId: 'a2', authorName: 'Dr. Maryam Khalid', authorAvatar: IMG.scholar4, status: 'published', featuredImage: IMG.reading, publishedAt: '2024-06-28', updatedAt: '2024-06-28', readTime: '9 min read', views: 830 },
  { id: '13', slug: 'the-ethics-of-disagreement', title: 'The ethics of disagreement', excerpt: 'How the tradition teaches us to differ without losing our adab, our clarity, or our unity.', body: articleBody, category: 'Contemporary Issues', tags: ['community', 'prophetic-example'], authorId: 'a3', authorName: 'Shaykh Yusuf Asad', authorAvatar: IMG.scholar2, status: 'published', featuredImage: IMG.arches, publishedAt: '2024-06-20', updatedAt: '2024-06-20', readTime: '8 min read', views: 940 },
  { id: '14', slug: 'the-night-prayer-and-the-quiet-heart', title: 'The night prayer and the quiet heart', excerpt: 'On tahajjud, solitude, and the conversations that happen when the world has gone still.', body: articleBody, category: 'Character & Practice', tags: ['prayer', 'patience'], authorId: 'a4', authorName: 'Ustadha Sara Ben Omar', authorAvatar: IMG.scholar4, status: 'published', featuredImage: IMG.quran, publishedAt: '2024-06-10', updatedAt: '2024-06-10', readTime: '6 min read', views: 1180 },
  { id: '9', slug: 'the-company-you-keep', title: 'The company you keep', excerpt: 'On friendship as a spiritual practice and the Prophet\'s teaching on companionship.', body: articleBody, category: 'Character & Practice', tags: ['prophetic-example', 'community'], authorId: 'a1', authorName: 'Ustadh Kareem Rahman', authorAvatar: IMG.scholar1, status: 'returned', featuredImage: IMG.scholar2, publishedAt: null, updatedAt: '2024-08-25', readTime: '6 min read', reviewNotes: 'Beautiful piece. Could you expand the section on prophetic companionship with one more example? Also, please add a footnote for the hadith on p.2.' },
  { id: '10', slug: 'the-heart-and-its-vessels', title: 'The heart and its vessels', excerpt: 'A meditation on the Quranic image of the heart and what it means to carry it with care.', body: articleBody, category: 'Spirituality', tags: ['intention', 'gratitude'], authorId: 'a2', authorName: 'Dr. Maryam Khalid', authorAvatar: IMG.scholar4, status: 'published', featuredImage: IMG.quran, publishedAt: '2024-07-20', updatedAt: '2024-07-20', readTime: '8 min read', views: 980 },
];

export const questions: Question[] = [
  { id: 'q1', name: 'Ahmed H.', email: 'ahmed.h@email.com', subject: 'Is it permissible to pray while traveling?', category: 'Law & Methodology', body: 'I travel frequently for work and sometimes miss prayers. What is the ruling on combining and shortening prayers during travel?', status: 'new', assignedTo: null, createdAt: '2024-08-28' },
  { id: 'q2', name: 'Fatima Z.', email: 'fatima.z@email.com', subject: 'How do I build a consistent reading habit with the Quran?', category: 'Qur\'an & Tafsir', body: 'I struggle to read the Quran daily. Do you have advice on building a sustainable relationship with the Book?', status: 'assigned', assignedTo: 'Ustadh Kareem Rahman', createdAt: '2024-08-27' },
  { id: 'q3', name: 'Yusuf M.', email: 'yusuf.m@email.com', subject: 'What is the difference between gratitude and contentment?', category: 'Spirituality', body: 'I often hear these two used interchangeably. Are they the same in the Islamic tradition, or is there a meaningful distinction?', status: 'answered', assignedTo: 'Dr. Maryam Khalid', createdAt: '2024-08-22' },
  { id: 'q4', name: 'Layla A.', email: 'layla.a@email.com', subject: 'On wearing hijab while playing sports', category: 'Contemporary Issues', body: 'My daughter is a competitive swimmer and we are looking for guidance on modest athletic wear.', status: 'new', assignedTo: null, createdAt: '2024-08-28' },
  { id: 'q5', name: 'Omar B.', email: 'omar.b@email.com', subject: 'Can you recommend books on usul al-fiqh for beginners?', category: 'Law & Methodology', body: 'I am a university student interested in learning the basics of Islamic legal methodology. Where should I start?', status: 'archived', assignedTo: 'Shaykh Yusuf Asad', createdAt: '2024-08-15' },
];

export const subscribers: Subscriber[] = [
  { id: 's1', email: 'reader1@email.com', subscribedAt: '2024-08-28', status: 'active' },
  { id: 's2', email: 'student2@email.com', subscribedAt: '2024-08-26', status: 'active' },
  { id: 's3', email: 'seeker3@email.com', subscribedAt: '2024-08-20', status: 'active' },
  { id: 's4', email: 'mused4@email.com', subscribedAt: '2024-08-15', status: 'active' },
  { id: 's5', email: 'quiet5@email.com', subscribedAt: '2024-08-10', status: 'unsubscribed' },
  { id: 's6', email: 'wanderer6@email.com', subscribedAt: '2024-08-05', status: 'active' },
];

export const activity: ActivityEntry[] = [
  { id: 'ac1', actor: 'Dr. Maryam Khalid', action: 'published', entity: 'The heart and its vessels', timestamp: '2024-08-28 14:32', type: 'publish' },
  { id: 'ac2', actor: 'Ustadh Kareem Rahman', action: 'submitted for review', entity: 'The company you keep', timestamp: '2024-08-28 11:15', type: 'review' },
  { id: 'ac3', actor: 'Dr. Maryam Khalid', action: 'returned to author', entity: 'The company you keep', timestamp: '2024-08-27 16:45', type: 'review' },
  { id: 'ac4', actor: 'Shaykh Yusuf Asad', action: 'created draft', entity: 'The grammar of gratitude', timestamp: '2024-08-26 09:20', type: 'create' },
  { id: 'ac5', actor: 'Admin', action: 'invited new author', entity: 'Ustadh Ismail Diallo', timestamp: '2024-08-25 13:00', type: 'auth' },
  { id: 'ac6', actor: 'Dr. Maryam Khalid', action: 'approved', entity: 'The grammar of gratitude', timestamp: '2024-08-25 10:30', type: 'review' },
  { id: 'ac7', actor: 'Ustadha Sara Ben Omar', action: 'updated', entity: 'On the transmission of knowledge', timestamp: '2024-08-24 15:45', type: 'update' },
  { id: 'ac8', actor: 'Admin', action: 'deleted media item', entity: 'old-banner.png', timestamp: '2024-08-23 08:10', type: 'delete' },
];

export const mediaItems: MediaItem[] = [
  { id: 'm1', name: 'quran-open.jpg', url: IMG.quran, type: 'image', size: '2.4 MB', uploadedAt: '2024-08-20' },
  { id: 'm2', name: 'warm-light.jpg', url: IMG.quranWarm, type: 'image', size: '3.1 MB', uploadedAt: '2024-08-18' },
  { id: 'm3', name: 'reading-light.jpg', url: IMG.reading, type: 'image', size: '1.8 MB', uploadedAt: '2024-08-15' },
  { id: 'm4', name: 'arches-detail.jpg', url: IMG.arches, type: 'image', size: '4.2 MB', uploadedAt: '2024-08-12' },
  { id: 'm5', name: 'mosque-arches.jpg', url: IMG.arches2, type: 'image', size: '3.7 MB', uploadedAt: '2024-08-10' },
  { id: 'm6', name: 'sunlit-archway.jpg', url: IMG.arches3, type: 'image', size: '2.9 MB', uploadedAt: '2024-08-08' },
  { id: 'm7', name: 'scholar-portrait.jpg', url: IMG.scholar1, type: 'image', size: '1.5 MB', uploadedAt: '2024-08-05' },
  { id: 'm8', name: 'library-portrait.jpg', url: IMG.scholar2, type: 'image', size: '2.1 MB', uploadedAt: '2024-08-03' },
];

export const statusConfig: Record<ArticleStatus, { label: string; bg: string; text: string; dot: string }> = {
  draft: { label: 'Draft', bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  submitted: { label: 'Submitted', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  approved: { label: 'Approved', bg: 'bg-ilm-cream', text: 'text-ilm-navy', dot: 'bg-ilm-gold' },
  published: { label: 'Published', bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-600' },
  returned: { label: 'Returned', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
};
