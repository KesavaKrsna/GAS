import React from 'react';

const PHRASES = [
  'Hare Krishna',
  'Love in action',
  'All hearts welcome',
  'Every town and village',
  'Where bhakti sparks become flames',
  'Township-led · African-rooted',
  'Harinam · Prasadam · Books',
];

export function MantraMarquee({ dark = false }: { dark?: boolean }) {
  const items = [...PHRASES, ...PHRASES];
  return (
    <div
      className={`relative overflow-hidden border-y ${
        dark
          ? 'bg-plum border-gold/20'
          : 'bg-gradient-to-r from-wine via-[#8a2233] to-orange border-gold/30'
      }`}
    >
      <div className="flex w-max animate-marquee py-3">
        {items.map((phrase, i) => (
          <span
            key={`${phrase}-${i}`}
            className="flex items-center gap-5 px-5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-gold whitespace-nowrap"
          >
            <span className="text-cream/80">{phrase}</span>
            <span className="text-gold/70" aria-hidden>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
