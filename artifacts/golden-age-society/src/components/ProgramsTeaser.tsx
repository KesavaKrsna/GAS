import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

const PROGRAM_CARDS = [
  {
    icon: '🎶',
    title: 'Kasi Kirtan',
    desc: 'Township harinam outreach & Kasi Kirtan Academy',
  },
  {
    icon: '🍲',
    title: 'Krishna Prasadam',
    desc: 'Sanctified food distribution with FFLSA',
  },
  {
    icon: '📖',
    title: 'Book Distribution',
    desc: "Prabhupāda's teachings in 6 African languages",
  },
  {
    icon: '🤝',
    title: 'Reuniting Devotees',
    desc: 'Kasi Reunions, mentorship & spiritual counselling',
  },
  {
    icon: '📱',
    title: 'Bhakti Connect App',
    desc: 'Daily content, events & devotee community — coming soon',
  },
  {
    icon: '🛕',
    title: 'Sannyasi Support',
    desc: 'African collaboration with ISKCON Kenya & Ghana',
  },
];

export function ProgramsTeaser() {
  const [, navigate] = useLocation();

  return (
    <section className="py-20 md:py-24 bg-paper border-t border-gold/10">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">

        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="kicker mb-3">What we do</div>
            <h2 className="font-serif text-3xl md:text-4xl text-wine mb-4">
              Six Pillars of <em>Outreach</em>
            </h2>
            <p className="text-text/65 text-base max-w-xl mx-auto leading-relaxed">
              From township kirtan to digital devotee tools — every pillar serves Lord Caitanya's vision of a Golden Age in Africa.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROGRAM_CARDS.map((card, i) => (
            <motion.button
              key={card.title}
              onClick={() => navigate('/programs')}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3, transition: { duration: 0.18 } }}
              className="text-left bg-white rounded-2xl border border-gold/15 p-6 hover:border-wine/30 hover:shadow-md transition-all group"
            >
              <div className="text-3xl mb-3">{card.icon}</div>
              <h3 className="font-serif text-lg text-wine mb-1.5 group-hover:text-plum transition-colors">
                {card.title}
              </h3>
              <p className="text-sm text-text/60 leading-relaxed">{card.desc}</p>
            </motion.button>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/programs')}
            className="inline-flex items-center gap-2 px-7 py-3 border-2 border-wine text-wine rounded-full text-sm font-semibold hover:bg-wine hover:text-cream transition-all"
          >
            Explore all six programmes →
          </button>
        </div>

      </div>
    </section>
  );
}
