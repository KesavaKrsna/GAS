import React from 'react';

export function EventSection() {
  return (
    <section className="py-24 md:py-[105px] bg-wine relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-plum/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6 md:px-12 max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
          
          {/* Decorative element */}
          <div className="hidden md:flex shrink-0 w-24 h-24 rounded-full border-2 border-gold/30 items-center justify-center">
            <span className="text-4xl text-gold font-serif pb-1">✦</span>
          </div>

          {/* Text block */}
          <div className="flex-1 max-w-2xl">
            <div className="kicker !text-gold mb-4">Come as you are</div>
            <h2 className="text-4xl md:text-5xl text-cream mb-6">
              Join our next <em>gathering.</em>
            </h2>
            <p className="text-lg text-cream/80 leading-relaxed md:pr-8">
              We gather every Sunday for uplifting kirtan, philosophical discussion, and a bountiful vegetarian feast. Whether you are a lifelong practitioner or simply curious, there is a place for you here.
            </p>
          </div>

          {/* CTA */}
          <div className="shrink-0 w-full md:w-auto">
            <a 
              href="mailto:ocsacademy2020@gmail.com"
              className="inline-flex items-center justify-center px-8 py-4 bg-cream text-wine rounded-full text-lg font-bold hover:bg-gold hover:text-wine transition-all shadow-xl group w-full md:w-auto"
            >
              Get in touch 
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}