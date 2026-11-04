import { KARTIK_JAPA_MEET_URL } from '../config/site';

/** Approved Meet link. Kept identical to the published invitation. */
const MEET_URL = 'https://meet.google.com/wmc-kugp-rjk';
if (KARTIK_JAPA_MEET_URL !== MEET_URL) {
  throw new Error(`Kārtika Meet link must stay ${MEET_URL}`);
}

export const KARTIKA_TITLE = 'Kartik Month 2026: Join Our Daily Online Japa for Lord Damodara';
export const KARTIKA_DESCRIPTION =
  'Chant the Hare Krishna mahā-mantra with us every morning, 4:30–6:30 SAST, throughout Kartik month 2026. Daily online japa on Google Meet. Join us.';
export const KARTIKA_POST_PATH = '/kartik-month-2026-daily-online-japa';
export const KARTIKA_CANONICAL = `https://www.goldenage-society.org${KARTIKA_POST_PATH}`;
export const KARTIKA_IMAGE = 'https://www.goldenage-society.org/kartika-hero-desktop.jpg';
export const KARTIKA_IMAGE_ALT =
  'Ghee lamp offered during Kartik month 2026 – Golden Age Society daily japa';
export const KARTIKA_IMAGE_WIDTH = 1920;
export const KARTIKA_IMAGE_HEIGHT = 1080;
export const KARTIKA_BYLINE = 'By the Golden Age Society · 4 November 2026';
export const KARTIKA_DATE_PUBLISHED = '2026-11-04';
export const KARTIKA_SITE_URL = 'https://www.goldenage-society.org';
export const KARTIKA_SITE_LABEL = 'www.goldenage-society.org';

export const KARTIKA_MAHA_MANTRA_LINES = [
  'Hare Kṛṣṇa Hare Kṛṣṇa, Kṛṣṇa Kṛṣṇa Hare Hare,',
  'Hare Rāma Hare Rāma, Rāma Rāma Hare Hare',
] as const;

export const kartikaClass = {
  article: 'max-w-3xl mx-auto px-4 md:px-12 py-16 text-[15px] leading-relaxed text-text/80',
  byline: 'italic text-text/70 mb-8',
  h2: 'font-serif text-3xl md:text-4xl text-wine mt-12 mb-4',
  h3: 'font-serif text-xl md:text-2xl text-wine mt-8 mb-2',
  p: 'mb-4',
  ul: 'list-disc pl-5 space-y-2 mb-4',
  ol: 'list-decimal pl-5 space-y-2 mb-4',
  mantra: 'font-serif text-xl text-wine my-6 leading-snug',
  signoff: 'mt-8',
  link: 'text-wine underline underline-offset-2',
} as const;

if (KARTIKA_DESCRIPTION.length !== 146) {
  throw new Error(`Kartika meta description is ${KARTIKA_DESCRIPTION.length} characters; the SEO package is 146.`);
}

export type Run =
  | { kind: 'text'; text: string }
  | { kind: 'strong'; text: string }
  | { kind: 'link'; text: string; href: string; external?: boolean };

export type ArticleBlock =
  | { type: 'p'; inlines: Run[] }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: Run[][] }
  | { type: 'ol'; items: Run[][] }
  | { type: 'mantra' }
  | { type: 'signoff' };

const text = (value: string): Run => ({ kind: 'text', text: value });
const strong = (value: string): Run => ({ kind: 'strong', text: value });
const link = (value: string, href: string, external = false): Run => ({
  kind: 'link',
  text: value,
  href,
  external,
});
const para = (...inlines: Run[]): ArticleBlock => ({ type: 'p', inlines });
const h2 = (value: string): ArticleBlock => ({ type: 'h2', text: value });

const meetLink = (): Run => link(MEET_URL, MEET_URL, true);

export const KARTIKA_FAQS: { question: string; answer: string }[] = [
  {
    question: 'When does Kartik month 2026 end?',
    answer:
      "This year's Kārtika month runs until approximately 24 November 2026. Our daily japa sessions continue throughout the month.",
  },
  {
    question: 'What time are the online japa sessions?',
    answer:
      'Every morning from 4:30 to 6:30 SAST (UTC+2). If you are joining from another country, please convert to your local time.',
  },
  {
    question: 'Do I need experience or japa beads to join?',
    answer:
      'No. Beginners are warmly welcome. Beads are helpful for counting rounds, but you can simply listen and chant along.',
  },
  {
    question: 'Do I have to stay for the full two hours?',
    answer: 'Not at all. Join for as long as you are able, even a few minutes.',
  },
  {
    question: 'Who is Lord Damodara?',
    answer:
      'Damodara is a name of Krishna, remembered as the child bound with ropes by His mother, Yaśodā. Kārtika is widely celebrated as the month dear to Him.',
  },
];

export const kartikaBeforeFirstQuote: ArticleBlock[] = [
  para(
    text(
      'Before the sun rises over South Africa, while most of the country is still asleep, a small circle of voices is already awake, chanting. Every morning this Kārtika, the ',
    ),
    link('Golden Age Society (GAS)', '/about'),
    text(' is opening a daily online japa session on Google Meet, and we would love for you to be part of it.'),
  ),
  para(
    text(
      'Whether you have chanted for years or never held a set of japa beads, this is an open invitation to begin your day with the Hare Krishna mahā-mantra, together.',
    ),
  ),
  h2('What Is Kartik Month 2026?'),
  para(
    text(
      'Kārtika (often spelled Kartik or Kartika) is one of the most cherished months of the Vaiṣṇava calendar. It is widely known as the month especially dear to Lord Damodara, the name of Krishna remembered as the child bound with ropes by His mother, Yaśodā. In Kartik month 2026, the observance runs until approximately 24 November.',
    ),
  ),
  para(
    text(
      'Devotees mark this month with simple, heartfelt practices: offering small lamps to Lord Damodara, singing His glories, and making a sincere effort to increase their chanting. It is a season for deepening devotion and serving others.',
    ),
  ),
];

export const kartikaBetweenQuotes: ArticleBlock[] = [
  h2('Our Daily Online Japa Sessions'),
  para(text('For this Kārtika, GAS is hosting a daily japa session every morning:')),
  {
    type: 'ul',
    items: [
      [strong('When:'), text(' Every day, 4:30 – 6:30 SAST (South African Standard Time)')],
      [strong('Where:'), text(' Online, on Google Meet')],
      [strong('Join link:'), text(' '), meetLink()],
      [strong('For how long:'), text(' Throughout Kārtika month 2026 (until about 24 November)')],
    ],
  },
  para(
    text(
      'The hours before sunrise are traditionally valued as a peaceful, focused time for spiritual practice, and chanting with a group makes it easier to rise and stay steady all month.',
    ),
  ),
  para(
    text(
      'You do not need to stay for the full two hours. Come for one round or many. Simply open the link, settle in, and chant along.',
    ),
  ),
  h2('What Is Japa Meditation?'),
  para(
    text(
      "Japa is the quiet, personal repetition of the Lord's holy names, usually counted on a string of 108 beads. In japa, the practitioner chants the Hare Krishna mahā-mantra:",
    ),
  ),
  { type: 'mantra' },
  para(
    text(
      'Unlike many forms of meditation that ask you to empty the mind, japa invites you to fill it with sacred sound, and to listen attentively to each name as it is chanted.',
    ),
  ),
];

export const kartikaAfterSecondQuote: ArticleBlock[] = [
  h2('Why Chant Together? Japa Meditation Online in South Africa'),
  para(
    text(
      'Chanting alone can be beautiful, but chanting in company has its own strength. A shared schedule and familiar faces on screen help you stay consistent, especially at 4:30 in the morning.',
    ),
  ),
  para(
    text(
      'You can join from anywhere: Johannesburg, Durban, Cape Town, the Karoo, or abroad. If you have been looking for japa meditation online in South Africa, or a supportive group to help you keep a Kārtika vow, this is a warm place to start.',
    ),
  ),
  h2('How to Get Ready'),
  para(text('A few simple suggestions to help you make the most of each morning:')),
  {
    type: 'ol',
    items: [
      [strong('Save the link.'), text(' Bookmark '), meetLink(), text(' or add it to your calendar as a daily event.')],
      [strong('Set your alarm.'), text(' Give yourself a few minutes to freshen up before 4:30.')],
      [strong('Find a quiet spot,'), text(' with japa beads if you have them.')],
      [strong('Mute when you arrive.'), text(' This keeps the session peaceful for everyone.')],
      [strong('Set a gentle goal.'), text(' Choose a number of rounds you can keep up for the whole month.')],
    ],
  },
  h2('Kārtika in Action: Our Food-Feeding Initiative'),
  para(
    text(
      'At GAS, we believe that spiritual practice and service to others go hand in hand. As a Krishna-conscious foundation running community service programmes, we are also running a Kārtika food-feeding initiative this month, sharing nourishing meals with those in our communities who need them.',
    ),
  ),
  para(
    text('If you would like to support or volunteer, please visit the '),
    link('Get Involved page', '/get-involved'),
    text(' or the '),
    link('Donate page', '/donate'),
    text('.'),
  ),
  h2('Frequently Asked Questions'),
  ...KARTIKA_FAQS.flatMap(
    (faq): ArticleBlock[] => [
      { type: 'h3', text: faq.question },
      para(text(faq.answer)),
    ],
  ),
  h2('Join Us Tomorrow Morning'),
  para(
    text(
      'Kārtika comes once a year. It is a beautiful opportunity to build a habit of chanting, connect with community, and offer your mornings to Lord Damodara.',
    ),
  ),
  para(text('Set your alarm, save the link, and join us at 4:30 SAST. We look forward to chanting with you.')),
  { type: 'signoff' },
];

export function kartikaBlocksInOrder(): ArticleBlock[] {
  return [...kartikaBeforeFirstQuote, ...kartikaBetweenQuotes, ...kartikaAfterSecondQuote];
}

export const kartikaArticleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: KARTIKA_TITLE,
  description: KARTIKA_DESCRIPTION,
  datePublished: KARTIKA_DATE_PUBLISHED,
  dateModified: KARTIKA_DATE_PUBLISHED,
  inLanguage: 'en',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': KARTIKA_CANONICAL,
  },
  url: KARTIKA_CANONICAL,
  image: {
    '@type': 'ImageObject',
    url: KARTIKA_IMAGE,
    width: KARTIKA_IMAGE_WIDTH,
    height: KARTIKA_IMAGE_HEIGHT,
    caption: KARTIKA_IMAGE_ALT,
  },
  author: {
    '@type': 'Organization',
    name: 'Golden Age Society',
    url: KARTIKA_SITE_URL,
  },
  publisher: {
    '@type': 'Organization',
    name: 'Golden Age Society',
    url: KARTIKA_SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${KARTIKA_SITE_URL}/gas-logo.png`,
    },
  },
};

export const kartikaFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: KARTIKA_FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderRunsHtml(runs: Run[]): string {
  return runs
    .map((run) => {
      if (run.kind === 'text') return escapeHtml(run.text);
      if (run.kind === 'strong') return `<strong>${escapeHtml(run.text)}</strong>`;
      const extra = run.external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${escapeHtml(run.href)}" class="${kartikaClass.link}"${extra}>${escapeHtml(run.text)}</a>`;
    })
    .join('');
}

function renderBlockHtml(block: ArticleBlock): string {
  switch (block.type) {
    case 'p':
      return `<p class="${kartikaClass.p}">${renderRunsHtml(block.inlines)}</p>`;
    case 'h2':
      return `<h2 class="${kartikaClass.h2}">${escapeHtml(block.text)}</h2>`;
    case 'h3':
      return `<h3 class="${kartikaClass.h3}">${escapeHtml(block.text)}</h3>`;
    case 'ul':
      return `<ul class="${kartikaClass.ul}">${block.items.map((item) => `<li>${renderRunsHtml(item)}</li>`).join('')}</ul>`;
    case 'ol':
      return `<ol class="${kartikaClass.ol}">${block.items.map((item) => `<li>${renderRunsHtml(item)}</li>`).join('')}</ol>`;
    case 'mantra':
      return `<p class="${kartikaClass.mantra}"><strong>${escapeHtml(KARTIKA_MAHA_MANTRA_LINES[0])}<br />${escapeHtml(KARTIKA_MAHA_MANTRA_LINES[1])}</strong></p>`;
    case 'signoff':
      return `<p class="${kartikaClass.signoff}"><strong>Hare Krishna,</strong><br /><strong>The Golden Age Society</strong><br /><a href="${KARTIKA_SITE_URL}" class="${kartikaClass.link}">${KARTIKA_SITE_LABEL}</a></p>`;
    default: {
      const neverBlock: never = block;
      throw new Error(`Unknown article block ${JSON.stringify(neverBlock)}`);
    }
  }
}

/** Article markup for the no-JS static fallback. Not shown when JavaScript runs. */
export function renderKartikaNoscriptHtml(): string {
  const html = `<article class="${kartikaClass.article}"><h1 class="font-serif text-4xl md:text-5xl text-wine mb-4">${escapeHtml(KARTIKA_TITLE)}</h1><p class="${kartikaClass.byline}">${escapeHtml(KARTIKA_BYLINE)}</p>${kartikaBlocksInOrder().map(renderBlockHtml).join('')}</article>`;
  const forbidden = ['TEACHER TO SUPPLY', 'GAS TO CONFIRM', 'GAS TO SUPPLY', 'PUBLISH DATE', 'DRAFT'];
  for (const token of forbidden) {
    if (html.includes(token)) {
      throw new Error(`Kartika post HTML still contains placeholder text: ${token}`);
    }
  }
  return html;
}
