import { images } from './images';

export const heroImage = images.quranSunrise;
export const mosqueArchImage = images.mosqueArch;

export const libraryCategories = [
  'All',
  'Islamic Education',
  'Islamic Ethics',
  'Knowledge & Learning',
  'Tarbiyah',
  'Aqidah',
  'Fiqh',
  'Spirituality',
] as const;
export type LibraryCategory = (typeof libraryCategories)[number];

export const murabbiFilters = ['All', 'Studies', 'Hanafi', 'Maliki', "Shafi'i", 'Hanbali'] as const;
export type MurabbiFilter = (typeof murabbiFilters)[number];

export interface Murabbi {
  id: string;
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
    name: 'Shaykh Ibrahim Al-Fadl',
    role: 'Director of Studies',
    bio: 'Guides the academic and spiritual curriculum with wisdom and clarity. He holds the Administrator role and final publishing authority for the league.',
    credentials: 'Director · Traditional studies · Hanafi',
    madhhab: 'Hanafi',
    focus: 'Studies',
    image: images.murabbiPortrait,
    accent: 'bg-sky-100 text-sky-700',
    button: 'gold',
  },
  {
    id: 'omar-khalid',
    name: 'Ustadh Omar Khalid',
    role: 'Editorial Lead',
    bio: 'Shapes clarity, tone, and scholarly rigour across submissions before they reach the public library.',
    credentials: 'Editorial review · Hanafi',
    madhhab: 'Hanafi',
    focus: 'Studies',
    image: images.murabbiPortrait,
    accent: 'bg-emerald-100 text-emerald-700',
    button: 'ghost',
  },
  {
    id: 'yusuf-karim',
    name: 'Ustadh Yusuf Karim',
    role: 'Arabic & Text Studies',
    bio: 'Builds language skills and deepens understanding of the sacred texts with patience and precision.',
    credentials: 'Arabic & nass studies · Hanbali',
    madhhab: 'Hanbali',
    focus: 'Arabic',
    image: images.murabbiPortrait,
    accent: 'bg-orange-100 text-orange-700',
    button: 'sand',
  },
  {
    id: 'amina-hassan',
    name: 'Ustadha Amina Hassan',
    role: 'Tarbiyah & Community',
    bio: 'Walks with families and youth, helping knowledge settle into character and everyday practice.',
    credentials: 'Tarbiyah · Maliki',
    madhhab: 'Maliki',
    focus: 'Spiritual',
    image: images.murabbiPortrait,
    accent: 'bg-indigo-100 text-indigo-700',
    button: 'ghost',
  },
  {
    id: 'khalid-noor',
    name: 'Ustadh Khalid Noor',
    role: 'Fiqh & Practical Guidance',
    bio: 'Brings fiqh down to earth with examples that help seekers live with clarity and adab.',
    credentials: "Fiqh studies · Shafi'i",
    madhhab: "Shafi'i",
    focus: 'Fiqh',
    image: images.murabbiPortrait,
    accent: 'bg-amber-100 text-amber-800',
    button: 'navy',
  },
];

export const pillars = [
  { title: 'Thoughtful learning', body: 'Knowledge that is paced, rooted, and meant to be lived, not rushed through.' },
  { title: 'Soulful conversation', body: 'Questions that matter, held with dignity, between seekers and those who guide.' },
  { title: 'Character first', body: 'We measure growth not by how much we know, but by how we become.' },
];

export const steps = [
  { n: '01', title: 'Read with presence', body: 'Sit with an article the way one sits with a teacher: slowly, and with the heart open.' },
  { n: '02', title: 'Ask with adab', body: 'Bring your questions. Our murabbiyūn answer with care, not haste.' },
  { n: '03', title: 'Live what you learn', body: 'Let knowledge settle into habit, character, and the way you meet the world.' },
];
