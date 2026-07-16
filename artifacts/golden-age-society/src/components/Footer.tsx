import React from 'react';
import gasLogo from '@assets/gas-logo.png';

interface FooterProps {
  onSponsorClick: () => void;
}

export function Footer({ onSponsorClick }: FooterProps) {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer id="contact" className="bg-[#32111e] text-[#fffdf7] pt-20 pb-8">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12 md:gap-8 mb-16">
          
          {/* Brand Col */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <img 
              src={gasLogo} 
              alt="Golden Age Society" 
              className="w-[95px] h-[95px] object-contain mb-6 filter brightness-[8] opacity-90"
            />
            <p className="font-serif text-2xl text-gold italic max-w-[280px] leading-snug">
              Where bhakti sparks become flames.
            </p>
          </div>

          {/* Explore Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-gold font-serif text-xl mb-6">Explore</h4>
            <ul className="space-y-4 text-[15px] text-cream/80">
              <li>
                <button onClick={() => scrollTo('mission')} className="hover:text-gold transition-colors">Our mission</button>
              </li>
              <li>
                <button onClick={() => scrollTo('stories')} className="hover:text-gold transition-colors">Stories</button>
              </li>
              <li>
                <button onClick={() => scrollTo('gallery')} className="hover:text-gold transition-colors">Gallery</button>
              </li>
            </ul>
          </div>

          {/* Contact Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-gold font-serif text-xl mb-6">Contact</h4>
            <ul className="space-y-4 text-[15px] text-cream/80">
              <li>
                <a href="mailto:hello@goldenagesociety.org" className="hover:text-gold transition-colors">hello@goldenagesociety.org</a>
              </li>
              <li>
                <a href="mailto:hello@goldenagesociety.org?subject=Join%20a%20gathering" className="hover:text-gold transition-colors">Join a gathering</a>
              </li>
              <li>
                <button onClick={onSponsorClick} className="hover:text-gold transition-colors font-medium">
                  Sponsor GAS
                </button>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-[#db7d92]/20 pt-8 flex flex-col items-center text-center">
          <p className="text-sm text-[#db7d92]/60 font-medium">
            © 2026 Golden Age Society. Made with devotion.
          </p>
        </div>

      </div>
    </footer>
  );
}