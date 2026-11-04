import { useEffect } from 'react';
import {
  KARTIKA_CANONICAL,
  KARTIKA_DESCRIPTION,
  KARTIKA_IMAGE,
  KARTIKA_IMAGE_ALT,
  KARTIKA_IMAGE_HEIGHT,
  KARTIKA_IMAGE_WIDTH,
  KARTIKA_TITLE,
  kartikaArticleJsonLd,
  kartikaFaqJsonLd,
} from '@/content/kartikaJapaPost';

/**
 * Homepage head tags from index.html. Other pages only change document.title,
 * so leaving this route restores these instead of leaving article tags in place.
 */
const HOME_TITLE = 'Golden Age Society';
const HOME_DESCRIPTION =
  "Golden Age Society (GAS) ignites Krishna Consciousness in South African townships through Kasi Kirtan, Krishna Prasadam outreach, book distribution in African languages, and township-led spiritual centres — under Lord Caitanya's 10,000-year Golden Age.";
const HOME_SOCIAL_TITLE = 'Golden Age Society — Where Bhakti Sparks Become Flames';

type MetaAttr = 'name' | 'property';

const HOME_METAS: { attr: MetaAttr; key: string; content: string }[] = [
  { attr: 'name', key: 'description', content: HOME_DESCRIPTION },
  { attr: 'property', key: 'og:type', content: 'website' },
  { attr: 'property', key: 'og:title', content: HOME_SOCIAL_TITLE },
  { attr: 'property', key: 'og:description', content: HOME_DESCRIPTION },
  { attr: 'property', key: 'og:image', content: '/gas-logo.png' },
  { attr: 'property', key: 'og:image:alt', content: 'Golden Age Society logo' },
  { attr: 'property', key: 'og:image:width', content: '512' },
  { attr: 'property', key: 'og:image:height', content: '512' },
  { attr: 'name', key: 'twitter:card', content: 'summary_large_image' },
  { attr: 'name', key: 'twitter:title', content: HOME_SOCIAL_TITLE },
  { attr: 'name', key: 'twitter:description', content: HOME_DESCRIPTION },
  { attr: 'name', key: 'twitter:image', content: '/gas-logo.png' },
];

const POST_METAS: { attr: MetaAttr; key: string; content: string }[] = [
  { attr: 'name', key: 'description', content: KARTIKA_DESCRIPTION },
  { attr: 'property', key: 'og:title', content: KARTIKA_TITLE },
  { attr: 'property', key: 'og:description', content: KARTIKA_DESCRIPTION },
  { attr: 'property', key: 'og:type', content: 'article' },
  { attr: 'property', key: 'og:url', content: KARTIKA_CANONICAL },
  { attr: 'property', key: 'og:image', content: KARTIKA_IMAGE },
  { attr: 'property', key: 'og:image:alt', content: KARTIKA_IMAGE_ALT },
  { attr: 'property', key: 'og:image:width', content: String(KARTIKA_IMAGE_WIDTH) },
  { attr: 'property', key: 'og:image:height', content: String(KARTIKA_IMAGE_HEIGHT) },
  { attr: 'name', key: 'twitter:card', content: 'summary_large_image' },
  { attr: 'name', key: 'twitter:title', content: KARTIKA_TITLE },
  { attr: 'name', key: 'twitter:description', content: KARTIKA_DESCRIPTION },
  { attr: 'name', key: 'twitter:image', content: KARTIKA_IMAGE },
  { attr: 'name', key: 'twitter:image:alt', content: KARTIKA_IMAGE_ALT },
];

const ADDED_METAS: { attr: MetaAttr; key: string }[] = [
  { attr: 'property', key: 'og:url' },
  { attr: 'name', key: 'twitter:image:alt' },
];

function upsertMeta(attr: MetaAttr, key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertJsonLd(id: string, data: unknown) {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

function upsertCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = href;
}

function restoreHomepageHead() {
  document.title = HOME_TITLE;
  for (const meta of HOME_METAS) upsertMeta(meta.attr, meta.key, meta.content);
  for (const meta of ADDED_METAS) {
    document.head.querySelector(`meta[${meta.attr}="${meta.key}"]`)?.remove();
  }
  document.head.querySelector('link[rel="canonical"]')?.remove();
  document.getElementById('kartika-article-jsonld')?.remove();
  document.getElementById('kartika-faq-jsonld')?.remove();
}

/**
 * Sets the approved title tag exactly (no "| Golden Age Society" suffix) and
 * the route's description, canonical, Open Graph, Twitter, and JSON-LD tags.
 */
export function useKartikaDocumentHead() {
  useEffect(() => {
    document.title = KARTIKA_TITLE;
    for (const meta of POST_METAS) upsertMeta(meta.attr, meta.key, meta.content);
    upsertCanonical(KARTIKA_CANONICAL);
    upsertJsonLd('kartika-article-jsonld', kartikaArticleJsonLd);
    upsertJsonLd('kartika-faq-jsonld', kartikaFaqJsonLd);
    return restoreHomepageHead;
  }, []);
}
