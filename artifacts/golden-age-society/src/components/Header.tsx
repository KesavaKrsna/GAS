import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocation } from 'wouter';
import gasLogo from '@assets/gas-logo.png';

export function Header() {
  const [, navigate] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = { root: null, rootMargin: '-50% 0px -50% 0px', threshold: 0 };
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(entry.target.id); });
    };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    ['home', 'mission', 'stories', 'gallery', 'contact'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { id: 'home',    label: 'Home' },
    { id: 'mission', label: 'Mission' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  const pageLinks = [
    { label: 'Programs',  path: '/programs' },
    { label: 'Temples',   path: '/temples' },
    { label: 'Events',    path: '/events' },
    { label: 'Impact',    path: '/impact' },
    { label: 'Newsletter', path: '/newsletter' },
  ];

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
  };

  const goTo = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const goToDonate = () => {
    setMobileMenuOpen(false);
    navigate('/donate');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-[80px] flex items-center bg-[#fffdf8] ${isScrolled ? 'shadow-sm' : ''}`}>
      <div className="container mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between h-full gap-3">

        {/* Logo */}
        <button onClick={() => scrollTo('home')} className="flex items-center gap-3 hover:opacity-90 transition-opacity flex-shrink-0">
          <img src={gasLogo} alt="Golden Age Society" className="w-[52px] h-[58px] object-contain" />
          <span className="font-serif text-wine text-[17px] leading-tight font-semibold hidden lg:block">
            Golden Age<br/>Society
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`px-3.5 py-2 rounded-full text-[13px] font-medium transition-colors whitespace-nowrap ${
                activeSection === link.id
                  ? 'bg-[#f8f5ed] text-wine'
                  : 'text-text hover:text-wine hover:bg-[#f8f5ed]/50'
              }`}
            >
              {link.label}
            </button>
          ))}
          {pageLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => goTo(link.path)}
              className="px-3.5 py-2 rounded-full text-[13px] font-medium transition-colors text-text hover:text-wine hover:bg-[#f8f5ed]/50 whitespace-nowrap"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Donate — always visible, including mobile */}
          <button
            onClick={goToDonate}
            className="px-4 md:px-5 py-2 bg-wine text-cream rounded-full text-[13px] md:text-[14px] font-semibold hover:bg-plum transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span>♡</span>
            <span>Donate</span>
          </button>
          {/* Mobile hamburger */}
          <button
            className="md:hidden text-wine p-1.5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      {mobileMenuOpen && (
        <div className="absolute top-[80px] left-0 right-0 bg-cream shadow-xl border-t border-paper py-4 px-5 flex flex-col gap-1 md:hidden max-h-[80vh] overflow-y-auto">
          {/* Home sections */}
          <div className="text-[10px] uppercase tracking-widest text-text/40 font-semibold px-3 pt-2 pb-1">Home</div>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`text-left text-base py-2.5 px-3 rounded-xl ${activeSection === link.id ? 'bg-paper text-wine font-medium' : 'text-text'}`}
            >
              {link.label}
            </button>
          ))}
          {/* Page links */}
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
          {/* Social links */}
          <div className="text-[10px] uppercase tracking-widest text-text/40 font-semibold px-3 pt-3 pb-1">Connect</div>
          <a href="https://wa.me/27000000000" target="_blank" rel="noopener noreferrer"
            className="text-left text-base py-2.5 px-3 rounded-xl text-text hover:bg-paper hover:text-wine transition-colors flex items-center gap-2">
            <span>💬</span> WhatsApp
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
            className="text-left text-base py-2.5 px-3 rounded-xl text-text hover:bg-paper hover:text-wine transition-colors flex items-center gap-2">
            <span>📘</span> Facebook
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
            className="text-left text-base py-2.5 px-3 rounded-xl text-text hover:bg-paper hover:text-wine transition-colors flex items-center gap-2">
            <span>📷</span> Instagram
          </a>
        </div>
      )}
    </header>
  );
}
