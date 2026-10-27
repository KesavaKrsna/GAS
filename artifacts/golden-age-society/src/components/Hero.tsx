import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { KARTIK_JAPA_MEET_URL } from '@/config/site';

const DONATE_URL = 'https://www.goldenage-society.org/donate';

/**
 * Hero rotation, then back to the start:
 * 1. Kārtika 2026 — the opening screen.
 * 2. The existing Katlehong launch slide and its feast image.
 * 3. Katlehong Harināma & prasādam — the existing 14 Nov gathering, unchanged.
 */
const SLIDE_COUNT = 3;
const AUTO_MS = 6500;
const SLIDE_LABELS = [
  'Kārtika 2026',
  'Golden Age Society Launch, Katlehong',
  'Katlehong Harināma and Prasādam',
] as const;

const LAUNCH_HIGHLIGHTS = [
  {
    title: 'Harinam',
    detail: 'Street kirtan',
    tone: 'bg-[#ee6424] text-cream',
    icon: 'harinam' as const,
  },
  {
    title: 'Prasadam',
    detail: 'Free vegetarian feast',
    tone: 'bg-[#1f8a4c] text-cream',
    icon: 'prasadam' as const,
  },
  {
    title: 'Books',
    detail: 'Book distribution',
    tone: 'bg-[#c2185b] text-cream',
    icon: 'books' as const,
  },
  {
    title: 'Sadhu-sanga',
    detail: 'Uplifting association',
    tone: 'bg-[#f0b429] text-[#3d150c]',
    icon: 'sanga' as const,
  },
];

function HighlightGlyph({ name }: { name: (typeof LAUNCH_HIGHLIGHTS)[number]['icon'] }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  if (name === 'harinam') {
    return (
      <svg {...common}>
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    );
  }
  if (name === 'prasadam') {
    return (
      <svg {...common}>
        <path d="M4 11h16" />
        <path d="M6 11c.4 4.2 2.6 7 6 7s5.6-2.8 6-7" />
        <path d="M12 4v4" />
        <path d="M8 7c1.2-1.4 2.6-2 4-2s2.8.6 4 2" />
      </svg>
    );
  }
  if (name === 'books') {
    return (
      <svg {...common}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function LaunchBackdrop() {
  return (
    <motion.div
      key="launch-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0"
    >
      <picture>
        <source media="(min-width: 768px)" srcSet="/launch-kirtan-feast-wide.jpg" />
        <img
          src="/launch-kirtan-feast-tall.jpg"
          alt="Neighbours sharing a vegetarian feast and street kirtan in Katlehong"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </picture>
      <div className="launch-scrim absolute inset-0" />
    </motion.div>
  );
}

function KartikaBackdrop() {
  return (
    <motion.div
      key="kartika-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0"
    >
      <picture>
        <source media="(min-width: 768px)" srcSet="/kartika-hero-desktop.jpg" />
        <img
          src="/kartika-hero-mobile.jpg"
          alt="Mother Yashoda tying a rope around Krishna beside a clay pot, with oil lamps along the ground"
          className="kartika-photo absolute inset-0 h-full w-full"
        />
      </picture>
      <div className="kartika-scrim absolute inset-0" />
    </motion.div>
  );
}

interface HeroProps {
  onSponsorClick: () => void;
}

export function Hero({ onSponsorClick: _onSponsorClick }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reasons = { hover: false, focus: false, hidden: document.hidden, reduced: reduced.matches };
    const sync = () => setPaused(reasons.hover || reasons.focus || reasons.hidden || reasons.reduced);
    sync();

    const onReduced = () => {
      reasons.reduced = reduced.matches;
      sync();
    };
    const onVis = () => {
      reasons.hidden = document.hidden;
      sync();
    };
    reduced.addEventListener('change', onReduced);
    document.addEventListener('visibilitychange', onVis);

    const root = document.getElementById('home');
    const onEnter = () => {
      reasons.hover = true;
      sync();
    };
    const onLeave = () => {
      reasons.hover = false;
      sync();
    };
    const onFocusIn = () => {
      reasons.focus = true;
      sync();
    };
    const onFocusOut = (event: FocusEvent) => {
      if (root && event.relatedTarget instanceof Node && root.contains(event.relatedTarget)) return;
      reasons.focus = false;
      sync();
    };
    root?.addEventListener('mouseenter', onEnter);
    root?.addEventListener('mouseleave', onLeave);
    root?.addEventListener('focusin', onFocusIn);
    root?.addEventListener('focusout', onFocusOut);

    return () => {
      reduced.removeEventListener('change', onReduced);
      document.removeEventListener('visibilitychange', onVis);
      root?.removeEventListener('mouseenter', onEnter);
      root?.removeEventListener('mouseleave', onLeave);
      root?.removeEventListener('focusin', onFocusIn);
      root?.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDE_COUNT);
    }, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [paused, currentSlide]);

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 768px)').matches;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = wide ? '/kartika-hero-desktop.jpg' : '/kartika-hero-mobile.jpg';
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  const showSlide = (index: number) => {
    const next = (index + SLIDE_COUNT) % SLIDE_COUNT;
    setCurrentSlide(next);
    setAnnouncement(`Slide ${next + 1} of ${SLIDE_COUNT}: ${SLIDE_LABELS[next]}`);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showSlide(currentSlide + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showSlide(currentSlide - 1);
    }
  };

  return (
    <section
      id="home"
      aria-roledescription="carousel"
      aria-label="Featured"
      onKeyDown={onKeyDown}
      className="relative mt-[83px] flex h-[calc(100svh-83px)] min-h-[32rem] w-full items-stretch overflow-hidden bg-plum md:h-[90vh] md:min-h-[640px]"
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <AnimatePresence>{currentSlide === 0 && <KartikaBackdrop />}</AnimatePresence>
        <AnimatePresence>{(currentSlide === 1 || currentSlide === 2) && <LaunchBackdrop />}</AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
          {currentSlide === 1 && (
            <motion.div
              key="launch-slide"
              id="hero-slide-1"
              role="group"
              aria-roledescription="slide"
              aria-label={`2 of ${SLIDE_COUNT}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="container relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-end px-5 pb-24 pt-16 text-left md:justify-center md:px-12 md:pb-4 md:pt-8"
            >
            <div className="flex w-full max-w-xl flex-col items-start gap-2.5 md:max-w-2xl md:gap-3.5">
              <div>
                <div className="kicker mb-1.5 !text-[#ffe7a3] [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]">
                  Come through · Chant, dance, feast
                </div>
                <h1 className="text-[1.7rem] leading-[1.02] text-cream [text-shadow:0_3px_18px_rgba(0,0,0,0.55)] sm:text-5xl md:text-6xl">
                  Golden Age Society
                  <span className="mt-1 block">
                    Launch, <em>Katlehong</em>
                  </span>
                </h1>
              </div>

              <ul className="grid w-full grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-2">
                {LAUNCH_HIGHLIGHTS.map((item) => (
                  <li
                    key={item.title}
                    className="flex items-center gap-1.5 rounded-full bg-black/40 px-2 py-1.5 text-left backdrop-blur-[2px] sm:gap-2 sm:px-2.5"
                  >
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${item.tone}`}>
                      <HighlightGlyph name={item.icon} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-serif text-[0.82rem] leading-none text-cream sm:text-[0.95rem]">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-[0.6rem] font-medium leading-tight text-cream/80">
                        {item.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <p className="max-w-xl text-[0.8rem] font-semibold leading-snug text-cream [text-shadow:0_2px_10px_rgba(0,0,0,0.65)] sm:text-base">
                Sat 14 Nov · 12:30 · 222 Maphisa St, Nhlapho Section, Katlehong
              </p>
              <p className="inline-flex items-center rounded-full bg-cream px-3 py-1 text-xs font-bold tracking-wide text-wine sm:text-sm">
                Free · All welcome
              </p>

              <div className="flex w-full flex-row items-center gap-2 sm:gap-3">
                <Link
                  href="/donate"
                  className="btn-gold group min-h-12 shrink-0 px-6 text-base shadow-[0_14px_36px_rgba(251,178,38,0.48)] sm:min-h-14 sm:px-10 sm:text-lg"
                >
                  Donate
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
                <a
                  href={DONATE_URL}
                  className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl bg-cream px-2 py-1.5 text-left sm:max-w-xs sm:flex-none sm:gap-3 sm:px-2.5 sm:py-2"
                >
                  <img
                    src="/donate-qr.svg"
                    alt="QR code for https://www.goldenage-society.org/donate"
                    width={80}
                    height={80}
                    className="h-12 w-12 shrink-0 rounded-md bg-cream sm:h-[4.5rem] sm:w-[4.5rem]"
                  />
                  <span className="min-w-0">
                    <span className="block font-serif text-sm leading-none text-wine sm:text-base">Scan to donate</span>
                    <span className="mt-1 hidden text-[0.68rem] font-medium leading-snug text-[#6d3a32] sm:block">
                      goldenage-society.org/donate
                    </span>
                  </span>
                </a>
              </div>
            </div>
            </motion.div>
          )}

          {currentSlide === 0 && (
            <motion.div
              key="kartika-slide"
              id="hero-slide-0"
              role="group"
              aria-roledescription="slide"
              aria-label={`1 of ${SLIDE_COUNT}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="kartika-frame"
            >
              <div className="kartika-copy">
                <p className="kartika-eyebrow">The month of Dāmodara</p>
                <h1>
                  <span className="kartika-word">Kārtika</span>
                  <span className="kartika-year">2026</span>
                </h1>
                <svg className="kartika-lotus" viewBox="0 0 64 28" fill="none" stroke="#f2c462" strokeWidth="1.6" aria-hidden="true">
                  <path d="M32 3c-5 6-5 13 0 21 5-8 5-15 0-21z" />
                  <path d="M32 24c-4-7-11-11-18-11 2 7 9 11 18 11z" />
                  <path d="M32 24c4-7 11-11 18-11-2 7-9 11-18 11z" />
                  <path d="M4 25h22M38 25h22" />
                </svg>
                <p className="kartika-sub">
                  Offer a lamp to Lord <em>Dāmodara</em> this holy month
                </p>
                <div className="kartika-cta">
                  <a
                    href={KARTIK_JAPA_MEET_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kartika-btn"
                  >
                    <svg className="diya" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2c2 3 2.6 5 1.6 6.6A2 2 0 0 1 10.4 8.6C9.6 7 10 5 12 2z" fill="#ffd27a" />
                      <path d="M3 13h18c-1 4.2-4.6 7-9 7s-8-2.8-9-7z" fill="#f2c462" />
                    </svg>
                    Join Kārtika Japa
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  <p className="kartika-when">Daily · 4:30–6:30 AM (SAST)</p>
                </div>
              </div>
            </motion.div>
          )}

          {currentSlide === 2 && (
            <motion.div
              key="katlehong-feeding-slide"
              id="hero-slide-2"
              role="group"
              aria-roledescription="slide"
              aria-label={`3 of ${SLIDE_COUNT}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="container relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-end px-5 pb-24 pt-16 text-left md:justify-center md:px-12 md:pb-4 md:pt-8"
            >
            <div className="flex w-full max-w-xl flex-col items-start gap-2.5 md:max-w-2xl md:gap-3.5">
              <div>
                <div className="kicker mb-1.5 !text-[#ffe7a3] [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]">
                  First outreach centre
                </div>
                <h1 className="text-[1.7rem] leading-[1.02] text-cream [text-shadow:0_3px_18px_rgba(0,0,0,0.55)] sm:text-5xl md:text-6xl">
                  Katlehong
                  <span className="mt-1 block">
                    <em>Harināma</em> &amp; Prasādam
                  </span>
                </h1>
              </div>
              <p className="max-w-xl text-sm font-medium leading-relaxed text-cream [text-shadow:0_2px_10px_rgba(0,0,0,0.65)] sm:text-lg">
                Our first working model: congregational chanting through the streets of Katlehong followed by prasādam,
                which is donated in kind. Devotees travel in from Soweto, Edenvale, Hammanskraal and Johannesburg.
              </p>
              <p className="max-w-xl text-[0.8rem] font-semibold leading-snug text-cream [text-shadow:0_2px_10px_rgba(0,0,0,0.65)] sm:text-base">
                Sat 14 Nov · 12:30 · 222 Maphisa St, Nhlapho Section, Katlehong
              </p>
              <p className="inline-flex items-center rounded-full bg-cream px-3 py-1 text-xs font-bold tracking-wide text-wine sm:text-sm">
                Free · All welcome
              </p>
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-3">
                <Link
                  href="/donate?tier=transport"
                  className="btn-gold group min-h-12 px-6 text-base shadow-[0_14px_36px_rgba(251,178,38,0.48)]"
                >
                  Sponsor a transport day
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
                <Link href="/get-involved" className="btn-ghost min-h-12 px-6 text-base">
                  Volunteer
                </Link>
              </div>
            </div>
            </motion.div>
          )}
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center md:bottom-5">
        <div
          role="group"
          aria-label="Hero slides"
          className="flex items-center gap-1 rounded-full bg-black/45 px-1.5 py-1 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => showSlide(currentSlide - 1)}
            className="grid h-11 w-11 place-items-center rounded-full text-xl text-cream/90 transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            aria-label="Previous slide"
          >
            <span aria-hidden>←</span>
          </button>
          <div role="tablist" aria-label="Choose a slide" className="flex items-center gap-0.5 px-0.5">
            {SLIDE_LABELS.map((label, idx) => (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={idx === currentSlide}
                aria-label={label}
                onClick={() => showSlide(idx)}
                className="grid h-11 w-9 place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <span
                  aria-hidden
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? 'w-8 bg-gold' : 'w-2.5 bg-cream/40'
                  }`}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => showSlide(currentSlide + 1)}
            className="grid h-11 w-11 place-items-center rounded-full text-xl text-cream/90 transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            aria-label="Next slide"
          >
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </section>
  );
}
