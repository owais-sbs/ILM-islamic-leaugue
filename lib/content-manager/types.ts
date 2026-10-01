/** ============================================================
 *  ILM Content Manager — Type Definitions (Phase 1)
 *  All data lives in localStorage. No Supabase in Phase 1.
 * ============================================================ */

export interface NavItem {
  id: string;
  label: string;
  href: string;
  visible: boolean;
  order: number;
}

export interface CMHeader {
  siteName: string;
  ctaText: string;
  ctaUrl: string;
  navItems: NavItem[];
}

export interface CMHero {
  eyebrow: string;
  heading: string;
  headingHighlight: string;
  description: string;
  primaryBtnText: string;
  primaryBtnUrl: string;
  secondaryBtnText: string;
  secondaryBtnUrl: string;
  heroImage: string;
  showImage: boolean;
  showPrimaryBtn: boolean;
  showSecondaryBtn: boolean;
  visible: boolean;
}

export interface PillarItem {
  id: string;
  title: string;
  body: string;
  visible: boolean;
  order: number;
}

export interface CMAbout {
  sectionLabel: string;
  heading: string;
  headingHighlight: string;
  body1: string;
  body2: string;
  btnText: string;
  btnUrl: string;
  visible: boolean;
  pillars: PillarItem[];
}

export interface CMFeaturedArticles {
  mode: 'latest' | 'selected';
  selectedIds: string[];
  count: number;
  visible: boolean;
}

export interface CMCategoryDisplay {
  id: string;
  visible: boolean;
  order: number;
}

export interface CMCategories {
  visible: boolean;
  items: CMCategoryDisplay[];
}

export interface CMMurabbiDisplay {
  id: string;
  visible: boolean;
  order: number;
}

export interface CMMurabbiyun {
  visible: boolean;
  items: CMMurabbiDisplay[];
}

/** Directory section — the intro banner above the Murabbiyūn cards */
export interface CMDirectory {
  sectionLabel: string;
  heading: string;
  headingHighlight: string;
  description1: string;
  description2: string;
  image: string;
  imageAlt: string;
  overlayLine1: string;
  overlayLine2: string;
  overlayLine3: string;
  visible: boolean;
  murabbiyun: CMMurabbiyun;
  categories: CMCategories;
}

export interface LearningStep {
  id: string;
  n: string;
  title: string;
  body: string;
  visible: boolean;
  order: number;
}

export interface CMLearningJourney {
  sectionLabel: string;
  heading: string;
  visible: boolean;
  steps: LearningStep[];
}

export interface CMQuote {
  text: string;
  attribution: string;
  visible: boolean;
}

export interface CMNewsletter {
  heading: string;
  subheading: string;
  description: string;
  inputPlaceholder: string;
  btnText: string;
  successMessage: string;
  visible: boolean;
}

export interface FooterLink {
  id: string;
  label: string;
  href: string;
  visible: boolean;
  order: number;
}

export interface SocialLink {
  id: string;
  platform: 'instagram' | 'linkedin' | 'youtube' | 'twitter' | 'facebook' | 'tiktok';
  href: string;
  visible: boolean;
}

export interface CMFooter {
  description: string;
  copyright: string;
  exploreLinks: FooterLink[];
  connectLinks: FooterLink[];
  socialLinks: SocialLink[];
  visible: boolean;
}

export interface CMHomepageContent {
  header: CMHeader;
  hero: CMHero;
  about: CMAbout;
  featuredArticles: CMFeaturedArticles;
  directory: CMDirectory;
  learningJourney: CMLearningJourney;
  quote: CMQuote;
  newsletter: CMNewsletter;
  footer: CMFooter;
}

/* ============================================================
 *  Static pages — About Us & Mission/Vision
 * ============================================================ */

export interface CMAboutPage {
  eyebrow: string;
  heading: string;
  headingHighlight: string;
  methodologyTitle: string;
  introParagraphs: string[];
  principlesTitle: string;
  principles: { title: string; body: string }[];
  closingParagraph: string;
  founderTitle: string;
  founderAuthor: string;
  founderParagraphs: string[];
}

export interface CMMissionVisionPage {
  pageTitle: string;
  missionEyebrow: string;
  missionTitle: string;
  missionBody: string;
  visionEyebrow: string;
  visionTitle: string;
  visionBody: string;
  visionNotes: string[];
  objectivesTitle: string;
  objectives: string[];
}

export interface CMPagesContent {
  aboutPage: CMAboutPage;
  missionVisionPage: CMMissionVisionPage;
}

export type CMSection = keyof CMHomepageContent;
export type CMPageSection = keyof CMPagesContent;
