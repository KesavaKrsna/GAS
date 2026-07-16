import React from 'react';
import { Link } from 'wouter';
import gasLogo from '@assets/gas-logo.png';

export function Spotlight() {
  return (
    <section id="stories" className="py-24 md:py-[105px] bg-cream">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          
          {/* Decorative Art Panel */}
          <div className="relative w-full h-[390px] rounded-[2rem] overflow-hidden shadow-xl order-2 md:order-1 flex items-center justify-center group">
            
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#fbb226_0%,_#ee6424_40%,_#751c2b_80%,_#39121f_100%)] transition-transform duration-700 group-hover:scale-105" />
            
            <div 
              className="absolute inset-0 opacity-15 mix-blend-overlay transition-transform duration-1000 group-hover:rotate-3"
              style={{
                backgroundImage: `repeating-radial-gradient(circle at center, transparent 0, transparent 15px, rgba(251, 178, 38, 0.4) 15px, rgba(251, 178, 38, 0.4) 16px)`
              }}
            />

            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-4xl text-gold drop-shadow-lg">✦</div>
            
            <img 
              src={gasLogo} 
              alt="" 
              className="w-[245px] h-[250px] object-contain relative z-10 filter brightness-[8] drop-shadow-xl opacity-90 transition-all duration-500 group-hover:scale-105"
            />

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-plum to-transparent">
              <div className="text-center text-[0.65rem] uppercase tracking-[0.2em] text-cream/90 font-semibold mb-2">
                Kirtan brings us together
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="order-1 md:order-2">
            <div className="kicker mb-5">Outreach spotlight</div>
            <h2 className="text-4xl md:text-5xl text-wine mb-6">
              When the streets begin to <em>sing.</em>
            </h2>
            <p className="text-lg text-text/80 leading-relaxed mb-8">
              Every Saturday, the vibrant sounds of mridangam drums and kartals echo through the city center. What starts as a small group singing the Hare Krishna mantra soon becomes a spontaneous festival. Passersby stop, listen, and find themselves joining in the timeless rhythm of pure joy.
            </p>
            <Link 
              href="#stories" 
              className="inline-flex items-center gap-2 font-serif text-lg text-wine font-semibold pb-1 border-b-2 border-gold/40 hover:border-gold transition-colors"
            >
              Read our stories <span>→</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}