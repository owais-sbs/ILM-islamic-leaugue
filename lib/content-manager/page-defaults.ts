/** ============================================================
 *  ILM Content Manager — Static Page Defaults (Phase 1)
 *  Mirrors the current About Us & Mission/Vision pages exactly.
 * ============================================================ */

import type { CMPagesContent } from './types';

export const CM_PAGE_STORAGE_KEY = 'ilm_content_manager_pages_v2';

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

  privacyPage: {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    lastUpdated: 'September 2026',
    sections: [
      { heading: '', body: 'ILM respects your privacy. This policy explains what information we collect when you use the public site, how we use it, and the choices available to you.' },
      { heading: 'Information we collect', body: 'When you ask a question, write via the contact form, or subscribe to updates, you may provide a name, email address, and message content. We also receive standard technical data such as browser type and approximate usage logs needed to keep the site reliable.' },
      { heading: 'How we use information', body: 'We use contact details to reply to questions and correspondence, to operate the contributor portal, and to send newsletter notes only when you have subscribed. We do not sell personal information.' },
      { heading: 'Storage and access', body: 'Submissions may be stored in our systems so administrators, editors, and assigned Murabbiyūn can respond. Access is limited to people who need it to serve the request.' },
      { heading: 'Cookies and local storage', body: 'The site may use cookies or browser storage for session preferences and demo/admin state. You can clear these through your browser settings.' },
      { heading: 'Contact', body: 'For privacy requests, write to salam@ilm.org or use the contact page.' },
    ],
  },

  disclaimerPage: {
    eyebrow: 'Disclaimer',
    title: 'A note on this content',
    lastUpdated: '',
    sections: [
      { heading: '', body: 'The writings on the Islamic League of Murabbiyūn (ILM) website are offered for educational and spiritual guidance. They are intended to support thoughtful learning, character formation, and respectful conversation.' },
      { heading: '', body: 'This content is not a substitute for asking a qualified scholar about your specific circumstances. Religious rulings (fatwa), personal advice, and decisions that apply to your life should be sought from people of knowledge who understand your context.' },
      { heading: '', body: 'Authors and Murabbiyūn write in good faith. Editors and administrators review material for clarity and care, but ILM does not guarantee completeness, and readers remain responsible for how they apply what they read.' },
      { heading: '', body: 'External links, quotations, and references are provided for learning. Their presence does not imply endorsement of every view associated with a linked source. Where scholarly disagreement (ikhtilāf) appears, we aim to present it with adab rather than to settle every dispute.' },
      { heading: '', body: 'By using this site you acknowledge that ILM, its contributors, and affiliated organizers are not liable for decisions made solely on the basis of published articles, directory profiles, or answers offered through the Ask a Question flow.' },
    ],
  },

  termsPage: {
    eyebrow: 'Legal',
    title: 'Terms & Conditions',
    lastUpdated: 'September 2026',
    sections: [
      { heading: '', body: 'By accessing the Islamic League of Murabbiyūn website, you agree to these terms. If you do not agree, please do not use the site.' },
      { heading: 'Educational purpose', body: 'Content is provided for learning and spiritual reflection. It is not professional, legal, medical, or individualized religious counsel. Always consult qualified scholars for matters that apply to your situation.' },
      { heading: 'Acceptable use', body: 'You agree not to misuse the site, attempt unauthorized access to contributor systems, submit abusive or unlawful content, or scrape the library in a way that harms service for others.' },
      { heading: 'Submissions', body: 'Questions and messages you send may be reviewed by ILM staff and assigned Murabbiyūn. Do not include sensitive personal data you are not comfortable sharing for that purpose.' },
      { heading: 'Intellectual property', body: 'Articles, branding, and site design are protected. You may share links and brief quotations with attribution for personal, non-commercial learning. Reproduction of full articles without permission is not allowed.' },
      { heading: 'Limitation of liability', body: 'To the fullest extent permitted by law, ILM and its contributors are not liable for indirect or consequential loss arising from use of the site or reliance on published content.' },
      { heading: 'Changes', body: 'We may update these terms as the platform grows. Continued use after changes means you accept the revised terms. Related pages include our Privacy Policy and Disclaimer.' },
    ],
  },
};
