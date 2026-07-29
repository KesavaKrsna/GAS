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
    { id: 'mission', label: 'Our mission' },
    { id: 'stories', label: 'Stories' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  const goToNewsletter = () => {
    setMobileMenuOpen(false);
    navigate('/newsletter');
  };

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
  };

  const goToDonate = () => {
    setMobileMenuOpen(false);
    navigate('/donate');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-[96px] flex items-center bg-[#fffdf8] ${isScrolled ? 'shadow-sm' : ''}`}>
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between h-full">
        <button onClick={() => scrollTo('home')} className="flex items-center gap-4 hover:opacity-90 transition-opacity">
          <img src={gasLogo} alt="Golden Age Society" className="w-[65px] h-[72px] object-contain" />
          <span className="font-serif text-wine text-xl leading-tight font-semibold hidden sm:block">
            Golden Age<br/>Society
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`px-5 py-2.5 rounded-full text-[15px] font-medium transition-colors ${
                activeSection === link.id
                  ? 'bg-[#f8f5ed] text-wine'
                  : 'text-text hover:text-wine hover:bg-[#f8f5ed]/50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={goToNewsletter}
            className="px-5 py-2.5 rounded-full text-[15px] font-medium transition-colors text-text hover:text-wine hover:bg-[#f8f5ed]/50"
          >
            Newsletter
          </button>
          <button
            onClick={goToDonate}
            className="ml-2 px-6 py-2.5 bg-wine text-cream rounded-full text-[15px] font-medium hover:bg-plum transition-colors shadow-sm flex items-center gap-2"
          >
            <span>♡</span> Donate
          </button>
        </nav>

        <button className="md:hidden text-wine p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-[96px] left-0 right-0 bg-cream shadow-xl border-t border-paper p-6 flex flex-col gap-4 md:hidden">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`text-left text-lg py-3 px-4 rounded-xl ${activeSection === link.id ? 'bg-paper text-wine font-medium' : 'text-text'}`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={goToNewsletter}
            className="text-left text-lg py-3 px-4 rounded-xl text-text"
          >
            Newsletter
          </button>
          <button
            onClick={goToDonate}
            className="mt-4 px-6 py-4 bg-wine text-cream rounded-xl text-lg font-medium hover:bg-plum transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <span>♡</span> Donate
          </button>
        </div>
      )}
    </header>
  );
}
