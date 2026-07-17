import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Main gallery images
import img1 from '@assets/gas_media/gallery/IMG_20211228_141457.jpg';
import img2 from '@assets/gas_media/gallery/1575.jpeg';
import img3 from '@assets/gas_media/gallery/5301.jpeg';
import img4 from '@assets/gas_media/gallery/1000030770.jpeg';
import img5 from '@assets/gas_media/gallery/1238.jpeg';
import img6 from '@assets/gas_media/gallery/1000036976.jpeg';

// Colour fest images
import cf1 from '@assets/gas_media/colour_fest/IMG_0883.jpg';
import cf2 from '@assets/gas_media/colour_fest/IMG_0841.jpg';
import cf3 from '@assets/gas_media/colour_fest/IMG_0862.jpg';
import cf4 from '@assets/gas_media/colour_fest/IMG_0845.jpg';
import cf5 from '@assets/gas_media/colour_fest/IMG_0849.jpg';
import cf6 from '@assets/gas_media/colour_fest/IMG_0839.jpg';
import cf7 from '@assets/gas_media/colour_fest/IMG_0875.jpg';
import cf8 from '@assets/gas_media/colour_fest/IMG_0850.jpg';

const mainTiles = [
  { id: 1, src: img1, title: 'Kirtan in the community', tall: true, wide: false },
  { id: 2, src: img2, title: 'Prasadam with love',       tall: false, wide: false },
  { id: 3, src: img3, title: 'Celebration & connection', tall: false, wide: false },
  { id: 4, src: img4, title: 'Service in action',        tall: false, wide: true  },
  { id: 5, src: img5, title: 'Sacred gathering',         tall: false, wide: false },
  { id: 6, src: img6, title: 'Community devotion',       tall: false, wide: false },
];

const colourFestPhotos = [cf1, cf2, cf3, cf4, cf5, cf6, cf7, cf8];

function LightboxModal({ src, title, onClose }: { src: string; title: string; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-plum/90 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-4xl w-full max-h-[90vh]"
          onClick={e => e.stopPropagation()}
        >
          <img src={src} alt={title} className="w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-plum to-transparent rounded-b-xl">
            <p className="text-cream text-sm font-semibold text-center tracking-wide">{title}</p>
          </div>
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 w-9 h-9 rounded-full bg-wine text-cream flex items-center justify-center shadow-lg hover:bg-wine/80 transition-colors text-lg leading-none"
          >
            ×
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function Gallery() {
  const [lightbox, setLightbox] = useState<{ src: string; title: string } | null>(null);

  return (
    <section id="gallery" className="py-24 md:py-[105px] bg-[#f5f1e7]">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        {/* Heading */}
        <div className="text-center mb-14">
          <div className="kicker mb-4">Joy of devotion</div>
          <h2 className="text-4xl md:text-5xl text-wine">
            Glimpses of our <em>golden moments.</em>
          </h2>
        </div>

        {/* Main gallery grid */}
        <div className="grid grid-cols-2 md:grid-cols-[1.18fr_1fr_1fr] md:auto-rows-[200px] gap-3 md:gap-4">
          {mainTiles.map((tile, i) => (
            <motion.div
              key={tile.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`
                relative rounded-xl overflow-hidden shadow-sm group cursor-pointer
                ${tile.tall ? 'md:row-span-2 row-span-2 h-[380px] md:h-auto' : 'h-[180px] md:h-auto'}
                ${tile.wide ? 'col-span-2 md:col-span-2' : ''}
              `}
              onClick={() => setLightbox({ src: tile.src, title: tile.title })}
            >
              <img
                src={tile.src}
                alt={tile.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-plum/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-cream text-xs md:text-sm font-bold uppercase tracking-wider drop-shadow-md">
                  {tile.title}
                </span>
              </div>
              {/* Zoom hint */}
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-cream text-xs">
                ⊕
              </div>
            </motion.div>
          ))}
        </div>

        {/* Colour Festival Section */}
        <div className="mt-16 md:mt-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-wine/20" />
            <div className="text-center">
              <div className="kicker mb-1">Holi — Festival of Colour</div>
              <h3 className="text-2xl md:text-3xl font-serif text-wine">
                When devotion bursts into <em>colour.</em>
              </h3>
            </div>
            <div className="h-px flex-1 bg-wine/20" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {colourFestPhotos.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="relative aspect-square rounded-lg overflow-hidden shadow-sm group cursor-pointer"
                onClick={() => setLightbox({ src, title: `Colour Festival — ${i + 1}` })}
              >
                <img
                  src={src}
                  alt={`Colour festival ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-wine/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-cream text-xs">
                  ⊕
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {lightbox && (
        <LightboxModal src={lightbox.src} title={lightbox.title} onClose={() => setLightbox(null)} />
      )}
    </section>
  );
}
