import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { MantraMarquee } from '@/components/visual/MantraMarquee';
import { StandFor } from '@/components/StandFor';
import { Mission } from '@/components/Mission';
import { ProgramsTeaser } from '@/components/ProgramsTeaser';
import { Impact } from '@/components/Impact';
import { Spotlight } from '@/components/Spotlight';
import { Gallery } from '@/components/Gallery';
import { EventSection } from '@/components/EventSection';
import { ContactForm } from '@/components/ContactForm';
import { Footer } from '@/components/Footer';

export default function Home() {
  usePageTitle();
  const [, navigate] = useLocation();
  const goToDonate = () => navigate('/donate');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    const el = document.getElementById(hash);
    if (!el) return;
    const t = window.setTimeout(() => {
      window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
    }, 80);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col relative font-sans text-text">
      <Header />

      <main className="flex-1">
        <Hero onSponsorClick={goToDonate} />
        <MantraMarquee />
        <StandFor />
        <Mission />
        <ProgramsTeaser />
        <Impact onSponsorClick={goToDonate} />
        <Spotlight />
        <Gallery />
        <EventSection />
        <ContactForm />
      </main>

      <Footer onSponsorClick={goToDonate} />
    </div>
  );
}
