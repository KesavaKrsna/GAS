import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocation } from 'wouter';
import gasLogo from '@assets/gas-logo.png';

export function Header() {
  const [location, navigate] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const isHome = location === '/' || location === '';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const observerOptions = { root: null, rootMargin: '-50% 0px -50% 0px', threshold: 0 };
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    ['home', 'mission', 'stories', 'gallery', 'contact'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isHome]);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'mission', label: 'Mission' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  const pageLinks = [
    { label: 'Programs', path: '/programs' },
    { label: 'Temples', path: '/temples' },
    { label: 'Impact', path: '/impact' },
    { label: 'Newsletter', path: '/newsletter' },
  ];

  const goSection = (id: string) => {
    setMobileMenuOpen(false);
    if (isHome) {
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(`/#${id}`);
    }
  };

  const goTo = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const goToDonate = () => {
    setMobileMenuOpen(false);
    navigate('/donate');
  };

  const goHome = () => {
    setMobileMenuOpen(false);
    if (isHome) goSection('home');
    else navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-[0_12px_40px_rgba(57,18,31,0.12)]' : ''
      }`}
    >
      <div className="h-[3px] bg-gradient-to-r from-wine via-gold to-orange" />
      <div className="h-[80px] flex items-center bg-cream/90 backdrop-blur-md border-b border-gold/15">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between h-full gap-3">
          <button onClick={goHome} className="flex items-center gap-3 hover:opacity-90 transition-opacity flex-shrink-0">
            <img src={gasLogo} alt="Golden Age Society" className="w-[48px] h-[54px] object-contain" />
            <span className="font-serif text-wine text-[17px] leading-[1.15] font-semibold hidden lg:block text-left">
              Golden Age
              <br />
              Society
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => goSection(link.id)}
                className={`px-3.5 py-2 rounded-full text-[13px] font-medium transition-colors whitespace-nowrap ${
                  isHome && activeSection === link.id
                    ? 'bg-wine text-cream'
                    : 'text-text hover:text-wine hover:bg-paper'
                }`}
              >
                {link.label}
              </button>
            ))}
            {pageLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => goTo(link.path)}
                className={`px-3.5 py-2 rounded-full text-[13px] font-medium transition-colors whitespace-nowrap ${
                  location === link.path
                    ? 'bg-paper text-wine'
                    : 'text-text hover:text-wine hover:bg-paper'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={goToDonate}
              className="px-4 md:px-5 py-2 bg-gold text-[#1a0a00] rounded-full text-[13px] md:text-[14px] font-semibold hover:bg-orange hover:text-cream transition-colors shadow-[0_6px_18px_rgba(251,178,38,0.4)] flex items-center gap-1.5"
            >
              <span>♡</span>
              <span>Donate</span>
            </button>
            <button
              className="lg:hidden text-wine p-1.5"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-[83px] left-0 right-0 bg-cream shadow-xl border-t border-gold/20 py-4 px-5 flex flex-col gap-1 lg:hidden max-h-[80vh] overflow-y-auto">
          <div className="text-[10px] uppercase tracking-widest text-text/40 font-semibold px-3 pt-2 pb-1">Home</div>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => goSection(link.id)}
              className={`text-left text-base py-2.5 px-3 rounded-xl ${
                isHome && activeSection === link.id ? 'bg-paper text-wine font-medium' : 'text-text'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="text-[10px] uppercase tracking-widest text-text/40 font-semibold px-3 pt-3 pb-1">Explore</div>
          {pageLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => goTo(link.path)}
              className="text-left text-base py-2.5 px-3 rounded-xl text-text hover:bg-paper hover:text-wine transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="text-[10px] uppercase tracking-widest text-text/40 font-semibold px-3 pt-3 pb-1">Connect</div>
          <a
            href="https://wa.me/27000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="text-left text-base py-2.5 px-3 rounded-xl text-text hover:bg-paper hover:text-wine transition-colors"
          >
            WhatsApp
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-left text-base py-2.5 px-3 rounded-xl text-text hover:bg-paper hover:text-wine transition-colors"
          >
            Facebook
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-left text-base py-2.5 px-3 rounded-xl text-text hover:bg-paper hover:text-wine transition-colors"
          >
            Instagram
          </a>
        </div>
      )}
    </header>
  );
}
