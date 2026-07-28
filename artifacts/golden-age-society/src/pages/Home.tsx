import React from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Mission } from '@/components/Mission';
import { Impact } from '@/components/Impact';
import { Spotlight } from '@/components/Spotlight';
import { Gallery } from '@/components/Gallery';
import { EventSection } from '@/components/EventSection';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [, navigate] = useLocation();
  const goToDonate = () => navigate('/donate');

  return (
    <div className="min-h-[100dvh] flex flex-col relative font-sans text-text">
      <Header />

      <main className="flex-1">
        <Hero onSponsorClick={goToDonate} />
        <Mission />
        <Impact onSponsorClick={goToDonate} />
        <Spotlight />
        <Gallery />
        <EventSection />
      </main>

      <Footer onSponsorClick={goToDonate} />
    </div>
  );
}
