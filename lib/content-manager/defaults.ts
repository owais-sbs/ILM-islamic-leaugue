/** ============================================================
 *  ILM Content Manager — Default / Fallback Content (Phase 1)
 *  Mirrors the current live homepage content exactly.
 *  If no localStorage data exists the site uses these values.
 * ============================================================ */

import type { CMHomepageContent } from './types';

export const CM_DEFAULTS: CMHomepageContent = {
  header: {
    siteName: 'Islamic League of Murabbiyūn',
    ctaText: 'Ask a Question',
    ctaUrl: '/ask',
    navItems: [
      { id: 'nav-home', label: 'Home', href: '/', visible: true, order: 0 },
      { id: 'nav-about', label: 'About Us', href: '/about', visible: true, order: 1 },
      { id: 'nav-articles', label: 'Articles', href: '/articles', visible: true, order: 2 },
      { id: 'nav-murabbiyun', label: 'Murabbiyūn', href: '/murabbiyun', visible: true, order: 3 },
      { id: 'nav-connect', label: 'Connect', href: '/contact', visible: true, order: 4 },
    ],
  },

  hero: {
    eyebrow: 'Knowledge. Clarity. Cultivation.',
    heading: 'Islamic League of',
    headingHighlight: 'Murabbiyūn',
    description: 'Making beneficial Islamic knowledge accessible to Muslims in America.',
    primaryBtnText: 'Explore the Library',
    primaryBtnUrl: '/articles',
    secondaryBtnText: 'Discover Our Story',
    secondaryBtnUrl: '/about',
    heroImage:
      'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80',
    showImage: true,
    showPrimaryBtn: true,
    showSecondaryBtn: true,
    visible: true,
  },

  about: {
    sectionLabel: 'About Us',
    heading: 'Islamic League of Murabbiyūn',
    headingHighlight: 'Murabbiyūn',
    body1:
      'The Islamic League of Murabbiyūn (ILM) is an educational initiative dedicated to providing clear, reliable, and practical Islamic guidance rooted in the Qur\u2019an, Sunnah, and the methodology of Ahlus-Sunnah wa-l-Jamā\u02BFah.',
    body2:
      'Through qualified educators, research, articles, seminars, and educational resources, we seek to clarify the matters of Islam that affect the everyday lives of Muslims and cultivate a community grounded in sound knowledge and practice.',
    btnText: 'Learn more about ILM',
    btnUrl: '/about',
    visible: true,
    pillars: [
      {
        id: 'pillar-1',
        title: 'Knowledge',
        body: 'Reliable Islamic education for Muslims in America, rooted in the Qur\u2019an, Sunnah, and the methodology of Ahlus-Sunnah wa-l-Jamā\u02BFah.',
        visible: true,
        order: 0,
      },
      {
        id: 'pillar-2',
        title: 'Clarity',
        body: 'Making beneficial Islamic knowledge accessible to Muslims in America.',
        visible: true,
        order: 1,
      },
      {
        id: 'pillar-3',
        title: 'Cultivation',
        body: 'Making Islam clear. Making knowledge accessible. Cultivating Muslims.',
        visible: true,
        order: 2,
      },
    ],
  },

  featuredArticles: {
    mode: 'latest',
    selectedIds: [],
    count: 3,
    visible: true,
  },

  directory: {
    sectionLabel: 'Directory',
    heading: 'Meet the',
    headingHighlight: 'Murabbiyūn',
    description1:
      'The contributors who sacrifice their time by authoring beneficial and knowledge-based articles are all upon the way of Ahlus Sunnah wa al-Jamā\u02BFah.',
    description2:
      'In specific matters one mentor\u2019s position may differ from another. Every mentor represents himself, and his view should not be construed to be reflective of other mentors.',
    image:
      'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Mosque at sunrise',
    overlayLine1: 'Knowledge',
    overlayLine2: 'Builds',
    overlayLine3: 'Character',
    visible: true,
    murabbiyun: {
      visible: true,
      items: [
        { id: 'aqil-ingram', visible: true, order: 0 },
        { id: 'ilir-aliji', visible: true, order: 1 },
        { id: 'mujahid-keith', visible: true, order: 2 },
        { id: 'hanif-fouse', visible: true, order: 3 },
        { id: 'najeeb-al-anjelesi', visible: true, order: 4 },
      ],
    },
    categories: {
      visible: true,
      items: [
        { id: 'cat1', visible: true, order: 0 },
        { id: 'cat2', visible: true, order: 1 },
        { id: 'cat3', visible: true, order: 2 },
        { id: 'cat4', visible: true, order: 3 },
        { id: 'cat5', visible: true, order: 4 },
        { id: 'cat6', visible: true, order: 5 },
        { id: 'cat8', visible: true, order: 6 },
        { id: 'cat9', visible: true, order: 7 },
        { id: 'cat7', visible: true, order: 8 },
      ],
    },
  },

  learningJourney: {
    sectionLabel: 'A way of learning',
    heading: 'How seekers walk with ILM.',
    visible: true,
    steps: [
      {
        id: 'step-1',
        n: '01',
        title: 'Read with presence',
        body: 'Sit with an article the way one sits with a teacher: slowly, and with the heart open.',
        visible: true,
        order: 0,
      },
      {
        id: 'step-2',
        n: '02',
        title: 'Ask with adab',
        body: 'Bring your questions. Our murabbiy\u016Bn answer with care, not haste.',
        visible: true,
        order: 1,
      },
      {
        id: 'step-3',
        n: '03',
        title: 'Live what you learn',
        body: 'Let knowledge settle into habit, character, and the way you meet the world.',
        visible: true,
        order: 2,
      },
    ],
  },

  quote: {
    text: 'Making Islam clear. Making knowledge accessible. Cultivating Muslims.',
    attribution: 'Islamic League of Murabbiy\u016Bn',
    visible: true,
  },

  newsletter: {
    heading: 'A little more meaning in your inbox.',
    subheading: 'Stay in the circle',
    description: 'Monthly reflections, new conversations, and gentle reminders for the road ahead.',
    inputPlaceholder: 'you@example.com',
    btnText: 'Subscribe',
    successMessage: "You're on the list.",
    visible: true,
  },

  footer: {
    description: 'Making beneficial Islamic knowledge accessible to Muslims in America.',
    copyright: '© 2026 Islamic League of Murabbiy\u016Bn. All Rights Reserved.',
    exploreLinks: [
      { id: 'fl-home', label: 'Home', href: '/', visible: true, order: 0 },
      { id: 'fl-about', label: 'About Us', href: '/about', visible: true, order: 1 },
      { id: 'fl-mv', label: 'Mission & Vision', href: '/mission-vision', visible: true, order: 2 },
      { id: 'fl-articles', label: 'Articles', href: '/articles', visible: true, order: 3 },
      { id: 'fl-murabbiyun', label: 'Murabbiy\u016Bn', href: '/murabbiyun', visible: true, order: 4 },
      { id: 'fl-donation', label: 'Donation', href: '/donation', visible: true, order: 5 },
    ],
    connectLinks: [
      { id: 'cl-ask', label: 'Ask a question', href: '/ask', visible: true, order: 0 },
      { id: 'cl-contact', label: 'Contact us', href: '/contact', visible: true, order: 1 },
      { id: 'cl-disclaimer', label: 'Disclaimer', href: '/disclaimer', visible: true, order: 2 },
      { id: 'cl-privacy', label: 'Privacy Policy', href: '/privacy', visible: true, order: 3 },
      { id: 'cl-terms', label: 'Terms & Conditions', href: '/terms', visible: true, order: 4 },
      { id: 'cl-login', label: 'Contributor portal', href: '/login', visible: true, order: 5 },
    ],
    socialLinks: [
      { id: 'sl-instagram', platform: 'instagram', href: '/#top', visible: true },
      { id: 'sl-linkedin', platform: 'linkedin', href: '/#top', visible: true },
      { id: 'sl-youtube', platform: 'youtube', href: '/#top', visible: true },
    ],
    visible: true,
  },
};
