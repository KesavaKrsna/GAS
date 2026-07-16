import React from 'react';

interface ImpactProps {
  onSponsorClick: () => void;
}

const stats = [
  { value: "28,500", label: "Meals shared" },
  { value: "12,400", label: "Hearts inspired" },
  { value: "47", label: "Community gatherings", noPlus: true },
  { value: "320", label: "Active volunteers", noPlus: true }
];

export function Impact({ onSponsorClick }: ImpactProps) {
  return (
    <section className="py-24 md:py-[105px] bg-[#efe9d9] border-y border-gold/10">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Col */}
          <div>
            <div className="kicker mb-5">Our reach</div>
            <h2 className="text-4xl md:text-5xl text-wine mb-6">
              One spark can <em>light a thousand lamps.</em>
            </h2>
            <p className="text-lg text-text/80 leading-relaxed mb-10">
              Every gathering, every plate of prasadam, and every mantra chanted creates a ripple of positive change in the world. With the support of our generous community, the flame of devotion continues to spread, warming countless hearts.
            </p>
            <button 
              onClick={onSponsorClick}
              className="px-8 py-3.5 bg-wine text-cream rounded-full text-base font-medium hover:bg-plum transition-colors shadow-sm inline-flex items-center gap-2 group"
            >
              Sponsor the movement 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          {/* Right Col */}
          <div className="bg-paper rounded-2xl overflow-hidden shadow-sm relative">
            {/* Inner Grid */}
            <div className="grid grid-cols-2 gap-[1px] bg-gold/20">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-paper p-8 md:p-12 flex flex-col justify-center items-center text-center">
                  <div className="text-4xl md:text-[2.75rem] font-serif text-wine mb-2 font-bold flex items-baseline">
                    {stat.value}
                    {!stat.noPlus && <span className="text-orange ml-1 text-2xl">+</span>}
                  </div>
                  <div className="text-sm uppercase tracking-widest text-text/60 font-semibold mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}