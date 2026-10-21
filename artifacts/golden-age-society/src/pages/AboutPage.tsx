import React from 'react';
import { useLocation } from 'wouter';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageHero } from '@/components/visual/PageHero';
import { SectionHeading } from '@/components/sections/ProposalBlocks';
import { CONTACT_EMAIL, mailto } from '@/config/site';

const ROLES = ['Finance', 'Safeguarding', 'Outreach', 'Prasādam', 'Transport', 'Records'];

const TEAM_PHOTOS: Record<string, { src: string; alt: string }> = {
  'Kesava Krsna Das': { src: '/team-kesava-krsna-das', alt: 'Kesava Krsna Das (Keshav Krsna Prabhu)' },
  Premvkay: { src: '/team-prem', alt: 'Premvkay' },
};

export default function AboutPage() {
  usePageTitle('About & Team');
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <PageHero
        kicker="About Golden Age Society"
        title={<>Our <em>team</em> &amp; governance</>}
        subtitle="A Kṛṣṇa-consciousness society cultivating devotees who can cultivate other devotees, in townships and communities across South Africa."
      />
      <div className="max-w-5xl mx-auto px-4 md:px-12 py-16 space-y-16">
        <div>
          <SectionHeading kicker="Core team" title="Who leads GAS" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              ['Kesava Krsna Das', 'Core team. Hosts the monthly saṅga.'],
              ['Premvkay', 'Core team. Author of the GAS Development Booklet.'],
            ].map(([n, r]) => (
              <div key={n} className="bg-white rounded-[1.5rem] border border-gold/20 p-6 flex items-center gap-4">
                {TEAM_PHOTOS[n] ? (
                  <picture className="block w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden shrink-0 border border-gold/30">
                    <source srcSet={`${TEAM_PHOTOS[n].src}.webp`} type="image/webp" />
                    <img src={`${TEAM_PHOTOS[n].src}.jpg`} alt={TEAM_PHOTOS[n].alt} className="w-full h-full object-cover" />
                  </picture>
                ) : (
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-wine text-gold font-serif text-2xl flex items-center justify-center shrink-0">{n[0]}</div>
                )}
                <div>
                  <h3 className="font-serif text-xl text-wine">{n}</h3>
                  <p className="text-sm text-text/65">{r}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionHeading kicker="Coordinators" title="Roles we are filling" intro="Coordinators will be named here once appointed." />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ROLES.map((r) => (
              <div key={r} className="bg-paper rounded-xl border border-gold/15 p-4">
                <div className="font-serif text-lg text-wine">{r}</div>
                <div className="text-xs text-text/50 italic">To be appointed</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-wine/5 to-gold/5 border-2 border-gold/20 rounded-2xl p-8">
          <div className="kicker mb-2">Governance note</div>
          <h3 className="font-serif text-2xl text-wine mb-3">Legal host: pending confirmation</h3>
          <p className="text-text/75 leading-relaxed text-[15px]">
            We are confirming whether GAS is its own registered NPO or a programme under a host organisation. Until
            that is confirmed in writing we do not make tax or PBO claims; tax receipts are on request only. Money is
            handled with a ledger, receipts, two-person sign-off and a reconciliation after every event, and reported
            monthly on the{' '}
            <button onClick={() => navigate('/impact')} className="text-wine underline">Impact</button> page.
          </p>
          <p className="text-sm text-text/55 mt-4">
            Questions: <a className="text-wine underline" href={mailto('Governance question')}>{CONTACT_EMAIL}</a>
          </p>
        </div>
      </div>
      <Footer onSponsorClick={() => navigate('/donate')} />
    </div>
  );
}
