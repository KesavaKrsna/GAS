import React, { useState } from 'react';
import { SponsorModal } from '@/components/SponsorModal';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Mission } from '@/components/Mission';
import { Impact } from '@/components/Impact';
import { Spotlight } from '@/components/Spotlight';
import { Gallery } from '@/components/Gallery';
import { VideoSection } from '@/components/VideoSection';
import { EventSection } from '@/components/EventSection';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] flex flex-col relative font-sans text-text">
      <Header onSponsorClick={() => setIsSponsorModalOpen(true)} />

      <main className="flex-1">
        <Hero onSponsorClick={() => setIsSponsorModalOpen(true)} />
        <Mission />
        <Impact onSponsorClick={() => setIsSponsorModalOpen(true)} />
        <Spotlight />
        <Gallery />
        <VideoSection />
        <EventSection />
      </main>

      <Footer onSponsorClick={() => setIsSponsorModalOpen(true)} />

      {isSponsorModalOpen && (
        <SponsorModal onClose={() => setIsSponsorModalOpen(false)} />
      )}
    </div>
  );
}
