import React from 'react';
import { useLocation } from 'wouter';
import { usePageTitle } from '@/hooks/usePageTitle';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageHero } from '@/components/visual/PageHero';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const CENTRES = [
  {
    id: 'hammanskraal',
    name: 'ISKCON Hammanskraal',
    location: 'Hammanskraal, Gauteng',
    address: 'Hammanskraal, Gauteng, South Africa',
    contact: 'ocsacademy2020@gmail.com',
    phone: null,
    description:
      'A growing centre of Krishna Consciousness in the Hammanskraal township community. This centre serves as a hub for Prasadam distribution, Kasi Kirtan outreach, and weekly Bhakti programmes — meeting devotees and seekers where they live.',
    tags: ['Prasadam', 'Kasi Kirtan', 'Bhakti programmes'],
  },
  {
    id: 'klerksdorp',
    name: 'ISKCON Klerksdorp',
    subtitle: 'New Vrindavan Hare Krishna Centre',
    location: 'Klerksdorp, North West',
    address: 'Klerksdorp, North West Province, South Africa',
    contact: 'ocsacademy2020@gmail.com',
    phone: null,
    description:
      'The New Vrindavan Hare Krishna Centre in Klerksdorp is one of GAS\'s established pillars of outreach in the North West Province. It serves as a hub for Krishna Prasadam distribution, Kasi Kirtan outreach, and weekly Bhakti programmes — nourishing the bodies and souls of devotees and seekers across the North West.',
    tags: ['Prasadam', 'Kasi Kirtan', 'Bhakti programmes'],
  },
];

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

      {/* ── Centre Cards ─────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 md:px-12 py-16 space-y-8">
        <div className="text-center mb-10">
          <div className="kicker mb-3">Active Centres</div>
          <h2 className="font-serif text-3xl md:text-4xl text-wine">Our temple communities</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CENTRES.map((centre, i) => (
            <motion.div key={centre.id} {...fadeUp(i * 0.08)} className="bg-white rounded-2xl border border-gold/20 shadow-sm overflow-hidden">
              {/* Card header */}
              <div className="bg-wine/5 border-b border-gold/15 px-6 py-5">
                <div className="flex items-start gap-3">
                  <span className="text-3xl mt-0.5">🛕</span>
                  <div>
                    <h3 className="font-serif text-xl text-wine leading-tight">{centre.name}</h3>
                    {centre.subtitle && <div className="text-xs text-text/50 italic mt-0.5">{centre.subtitle}</div>}
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-text/55">
                      <span>📍</span> {centre.location}
                    </div>
                  </div>
                </div>
              </div>
              {/* Body */}
              <div className="px-6 py-5 space-y-4">
                <p className="text-sm text-text/70 leading-relaxed">{centre.description}</p>
                <div className="flex flex-wrap gap-2">
                  {centre.tags.map(tag => (
                    <span key={tag} className="text-[11px] uppercase tracking-wider font-semibold px-3 py-1 bg-gold/10 text-wine/80 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="pt-2 border-t border-paper space-y-1.5 text-sm">
                  <div className="flex items-center gap-2 text-text/60">
                    <span>✉️</span>
                    <a href={`mailto:${centre.contact}`} className="text-wine hover:underline">{centre.contact}</a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

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
      <Footer onSponsorClick={() => navigate('/donate')} />
    </div>
  );
}
