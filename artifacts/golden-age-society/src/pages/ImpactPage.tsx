import React from 'react';
import { useLocation } from 'wouter';
import { usePageTitle } from '@/hooks/usePageTitle';
import { motion } from 'framer-motion';
import gasLogo from '@assets/gas-logo.png';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

/* ─── Impact stats — update these with real figures ─────────────── */
const STATS = [
  { icon: '🍲', value: '—', unit: 'meals served', note: 'Update with real figure' },
  { icon: '🎶', value: '—', unit: 'kirtan outreach days', note: 'Update with real figure' },
  { icon: '📖', value: '—', unit: 'books distributed', note: 'Update with real figure' },
  { icon: '🤝', value: '—', unit: 'devotees reunited', note: 'Update with real figure' },
  { icon: '🏘️', value: '6+', unit: 'townships reached', note: 'Soweto, Tembisa, Katlehong & more' },
  { icon: '🌍', value: '2', unit: 'active centres', note: 'Hammanskraal & Klerksdorp' },
];

/* ─── Testimonials — replace with real quotes ────────────────────── */
const TESTIMONIALS = [
  {
    quote: 'Placeholder testimonial — replace with a real story from a township devotee or community member.',
    name: 'Devotee name',
    location: 'Township, Gauteng',
  },
  {
    quote: 'Placeholder testimonial — replace with a real story from someone who received Prasadam or attended a kirtan.',
    name: 'Community member',
    location: 'Township, Gauteng',
  },
];

/* ─── Quarterly Update — edit the text block below ───────────────── */
const QUARTERLY_UPDATE = {
  period: 'Q2 2026 (April – June)',
  highlights: [
    'Continued Kasi Kirtan outreach across Soweto and Tembisa.',
    'Inter-Faith Symposium planned for 15 August 2026 at Katlegong Resource Centre.',
    'Book translation project for Zulu and Tswana editions underway with BBT Africa.',
    'Bhakti Connect App design phase in progress.',
  ],
  note: 'This section is updated each quarter. Edit the QUARTERLY_UPDATE constant in ImpactPage.tsx to reflect current activities.',
};

export default function ImpactPage() {
  usePageTitle('Impact & Stories');
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-cream">

      {/* ── Nav ──────────────────────────────────────────────────── */}
      <header className="bg-[#fffdf8] border-b border-paper shadow-sm sticky top-0 z-40 h-[64px] flex items-center">
        <div className="container mx-auto px-4 md:px-12 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={gasLogo} alt="Golden Age Society" className="w-10 h-[44px] object-contain" />
            <span className="font-serif text-wine text-base leading-tight font-semibold hidden sm:block">Golden Age<br/>Society</span>
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-sm text-text/60 hover:text-wine transition-colors">← Home</button>
            <button onClick={() => navigate('/donate')} className="px-4 py-2 bg-wine text-cream rounded-full text-sm font-semibold hover:bg-plum transition-colors">♡ Donate</button>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="bg-wine py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `repeating-radial-gradient(circle at center, transparent 0, transparent 30px, rgba(251,178,38,0.4) 30px, rgba(251,178,38,0.4) 31px)` }} />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 text-gold text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            ✦ Making the Mission Visible
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-cream mb-4 leading-tight">
            Impact & <em className="text-gold">Stories</em>
          </h1>
          <p className="text-cream/80 text-lg max-w-xl mx-auto leading-relaxed">
            Every meal served, every kirtan held, every book distributed is a spark of the Golden Age. Here is what GAS has accomplished — and where it is going.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-12 py-16 space-y-16">

        {/* ── Stat blocks ──────────────────────────────────────── */}
        <div>
          <div className="text-center mb-10">
            <div className="kicker mb-3">By the numbers</div>
            <h2 className="font-serif text-3xl md:text-4xl text-wine">Our reach so far</h2>
            <p className="text-text/55 text-sm mt-2">Stats will be updated as verified figures are confirmed.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {STATS.map((stat, i) => (
              <motion.div key={stat.unit} {...fadeUp(i * 0.07)}
                className="bg-white rounded-2xl border border-gold/15 p-5 md:p-6 text-center hover:shadow-md hover:border-gold/35 transition-all">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="font-serif text-3xl md:text-4xl text-wine font-bold mb-1">{stat.value}</div>
                <div className="text-sm font-semibold text-text/70 mb-1">{stat.unit}</div>
                <div className="text-[11px] text-text/40 leading-tight">{stat.note}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Quarterly Update ─────────────────────────────────── */}
        <motion.div {...fadeUp(0.1)} className="bg-gradient-to-br from-wine/5 to-gold/5 border-2 border-gold/20 rounded-2xl p-8">
          <div className="flex items-start gap-4 mb-6">
            <span className="text-3xl">📋</span>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-wine/60 mb-0.5">Quarterly Impact Update</div>
              <h3 className="font-serif text-2xl text-wine">{QUARTERLY_UPDATE.period}</h3>
            </div>
          </div>
          <ul className="space-y-3 mb-5">
            {QUARTERLY_UPDATE.highlights.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text/75 leading-relaxed">
                <span className="text-gold mt-0.5 flex-shrink-0">✦</span>
                {item}
              </li>
            ))}
          </ul>
          <div className="bg-white/60 border border-gold/20 rounded-xl px-4 py-3">
            <p className="text-xs text-text/50 italic leading-relaxed">
              ✏️ {QUARTERLY_UPDATE.note}
            </p>
          </div>
        </motion.div>

        {/* ── Testimonials ─────────────────────────────────────── */}
        <div>
          <div className="text-center mb-10">
            <div className="kicker mb-3">Stories from the field</div>
            <h2 className="font-serif text-3xl md:text-4xl text-wine">Voices of the community</h2>
            <p className="text-text/55 text-sm mt-2 max-w-md mx-auto">
              Replace these placeholders with real testimonials from township devotees and community members.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="bg-white rounded-2xl border border-gold/15 p-6 shadow-sm">
                {/* Photo placeholder */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-wine/10 to-gold/10 border border-gold/20 flex items-center justify-center mb-4">
                  <span className="text-2xl">🙏</span>
                </div>
                <blockquote className="text-sm text-text/70 leading-relaxed italic mb-4 border-l-2 border-gold/40 pl-4">
                  "{t.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-wine text-sm">{t.name}</div>
                  <div className="text-xs text-text/50">{t.location}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Photo gallery placeholder ─────────────────────────── */}
        <div>
          <div className="text-center mb-8">
            <div className="kicker mb-3">From the field</div>
            <h2 className="font-serif text-3xl text-wine">Impact in photos</h2>
            <p className="text-text/55 text-sm mt-2">Real outreach photos coming soon.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-gradient-to-br from-wine/8 to-gold/8 border border-gold/15 flex items-center justify-center">
                <div className="text-center text-text/25">
                  <div className="text-3xl mb-1">🖼</div>
                  <div className="text-xs">Photo {i + 1}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <div className="bg-wine py-14 px-4 text-center">
        <h2 className="font-serif text-3xl text-cream mb-4">Be part of the next chapter.</h2>
        <p className="text-cream/80 mb-8 max-w-md mx-auto">Every donation adds to this story.</p>
        <button onClick={() => navigate('/donate')} className="px-10 py-4 bg-gold text-[#1a0a00] rounded-full font-bold text-base hover:bg-cream transition-colors shadow-xl">
          ♡ Donate now →
        </button>
      </div>
    </div>
  );
}
