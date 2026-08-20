import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gasLogo from '@assets/gas-logo.png';
import prabhupadaImg from '@assets/Srila_Prabhupada_1784293998582.png';
import heroPhoto from '@assets/hero_1784320482932.png';
import heroMandate from '/hero-mandate.jpg';
import heroSymposium from '/hero-symposium.png';
import { SparkField } from './visual/SparkField';
import { MandalaBackdrop, LotusMark } from './visual/LotusMark';

interface HeroProps {
  onSponsorClick: () => void;
}

const slides = [
  {
    id: 0,
    kicker: 'Upcoming event · 15 August 2026',
    h1: (
      <>
        Inter-Faith
        <br />
        <em>Symposium.</em>
      </>
    ),
    body: 'Katlegong Resource Center · 13:30–16:00 · L824 Ramakonopi East, Katlegong. Many paths. One truth. One humanity. Meal will be served on the day.',
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

  const scrollToContact = () => {
    const el = document.getElementById('contact-form');
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative w-full min-h-[640px] h-[92vh] md:h-[90vh] flex items-center justify-center overflow-hidden bg-plum mt-[83px]"
    >
      <div className="absolute inset-0 pointer-events-none z-0">
        <AnimatePresence>
          {currentSlide === 0 && (
            <motion.div
              key="symposium-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 bg-[#14080d]"
            />
          )}
        </AnimatePresence>

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

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_#fbb226_0%,_#ee6424_28%,_#751c2b_68%,_#39121f_100%)] opacity-80" />
        <MandalaBackdrop />
        <SparkField />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_32%,rgba(20,8,13,0.72)_100%)]" />
        <div className="absolute bottom-20 left-8 md:left-16 opacity-20">
          <LotusMark className="w-20 h-20 md:w-28 md:h-28" />
        </div>
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

      <div className="container relative z-10 mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          {currentSlide === 0 && (
            <motion.div
              key="symposium-slide"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-4 py-4"
            >
              <div className="kicker !text-gold drop-shadow-md">Golden Age Society · Upcoming Event</div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl text-cream drop-shadow-lg leading-tight">
                We're proud to co-host an <em>Inter-Faith Symposium</em>
              </h1>
              <img
                src={heroSymposium}
                alt="Inter-Faith Symposium — 15 August 2026"
                className="max-h-[48vh] w-auto rounded-[1.5rem] foil-frame"
              />
              <p className="text-cream/80 text-sm sm:text-base italic tracking-wide">
                Many paths. One truth. One humanity.
              </p>
              <button onClick={scrollToContact} className="btn-gold group">
                RSVP — get in touch
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
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

        <div className="flex items-center gap-4 z-20 mt-auto">
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
