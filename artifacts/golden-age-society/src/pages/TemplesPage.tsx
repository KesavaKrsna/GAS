import React from 'react';
import { useLocation } from 'wouter';
import { usePageTitle } from '@/hooks/usePageTitle';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageHero } from '@/components/visual/PageHero';
import { AshramaTimeline, ASHRAMA_NOTE, KatlehongFeature, SectionHeading } from '@/components/sections/ProposalBlocks';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const ROADMAP = [
  {
    phase: 'Immediate',
    color: 'bg-wine',
    ring: 'ring-wine/30',
    icon: '🔥',
    towns: ['Soweto', 'Tembisa', 'Katlehong', 'Daveyton'],
    desc: 'Active outreach ongoing — centres forming',
  },
  {
    phase: 'Mid-term',
    color: 'bg-orange',
    ring: 'ring-orange/30',
    icon: '🌱',
    towns: ['Mamelodi', 'Alexandra'],
    desc: 'Planned expansion within 2–3 years',
  },
  {
    phase: 'Long-term',
    color: 'bg-gold',
    ring: 'ring-gold/30',
    icon: '🛕',
    towns: ['Vosloorus', 'Khayelitsha', 'Umlazi'],
    desc: 'Vision for self-sustaining temple centres',
  },
];

export default function TemplesPage() {
  usePageTitle('Temples & Locations');
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <PageHero
        kicker="Temples & Community Centres"
        title={<>Where the <em>Flame Burns</em></>}
        subtitle="Our existing centres and the geographic roadmap for bringing Krishna Consciousness to every township in Africa."
      />

      {/* ── Katlehong: first working model ─ */}
      <div className="max-w-5xl mx-auto px-4 md:px-12 pt-16">
        <SectionHeading kicker="First working model" title={<>Katlehong <em>outreach centre</em></>} intro="Saturday Harināma and prasādam, supported by devotees from Soweto, Edenvale, Hammanskraal and Johannesburg." />
        <KatlehongFeature showChecklist={false} />
      </div>

      {/* Active Centres section (centre cards) removed. */}

      {/* ── Geographic Roadmap ───────────────────────────────────── */}
      <div className="bg-[#fffdf7] border-t border-gold/10 py-16 px-4 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="kicker mb-3">Geographic Vision</div>
            <h2 className="font-serif text-3xl md:text-4xl text-wine mb-4">The Roadmap</h2>
            <p className="text-text/65 max-w-xl mx-auto text-base leading-relaxed">
              GAS is planting the sankirtana flag across South Africa's townships — phase by phase.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ROADMAP.map((phase, i) => (
              <motion.div
                key={phase.phase}
                {...fadeUp(i * 0.1)}
                className={`rounded-2xl border-2 ${phase.ring} bg-white p-6 relative overflow-hidden`}
              >
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${phase.color}`} />
                <div className="flex items-center gap-3 mb-4 mt-2">
                  <span className="text-2xl">{phase.icon}</span>
                  <div>
                    <div className="font-bold text-wine text-sm uppercase tracking-wide">{phase.phase}</div>
                    <div className="text-xs text-text/50">{phase.desc}</div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {phase.towns.map(town => (
                    <li key={town} className="flex items-center gap-2.5 text-sm text-text/75">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${phase.color}`} />
                      {town}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp(0.2)} className="mt-8 bg-wine/5 border border-wine/15 rounded-2xl px-6 py-5 text-center">
            <p className="text-sm text-text/65 leading-relaxed max-w-2xl mx-auto">
              Each phase represents a new centre of Krishna Consciousness — from active outreach to
              fully established self-sustaining temples led by locally trained African devotees, fulfilling
              Lord Caitanya's prophecy that the sankirtana movement would reach <em>every town and village</em>.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="bg-plum py-14 px-4 text-center grain relative overflow-hidden">
        <h2 className="font-serif text-3xl text-cream mb-4">Help build the next centre.</h2>
        <p className="text-cream/80 mb-8 max-w-md mx-auto">Your donation funds the establishment of new township centres.</p>
        <button onClick={() => navigate('/donate')} className="btn-gold">
          ♡ Donate now →
        </button>
      </div>
      {/* ── Āśrama roadmap ─ */}
      <div id="ashrama" className="max-w-6xl mx-auto px-4 md:px-12 py-16 scroll-mt-24">
        <SectionHeading kicker="Āśrama development" title={<>Four stages to a <em>brahmacārī āśrama</em></>} intro={ASHRAMA_NOTE} />
        <AshramaTimeline />
      </div>

      {/* ── Partners ─ */}
      <div className="bg-paper/60 border-t border-gold/10 py-16 px-4 md:px-12">
        <div className="max-w-4xl mx-auto">
          <SectionHeading kicker="Partners" title={<>Supporting other <em>kīrtanas</em></>} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              ['🛕', 'ISKCON temples', 'We coordinate respectfully with local ISKCON temples, sharing dates and inviting devotees to their programmes.'],
              ['🎶', 'Other kīrtanas', 'We bring devotees and transport to support kīrtanas run by others, rather than competing with them.'],
              ['🍲', 'Food for Life SA', 'We work alongside FFLSA on prasādam distribution.'],
            ].map(([icon, t, b]) => (
              <div key={t} className="bg-white rounded-[1.5rem] p-6 border border-gold/15">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-serif text-xl text-wine mb-2">{t}</h3>
                <p className="text-sm text-text/70 leading-relaxed">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer onSponsorClick={() => navigate('/donate')} />
    </div>
  );
}
