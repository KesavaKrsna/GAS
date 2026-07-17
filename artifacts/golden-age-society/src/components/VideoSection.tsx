import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

import v1 from '@assets/gas_media/videos/gas_kirtan_01.mp4';
import v2 from '@assets/gas_media/videos/gas_kirtan_02.mp4';
import v3 from '@assets/gas_media/videos/gas_kirtan_03.mp4';
import v4 from '@assets/gas_media/videos/gas_kirtan_04.mp4';
import v5 from '@assets/gas_media/videos/gas_event_01.mp4';
import v6 from '@assets/gas_media/videos/gas_event_02.mp4';
import v7 from '@assets/gas_media/videos/gas_event_03.mp4';

const videos = [
  { src: v1, title: 'Kirtan in the streets',        caption: 'Hare Krishna kirtan — the sound of devotion' },
  { src: v2, title: 'Community gathering',           caption: 'Coming together in joy and service' },
  { src: v3, title: 'Mantra meditation',             caption: 'The transformative power of chanting' },
  { src: v4, title: 'Prasadam distribution',         caption: 'Feeding the community with love' },
  { src: v5, title: 'Festival celebration',          caption: 'Joy in the heart of the city' },
  { src: v6, title: 'Sacred worship',                caption: 'Devotional service in practice' },
  { src: v7, title: 'GAS outreach',                  caption: 'Bringing bhakti to every heart' },
];

function VideoCard({ src, title, caption, index }: { src: string; title: string; caption: string; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative rounded-xl overflow-hidden bg-plum shadow-lg"
    >
      <div className="relative aspect-video">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover"
          playsInline
          preload="metadata"
          onEnded={() => setPlaying(false)}
          controls={playing}
        />

        {/* Play overlay — shown when paused */}
        {!playing && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center bg-plum/50 cursor-pointer group-hover:bg-plum/40 transition-colors"
            onClick={togglePlay}
          >
            <div className="w-14 h-14 rounded-full bg-wine/90 border border-gold/40 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-cream ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <h4 className="font-serif text-gold text-base font-semibold mb-1">{title}</h4>
        <p className="text-cream/60 text-xs tracking-wide">{caption}</p>
      </div>
    </motion.div>
  );
}

export function VideoSection() {
  return (
    <section id="videos" className="py-24 md:py-[105px] bg-plum">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        {/* Heading */}
        <div className="text-center mb-14">
          <div className="kicker mb-4 !text-gold">Living bhakti</div>
          <h2 className="text-4xl md:text-5xl text-cream">
            The sound of <em className="text-gold">devotion.</em>
          </h2>
          <p className="mt-4 text-cream/60 max-w-xl mx-auto text-base leading-relaxed">
            Experience the heart of Golden Age Society through kirtan, prasadam, and sacred community moments captured live.
          </p>
        </div>

        {/* Video grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((v, i) => (
            <VideoCard key={i} {...v} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
