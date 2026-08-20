import React from 'react';
import { useLocation } from 'wouter';
import gasLogo from '@assets/gas-logo.png';
import { MantraMarquee } from './visual/MantraMarquee';

interface FooterProps {
  onSponsorClick: () => void;
}

export function Footer({ onSponsorClick }: FooterProps) {
  const [, navigate] = useLocation();

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) window.scrollTo({ top: element.offsetTop - 72, behavior: 'smooth' });
    else navigate(`/#${id}`);
  };

  return (
    <footer id="contact" className="bg-[#2a0d18] text-[#fffdf7]">
      <MantraMarquee dark />
      <div className="container mx-auto px-6 md:px-12 max-w-6xl pt-20 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 md:gap-6 mb-16">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <img
              src={gasLogo}
              alt="Golden Age Society"
              className="w-[88px] h-[88px] object-contain mb-5 filter brightness-[8] opacity-90"
            />
            <p className="font-serif text-2xl text-gold italic max-w-[280px] leading-snug mb-4">
              Where bhakti sparks become flames.
            </p>
            <div className="flex items-center gap-3 mt-1">
              {[
                { href: 'https://wa.me/27000000000', label: 'WhatsApp' },
                { href: 'https://facebook.com', label: 'Facebook' },
                { href: 'https://instagram.com', label: 'Instagram' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  className="px-3 h-9 rounded-full bg-white/8 border border-gold/20 flex items-center justify-center hover:bg-gold/20 hover:border-gold/40 transition-all text-xs font-medium text-cream"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-gold font-serif text-xl mb-5">Explore</h4>
            <ul className="space-y-3 text-[14px] text-cream/80">
              <li>
                <button onClick={() => scrollTo('mission')} className="hover:text-gold transition-colors">
                  Our mission
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/programs')} className="hover:text-gold transition-colors">
                  Programs
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/temples')} className="hover:text-gold transition-colors">
                  Temples & Locations
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/impact')} className="hover:text-gold transition-colors">
                  Impact & Stories
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/newsletter')} className="hover:text-gold transition-colors">
                  Newsletter
                </button>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-gold font-serif text-xl mb-5">Contact</h4>
            <ul className="space-y-3 text-[14px] text-cream/80">
              <li>
                <a href="mailto:ocsacademy2020@gmail.com" className="hover:text-gold transition-colors break-all">
                  ocsacademy2020@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/27000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  WhatsApp us
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>

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

        <div className="border-t border-gold/15 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-cream/45 font-medium text-center md:text-left space-y-0.5">
            <p>© 2026 Golden Age Society. Made with devotion.</p>
            <p className="text-[11px] text-cream/30">
              No.5 Fourth Avenue, Edenvale 1609, South Africa · PBO No. 930070132
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {[
              { label: 'Terms of Use', slug: 'terms' },
              { label: 'Privacy Policy', slug: 'privacy' },
              { label: 'Refund Policy', slug: 'refunds' },
              { label: 'Contact', slug: 'contact' },
            ].map(({ label, slug }) => (
              <button
                key={slug}
                onClick={() => navigate(`/legal/${slug}`)}
                className="text-xs text-cream/40 hover:text-gold transition-colors"
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
