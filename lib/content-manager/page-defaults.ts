/** ============================================================
 *  ILM Content Manager — Static Page Defaults (Phase 1)
 *  Mirrors the current About Us & Mission/Vision pages exactly.
 * ============================================================ */

import type { CMPagesContent } from './types';

export const CM_PAGE_STORAGE_KEY = 'ilm_content_manager_pages_v1';

export const CM_PAGE_DEFAULTS: CMPagesContent = {
  aboutPage: {
    eyebrow: 'About Us',
    heading: 'Contributing Mentors /',
    headingHighlight: 'Murabbiyūn',
    methodologyTitle: 'Scholarly differences among mentors',
    introParagraphs: [
      'The contributors who sacrifice their time by authoring beneficial and knowledge-based articles are all upon the way of Ahlus Sunnah wa al-Jamā\u02BFah. Thus, all have studied the usūl of one of the well-known Islamic Jurisprudence schools of thought, i.e. Hanbali, Maliki, Shafi\u02BCee, Hanafi, or Thahiri.',
      'As a result, in specific matters one mentor\u2019s position may differ from another mentor due to differing being abundant in these affairs, i.e. in fiqh, al-jarh wa at-ta\u02BFd\u012Bl as relates to men in the sanad (chain of transmission to a hadith), etc.',
      'Thus, you may find a subject expounded upon by a specific mentor whose conclusion differs with another, as every mentor represents himself, and his view should not be construed to be reflective of other mentors.',
      'Despite that, ILM does guarantee that each article and what is presented therein will not clash with nor go outside of orthodoxy as it relates to the conclusion found within them, consequently making them a reliable source of knowledge-based research.',
    ],
    principlesTitle: 'Guiding Principles and Procedures',
    principles: [
      { title: 'Sincerity', body: 'Seeking the pleasure of Allah and the benefit of the Muslim community.' },
      { title: 'Sound scholarship', body: 'Building educational material upon reliable sources and sound principles.' },
      { title: 'Clarity', body: 'Explaining Islamic guidance in language that ordinary Muslims can understand.' },
      { title: 'Practical relevance', body: "Prioritizing matters that directly affect Muslims' everyday lives." },
      { title: 'Intellectual honesty', body: 'Distinguishing established matters from areas of legitimate scholarly disagreement.' },
      { title: 'Respect for scholarship', body: 'Recognizing the established Islamic scholarly tradition and avoiding casual or uninformed judgments.' },
      { title: 'Responsibility', body: 'Publishing only material that the author is prepared to stand behind as a representation of his research.' },
      { title: 'Cultivation', body: 'Seeking not merely to inform Muslims, but to cultivate sound understanding, worship, character, and practice.' },
      { title: 'Service', body: 'Making beneficial Islamic knowledge accessible to Muslims throughout the United States.' },
    ],
    closingParagraph:
      'This standard will be seen and easily attested to by academics and laymen, and it is this standard that will be the means of achieving the primary goal of this website inshā\u02BEllah.',
    founderTitle: 'Founder\u2019s Statement',
    founderAuthor: 'Najeeb ibn Yusuf al-Anjelesi',
    founderParagraphs: [
      'As Salāmu alaikum wa rahmatullahi wa barakātuhu!',
      'It is not unknown to anyone given ears by which they hear, eyes by which they see, and a sound heart by which they comprehend, that the challenges of the Muslims in the west (generally) and in the United States (specifically) are various and multifaceted.',
      'Allah says:',
      '"And We sent down to you the Book a clarification for all things. A guidance, mercy, and glad-tidings for the Muslims." An-Nahl: 89',
      'Thus, I ask Allah that He aids and assists this effort, grants us success in our endeavors, and causes it to be a source of reward for all the contributors to this venture. Indeed, He is All-Knower, All-Seeing and All-Capable of whatsoever He wills.',
      'Lastly, may His lofty commendations and peace be on His Messenger Muhammad.',
    ],
  },

  missionVisionPage: {
    pageTitle: 'Mission & Vision',
    missionEyebrow: 'Mission',
    missionTitle: 'The Mission',
    missionBody:
      'To Provide English-speaking Muslims in the United States specifically and the west generally with clear, reliable, practically relevant Islamic education rooted in the Quran, Sunnah, Ijm\u0101 (i.e. consensus of Islamic scholars throughout time), and the methodology of Ahlus-Sunnah wa al-Jam\u0101\u02BFah, enabling Muslims to understand and practice their religion with sound knowledge, clarity, and confidence.',
    visionEyebrow: 'Vision',
    visionTitle: 'The Vision',
    visionBody:
      'To establish, by the permission of Allah, a recognized and respected national Islamic educational institution that cultivates knowledgeable and practicing Muslims, answers the religious questions and cultural challenges facing Muslims in America, develops promising students of knowledge, and serves as a trusted source of scholarly clarification and educational guidance for the broader Muslim American community.',
    visionNotes: [
      'The purpose of this website is among the methods employed to reach the vision outlined above.',
      'I ask Allah the Mighty and Sublime to bestow blessings in the collective efforts of the contributing Mentors and to grant them success in that regard.',
    ],
    objectivesTitle: 'Objectives',
    objectives: [
      'Make essential Islamic knowledge accessible to ordinary Muslims in a clear and understandable form.',
      'Address the practical religious matters Muslims encounter in their everyday lives.',
      'Connect qualified Murabbiy\u016Bn with the wider Muslim public through coordinated educational work.',
      'Encourage Muslims to understand the reasons and evidence behind religious guidance rather than merely receiving conclusions.',
      'Identify recurring areas of confusion, cultural practice, and religious misunderstanding affecting Muslims in the United States.',
      'Develop educational resources appropriate for both ordinary Muslims and, at more advanced stages, serious students of knowledge.',
      'Cultivate promising students who may eventually become qualified educators and contributors to the Muslim community.',
      'Represent Islam responsibly in appropriate media and institutional settings when clarification from qualified Muslim educators is needed.',
    ],
  },
};
