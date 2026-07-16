import React from 'react';

const pillars = [
  {
    symbol: "ॐ",
    num: "01",
    title: "Kirtan & Prayer",
    body: "Through collective chanting of the holy names, we awaken the soul's natural joy. This musical meditation clears the heart and brings profound peace, connecting us directly to the divine."
  },
  {
    symbol: "✦",
    num: "02",
    title: "Sacred Prasadam",
    body: "Food prepared with love and offered to the divine becomes spiritualized. Sharing this karma-free, vegetarian feast nourishes both the body and the soul, building deep community bonds."
  },
  {
    symbol: "🪷",
    num: "03",
    title: "Service & Community",
    body: "Bhakti means active devotion. We express our spiritual realization through selfless service to others, creating a warm, inclusive family where every person is valued."
  }
];

export function Mission() {
  return (
    <section id="mission" className="py-24 md:py-[105px] bg-cream">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="kicker mb-4">Our purpose</div>
          <h2 className="text-4xl md:text-5xl text-wine mb-6">
            Pillars of our <em>devotion.</em>
          </h2>
          <p className="text-lg text-text/80 leading-relaxed">
            The Golden Age Society is rooted in the ancient, living tradition of Bhakti Yoga. We create spaces where spiritual practice meets joyful, everyday life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((pillar, idx) => (
            <div 
              key={idx} 
              className="bg-paper rounded-2xl p-8 md:p-10 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="flex justify-between items-start mb-12">
                <div className="text-4xl text-orange font-serif leading-none drop-shadow-sm">{pillar.symbol}</div>
                <div className="text-lg font-serif text-text/20 tracking-wider group-hover:text-gold/50 transition-colors">{pillar.num}</div>
              </div>
              <h3 className="text-2xl text-wine mb-4">{pillar.title}</h3>
              <p className="text-text/75 leading-relaxed text-sm md:text-base">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}