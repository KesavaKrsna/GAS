import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gasLogo from '@assets/gas-logo.png';
import prabhupadaImg from '@assets/Srila_Prabhupada_1784293998582.png';
import heroPhoto from '@assets/hero_1784320482932.png';

interface HeroProps {
  onSponsorClick: () => void;
}

const slides = [
  {
    id: 1,
    kicker: "Golden Age Society presents",
    h1: <>Spiritual awakening,<br/><em>joyful community.</em></>,
    body: "Experience the profound joy of Krishna consciousness. Through devotional chanting, spiritual wisdom, and loving association, we nurture the soul's natural yearning for connection.",
  },
  {
    id: 2,
    kicker: "Learn with Golden Age Society",
    h1: <>Meet <em>Śrīla Prabhupāda,</em><br/>our guiding teacher.</>,
    body: "The founder-acharya of the worldwide Hare Krishna movement who brought the timeless wisdom of Bhakti Yoga to the modern world, transforming countless hearts with extraordinary compassion.",
  },
  {
    id: 3,
    kicker: "The heart of devotion",
    h1: <>Know <em>Śrī Śrī Rādhā-Kṛṣṇa.</em></>,
    body: "At the center of all spiritual inquiry is the supreme divine couple. Discover the perfection of love, beauty, and sweetness in the topmost realm of devotional service.",
  }
];

export function Hero({ onSponsorClick }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [currentSlide]); // Reset timer when slide changes manually

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const scrollToMission = () => {
    const el = document.getElementById('mission');
    if (el) {
      window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative w-full min-h-[600px] h-[85vh] md:h-[80vh] flex items-center justify-center overflow-hidden bg-plum mt-[96px]">
      
      {/* Background with radial gradient and pattern overlay */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Slide 1 hero photo */}
        <AnimatePresence>
          {currentSlide === 0 && (
            <motion.img
              key="hero-photo"
              src={heroPhoto}
              alt=""
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_#fbb226_0%,_#ee6424_30%,_#751c2b_70%,_#39121f_100%)] opacity-80" />
        
        {/* Repeating concentric rings pattern */}
        <div 
          className="absolute inset-0 opacity-10 mix-blend-overlay"
          style={{
            backgroundImage: `repeating-radial-gradient(circle at center, transparent 0, transparent 20px, rgba(251, 178, 38, 0.4) 20px, rgba(251, 178, 38, 0.4) 21px)`
          }}
        />

        {/* Thin golden decorative ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vh] h-[70vh] rounded-full border border-gold/30" />
        
        {/* Dark Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />

        {/* Sanskrit Decor */}
        <div className="absolute bottom-16 left-10 md:left-24 text-6xl md:text-8xl text-gold/10 font-serif select-none pointer-events-none">✦</div>
        {/* Lotus decor */}
        <div className="absolute bottom-16 right-10 md:right-24 select-none pointer-events-none w-16 h-16 md:w-24 md:h-24 opacity-10">
          <svg viewBox="0 0 120 120" className="w-full h-full" fill="rgba(251,178,38,1)">
            {/* Outer petals */}
            {[0,45,90,135,180,225,270,315].map((deg) => (
              <ellipse key={deg} cx={60} cy={60} rx={9} ry={24}
                style={{ transformOrigin:'60px 60px', transform:`rotate(${deg}deg) translateY(-16px)` }} />
            ))}
            {/* Inner petals */}
            {[0,60,120,180,240,300].map((deg) => (
              <ellipse key={`i${deg}`} cx={60} cy={60} rx={6} ry={16}
                style={{ transformOrigin:'60px 60px', transform:`rotate(${deg}deg) translateY(-9px)` }} />
            ))}
            {/* Centre */}
            <circle cx={60} cy={60} r={9} />
          </svg>
        </div>
      </div>

      {/* Srila Prabhupada figure — shown only on slide 2 */}
      <AnimatePresence>
        {currentSlide === 1 && (
          <motion.div
            key="prabhupada"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-10 right-0 md:right-8 lg:right-16 z-10 pointer-events-none select-none h-[144%] max-h-[1000px] flex items-end"
          >
            {/* Soft glow halo behind figure */}
            <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-gold/10 via-transparent to-transparent rounded-full blur-3xl" />
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
        
        <img 
          src={gasLogo} 
          alt="Golden Age Society Mark" 
          className="w-[90px] h-[75px] md:w-[110px] md:h-[92px] object-contain mb-8 filter brightness-[10] drop-shadow-md"
        />

        <div className="relative w-full max-w-4xl min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={`absolute inset-0 flex flex-col items-center ${currentSlide === 1 ? 'md:items-start md:text-left md:pr-[38%]' : ''}`}
            >
              <div className="kicker mb-6 !text-gold shadow-sm drop-shadow-md">{slides[currentSlide].kicker}</div>
              <h1 className="text-[2.75rem] md:text-6xl lg:text-7xl text-cream mb-6 drop-shadow-lg">
                {slides[currentSlide].h1}
              </h1>
              <p className="text-cream/90 md:text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium">
                {slides[currentSlide].body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-12 mb-16">
          <button 
            onClick={scrollToMission}
            className="px-8 py-3.5 bg-wine text-cream rounded-full text-base font-medium hover:bg-wine/90 transition-colors shadow-lg border border-wine/20 w-full sm:w-auto"
          >
            Discover our mission
          </button>
          <button 
            onClick={onSponsorClick}
            className="px-8 py-3.5 bg-transparent border border-cream/50 text-cream rounded-full text-base font-medium hover:bg-cream/10 transition-colors w-full sm:w-auto"
          >
            Support the flame
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 z-20 mt-auto">
          <button onClick={prevSlide} className="text-cream/70 hover:text-cream transition-colors p-2 text-xl" aria-label="Previous slide">
            ←
          </button>
          <div className="flex items-center gap-2.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 transition-all duration-300 rounded-full ${
                  idx === currentSlide ? 'w-6 bg-cream' : 'w-2 bg-cream/30 hover:bg-cream/50'
                }`}
              />
            ))}
          </div>
          <button onClick={nextSlide} className="text-cream/70 hover:text-cream transition-colors p-2 text-xl" aria-label="Next slide">
            →
          </button>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-plum/40 backdrop-blur-sm border-t border-gold/10 flex items-center justify-center">
        <span className="text-[0.65rem] uppercase tracking-[0.2em] text-gold/70 font-semibold">
          Hare Krishna &bull; Love in action &bull; All hearts welcome
        </span>
      </div>
    </section>
  );
}