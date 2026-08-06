import React from 'react';
import { useLocation } from 'wouter';
import { usePageTitle } from '@/hooks/usePageTitle';
import { motion } from 'framer-motion';
import gasLogo from '@assets/gas-logo.png';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as const },
});

interface Pillar {
  id: string;
  icon: string;
  kicker: string;
  title: string;
  body: React.ReactNode;
  cta?: { label: string; href?: string };
  tag?: string;
}

const PILLARS: Pillar[] = [
  {
    id: 'kasi-kirtan',
    icon: '🎶',
    kicker: 'Pillar 1',
    title: 'Kasi Kirtan',
    image: '/kasi-kirtan-outreach.png',
    body: (
      <>
        <p>
          The Kasi Kirtan initiative takes the sacred chanting of the Hare Krishna mahā-mantra directly into
          South African townships — the <em>kasi</em>. Devotees perform street harinam (congregational chanting),
          bringing the transcendental sound vibration to communities that have rarely encountered Bhakti culture.
        </p>
        <p>
          The <strong>Kasi Kirtan Academy</strong> is GAS's vision for the next generation: a structured music and
          spiritual education programme that trains township youth in mridanga, kartals, and devotional singing —
          equipping them to become future leaders of the sankirtana movement in Africa.
        </p>
      </>
    ),
  },
  {
    id: 'prasadam',
    icon: '🍲',
    kicker: 'Pillar 2',
    title: 'Krishna Prasadam',
    image: '/prasadam-outreach.png',
    body: (
      <>
        <p>
          "Food for Life" is one of the most powerful forms of devotional outreach. GAS distributes
          sanctified <strong>Krishna Prasadam</strong> — food offered to the Lord — to township communities,
          combining nourishment of the body with an experience of Bhakti culture.
        </p>
        <p>
          GAS partners with <strong>Food for Life South Africa (FFLSA)</strong> to amplify reach, ensuring
          that hundreds of meals are served at each outreach event. Every plate is an act of love and an
          invitation to spiritual life.
        </p>
      </>
    ),
  },
  {
    id: 'book-distribution',
    icon: '📖',
    kicker: 'Pillar 3',
    title: 'Book Translation & Distribution',
    body: (
      <>
        <p>
          Śrīla Prabhupāda called book distribution the <em>brihad-mridanga</em> — the great drum whose sound
          reaches farther than any harinam. GAS is committed to making his timeless teachings accessible to
          every African heart in their mother tongue.
        </p>
        <p>
          Working with <strong>BBT Africa</strong>, GAS funds the translation and distribution of Prabhupāda's
          books into <strong>Zulu, Sotho, Tswana, Pedi, Xhosa, and Afrikaans</strong> — six of South Africa's
          most widely spoken languages — so that no language barrier stands between the seeker and the truth.
        </p>
      </>
    ),
  },
  {
    image: '/reuniting-devotees.png',
    id: 'reuniting-devotees',
    icon: '🤝',
    kicker: 'Pillar 4',
    title: 'Reuniting Township Devotees',
    body: (
      <>
        <p>
          Thousands of initiated devotees across South African townships have drifted from active practice due
          to isolation, distance from temples, and lack of community. GAS actively seeks them out through
          <strong> Kasi Reunions</strong> — gathering events that restore fellowship and reignite practice.
        </p>
        <p>
          Beyond reunions, GAS provides one-on-one <strong>mentorship and spiritual counselling</strong> to
          help devotees rebuild their sādhanā, reconnect with their local ISKCON community, and find their
          service in Lord Caitanya's mission.
        </p>
      </>
    ),
  },
  {
    id: 'bhakti-connect',
    icon: '📱',
    kicker: 'Pillar 5',
    title: 'Bhakti Connect App',
    body: (
      <>
        <p>
          The <strong>Bhakti Connect App</strong> is GAS's digital outreach platform — a devotee-facing mobile
          application that delivers daily spiritual content, event announcements, and community connection
          directly to township devotees' phones.
        </p>
        <p>
          Features include a daily Bhakti reading, kirtan recordings, event management for harinam and
          Prasadam days, and a devotee directory to help isolated practitioners find their nearest community.
        </p>
      </>
    ),
    cta: { label: 'Coming soon to app stores' },
    tag: 'Coming soon',
  },
  {
    id: 'sannyasi-support',
    icon: '🛕',
    kicker: 'Pillar 6',
    title: 'Sannyasi Support & African Collaboration',
    body: (
      <>
        <p>
          GAS actively supports the work of senior renounced Vaishnava teachers who are dedicated to
          Africa's spiritual upliftment — including <strong>HH Bhakti Narasimha Swami</strong> and
          <strong> HH Bhakti Sarvajña Gauranga Swami</strong>, whose decades of service on the continent
          provide the GAS mission with deep roots and guidance.
        </p>
        <p>
          GAS collaborates with <strong>ISKCON Kenya</strong> and <strong>ISKCON Ghana</strong> to share
          resources, coordinate pan-African harinam initiatives, and build a unified African Vaishnava
          voice within the worldwide ISKCON family.
        </p>
      </>
    ),
  },
];

function PillarPhoto({ alt, src }: { alt: string; src?: string }) {
  if (src) {
    return (
      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div className="w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-wine/10 to-gold/10 border border-gold/20 flex items-center justify-center">
      <div className="text-center text-text/30 px-6">
        <div className="text-5xl mb-2">🖼</div>
        <div className="text-sm">Photo placeholder — {alt}</div>
      </div>
    </div>
  );
}

export default function ProgramsPage() {
  usePageTitle('Our Programs');
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-cream">

      {/* ── Compact nav ──────────────────────────────────────────── */}
      <header className="bg-[#fffdf8] border-b border-paper shadow-sm sticky top-0 z-40 h-[64px] flex items-center">
        <div className="container mx-auto px-4 md:px-12 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={gasLogo} alt="Golden Age Society" className="w-10 h-[44px] object-contain" />
            <span className="font-serif text-wine text-base leading-tight font-semibold hidden sm:block">
              Golden Age<br/>Society
            </span>
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-sm text-text/60 hover:text-wine transition-colors">← Home</button>
            <button onClick={() => navigate('/donate')} className="px-4 py-2 bg-wine text-cream rounded-full text-sm font-semibold hover:bg-plum transition-colors">
              ♡ Donate
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="bg-wine py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `repeating-radial-gradient(circle at center, transparent 0, transparent 30px, rgba(251,178,38,0.4) 30px, rgba(251,178,38,0.4) 31px)` }} />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 text-gold text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            ✦ Six Pillars of Outreach
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-cream mb-4 leading-tight">
            Our <em className="text-gold">Programs</em>
          </h1>
          <p className="text-cream/80 text-lg max-w-xl mx-auto leading-relaxed">
            Six interconnected pillars that carry Lord Caitanya's Golden Age vision into the townships and villages of Africa.
          </p>
        </div>
      </div>

      {/* ── Pillar sections ──────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 md:px-12 py-16 space-y-20">
        {PILLARS.map((pillar, i) => {
          const isEven = i % 2 === 0;
          return (
            <motion.div
              key={pillar.id}
              {...fadeUp(0.05)}
              className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center ${!isEven ? 'md:[&>*:first-child]:order-2' : ''}`}
            >
              {/* Text */}
              <div>
                {pillar.tag && (
                  <span className="inline-block text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-gold/15 text-wine/80 mb-3">
                    {pillar.tag}
                  </span>
                )}
                <div className="kicker mb-2">{pillar.kicker}</div>
                <h2 className="font-serif text-3xl md:text-4xl text-wine mb-1 flex items-center gap-3">
                  <span>{pillar.icon}</span> {pillar.title}
                </h2>
                <div className="w-12 h-0.5 bg-gold/50 mb-5 mt-3" />
                <div className="space-y-4 text-text/75 leading-relaxed text-[15px]">
                  {pillar.body}
                </div>
                {pillar.cta && (
                  <div className="mt-6">
                    {pillar.cta.href ? (
                      <a href={pillar.cta.href} className="inline-flex items-center gap-2 px-5 py-2.5 bg-wine text-cream rounded-full text-sm font-semibold hover:bg-plum transition-colors">
                        {pillar.cta.label} →
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 border border-wine/30 text-wine/70 rounded-full text-sm font-semibold">
                        📱 {pillar.cta.label}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Photo */}
              <div>
                <PillarPhoto alt={pillar.title} src={(pillar as any).image} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Donate CTA ───────────────────────────────────────────── */}
      <div className="bg-wine py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-cream mb-4">
            Support a pillar that <em className="text-gold">moves you.</em>
          </h2>
          <p className="text-cream/80 mb-8 text-lg leading-relaxed">
            Every donation goes directly to one of these six programmes. Choose a sponsorship tier and see your gift in action.
          </p>
          <button
            onClick={() => navigate('/donate')}
            className="px-10 py-4 bg-gold text-[#1a0a00] rounded-full text-base font-bold hover:bg-cream transition-colors shadow-xl"
          >
            ♡ Donate now →
          </button>
        </div>
      </div>
    </div>
  );
}
