import React from 'react';
import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

const objectives = [
  { icon: '🛕', text: 'Support township-based Krishna Conscious centers' },
  { icon: '🎶', text: 'Empower youth through kirtan, culture, and education' },
  { icon: '📚', text: 'Translate and distribute Srila Prabhupada\'s teachings widely' },
  { icon: '🍛', text: 'Prasadam distribution to communities in need' },
  { icon: '🌱', text: 'Cultivate and nurture devotees through ongoing spiritual education and community care' },
];

/* Animated lotus SVG ─────────────────────────────────────────────────────── */
function LotusIcon() {
  return (
    <motion.svg
      viewBox="0 0 120 120"
      className="w-full h-full"
      initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Outer petals – slow pulse */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <motion.ellipse
          key={deg}
          cx={60} cy={60}
          rx={10} ry={26}
          fill="rgba(251,178,38,0.22)"
          stroke="rgba(251,178,38,0.55)"
          strokeWidth={0.8}
          style={{ transformOrigin: '60px 60px', transform: `rotate(${deg}deg) translateY(-16px)` }}
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 3, delay: i * 0.18, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      {/* Inner petals */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <motion.ellipse
          key={`i${deg}`}
          cx={60} cy={60}
          rx={7} ry={18}
          fill="rgba(238,100,36,0.30)"
          stroke="rgba(238,100,36,0.6)"
          strokeWidth={0.7}
          style={{ transformOrigin: '60px 60px', transform: `rotate(${deg}deg) translateY(-10px)` }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.4, delay: i * 0.22 + 0.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      {/* Centre circle */}
      <motion.circle
        cx={60} cy={60} r={10}
        fill="rgba(251,178,38,0.9)"
        style={{ transformOrigin: '60px 60px' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.svg>
  );
}

/* Flame SVG ─────────────────────────────────────────────────────────────── */
function FlameIcon({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 48 64"
      className={className}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <motion.path
        d="M24 4 C24 4 10 20 10 34 C10 46 16 56 24 60 C32 56 38 46 38 34 C38 20 24 4 24 4Z"
        fill="rgba(238,100,36,0.85)"
        animate={{ scaleY: [1, 1.06, 1], scaleX: [1, 0.96, 1] }}
        style={{ transformOrigin: '24px 60px' }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M24 20 C24 20 16 30 16 38 C16 46 19.5 54 24 58 C28.5 54 32 46 32 38 C32 30 24 20 24 20Z"
        fill="rgba(251,178,38,0.9)"
        animate={{ scaleY: [1, 1.08, 1], scaleX: [1, 0.94, 1] }}
        style={{ transformOrigin: '24px 58px' }}
        transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
      />
      <motion.ellipse
        cx={24} cy={52} rx={5} ry={7}
        fill="rgba(255,253,247,0.75)"
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.svg>
  );
}

export function Mission() {
  return (
    <section id="mission" className="py-24 md:py-[105px] bg-cream overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl space-y-20">

        {/* ── BLOCK 1: Lord Caitanya's Golden Age ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-center">
          <div>
            <motion.div {...fadeUp(0)} className="kicker mb-4">Our Purpose</motion.div>
            <motion.h2 {...fadeUp(0.08)} className="text-4xl md:text-5xl text-wine mb-2 leading-tight">
              Lord Caitanya's <em className="text-orange">Golden Age</em>
            </motion.h2>
            <motion.p {...fadeUp(0.14)} className="text-sm uppercase tracking-widest text-gold font-semibold mb-8">
              "Where Bhakti Sparks Become Flames"
            </motion.p>
            <motion.div {...fadeUp(0.2)} className="space-y-5 text-text/80 leading-relaxed">
              <p className="text-base md:text-lg">
                Lord Caitanya Mahāprabhu predicted a <strong className="text-wine">10,000-year Golden Age</strong> within
                Kali-yuga during which the sankirtana movement would spread across the world. GAS stands
                committed to being a catalyst in this divine mission—igniting and fueling the flame of
                Bhakti within African townships and villages.
              </p>
              <p>
                These communities, historically underserved yet spiritually receptive, hold immense
                potential for the blossoming of Krishna Consciousness. GAS aims to awaken this natural
                devotion, empowering individuals and families to embrace the chanting of the holy names
                and participate fully in Lord Caitanya's Golden Age.
              </p>
            </motion.div>
          </div>

          {/* Lord Caitanya image */}
          <motion.div
            className="flex items-center justify-center"
            {...fadeUp(0.1)}
          >
            <div className="relative">
              {/* Soft divine glow behind the figure */}
              <motion.div
                className="absolute inset-0 rounded-full blur-2xl"
                style={{ background: 'radial-gradient(circle, rgba(251,178,38,0.28) 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.img
                src="/lord-caitanya.png"
                alt="Lord Caitanya Mahāprabhu"
                className="relative z-10 w-72 lg:w-80 rounded-2xl shadow-xl object-cover"
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </motion.div>
        </div>

        {/* ── BLOCK 2: Vision & Mission ────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vision */}
          <motion.div
            {...fadeUp(0.05)}
            className="bg-wine rounded-2xl p-8 md:p-10 relative overflow-hidden group"
          >
            {/* Background lotus watermark */}
            <div className="absolute -right-6 -bottom-6 w-40 h-40 opacity-10 pointer-events-none">
              <LotusIcon />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-9 h-9 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold text-lg">👁</span>
                <span className="text-xs font-bold uppercase tracking-widest text-gold/80">Vision</span>
              </div>
              <p className="text-cream/90 leading-relaxed text-base">
                To usher in the Golden Age of Lord Caitanya Mahāprabhu within African communities by
                establishing vibrant centers of <strong className="text-gold">Krishna Consciousness</strong> in
                every township and village.
              </p>
            </div>
          </motion.div>

          {/* Mission */}
          <motion.div
            {...fadeUp(0.12)}
            className="bg-paper rounded-2xl p-8 md:p-10 relative overflow-hidden border border-gold/20 group"
          >
            <div className="absolute -right-6 -bottom-6 w-40 h-40 opacity-10 pointer-events-none">
              <LotusIcon />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-9 h-9 rounded-full bg-orange/10 border border-orange/30 flex items-center justify-center text-orange text-lg">🔥</span>
                <span className="text-xs font-bold uppercase tracking-widest text-orange/80">Mission</span>
              </div>
              <p className="text-text/80 leading-relaxed text-base">
                To expand the sankirtana movement by engaging local township communities in Harinam,
                Prasadam, book distribution, spiritual education, cultural expression, and
                sustainable <strong className="text-wine">African-led temple development</strong>.
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── BLOCK 3: Core Objectives ─────────────────────────────────────── */}
        <div>
          <motion.div {...fadeUp(0)} className="text-center mb-10">
            <div className="kicker mb-3">Core Objectives</div>
            <h3 className="text-3xl md:text-4xl text-wine">What we work toward</h3>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {objectives.map((obj, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-paper rounded-2xl p-7 flex flex-col items-start gap-4 border border-gold/10 hover:border-gold/30 hover:shadow-md transition-shadow"
              >
                <motion.span
                  className="text-3xl"
                  animate={{ rotate: [0, 6, -6, 0] }}
                  transition={{ duration: 4, delay: i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {obj.icon}
                </motion.span>
                <p className="text-sm text-text/75 leading-relaxed">{obj.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
