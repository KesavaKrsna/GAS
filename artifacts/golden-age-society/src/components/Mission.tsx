import React from 'react';
import { motion } from 'framer-motion';
import { LotusMark } from './visual/LotusMark';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const objectives = [
  { icon: '🛕', text: 'Support township-based Krishna Conscious centers' },
  { icon: '🎶', text: 'Empower youth through kirtan, culture, and education' },
  { icon: '📚', text: "Translate and distribute Srila Prabhupada's teachings widely" },
  { icon: '🍛', text: 'Prasadam distribution to communities in need' },
  { icon: '🌱', text: 'Cultivate and nurture devotees through ongoing spiritual education and community care' },
];

export function Mission() {
  return (
    <section id="mission" className="py-24 md:py-[110px] bg-cream overflow-hidden relative">
      <div className="absolute -right-24 top-24 opacity-[0.07] pointer-events-none">
        <LotusMark className="w-72 h-72" />
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-6xl space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
          <div>
            <motion.div {...fadeUp(0)} className="kicker mb-4">
              Our Purpose
            </motion.div>
            <motion.h2 {...fadeUp(0.08)} className="text-4xl md:text-6xl text-wine mb-3 leading-tight">
              Lord Caitanya's <em className="text-orange">Golden Age</em>
            </motion.h2>
            <motion.p {...fadeUp(0.14)} className="text-sm uppercase tracking-[0.2em] text-gold font-semibold mb-8">
              "Where Bhakti Sparks Become Flames"
            </motion.p>
            <motion.div {...fadeUp(0.2)} className="space-y-5 text-text/80 leading-relaxed">
              <p className="text-base md:text-lg">
                Lord Caitanya Mahāprabhu predicted a <strong className="text-wine">10,000-year Golden Age</strong> within
                Kali-yuga during which the sankirtana movement would spread across the world. GAS stands committed to
                being a catalyst in this divine mission—supporting township-based Krishna Conscious centers and fueling
                the flame of Bhakti within African communities.
              </p>
              <p>
                Through weekly <strong className="text-wine">Prasadam distribution</strong>, Harinam sankirtan, youth
                empowerment, and the translation and sharing of Srila Prabhupada's teachings, GAS cultivates and
                nurtures devotees—empowering individuals and families to participate fully in Lord Caitanya's Golden
                Age.
              </p>
            </motion.div>
          </div>

          <motion.div className="flex items-center justify-center" {...fadeUp(0.1)}>
            <div className="relative rotate-[-2deg]">
              <motion.div
                className="absolute -inset-8 rounded-full blur-3xl"
                style={{ background: 'radial-gradient(circle, rgba(251,178,38,0.35) 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.12, 1], opacity: [0.55, 1, 0.55] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.img
                src="/lord-caitanya.png"
                alt="Lord Caitanya Mahāprabhu"
                className="relative z-10 w-72 lg:w-[22rem] rounded-[2rem] foil-frame object-cover"
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as const }}
              />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <motion.div {...fadeUp(0.05)} className="bg-wine rounded-[1.75rem] p-8 md:p-10 relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-44 h-44 opacity-15 pointer-events-none">
              <LotusMark />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-10 h-10 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold text-lg">
                  ✦
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-gold">Vision</span>
              </div>
              <p className="text-cream/92 leading-relaxed text-base md:text-lg">
                To usher in the Golden Age of Lord Caitanya Mahāprabhu within African communities by supporting vibrant
                centers of <strong className="text-gold">Krishna Consciousness</strong> in every township and
                village—nourishing body and soul through Prasadam, kirtan, and devotional culture.
              </p>
            </div>
          </motion.div>

          <motion.div
            {...fadeUp(0.12)}
            className="bg-paper rounded-[1.75rem] p-8 md:p-10 relative overflow-hidden border border-gold/25"
          >
            <div className="absolute -right-8 -bottom-8 w-44 h-44 opacity-10 pointer-events-none">
              <LotusMark />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-10 h-10 rounded-full bg-orange/15 border border-orange/35 flex items-center justify-center text-orange text-lg animate-flicker">
                  ✦
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-orange">Mission</span>
              </div>
              <p className="text-text/80 leading-relaxed text-base md:text-lg">
                To expand the sankirtana movement by engaging local township communities in Harinam, Prasadam, book
                distribution, spiritual education, cultural expression, and sustainable{' '}
                <strong className="text-wine">African-led temple development</strong>.
              </p>
            </div>
          </motion.div>
        </div>

        <div>
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <div className="kicker mb-3">Core Objectives</div>
            <h3 className="text-3xl md:text-5xl text-wine">What we work toward</h3>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {objectives.map((obj, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-paper rounded-[1.5rem] p-6 flex flex-col items-start gap-4 border border-gold/15 hover:border-gold/45 hover:shadow-[0_16px_40px_rgba(117,28,43,0.1)] transition-shadow"
              >
                <span className="text-3xl">{obj.icon}</span>
                <p className="text-sm text-text/75 leading-relaxed">{obj.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
