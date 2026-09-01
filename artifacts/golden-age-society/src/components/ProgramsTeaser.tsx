import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

const PROGRAM_CARDS = [
  {
    icon: '🎶',
    title: 'Kasi Kirtan',
    desc: 'Township harinam outreach & Kasi Kirtan Academy',
    image: '/kasi-kirtan-outreach.png',
  },
  {
    icon: '🍲',
    title: 'Krishna Prasadam',
    desc: 'Sanctified food distribution with FFLSA',
    image: '/prasadam-outreach.png',
  },
  {
    icon: '📖',
    title: 'Book Distribution',
    desc: "Prabhupāda's teachings in 6 African languages",
    image: '/book-distribution.png',
  },
  {
    icon: '🤝',
    title: 'Reuniting Devotees',
    desc: 'Kasi Reunions, mentorship & spiritual counselling',
    image: '/reuniting-devotees.png',
  },
  {
    icon: '📱',
    title: 'Bhakti Connect App',
    desc: 'Daily content, events & devotee community — coming soon',
    image: '/bhakti-connect-app.jpg',
  },
  {
    icon: '🛕',
    title: 'Sannyasi Support',
    desc: 'African collaboration with ISKCON Kenya & Ghana',
    image: null,
  },
];

export function ProgramsTeaser() {
  const [, navigate] = useLocation();

  return (
    <section className="py-20 md:py-28 bg-paper relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="kicker mb-3">What we do</div>
            <h2 className="font-serif text-4xl md:text-5xl text-wine mb-4">
              Six Pillars of <em>Outreach</em>
            </h2>
            <p className="text-text/65 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              From township kirtan to digital devotee tools — every pillar serves Lord Caitanya's vision of a Golden
              Age in Africa.
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
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as const }}
              whileHover={{ y: -6, transition: { duration: 0.18 } }}
              className="text-left group relative overflow-hidden rounded-[1.6rem] min-h-[280px] border border-gold/20"
            >
              {card.image ? (
                <img
                  src={card.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-wine via-plum to-orange" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-plum via-plum/55 to-plum/10" />
              <div className="relative z-10 flex flex-col justify-end h-full p-6 min-h-[280px]">
                <span className="text-2xl mb-2">{card.icon}</span>
                <h3 className="font-serif text-2xl text-cream mb-1.5">{card.title}</h3>
                <p className="text-sm text-cream/80 leading-relaxed">{card.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/programs')}
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-wine text-wine rounded-full text-sm font-semibold hover:bg-wine hover:text-cream transition-all"
          >
            Explore all programmes →
          </button>
        </div>
      </div>
    </section>
  );
}
