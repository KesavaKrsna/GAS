import React from 'react';
import { useLocation } from 'wouter';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageHero } from '@/components/visual/PageHero';

export default function DirectoryPage() {
  usePageTitle('Business Directory');
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <PageHero kicker="Coming soon" title={<>Devotee business <em>directory</em></>} subtitle="A listing of businesses in our community network." />
      <div className="max-w-3xl mx-auto px-4 md:px-12 py-16">
        <div className="bg-white rounded-2xl border-2 border-gold/25 p-8 text-center">
          <div className="text-4xl mb-3">🏪</div>
          <h2 className="font-serif text-2xl text-wine mb-3">Coming soon</h2>
          <p className="text-text/70 leading-relaxed">
            Listings will be published once written terms are in place.
          </p>
          <p className="mt-4 text-sm font-semibold text-wine bg-gold/10 border border-gold/30 rounded-xl px-4 py-3">
            The directory is separate from GAS funds. Business money is never mixed with donations to Golden Age Society.
          </p>
        </div>
      </div>
      <Footer onSponsorClick={() => navigate('/donate')} />
    </div>
  );
}
