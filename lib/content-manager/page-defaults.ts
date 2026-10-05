/** ============================================================
 *  ILM Content Manager — Static Page Defaults (Phase 1)
 *  Mirrors the current About Us & Mission/Vision pages exactly.
 * ============================================================ */

import type { CMPagesContent } from './types';

export const CM_PAGE_STORAGE_KEY = 'ilm_content_manager_pages_v3';

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

  askPage: {
    eyebrow: 'Ask with adab',
    title: 'Ask a question',
    intro:
      'Your question is stored for editors and administrators. Visitors cannot read the question inbox. You may optionally identify a preferred Murabbī; administrators still review and route each question.',
    successTitle: 'Question sent successfully',
    successMessage: 'Your question was delivered to the ILM team. Please wait — a murabbi will respond by email.',
    namePlaceholder: 'Name',
    emailPlaceholder: 'Email',
    subjectPlaceholder: 'Subject',
    preferredAuthorLabel: 'Preferred Murabbī (optional)',
    categoryLabel: 'Category',
    questionPlaceholder: 'Your question',
    submitLabel: 'Send question',
  },

  contactPage: {
    eyebrow: 'Contact',
    title: 'Write to ILM',
    intro: 'For general correspondence:',
    contactEmailLabel: 'Email',
    contactEmail: 'salam@ilm.org',
    secondaryNote:
      'Questions about sacred knowledge belong on the Ask a Question page so they can be assigned to a murabbi.',
    successTitle: 'Message sent successfully',
    successMessage: 'Your contact form was delivered to the ILM admin team. Please wait for a thoughtful reply by email.',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'Your email',
    subjectPlaceholder: 'Subject',
    messagePlaceholder: 'Your message',
    submitLabel: 'Send message',
  },

  donationPage: {
    pageTitle: 'Support the Islamic League of Murabbiyūn (ILM)',
    subtitle: 'Supporting Islamic Education for Muslims in America',
    introduction: [
      'The Islamic League of Murabbiyūn (ILM) is an educational initiative of Talha Islamic Ministry, an established nonprofit organization dedicated to serving the Muslim community.',
      'ILM was established with a simple but important objective: to make reliable Islamic knowledge accessible to ordinary Muslims in the United States and to provide clarity on the religious matters that affect their everyday lives.',
      'Many Muslims encounter questions about marriage, business, family life, purification and cleanliness, food, worship, and other aspects of their religion on a regular basis. Yet finding clear, accessible, and properly grounded answers can sometimes be difficult.',
      'ILM seeks to help bridge that gap.',
    ],
    missionTitle: 'Our Mission',
    missionBody:
      "ILM is committed to providing English-speaking Muslims throughout the United States with clear, practical, and reliable Islamic education rooted in the Qur'an, Sunnah, and the methodology of Ahlus-Sunnah wa-l-Jamāʿah.",
    missionInitialWork:
      'Our initial work will focus on developing an online educational resource containing articles written by qualified Murabbiyūn, mentors, educators, and cultivators who have received formal Islamic education or substantial traditional training under qualified scholars.',
    missionExpandIntro: 'As the organization grows, we hope to expand this work into:',
    missionExpandItems: [
      'Educational books and publications',
      'Intensive 5- and 10-day seminars',
      'Seasonal educational programs and lectures',
      'An annual Islamic educational conference',
      'Research addressing issues affecting Muslims in America',
      'Educational resources for youth and families',
      'Mentorship for promising students of knowledge',
      'Assistance for qualified students seeking admission to established Islamic universities and institutions',
      'Translation of selected materials into Spanish and Haitian Creole',
      'Responsible engagement with media and community organizations when clarification of Islamic teachings is needed',
      'Eventually, a scholarly and advisory body capable of examining emerging cultural issues affecting American Muslims',
    ],
    whySupportTitle: 'Why Your Support Matters',
    whySupportIntro: [
      'The work of establishing a beneficial educational institution requires more than knowledge and qualified teachers. It requires the resources necessary to publish, distribute, organize, research, translate, and preserve beneficial knowledge.',
      'Your contribution can help ILM:',
    ],
    whySupportItems: [
      {
        title: 'Build and maintain its educational platform',
        body: 'Allowing beneficial Islamic articles and resources to remain freely accessible to Muslims throughout the United States.',
      },
      {
        title: 'Publish beneficial Islamic literature',
        body: 'Helping transform online educational material into books, booklets, guides, and other resources that can be distributed in Muslim communities.',
      },
      {
        title: 'Support educational programs',
        body: 'Helping us organize seminars, lectures, conferences, and other opportunities for Muslims to learn directly from qualified educators.',
      },
      {
        title: 'Develop future students of knowledge',
        body: 'Helping promising students pursue advanced Islamic education and, when necessary, supplementing scholarships or stipends so that financial hardship does not prevent them from benefiting from their studies.',
      },
      {
        title: 'Address the needs of American Muslims',
        body: 'Providing the resources necessary to research and address religious questions and cultural issues that specifically affect Muslims living in the United States.',
      },
      {
        title: 'Expand access to beneficial knowledge',
        body: 'Supporting translation and other efforts to reach Muslims who may benefit from educational material in Spanish, Haitian Creole, and other languages as the need arises.',
      },
    ],
    longTermTitle: 'A Long-Term Vision',
    longTermParagraphs: [
      'The immediate goal of ILM is modest: to establish a reliable educational website and begin producing beneficial Islamic material.',
      'The long-term vision, however, is much greater.',
      'By the permission of Allah, we hope to develop ILM into a strong and recognized national Islamic educational institution, one that serves Muslims not merely by answering individual questions, but by cultivating a population of Muslims who understand their religion, practice it correctly, and are equipped to navigate the challenges of life in America while remaining firmly grounded in their faith.',
      'We also hope to cultivate the next generation of qualified Muslim educators and students of knowledge who can continue serving the community long after us.',
    ],
    joinUsTitle: 'Join Us in This Effort',
    joinUsParagraphs: [
      'We invite you to support the Islamic League of Murabbiyūn and help establish an educational institution whose benefit can continue to reach Muslims for years to come.',
      'Your contribution helps us build something whose benefit extends beyond a single lecture, article, or event. It helps us establish the means through which beneficial Islamic knowledge can be taught, preserved, distributed, and passed on to future generations.',
      'May Allah accept this effort, place blessing in it, and make it a means of guidance and benefit for Muslims throughout America.',
      'Support ILM today and help us build a lasting foundation for Islamic education.',
    ],
    organizational:
      'The Islamic League of Murabbiyūn (ILM) is an educational initiative of Talha Islamic Ministry, a nonprofit organization.',
    zelleLabel: 'Support via Zelle',
    zelleHint: 'Scan the QR code or use your banking app to send support to Talha Islamic Ministry.',
  },
};
