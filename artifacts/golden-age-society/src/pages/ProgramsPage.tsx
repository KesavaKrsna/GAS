import React from 'react';
import { useLocation } from 'wouter';
import { usePageTitle } from '@/hooks/usePageTitle';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageHero } from '@/components/visual/PageHero';
import { CONTACT_EMAIL, mailto } from '@/config/site';
import { KatlehongFeature, SectionHeading, VolunteerForm, WeeklyRhythm } from '@/components/sections/ProposalBlocks';

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
  image?: string;
  body: React.ReactNode;
  cta?: { label: string; href?: string };
  tag?: string;
}

const PILLARS: Pillar[] = [
  {
    id: 'bhakti-education',
    icon: '📖',
    kicker: 'Pillar 1',
    title: 'Bhakti Education',
    image: '/book-distribution.png',
    body: (
      <>
        <p>
          Cultivating devotees who can cultivate other devotees. A weekly rhythm of japa, an online class and
          reading keeps sādhanā steady between gatherings.
        </p>
        <p>
          <strong>Books in six languages.</strong> Working with BBT Africa, GAS supports translating and distributing
          Śrīla Prabhupāda's books into Zulu, Sotho, Tswana, Pedi, Xhosa and Afrikaans.
        </p>
      </>
    ),
  },
  {
    id: 'sankirtana',
    icon: '🎶',
    kicker: 'Pillar 2',
    title: 'Saṅkīrtana',
    image: '/kasi-kirtan-outreach.png',
    body: (
      <>
        <p>
          <strong>Kasi Kirtan</strong> takes the Hare Krishna mahā-mantra into South African townships through
          street harināma. Katlehong is our first regular outreach centre.
        </p>
        <p>
          The <strong>Kasi Kirtan Academy</strong> is our vision for training township youth in mṛdaṅga, kartālas and
          devotional singing. We also support other kīrtanas (see Temples &amp; Centres).
        </p>
      </>
    ),
  },
  {
    id: 'devotee-care',
    icon: '🤲',
    kicker: 'Pillar 3',
    title: 'Devotee Care & Welfare',
    image: '/reuniting-devotees.png',
    body: (
      <>
        <p>
          Confidential, consent-based support: weekly check-ins, mentorship and help for devotees who have drifted
          from practice (<strong>Kasi Reunions</strong>). Welfare is always kept separate from any commerce.
        </p>
        <p>
          <strong>Safeguarding &amp; grievances:</strong> any concern can be raised privately by email to{' '}
          <a className="text-wine underline" href={mailto('Confidential: devotee care / grievance')}>{CONTACT_EMAIL}</a>.
          See our <a className="text-wine underline" href="/legal/privacy">privacy policy</a> for photo consent and safeguarding.
        </p>
      </>
    ),
  },
  {
    id: 'prasadam',
    icon: '🍲',
    kicker: 'Pillar 4',
    title: 'Prasādam & Welfare',
    image: '/gallery-prasadam-3.jpeg',
    body: (
      <>
        <p>
          Sanctified vegetarian <strong>Krishna prasādam</strong> shared with communities, combining nourishment
          with an experience of Bhakti culture. At Katlehong, prasādam is donated in kind.
        </p>
        <p>
          GAS works alongside <strong>Food for Life South Africa (FFLSA)</strong> to extend its reach.
        </p>
      </>
    ),
  },
  {
    id: 'partnerships',
    icon: '🤝',
    kicker: 'Pillar 5',
    title: 'Community Partnerships',
    image: '/gallery-prasadam-6.jpeg',
    body: (
      <>
        <p>
          Supporting other kīrtanas and coordinating respectfully with ISKCON temples, so that our outreach adds to
          what local communities already do.
        </p>
      </>
    ),
  },
  {
    id: 'finance',
    icon: '📒',
    kicker: 'Pillar 6',
    title: 'Finance & Stewardship',
    image: '/ashram-devotee-community.png',
    body: (
      <>
        <p>
          A ledger, receipts for every expense, two-person sign-off and a reconciliation after every event.
          Restricted donations follow the donor's instructions.
        </p>
        <p>
          We will publish monthly reports on the <a className="text-wine underline" href="/impact">Impact</a> page once
          figures are verified.
        </p>
      </>
    ),
  },
  {
    id: 'ashrama',
    icon: '🛕',
    kicker: 'Pillar 7',
    title: 'Āśrama Development',
    image: '/launch-kirtan-feast-wide.jpg',
    body: (
      <>
        <p>
          A four-stage path from home programmes to a brahmacārī āśrama. See the roadmap on{' '}
          <a className="text-wine underline" href="/temples#ashrama">Temples &amp; Centres</a>.
        </p>
      </>
    ),
  },
  {
    id: 'bhakti-connect',
    image: '/bhakti-connect-app.jpg',
    icon: '📱',
    kicker: 'Future',
    title: 'Bhakti Connect App',
    body: (
      <>
        <p>
          A possible future devotee app. For now we start with WhatsApp groups, and will only build an app if
          demand is sustained.
        </p>
      </>
    ),
    tag: 'Future',
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
      <Header />

      <PageHero
        kicker="Seven Pillars"
        title={<>Our <em>Programs</em></>}
        subtitle="Seven pillars for cultivating devotees who can cultivate other devotees, in townships and communities across South Africa."
      />

      <div className="max-w-5xl mx-auto px-4 md:px-12 pt-16">
        <SectionHeading kicker="Feature" title={<>Katlehong <em>Harināma</em></>} />
        <KatlehongFeature />
        <div className="mt-12">
          <SectionHeading kicker="This week" title="Our weekly rhythm" />
          <WeeklyRhythm />
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
                <PillarPhoto alt={pillar.title} src={pillar.image} />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div id="volunteer" className="max-w-3xl mx-auto px-4 md:px-12 pb-16">
        <SectionHeading kicker="Volunteer" title="Join the opt-in register" intro="Tell us where you travel from and how you'd like to serve." />
        <VolunteerForm />
      </div>

      <div className="bg-plum py-16 px-4 text-center relative overflow-hidden grain">
        <div className="relative max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-cream mb-4">
            Support a pillar that <em>moves you.</em>
          </h2>
          <p className="text-cream/80 mb-8 text-lg leading-relaxed">
            Every donation goes directly to one of these programmes. Choose a sponsorship tier and see your gift in action.
          </p>
          <button onClick={() => navigate('/donate')} className="btn-gold">
            ♡ Donate now →
          </button>
        </div>
      </div>
      <Footer onSponsorClick={() => navigate('/donate')} />
    </div>
  );
}
