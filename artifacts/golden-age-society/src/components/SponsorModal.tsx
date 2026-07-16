import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SponsorModalProps {
  onClose: () => void;
}

const tiers = [
  { amount: 15, label: "Seed" },
  { amount: 35, label: "Flame" },
  { amount: 75, label: "Radiance" }
];

export function SponsorModal({ onClose }: SponsorModalProps) {
  const [selectedAmount, setSelectedAmount] = useState(35);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent scroll when modal open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-plum/80 backdrop-blur-sm cursor-pointer"
      />

      {/* Modal Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-[480px] bg-cream rounded-2xl md:rounded-[2rem] p-8 md:p-[43px] shadow-2xl z-10"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-wine/50 hover:text-wine bg-wine/5 hover:bg-wine/10 p-2 rounded-full transition-colors"
          aria-label="Close"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="kicker mb-4 text-center">Feed the flame</div>
        <h2 className="text-3xl md:text-4xl text-wine mb-4 text-center">
          Sponsor a <em>golden age.</em>
        </h2>
        
        <p className="text-text/75 text-center leading-relaxed mb-8">
          Your monthly sponsorship sustains our sanctuary, funds weekly prasadam distribution, and keeps our spiritual community thriving and accessible to everyone.
        </p>

        <div className="flex flex-row gap-3 mb-8 w-full">
          {tiers.map((tier) => (
            <button
              key={tier.amount}
              onClick={() => setSelectedAmount(tier.amount)}
              className={`flex-1 py-4 flex flex-col items-center justify-center rounded-xl transition-all border-2
                ${selectedAmount === tier.amount 
                  ? 'bg-wine border-wine text-cream shadow-md' 
                  : 'bg-white border-wine/10 text-wine hover:border-wine/30'
                }`}
            >
              <span className="font-serif text-2xl font-bold mb-1">${tier.amount}</span>
              <span className={`text-[11px] uppercase tracking-widest font-bold ${selectedAmount === tier.amount ? 'text-gold' : 'text-text/50'}`}>
                {tier.label}
              </span>
            </button>
          ))}
        </div>

        <a 
          href={`mailto:hello@goldenagesociety.org?subject=Monthly%20Sponsorship:%20$${selectedAmount}/month`}
          onClick={onClose}
          className="w-full py-4 bg-orange text-cream rounded-xl text-lg font-bold hover:bg-[#d95318] transition-colors shadow-lg shadow-orange/20 flex items-center justify-center gap-2 group"
        >
          Continue with ${selectedAmount}/month
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </a>

        <p className="text-center text-xs text-text/40 mt-6 max-w-[280px] mx-auto">
          Clicking continue will open your email client to arrange payment details with our team.
        </p>

      </motion.div>
    </div>
  );
}