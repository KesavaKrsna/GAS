import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import gasLogo from '@assets/gas-logo.png';
import prabhupadaImg from '@assets/Srila_Prabhupada_1784293998582.png';
import heroPhoto from '@assets/hero_1784320482932.png';
import heroMandate from '/hero-mandate.jpg';
import { SparkField } from './visual/SparkField';
import { MandalaBackdrop, LotusMark } from './visual/LotusMark';

const DONATE_URL = 'https://www.goldenage-society.org/donate';

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

interface HeroProps {
  onSponsorClick: () => void;
}

const slides = [
  {
    id: 0,
    kicker: 'Launch gathering · Katlehong',
    h1: (
      <>
        Golden Age Society
        <br />
        Launch, <em>Katlehong</em>
      </>
    ),
    body: 'Sat 14 Nov · 12:30 · 222 Maphisa St, Nhlapho Section, Katlehong. Harinam, Prasadam, Books and Sadhu-sanga. Free · All welcome.',
  },
  {
    id: 1,
    kicker: 'Golden Age Society',
    h1: (
      <>
        Where Bhakti Sparks
        <br />
        <em>Become Flames.</em>
      </>
    ),
    vision:
      "Ushering in Lord Caitanya Mahāprabhu's Golden Age by establishing vibrant centres of Krishna Consciousness in every township and village across Africa.",
    mission:
      'Expanding the sankirtana movement through Harinam, Prasadam, book distribution, spiritual education, cultural expression, and sustainable African-led temple development.',
  },
  {
    id: 2,
    kicker: 'Learn with Golden Age Society',
    h1: (
      <>
        Meet <em>Śrīla Prabhupāda,</em>
        <br />
        our guiding teacher.
      </>
    ),
    body: 'The founder-acharya of the worldwide Hare Krishna movement who brought the timeless wisdom of Bhakti Yoga to the modern world, transforming countless hearts with extraordinary compassion.',
  },
  {
    id: 3,
    kicker: 'Our mandate in action',
    h1: (
      <>
        Nourishing body,
        <br />
        <em>mind and soul.</em>
      </>
    ),
    body: 'Prasadam distribution, sacred book distribution, uplifting kirtan — and growing our township presence through vibrant centres and temples where every heart is welcome.',
  },
];

export function Hero({ onSponsorClick }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const scrollToMission = () => {
    const el = document.getElementById('mission');
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className={`relative w-full overflow-hidden bg-plum mt-[83px] flex ${
        currentSlide === 0
          ? 'h-[calc(100svh-83px)] min-h-[32rem] items-stretch md:h-[90vh] md:min-h-[640px]'
          : 'min-h-[640px] h-[92vh] md:h-[90vh] items-center justify-center'
      }`}
    >
      <div className="absolute inset-0 pointer-events-none z-0">
        <AnimatePresence>{currentSlide === 0 && <LaunchBackdrop />}</AnimatePresence>

        <AnimatePresence>
          {currentSlide === 1 && (
            <motion.img
              key="hero-photo"
              src={heroPhoto}
              alt=""
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1 }}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {currentSlide === 3 && (
            <motion.img
              key="hero-mandate"
              src={heroMandate}
              alt=""
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1 }}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          )}
        </AnimatePresence>

        {currentSlide !== 0 && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_#fbb226_0%,_#ee6424_28%,_#751c2b_68%,_#39121f_100%)] opacity-80" />
            <MandalaBackdrop />
            <SparkField />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_32%,rgba(20,8,13,0.72)_100%)]" />
            <div className="absolute bottom-20 left-8 md:left-16 opacity-20">
              <LotusMark className="w-20 h-20 md:w-28 md:h-28" />
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {currentSlide === 2 && (
          <motion.div
            key="prabhupada"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-10 right-0 md:right-8 lg:right-16 z-10 pointer-events-none select-none h-[62%] sm:h-[74%] md:h-[96%] lg:h-[111%] max-h-[780px] flex items-end"
          >
            <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-gold/15 via-transparent to-transparent rounded-full blur-3xl animate-pulse-glow" />
            <img
              src={prabhupadaImg}
              alt="Śrīla Prabhupāda"
              className="h-full w-auto object-contain relative"
              style={{ mixBlendMode: 'screen' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`container relative z-10 mx-auto flex flex-col px-5 md:px-12 ${
          currentSlide === 0
            ? 'h-full w-full max-w-6xl justify-end pb-2 pt-16 text-left md:justify-center md:pb-4 md:pt-8'
            : 'items-center justify-center px-6 text-center'
        }`}
      >
        <AnimatePresence mode="wait">
          {currentSlide === 0 && (
            <motion.div
              key="launch-slide"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex w-full max-w-xl flex-col items-start gap-2.5 md:max-w-2xl md:gap-3.5"
            >
              <div>
                <div className="kicker mb-1.5 !text-[#ffe7a3] [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]">
                  Come through · Sing, dance, feast
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
            </motion.div>
          )}

          {currentSlide === 1 && (
            <motion.div
              key="slide-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center w-full max-w-3xl"
            >
              <img
                src={gasLogo}
                alt="Golden Age Society Mark"
                className="w-[80px] h-[67px] md:w-[96px] md:h-[80px] object-contain mb-5 filter brightness-[10] drop-shadow-md"
              />
              <div className="kicker mb-3 !text-gold drop-shadow-md">Golden Age Society</div>
              <h1 className="text-[2.15rem] sm:text-5xl md:text-6xl lg:text-7xl text-cream mb-6 drop-shadow-lg leading-[1.05] text-center">
                Where Bhakti Sparks
                <br />
                <em className="text-gold">Become Flames.</em>
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-7 px-2">
                <div className="bg-plum/50 backdrop-blur-md border border-gold/25 rounded-2xl px-4 py-4 text-left">
                  <div className="text-xs font-bold uppercase tracking-widest text-gold mb-1.5">Vision</div>
                  <p className="text-cream/90 text-xs sm:text-sm leading-relaxed">{slides[1].vision}</p>
                </div>
                <div className="bg-plum/50 backdrop-blur-md border border-gold/25 rounded-2xl px-4 py-4 text-left">
                  <div className="text-xs font-bold uppercase tracking-widest text-gold mb-1.5">Mission</div>
                  <p className="text-cream/90 text-xs sm:text-sm leading-relaxed">{slides[1].mission}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-8 w-full max-w-xs sm:max-w-none justify-center">
                <button onClick={onSponsorClick} className="btn-gold w-full sm:w-auto group">
                  ♡ Donate now
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button onClick={scrollToMission} className="btn-ghost w-full sm:w-auto">
                  Discover our mission
                </button>
              </div>
            </motion.div>
          )}

          {currentSlide > 1 && (
            <motion.div
              key={`slide-${currentSlide}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center w-full"
            >
              <img
                src={gasLogo}
                alt="Golden Age Society Mark"
                className="w-[90px] h-[75px] md:w-[110px] md:h-[92px] object-contain mb-8 filter brightness-[10] drop-shadow-md"
              />
              <div
                className={`flex flex-col items-center w-full max-w-3xl ${
                  currentSlide === 2 ? 'md:items-start md:text-left md:pr-[36%]' : ''
                }`}
              >
                <div className="kicker mb-4 !text-gold drop-shadow-md">{slides[currentSlide].kicker}</div>
                <h1 className="text-[2.2rem] sm:text-5xl md:text-6xl lg:text-7xl text-cream mb-5 drop-shadow-lg leading-tight">
                  {slides[currentSlide].h1}
                </h1>
                {'body' in slides[currentSlide] && (
                  <p className="text-sm sm:text-base md:text-lg text-cream/95 max-w-xl leading-relaxed font-medium px-5 py-4 rounded-2xl bg-plum/40 backdrop-blur-md border border-gold/20">
                    {(slides[currentSlide] as { body: string }).body}
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 mb-10 w-full max-w-xs sm:max-w-none justify-center">
                <button onClick={scrollToMission} className="btn-gold w-full sm:w-auto">
                  Discover our mission
                </button>
                <button onClick={onSponsorClick} className="btn-ghost w-full sm:w-auto">
                  Support the flame
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="z-20 mt-3 flex items-center gap-4 self-center md:mt-4">
          <button
            onClick={prevSlide}
            className="text-cream/70 hover:text-gold transition-colors p-2 text-xl"
            aria-label="Previous slide"
          >
            ←
          </button>
          <div className="flex items-center gap-2.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 transition-all duration-300 rounded-full ${
                  idx === currentSlide ? 'w-8 bg-gold' : 'w-2 bg-cream/35 hover:bg-cream/60'
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="text-cream/70 hover:text-gold transition-colors p-2 text-xl"
            aria-label="Next slide"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
