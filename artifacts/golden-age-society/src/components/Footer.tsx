import React from 'react';
import { useLocation } from 'wouter';
import gasLogo from '@assets/gas-logo.png';

interface FooterProps {
  onSponsorClick: () => void;
}

export function Footer({ onSponsorClick }: FooterProps) {
  const [, navigate] = useLocation();

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) window.scrollTo({ top: element.offsetTop, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-[#32111e] text-[#fffdf7] pt-20 pb-8">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 md:gap-6 mb-16">

          {/* Brand Col */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <img
              src={gasLogo}
              alt="Golden Age Society"
              className="w-[88px] h-[88px] object-contain mb-5 filter brightness-[8] opacity-90"
            />
            <p className="font-serif text-xl text-gold italic max-w-[260px] leading-snug mb-4">
              Where bhakti sparks become flames.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-1">
              <a href="https://wa.me/27000000000" target="_blank" rel="noopener noreferrer"
                title="WhatsApp"
                className="w-9 h-9 rounded-full bg-white/8 border border-white/10 flex items-center justify-center hover:bg-gold/20 hover:border-gold/40 transition-all text-base">
                💬
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                title="Facebook"
                className="w-9 h-9 rounded-full bg-white/8 border border-white/10 flex items-center justify-center hover:bg-gold/20 hover:border-gold/40 transition-all text-base">
                📘
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                title="Instagram"
                className="w-9 h-9 rounded-full bg-white/8 border border-white/10 flex items-center justify-center hover:bg-gold/20 hover:border-gold/40 transition-all text-base">
                📷
              </a>
            </div>
          </div>

          {/* Explore Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-gold font-serif text-xl mb-5">Explore</h4>
            <ul className="space-y-3 text-[14px] text-cream/80">
              <li>
                <button onClick={() => scrollTo('mission')} className="hover:text-gold transition-colors">Our mission</button>
              </li>
              <li>
                <button onClick={() => navigate('/programs')} className="hover:text-gold transition-colors">Programs</button>
              </li>
              <li>
                <button onClick={() => navigate('/temples')} className="hover:text-gold transition-colors">Temples & Locations</button>
              </li>
              <li>
                </li>
              <li>
                <button onClick={() => navigate('/impact')} className="hover:text-gold transition-colors">Impact & Stories</button>
              </li>
              <li>
                <button onClick={() => navigate('/newsletter')} className="hover:text-gold transition-colors">Newsletter</button>
              </li>
            </ul>
          </div>

          {/* Contact Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-gold font-serif text-xl mb-5">Contact</h4>
            <ul className="space-y-3 text-[14px] text-cream/80">
              <li>
                <a href="mailto:ocsacademy2020@gmail.com" className="hover:text-gold transition-colors break-all">
                  ocsacademy2020@gmail.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/27000000000" target="_blank" rel="noopener noreferrer"
                  className="hover:text-gold transition-colors flex items-center gap-1.5">
                  <span>💬</span> WhatsApp us
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                  className="hover:text-gold transition-colors flex items-center gap-1.5">
                  <span>📘</span> Facebook
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                  className="hover:text-gold transition-colors flex items-center gap-1.5">
                  <span>📷</span> Instagram
                </a>
              </li>
            </ul>
          </div>

          {/* Give */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-gold font-serif text-xl mb-5">Give</h4>
            <ul className="space-y-3 text-[14px] text-cream/80">
              <li>
                <button onClick={onSponsorClick} className="hover:text-gold transition-colors font-medium">
                  ♡ Donate
                </button>
              </li>
              <li>
                <button onClick={onSponsorClick} className="hover:text-gold transition-colors">
                  Bhakti Builder (monthly)
                </button>
              </li>
              <li>
                <button onClick={onSponsorClick} className="hover:text-gold transition-colors">
                  Corporate CSI partner
                </button>
              </li>
              <li>
                <a href="mailto:ocsacademy2020@gmail.com?subject=Volunteering" className="hover:text-gold transition-colors">
                  Volunteer with us
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-[#db7d92]/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-[#db7d92]/60 font-medium text-center md:text-left space-y-0.5">
            <p>© 2026 Golden Age Society. Made with devotion.</p>
            <p className="text-[11px] text-[#db7d92]/40">No.5 Fourth Avenue, Edenvale 1609, South Africa · PBO No. 930070132</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {[
              { label: 'Terms of Use',   slug: 'terms'   },
              { label: 'Privacy Policy', slug: 'privacy' },
              { label: 'Refund Policy',  slug: 'refunds' },
              { label: 'Contact',        slug: 'contact' },
            ].map(({ label, slug }) => (
              <button
                key={slug}
                onClick={() => navigate(`/legal/${slug}`)}
                className="text-xs text-[#db7d92]/50 hover:text-gold transition-colors"
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

      </div>
    </footer>
  );
}
