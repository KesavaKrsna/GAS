import React from 'react';
import { SparkField } from './SparkField';
import { MandalaBackdrop } from './LotusMark';

interface PageHeroProps {
  kicker: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHero({ kicker, title, subtitle, children }: PageHeroProps) {
  return (
    <div className="relative overflow-hidden bg-plum grain pt-28 md:pt-32 pb-16 md:pb-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_#fbb226_0%,_#ee6424_28%,_#751c2b_68%,_#39121f_100%)] opacity-80" />
      <MandalaBackdrop />
      <SparkField />
      <div className="relative z-10 container mx-auto px-6 md:px-12 max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/40 text-gold text-[0.68rem] font-semibold uppercase tracking-[0.22em] px-4 py-1.5 rounded-full mb-5">
          ✦ {kicker}
        </div>
        <h1 className="text-4xl md:text-6xl text-cream mb-5 leading-tight">{title}</h1>
        {subtitle && (
          <p className="text-cream/85 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
