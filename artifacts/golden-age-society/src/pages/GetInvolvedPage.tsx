import React from 'react';
import { useLocation } from 'wouter';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageHero } from '@/components/visual/PageHero';
import { KatlehongFeature, SectionHeading, VolunteerForm, WeeklyRhythm } from '@/components/sections/ProposalBlocks';

export default function GetInvolvedPage() {
  usePageTitle('Get Involved');
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <PageHero
        kicker="Get involved"
        title={<>Serve with <em>us</em></>}
        subtitle="Join the opt-in register. Tell us your skills, availability, where you travel from and how you'd like to serve."
      />
      <div className="max-w-5xl mx-auto px-4 md:px-12 py-16 space-y-16">
        <div className="max-w-3xl mx-auto">
          <SectionHeading kicker="Opt-in register" title="Volunteer sign-up" />
          <VolunteerForm />
        </div>
        <div>
          <SectionHeading kicker="This week" title="Our weekly rhythm" />
          <WeeklyRhythm />
        </div>
        <KatlehongFeature />
      </div>
      <Footer onSponsorClick={() => navigate('/donate')} />
    </div>
  );
}
