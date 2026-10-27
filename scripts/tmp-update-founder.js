require('dotenv').config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

const founderParagraphs = [
  'As Salāmu alaikum wa rahmatullahi wa barakātuhu!',
  'It is not unknown to anyone given ears by which they hear, eyes by which they see, and a sound heart by which they comprehend, that the challenges of the Muslims in the west (generally) and in the United States (specifically) are various and multifaceted. These challenges require clear insight and understanding of the revelation revealed from Allah to our Prophet Muhammad -sallahu alaihi wa sallam- in order to identify, assess, and arrive at the best means to overcome these challenges.The complexities of these challenges are not insurmountable, the remedy to them is not unknown, and the means to overcome them are obtainable. Returning to the guidance of revelation is the first step in addressing the challenges we’re faced with today as Allah has made explicitly clear all things the son of Adam requires to be successful in this life and the Hereafter, regardless of the place and time one may be.',
  'Allah says:',
  '“And We sent down to you the Book a clarification for all things. A guidance, mercy, and glad-tidings for the Muslims.” An-Nahl: 89',
  'Imam ibn Jarīr at-Tabari said in his exegesis to the Quran: “This Quran is sent down to you O’ Muhammad of all of that which humanity stands in need of from awareness of the lawful and unlawful, reward and punishment, etc.”',
  'Imam ibn Kathir said: “Undoubtedly, the Quran is inclusive of all beneficial knowledge from past narratives and future knowledge. Likewise, every lawful and unlawful matter along with whatever humanity stands in need of as it pertains to their worldly and religious related affairs, and their livelihood and ultimate (eternal) abode.”',
  'Thus, I ask Allah that He aids and assists this effort, grants us success in our endeavors, and causes it to be a source of reward for all the contributors to this venture. Indeed, He is All-Knower, All-Seeing and All-Capable of whatsoever He wills.',
  'Lastly, may His lofty commendations and peace be on His Messenger Muhammad.',
];

(async () => {
  const get = await fetch(`${url}/rest/v1/cms_documents?key=eq.pages&select=payload`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  const rows = await get.json();
  if (!rows?.[0]?.payload) {
    console.error('No pages payload', rows);
    process.exit(1);
  }

  const payload = rows[0].payload;
  payload.aboutPage = {
    ...payload.aboutPage,
    founderTitle: 'Founder’s Statement',
    founderAuthor: 'Najeeb ibn Yusuf al-Anjelesi',
    founderParagraphs,
  };

  const put = await fetch(`${url}/rest/v1/cms_documents?key=eq.pages`, {
    method: 'PATCH',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({ payload }),
  });

  const text = await put.text();
  console.log('status', put.status);
  const updated = JSON.parse(text);
  console.log(JSON.stringify(updated[0]?.payload?.aboutPage?.founderParagraphs, null, 2));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
