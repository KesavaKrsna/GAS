import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface ImpactProps {
  onSponsorClick: () => void;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

function VideoCard({
  src,
  poster,
  title,
  description,
  delay = 0,
}: {
  src: string;
  poster?: string;
  title: string;
  description: string;
  delay?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  return (
    <motion.div {...fadeUp(delay)} className="flex flex-col gap-4">
      <div
        className="relative rounded-2xl overflow-hidden bg-wine/10 cursor-pointer group shadow-md"
        style={{ aspectRatio: '16/9' }}
        onClick={toggle}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          preload="none"
          onEnded={() => setPlaying(false)}
        >
          <source src={src} type="video/mp4" />
        </video>
        {/* Play/pause overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
          }`}
          style={{ background: playing ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.32)' }}
        >
          <div className="w-14 h-14 rounded-full bg-gold/90 flex items-center justify-center shadow-lg">
            {playing ? (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-wine">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-wine ml-1">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-serif text-lg text-wine mb-1">{title}</h3>
        <p className="text-sm text-text/70 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

export function Impact({ onSponsorClick }: ImpactProps) {
  return (
    <section className="py-24 md:py-[105px] bg-[#efe9d9] border-y border-gold/10">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.div {...fadeUp(0)} className="kicker mb-4">Our reach</motion.div>
          <motion.h2 {...fadeUp(0.08)} className="text-4xl md:text-5xl text-wine mb-5">
            One spark can <em>light a thousand lamps.</em>
          </motion.h2>
          <motion.p {...fadeUp(0.14)} className="text-lg text-text/75 leading-relaxed max-w-2xl mx-auto">
            Every gathering, every plate of prasadam, and every mantra chanted creates a ripple of
            positive change. With the support of our generous community, the flame of devotion
            continues to spread across South Africa and beyond.
          </motion.p>
        </div>

        {/* Video */}
        <div className="max-w-2xl mx-auto mb-14">
          <VideoCard
            src="/in-every-town.mp4"
            title="In Every Town and Village"
            description="The sankirtana movement spreading across communities — bringing the holy names, devotional culture, and spiritual joy to every corner of South Africa."
            delay={0.05}
          />
        </div>

        {/* Stats row */}
        <motion.div
          {...fadeUp(0.2)}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-paper rounded-2xl p-6 md:p-10 shadow-sm border border-gold/10"
        >
          {[
            { value: '~300', label: 'Fed weekly in Klerksdorp' },
            { value: '28,500+', label: 'Meals shared to date' },
            { value: '47', label: 'Community gatherings' },
            { value: '320+', label: 'Active volunteers' },
          ].map((stat, i) => (
            <div key={i} className="text-center py-4">
              <div className="text-3xl md:text-4xl font-serif font-bold text-wine mb-1">{stat.value}</div>
              <div className="text-xs uppercase tracking-widest text-text/55 font-semibold">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div {...fadeUp(0.25)} className="text-center mt-10">
          <button
            onClick={onSponsorClick}
            className="px-8 py-3.5 bg-wine text-cream rounded-full text-base font-medium hover:bg-plum transition-colors shadow-sm inline-flex items-center gap-2 group"
          >
            Sponsor the movement
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </motion.div>

      </div>
    </section>
  );
}
