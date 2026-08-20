import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SparkField } from './visual/SparkField';

interface ImpactProps {
  onSponsorClick: () => void;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as const },
});

function VideoCard({
  src,
  title,
  description,
  delay = 0,
}: {
  src: string;
  title: string;
  description: string;
  delay?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <motion.div {...fadeUp(delay)} className="flex flex-col gap-4">
      <div
        className="relative rounded-[1.75rem] overflow-hidden bg-wine/10 cursor-pointer group foil-frame"
        style={{ aspectRatio: '16/9' }}
        onClick={toggle}
      >
        <video ref={videoRef} className="w-full h-full object-cover" playsInline preload="none" onEnded={() => setPlaying(false)}>
          <source src={src} type="video/mp4" />
        </video>
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
          }`}
          style={{ background: playing ? 'rgba(0,0,0,0.15)' : 'rgba(20,8,13,0.38)' }}
        >
          <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center shadow-lg gold-glow">
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
        <h3 className="font-serif text-xl text-cream mb-1">{title}</h3>
        <p className="text-sm text-cream/70 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShown(true);
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center py-5">
      <div
        className={`text-4xl md:text-5xl font-serif font-bold text-gold mb-2 transition-all duration-700 ${
          shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}
      >
        {value}
      </div>
      <div className="text-xs uppercase tracking-[0.18em] text-cream/65 font-semibold">{label}</div>
    </div>
  );
}

export function Impact({ onSponsorClick }: ImpactProps) {
  return (
    <section className="relative py-24 md:py-[110px] bg-plum overflow-hidden grain">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(251,178,38,0.22),_transparent_55%)]" />
      <SparkField />
      <div className="container relative z-10 mx-auto px-6 md:px-12 max-w-6xl">
        <div className="text-center mb-14">
          <motion.div {...fadeUp(0)} className="kicker !text-gold mb-4">
            Our reach
          </motion.div>
          <motion.h2 {...fadeUp(0.08)} className="text-4xl md:text-6xl text-cream mb-5">
            One spark can <em>light a thousand lamps.</em>
          </motion.h2>
          <motion.p {...fadeUp(0.14)} className="text-lg text-cream/75 leading-relaxed max-w-2xl mx-auto">
            Every gathering, every plate of prasadam, and every mantra chanted creates a ripple of positive change.
            With the support of our generous community, the flame of devotion continues to spread across South Africa
            and beyond.
          </motion.p>
        </div>

        <div className="max-w-2xl mx-auto mb-14">
          <VideoCard
            src="/in-every-town.mp4"
            title="In Every Town and Village"
            description="The sankirtana movement spreading across communities — bringing the holy names, devotional culture, and spiritual joy to every corner of South Africa."
            delay={0.05}
          />
        </div>

        <motion.div
          {...fadeUp(0.2)}
          className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-wine/50 backdrop-blur-sm rounded-[1.75rem] p-4 md:p-8 border border-gold/25"
        >
          <AnimatedStat value="~300" label="Fed weekly across SA" />
          <AnimatedStat value="28,500+" label="Meals shared to date" />
          <AnimatedStat value="47" label="Community gatherings" />
          <AnimatedStat value="320+" label="Active volunteers" />
        </motion.div>

        <motion.div {...fadeUp(0.25)} className="text-center mt-12">
          <button onClick={onSponsorClick} className="btn-gold group">
            Sponsor the movement
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
