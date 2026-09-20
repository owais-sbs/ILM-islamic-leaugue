import { images } from './images';
import { homeContent } from './ilm-page-content';

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

/** Madhhab filters omitted — contributor madhāhib are not supplied in source content. */
export const murabbiFilters = ['All'] as const;
export type MurabbiFilter = (typeof murabbiFilters)[number];

export type MurabbiDetail =
  | { type: 'paragraphs'; text: string[] }
  | { type: 'list'; items: string[] }
  | { type: 'meta'; entries: { label: string; value: string; href?: string }[] }
  | { type: 'books'; items: { title: string; paragraphs: string[] }[] };

export interface MurabbiSection {
  title: string;
  blocks: MurabbiDetail[];
}

export interface Murabbi {
  id: string;
  name: string;
  role: string;
  /** Short card excerpt — first biography paragraph from source. */
  bio: string;
  /** Full biography paragraphs for the profile page. */
  biography: string[];
  image: string;
  accent: string;
  sections: MurabbiSection[];
}

export const murabbiyūn: Murabbi[] = [
  {
    id: 'aqil-ingram',
    name: 'Aqil Ingram',
    role: 'Imām, Resident Scholar & Khaṭīb',
    bio: 'Aqil Ingram serves the Muslim community in several religious leadership capacities, including as an Imām, Resident Scholar, Khaṭīb, and community outreach worker. His masjid-related work is connected with Blackstone, the Islamic Society of Baltimore, Masjid al-Kauthar, and the Prince George\'s Muslim Association, with activities spanning Maryland and Delaware, including Baltimore, Lanham, and Wilmington.',
    biography: [
      'Aqil Ingram serves the Muslim community in several religious leadership capacities, including as an Imām, Resident Scholar, Khaṭīb, and community outreach worker. His masjid-related work is connected with Blackstone, the Islamic Society of Baltimore, Masjid al-Kauthar, and the Prince George\'s Muslim Association, with activities spanning Maryland and Delaware, including Baltimore, Lanham, and Wilmington.',
      'His religious and community responsibilities include delivering khuṭbahs, providing prayer services, Islamic instruction, community outreach, counseling, youth programs, and marriage services. He also serves as an instructor at Qibla Institute.',
      'Through these roles, Aqil\'s work encompasses preaching, Islamic education, spiritual guidance, pastoral care, youth engagement, marriage-related services, and community outreach.',
    ],
    image: images.murabbiPortrait,
    accent: 'bg-sky-100 text-sky-700',
    sections: [
      {
        title: 'Supporting the Masjid Work',
        blocks: [
          {
            type: 'paragraphs',
            text: [
              'Financial contributions can be made through Aqil\'s support platform or by contacting him through his website. Social-media management is also an area where volunteer assistance is needed.',
            ],
          },
          {
            type: 'meta',
            entries: [
              { label: 'Website', value: 'aqilingram.com', href: 'https://aqilingram.com' },
              { label: 'Social Media', value: '@aqilingram' },
              { label: 'Email', value: 'askaqlingram@gmail.com', href: 'mailto:askaqlingram@gmail.com' },
            ],
          },
        ],
      },
      {
        title: 'Founder — Aql Institute',
        blocks: [
          {
            type: 'paragraphs',
            text: [
              'Aqil is the Founder of Aql Institute, an Islamic educational program focused on developing students of knowledge through its College of Shariah Program in the English language.',
              'The program is designed particularly for working professional adults and college students, providing an opportunity for individuals with professional, educational, and other responsibilities to pursue systematic Islamic studies.',
              'Aql Institute\'s educational work centers on developing students of Islamic knowledge through structured English-language Sharīʿah studies.',
            ],
          },
        ],
      },
      {
        title: 'Supporting Aql Institute',
        blocks: [
          {
            type: 'paragraphs',
            text: [
              'People can help expand the institute by inviting others to the program through a unique affiliate link. Participants can receive 40% of the revenue generated through their referrals.',
              'The institute also needs:',
            ],
          },
          {
            type: 'list',
            items: ['Volunteers', 'Administrative assistance'],
          },
          {
            type: 'meta',
            entries: [
              { label: 'Program/Registration', value: 'Aql Institute on Skool' },
              { label: 'Website', value: 'aqilingram.com', href: 'https://aqilingram.com' },
            ],
          },
        ],
      },
      {
        title: 'Author & Publisher',
        blocks: [
          {
            type: 'paragraphs',
            text: [
              'Aqil is an author and publisher of Islamic books, with writings addressing hadith, Islamic creed, and foundational Islamic education.',
            ],
          },
          {
            type: 'books',
            items: [
              {
                title: 'Explanatory Notes on Imam an-Nawawee\'s Forty Ahaadeeth',
                paragraphs: [
                  'This work provides an explanation of Imām an-Nawawī\'s Forty Hadith, drawing upon the works of Shaykh Ibn ʿUthaymīn.',
                  'The book is available through Amazon and many local Islamic bookstores.',
                ],
              },
              {
                title: 'Explanation of al-Aqidah al-Wasitiyyah',
                paragraphs: [
                  'This work provides an overview of the ʿaqīdah of Ahl al-Sunnah wa\'l-Jamāʿah, based upon the works of Shaykh Ibn ʿUthaymīn.',
                  'The book is available through Amazon and local bookstores.',
                ],
              },
              {
                title: 'Explanation of the Three Principles',
                paragraphs: [
                  'This work explains the three questions of the grave, drawing upon the works of Shaykh Ibn ʿUthaymīn.',
                  'The book is available through Amazon and local Islamic bookstores.',
                ],
              },
            ],
          },
        ],
      },
      {
        title: 'Additional Books',
        blocks: [
          {
            type: 'list',
            items: ['Advent of the Comforter', 'The Unbroken Chain'],
          },
        ],
      },
      {
        title: 'Current Writing & Research Projects',
        blocks: [
          {
            type: 'paragraphs',
            text: ['Aqil is also working on additional written projects addressing:'],
          },
          {
            type: 'list',
            items: [
              'Whether the Messenger of Allah ﷺ is mentioned in the Bible',
              'The history of Islamic law',
            ],
          },
        ],
      },
      {
        title: 'Supporting His Writing and Publishing',
        blocks: [
          {
            type: 'paragraphs',
            text: [
              'Proceeds from Aqil\'s self-published works help support his broader daʿwah activities, including equipment and social-media management.',
              'Financial contributions can also assist with his ongoing writing, research, publishing, and educational work.',
            ],
          },
          {
            type: 'meta',
            entries: [
              { label: 'Author Website', value: 'aqilingram.com', href: 'https://aqilingram.com' },
            ],
          },
        ],
      },
      {
        title: 'Social Media Influencer',
        blocks: [
          {
            type: 'paragraphs',
            text: [
              'Aqil maintains an active digital presence through which he provides Islamic education, spiritual direction, and motivational content for both new and seasoned Muslims.',
              'His social-media work allows Islamic instruction and spiritual guidance to reach audiences beyond the communities he serves in person. Digital media also provides an avenue for presenting Islamic education and motivational material in formats that can be readily accessed and shared.',
            ],
          },
        ],
      },
      {
        title: 'Social Media',
        blocks: [
          {
            type: 'meta',
            entries: [{ label: 'Handle', value: '@aqilingram' }],
          },
        ],
      },
      {
        title: 'Supporting His Social Media Daʿwah',
        blocks: [
          {
            type: 'paragraphs',
            text: ['Assistance is particularly needed in the areas of:'],
          },
          {
            type: 'list',
            items: ['Editing', 'Thumbnail creation', 'Social-media management'],
          },
          {
            type: 'paragraphs',
            text: [
              'Financial contributions can also help provide equipment and other resources necessary to produce and distribute Islamic educational content.',
            ],
          },
        ],
      },
      {
        title: 'Daʿwah & Community Outreach',
        blocks: [
          {
            type: 'paragraphs',
            text: [
              'Aqil is involved in organized daʿwah and community outreach through Blackstone and the Islamic Circle of North America (ICNA). His roles within this work include serving as a preacher, educator, and food distributor.',
              'The work seeks to improve people\'s health, wealth, relationships, and happiness through spirituality and serves both the upper-middle-class community and people in need.',
              'This combines religious education and preaching with practical community service. In addition to providing Islamic guidance and education, the work includes food distribution, allowing community outreach to address both spiritual and material needs.',
            ],
          },
        ],
      },
      {
        title: 'Supporting the Outreach Work',
        blocks: [
          {
            type: 'paragraphs',
            text: [
              'People interested in volunteering or otherwise assisting with this work can contact Aqil directly through his website for further information. Financial contributions can also be made through his support platform.',
            ],
          },
          {
            type: 'meta',
            entries: [
              { label: 'Website', value: 'aqilingram.com', href: 'https://aqilingram.com' },
            ],
          },
        ],
      },
      {
        title: 'Islamic Counselor & Marriage/Family Services',
        blocks: [
          {
            type: 'paragraphs',
            text: [
              'Aqil provides Islamic counseling, marriage services, and family guidance to Muslims dealing with a variety of personal, marital, and family circumstances.',
              'His counseling services include:',
            ],
          },
          {
            type: 'list',
            items: [
              'Personal counseling',
              'Grief counseling',
              'Premarital counseling',
              'Marital counseling',
              'Crisis counseling',
            ],
          },
          {
            type: 'paragraphs',
            text: [
              'These services provide Muslims with access to guidance during personal difficulties, bereavement and grief, preparation for marriage, marital challenges, and periods of crisis.',
            ],
          },
        ],
      },
      {
        title: 'Requesting Counseling',
        blocks: [
          {
            type: 'paragraphs',
            text: [
              'Counseling and related services can be requested through aqilingram.com.',
              'The cost of services may vary according to the circumstances. Counseling services can also be sponsored for individuals who otherwise cannot afford them, providing an opportunity for supporters to help make these services available to Muslims in financial need.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ilir-aliji',
    name: 'Ilir Aliji',
    role: 'Imām',
    bio: 'Ilir Aliji serves as the Imām of Masjid Albani in Bedford, Texas, in the Dallas–Fort Worth area. His work at the masjid encompasses religious leadership, Islamic education, pastoral care, and service to the local Muslim community.',
    biography: [
      'Ilir Aliji serves as the Imām of Masjid Albani in Bedford, Texas, in the Dallas–Fort Worth area. His work at the masjid encompasses religious leadership, Islamic education, pastoral care, and service to the local Muslim community.',
      'His responsibilities include delivering khuṭbahs, providing prayer services, teaching Islamic classes, participating in community outreach, providing counseling, working with youth, and providing marriage services.',
      'Through these responsibilities, his work extends beyond congregational worship. He provides Islamic instruction and guidance, assists Muslims with personal and family matters, supports the religious development of youth, and participates in outreach designed to strengthen and educate the Muslim community.',
    ],
    image: images.murabbiPortrait,
    accent: 'bg-emerald-100 text-emerald-700',
    sections: [
      {
        title: 'Supporting the Masjid',
        blocks: [
          {
            type: 'paragraphs',
            text: [
              'People can assist the masjid by attending classes and encouraging others to attend the Friday-night lectures, where dinner is served. Financial support can be provided through the Islamic Institute of Texas website.',
            ],
          },
          {
            type: 'meta',
            entries: [
              { label: 'Masjid', value: 'Masjid Albani' },
              { label: 'Location', value: 'Bedford, Texas' },
              { label: 'Role', value: 'Imām' },
              { label: 'Website', value: 'iitex.org', href: 'https://iitex.org' },
              { label: 'Email', value: 'ilir214@gmail.com', href: 'mailto:ilir214@gmail.com' },
            ],
          },
        ],
      },
      {
        title: 'Islamic Institute of Texas',
        blocks: [
          {
            type: 'meta',
            entries: [{ label: 'Role', value: 'Head of Operations' }],
          },
          {
            type: 'paragraphs',
            text: [
              'Ilir serves as Head of Operations at the Islamic Institute of Texas (IIT). The institute provides structured Islamic education for converts and Muslims seeking to learn Islam systematically.',
              'The institute provides full-time Islamic education and a structured path for learning Arabic. Beginning students start with foundational Arabic instruction, beginning with alif, bāʾ, tāʾ, and spend approximately six months developing this foundation before progressing into a two-year Arabic program.',
              'The Islamic Institute of Texas also incorporates online Islamic education, allowing its educational programs to benefit students beyond those who can attend instruction locally.',
            ],
          },
        ],
      },
      {
        title: 'Supporting the Islamic Institute of Texas',
        blocks: [
          {
            type: 'paragraphs',
            text: [
              'People can financially support the institute through iitex.org, including by sponsoring a student of knowledge.',
              'Other opportunities to support the institute include:',
            ],
          },
          {
            type: 'list',
            items: ['Volunteering', 'Providing needed equipment', 'Assisting with administrative work'],
          },
          {
            type: 'meta',
            entries: [
              { label: 'Website', value: 'iitex.org', href: 'https://iitex.org' },
              { label: 'Email', value: 'ilir214@gmail.com', href: 'mailto:ilir214@gmail.com' },
            ],
          },
        ],
      },
      {
        title: 'Social Media Influencer',
        blocks: [
          {
            type: 'paragraphs',
            text: [
              'Ilir is active in digital Islamic education and social-media daʿwah, producing short-form videos that provide Islamic benefits and educational reminders.',
              'His social-media work extends his teaching beyond the classroom and local masjid environment, providing another means of reaching Muslims with beneficial Islamic content in an accessible digital format.',
            ],
          },
        ],
      },
      {
        title: 'Social Media Platforms',
        blocks: [
          {
            type: 'list',
            items: [
              'YouTube: Islamic Institute of Texas',
              'Instagram: @ilir.aliji214',
              'Facebook: Ilir Aliji',
              'TikTok: @sunnahsidenotes',
            ],
          },
        ],
      },
      {
        title: 'Supporting His Social Media Daʿwah',
        blocks: [
          {
            type: 'paragraphs',
            text: [
              'A specific need associated with this work is volunteer assistance with video editing. Volunteers with editing skills can help prepare and produce Islamic educational content for distribution through his online platforms.',
              'Financial support for the broader educational and online work can be provided through iitex.org.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'mujahid-keith',
    name: 'Mujahid Keith',
    role: 'Teacher & Khaṭīb',
    bio: 'Mujahid Keith serves as a teacher at Masjid Ibn Taymiyyah in Glenarden, Maryland, where he contributes to the religious education and instruction of the Muslim community.',
    biography: [
      'Mujahid Keith serves as a teacher at Masjid Ibn Taymiyyah in Glenarden, Maryland, where he contributes to the religious education and instruction of the Muslim community.',
      'His work at the masjid includes delivering khuṭbahs and conducting Islamic classes. Through these activities, he provides religious instruction to members of the congregation and contributes to the masjid\'s educational efforts.',
    ],
    image: images.murabbiPortrait,
    accent: 'bg-orange-100 text-orange-700',
    sections: [
      {
        title: 'Supporting the Masjid',
        blocks: [
          {
            type: 'paragraphs',
            text: [
              'People with Islamic knowledge and teaching ability can assist the masjid by giving Islamic lectures and conducting classes.',
            ],
          },
          {
            type: 'meta',
            entries: [
              { label: 'Masjid', value: 'Masjid Ibn Taymiyyah' },
              { label: 'Location', value: 'Glenarden, Maryland' },
              { label: 'Role', value: 'Teacher' },
              { label: 'Masjid Committee Contact', value: 'Abdul-Fattah' },
              { label: 'Office', value: '(240) 392-5308', href: 'tel:+12403925308' },
            ],
          },
        ],
      },
      {
        title: 'Director — Al-Tibyaan Academy Qur’an Program',
        blocks: [
          {
            type: 'paragraphs',
            text: [
              'Mujahid Keith serves as Director of the Al-Tibyaan Academy Qur’an Program, an Islamic educational program dedicated to Qur’anic studies.',
              'The program serves Muslim female students between the ages of 8 and 25 and provides full-time Qur’an memorization classes. Its work focuses on providing students with structured Qur’anic education and an environment dedicated to memorizing the Book of Allah.',
              'As Director, Mujahid oversees a program specifically focused on Qur’an education. Qur’an studies are the program\'s identified area of instruction, with full-time Qur’an memorization classes forming the core of its current work.',
            ],
          },
        ],
      },
      {
        title: 'Program Information',
        blocks: [
          {
            type: 'meta',
            entries: [
              { label: 'Program', value: 'Al-Tibyaan Academy Qur’an Program' },
              { label: 'Role', value: 'Director' },
              { label: 'Students Served', value: 'Muslim female students, ages 8–25' },
              { label: 'Primary Program', value: 'Full-time Qur’an memorization' },
              {
                label: 'Website',
                value: 'www.altibyaanacademy.org',
                href: 'https://www.altibyaanacademy.org',
              },
            ],
          },
        ],
      },
      {
        title: 'Prison Chaplaincy & Correctional Facility Daʿwah',
        blocks: [
          {
            type: 'paragraphs',
            text: [
              'Mujahid Keith has served in prison chaplaincy and volunteer Islamic daʿwah within correctional facilities in New York, Maryland, and Washington, D.C. His work has included serving incarcerated Muslims through Islamic instruction, khuṭbahs, lectures, and access to beneficial Islamic educational materials.',
              'His correctional-facility service includes:',
            ],
          },
          {
            type: 'list',
            items: [
              'Elmira Prison — Elmira, New York: Prison Chaplain',
              'Maryland Correctional Institution — Jessup, Maryland: Volunteer',
              'District of Columbia Jail — Washington, D.C.: Volunteer',
            ],
          },
          {
            type: 'paragraphs',
            text: [
              'Through this work, Mujahid has provided incarcerated individuals with access to Islamic teaching and religious instruction. An important need associated with this work is access to Islamic books, literature, and educational materials, as incarcerated Muslims often need additional resources through which they can study and increase their knowledge of Islam.',
            ],
          },
        ],
      },
      {
        title: 'Supporting Prison & Jail Daʿwah',
        blocks: [
          {
            type: 'paragraphs',
            text: [
              'Members of the public can assist this work by providing Islamic books, literature, and educational materials for incarcerated Muslims.',
              'These resources can help inmates continue learning about Islam, strengthen their understanding of the religion, and make productive use of their time through beneficial Islamic study.',
            ],
          },
        ],
      },
      {
        title: 'Contact',
        blocks: [
          {
            type: 'meta',
            entries: [
              { label: 'Name', value: 'Mujahid Keith' },
              {
                label: 'Email',
                value: 'ibnkeith76@outlook.com',
                href: 'mailto:ibnkeith76@outlook.com',
              },
            ],
          },
        ],
      },
    ],
  },
];

/** Home pillars mapped to the supplied tagline — wording from Opening Page Info only. */
export const pillars = [
  {
    title: 'Knowledge',
    body: homeContent.shortHand[2],
  },
  {
    title: 'Clarity',
    body: homeContent.supporting,
  },
  {
    title: 'Cultivation',
    body: homeContent.closing,
  },
];

export const steps = [
  { n: '01', title: 'Read with presence', body: 'Sit with an article the way one sits with a teacher: slowly, and with the heart open.' },
  { n: '02', title: 'Ask with adab', body: 'Bring your questions. Our murabbiyūn answer with care, not haste.' },
  { n: '03', title: 'Live what you learn', body: 'Let knowledge settle into habit, character, and the way you meet the world.' },
];
