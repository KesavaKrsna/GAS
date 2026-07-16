import React from 'react';

const tiles = [
  {
    id: 1,
    title: "Kirtan in the community",
    gradient: "from-orange via-wine to-plum",
    tall: true,
    wide: false,
  },
  {
    id: 2,
    title: "Prasadam with love",
    gradient: "from-gold to-[#e84c22]",
    tall: false,
    wide: false,
  },
  {
    id: 3,
    title: "Celebration & connection",
    gradient: "from-plum to-orange",
    tall: false,
    wide: false,
  },
  {
    id: 4,
    title: "Service in action",
    gradient: "from-[#9e1b2f] to-[#e67a15]",
    tall: false,
    wide: true,
  }
];

export function Gallery() {
  return (
    <section id="gallery" className="py-24 md:py-[105px] bg-[#f5f1e7]">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <div className="text-center mb-16">
          <div className="kicker mb-4">Joy of devotion</div>
          <h2 className="text-4xl md:text-5xl text-wine">
            Glimpses of our <em>golden moments.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1.18fr_1fr_1fr] md:auto-rows-[190px] gap-4">
          {tiles.map((tile) => (
            <div 
              key={tile.id}
              className={`
                relative rounded-2xl overflow-hidden shadow-sm group
                ${tile.tall ? 'md:row-span-2 h-[280px] md:h-auto' : 'h-[190px]'}
                ${tile.wide ? 'md:col-span-2' : ''}
              `}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${tile.gradient} opacity-90 transition-transform duration-700 group-hover:scale-105`} />
              
              {/* Decorative rings */}
              <div 
                className="absolute inset-0 opacity-10 mix-blend-overlay transition-opacity group-hover:opacity-20"
                style={{
                  backgroundImage: `repeating-radial-gradient(circle at center, transparent 0, transparent 20px, rgba(255,255,255,0.4) 20px, rgba(255,255,255,0.4) 21px)`
                }}
              />

              {/* Gold dot */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-2 h-2 bg-gold rounded-full shadow-[0_0_10px_rgba(251,178,38,0.8)]" />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end">
                <h3 className="text-cream font-serif text-xl md:text-2xl font-medium tracking-wide drop-shadow-md">
                  {tile.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}