import React from 'react';
import { motion } from 'framer-motion';

const VALUES = [
  {
    title: 'Bhakti in every township',
    body: 'African-led centres of Krishna Consciousness — not visiting programmes, but homes of devotion that belong to the community.',
    accent: 'from-wine to-plum',
    num: '01',
  },
  {
    title: 'The holy names, aloud',
    body: 'Harinam and Kasi Kirtan take the mahā-mantra into the street, the schoolyard, and the kasi — joy as public worship.',
    accent: 'from-orange to-wine',
    num: '02',
  },
  {
    title: 'Food as a sacred offering',
    body: 'Every plate of prasadam nourishes body and soul. Hunger is met with love, not leftover charity.',
    accent: 'from-[#9a2a3c] to-orange',
    num: '03',
  },
  {
    title: 'Wisdom in African tongues',
    body: "Prabhupāda's books in Zulu, Sotho, Tswana, Pedi, Xhosa, and Afrikaans — so no language stands between a seeker and the truth.",
    accent: 'from-plum to-wine',
    num: '04',
  },
];

export function StandFor() {
  return (
    <section className="relative py-20 md:py-28 bg-plum overflow-hidden grain">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(238,100,36,0.28),_transparent_50%),radial-gradient(ellipse_at_top_right,_rgba(251,178,38,0.18),_transparent_45%)]" />
      <div className="container relative z-10 mx-auto px-6 md:px-12 max-w-6xl">
        <div className="max-w-2xl mb-12 md:mb-16">
          <div className="kicker !text-gold mb-4">What we stand for</div>
          <h2 className="text-4xl md:text-5xl text-cream mb-5">
            A Golden Age that is <em>lived,</em> not lectured.
          </h2>
          <p className="text-cream/75 text-lg leading-relaxed">
            GAS exists so Lord Caitanya's 10,000-year Golden Age takes root in African townships —
            through sound, food, books, and communities that belong to the people who live there.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {VALUES.map((v, i) => (
            <motion.article
              key={v.num}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const }}
              className={`relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${v.accent} p-7 md:p-8 border border-gold/20`}
            >
              <span className="font-serif text-5xl text-gold/25 absolute top-4 right-6 leading-none">
                {v.num}
              </span>
              <h3 className="font-serif text-2xl text-cream mb-3 pr-16">{v.title}</h3>
              <p className="text-cream/80 leading-relaxed">{v.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
