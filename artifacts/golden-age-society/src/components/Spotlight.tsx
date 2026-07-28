import React from 'react';
import { motion } from 'framer-motion';
import prabhupadaImg from '@assets/Srila_Prabhupada_1784293998582.png';

export function Spotlight() {
  return (
    <section id="stories" className="py-24 md:py-[105px] bg-cream">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Photo Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-[420px] rounded-[2rem] overflow-hidden shadow-2xl order-2 md:order-1 group"
          >
            <img
              src={prabhupadaImg}
              alt="His Divine Grace A.C. Bhaktivedanta Swami Srila Prabhupada"
              className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-plum/80 via-wine/10 to-transparent" />
            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-3xl text-gold drop-shadow-lg select-none">✦</div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-plum via-plum/80 to-transparent pt-12">
              <div className="text-center text-[0.65rem] uppercase tracking-[0.2em] text-cream/90 font-bold">
                His Divine Grace A.C. Bhaktivedanta Swami Srila Prabhupada
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 md:order-2"
          >
            <div className="kicker mb-5">Our commitment</div>
            <h2 className="text-4xl md:text-5xl text-wine mb-6">
              Service with <em>integrity.</em>
            </h2>
            <p className="text-base md:text-lg text-text/80 leading-relaxed mb-8">
              We are dedicated to advancing the mission of{' '}
              <strong className="text-wine">His Divine Grace A.C. Bhaktivedanta Swami Srila Prabhupada</strong>{' '}
              through compassionate service, responsible stewardship, and unwavering integrity. Every
              donation, every programme, and every volunteer effort is managed with transparency,
              accountability, and a commitment to creating lasting spiritual and social impact.
              Our beneficiaries, donors, and partners can trust that we honour every contribution
              as a sacred responsibility in the service of Krishna and humanity.
            </p>
            <a
              href="mailto:hello@goldenagesociety.org?subject=Golden%20Age%20Society%20stories"
              className="inline-flex items-center gap-2 font-serif text-lg text-wine font-semibold pb-1 border-b-2 border-gold/40 hover:border-gold transition-colors"
            >
              Get in touch <span className="text-xl">→</span>
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
