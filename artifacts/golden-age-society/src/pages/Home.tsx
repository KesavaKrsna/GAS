import React from 'react';
import { useLocation } from 'wouter';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Mission } from '@/components/Mission';
import { ProgramsTeaser } from '@/components/ProgramsTeaser';
import { Impact } from '@/components/Impact';
import { Spotlight } from '@/components/Spotlight';
import { Gallery } from '@/components/Gallery';
import { ContactForm } from '@/components/ContactForm';
import { Footer } from '@/components/Footer';

export default function Home() {
  usePageTitle(); // root page — title is just "Golden Age Society"
  const [, navigate] = useLocation();
  const goToDonate = () => navigate('/donate');

  return (
    <div className="min-h-[100dvh] flex flex-col relative font-sans text-text">
      <Header />

      <main className="flex-1">
        <Hero onSponsorClick={goToDonate} />
        <Mission />
        <ProgramsTeaser />
        <Impact onSponsorClick={goToDonate} />
        <Spotlight />
        <Gallery />
        <ContactForm />
      </main>

      <Footer onSponsorClick={goToDonate} />
    </div>
  );
}
