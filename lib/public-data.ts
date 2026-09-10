import { images } from './images';

export const heroImage = images.quranSunrise;
export const mosqueArchImage = images.mosqueArch;

export const libraryCategories = ['All', 'Aqidah', 'Fiqh', 'Tarbiyah', 'History', 'Spirituality'] as const;
export type LibraryCategory = (typeof libraryCategories)[number];

export const murabbiFilters = ['All', 'Studies', 'Hanafi', 'Maliki', "Shafi'i", 'Hanbali'] as const;
export type MurabbiFilter = (typeof murabbiFilters)[number];

export interface Murabbi {
  id: string;
  initials: string;
  name: string;
  role: string;
  bio: string;
  credentials: string;
  madhhab: 'Hanafi' | 'Maliki' | "Shafi'i" | 'Hanbali';
  focus: 'Studies' | 'Fiqh' | 'Spiritual' | 'Arabic';
  image: string;
  accent: string;
  button: 'gold' | 'ghost' | 'navy' | 'sand';
}

export const murabbiyūn: Murabbi[] = [
  {
    id: 'ibrahim-al-fadl',
    initials: 'IF',
    name: 'Shaykh Ibrahim Al-Fadl',
    role: 'Director of Studies',
    bio: 'Guides the academic and spiritual curriculum with wisdom and clarity. He holds the Administrator role and final publishing authority for the league.',
    credentials: 'Director · Traditional studies · Hanafi',
    madhhab: 'Hanafi',
    focus: 'Studies',
    image: images.scholarKufi,
    accent: 'bg-sky-100 text-sky-700',
    button: 'gold',
  },
  {
    id: 'maryam-yusuf',
    initials: 'MY',
    name: 'Ustadha Maryam Yusuf',
    role: 'Fiqh Instructor',
    bio: 'Brings the principles of fiqh to life through clarity and practical examples drawn from the Maliki school.',
    credentials: 'PhD Islamic Studies · Maliki fiqh',
    madhhab: 'Maliki',
    focus: 'Fiqh',
    image: images.scholarHijab,
    accent: 'bg-emerald-100 text-emerald-700',
    button: 'ghost',
  },
  {
    id: 'hamza-idris',
    initials: 'HI',
    name: 'Shaykh Hamza Idris',
    role: 'Spiritual Counsel',
    bio: 'Supports hearts, strengthens faith, and walks with seekers through tazkiyah and daily practice.',
    credentials: 'Spiritual counsel · Shafi‘i',
    madhhab: "Shafi'i",
    focus: 'Spiritual',
    image: images.scholarBeard,
    accent: 'bg-indigo-100 text-indigo-700',
    button: 'ghost',
  },
  {
    id: 'yusuf-karim',
    initials: 'YK',
    name: 'Ustadh Yusuf Karim',
    role: 'Arabic & Text Studies',
    bio: 'Builds language skills and deepens understanding of the sacred texts with patience and precision.',
    credentials: 'Arabic & nass studies · Hanbali',
    madhhab: 'Hanbali',
    focus: 'Arabic',
    image: images.scholarQuran,
    accent: 'bg-orange-100 text-orange-700',
    button: 'sand',
  },
];

export const pillars = [
  { title: 'Thoughtful learning', body: 'Knowledge that is paced, rooted, and meant to be lived — not rushed through.' },
  { title: 'Soulful conversation', body: 'Questions that matter, held with dignity, between seekers and those who guide.' },
  { title: 'Character first', body: 'We measure growth not by how much we know, but by how we become.' },
];

export const steps = [
  { n: '01', title: 'Read with presence', body: 'Sit with an article the way one sits with a teacher — slowly, and with the heart open.' },
  { n: '02', title: 'Ask with adab', body: 'Bring your questions. Our murabbiyūn answer with care, not haste.' },
  { n: '03', title: 'Live what you learn', body: 'Let knowledge settle into habit, character, and the way you meet the world.' },
];
