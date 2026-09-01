import React from 'react';
import { useLocation } from 'wouter';
import { SparkField } from './visual/SparkField';

export function EventSection() {
  const [, navigate] = useLocation();

  return (
    <section className="py-20 md:py-24 bg-wine relative overflow-hidden grain">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange/25 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
      <SparkField />

      <div className="container relative z-10 mx-auto px-6 md:px-12 max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
          <div className="hidden md:flex shrink-0 w-24 h-24 rounded-full border-2 border-gold/40 items-center justify-center bg-gold/10">
            <span className="text-4xl text-gold font-serif pb-1">✦</span>
          </div>

          <div className="flex-1 max-w-2xl">
            <div className="kicker !text-gold mb-4">Come as you are</div>
            <h2 className="text-4xl md:text-5xl text-cream mb-5">
              Join our next <em>gathering.</em>
            </h2>
            <p className="text-lg text-cream/80 leading-relaxed md:pr-8">
              We gather for uplifting kirtan, philosophical discussion, and a bountiful vegetarian feast. Whether you
              are a lifelong practitioner or simply curious, there is a place for you here.
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto flex flex-col gap-3">
            <a href="mailto:ocsacademy2020@gmail.com" className="btn-gold w-full md:w-auto">
              Get in touch →
            </a>
            <button onClick={() => navigate('/donate')} className="btn-ghost w-full md:w-auto">
              Support a gathering
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
