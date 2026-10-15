import React from 'react';
import { useLocation } from 'wouter';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WHATSAPP_CULTIVATION_GROUP_URL, mailto } from '@/config/site';
import { PageHero } from '@/components/visual/PageHero';
import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

/* ─── Newsletter issue data ─── */
const issues = [
  {
    id: 'development-brief',
    issue: 'Issue 002',
    date: 'October 2026',
    tag: 'Development Brief',
    title: 'Development Booklet: our next 90 days',
    subtitle: 'Cultivating devotees who can cultivate other devotees',
    preview: 'A summary of the GAS Development Booklet: seven pillars, Katlehong as our first outreach centre, a weekly rhythm, honest finances and the 90-day roadmap.',
  },
  {
    id: 'launch-brief',
    issue: 'Issue 001',
    date: 'July 2026',
    tag: 'Official Communication',
    title: 'GAS Organisation Official Launch Brief',
    subtitle: 'Supporting Srila Prabhupada\'s Mission Through Accountability, Service and Community Development',
    preview: 'The GAS Organisation has been established to strengthen and support ISKCON\'s preaching and community development initiatives, particularly within South African townships.',
  },
];

/* ─── Full article content ─── */
const LaunchBrief = () => (
  <article className="max-w-3xl mx-auto">

    {/* Article header */}
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-6">
        <span className="kicker">Issue 001</span>
        <span className="text-text/30">·</span>
        <span className="kicker !text-text/50">July 2026</span>
        <span className="text-text/30">·</span>
        <span className="kicker !text-text/50">Official Communication</span>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl text-wine mb-4 leading-tight">
        GAS Organisation<br/><em>Official Launch Brief</em>
      </h1>
      <p className="text-lg text-text/70 leading-relaxed font-medium border-l-4 border-gold pl-5 py-1">
        Supporting Srila Prabhupada's Mission Through Accountability, Service and Community Development
      </p>
    </div>

    {/* Gold rule */}
    <div className="flex items-center gap-4 mb-10">
      <div className="flex-1 h-px bg-gold/30" />
      <span className="text-gold text-lg">✦</span>
      <div className="flex-1 h-px bg-gold/30" />
    </div>

    {/* Body */}
    <div className="prose-gas space-y-10 text-text/85 leading-relaxed text-base md:text-[1.05rem]">

      {/* Purpose */}
      <section>
        <h2 className="text-2xl text-wine mb-3 font-serif">Purpose</h2>
        <p>
          The GAS Organisation has been established to strengthen and support ISKCON's preaching
          and community development initiatives, particularly within South African townships. GAS
          exists as a practical service organisation that provides administrative, technological
          and organisational support so that devotees can focus on spreading Krishna consciousness.
        </p>
      </section>

      {/* Relationship with ISKCON */}
      <section>
        <h2 className="text-2xl text-wine mb-3 font-serif">Our Relationship with ISKCON</h2>
        <p className="mb-4">
          GAS is not separate from or a replacement for ISKCON. It exists to serve Srila
          Prabhupada's mission in cooperation with ISKCON leadership.
        </p>
        <div className="bg-paper rounded-2xl border border-gold/20 p-6 space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-gold mt-1 text-lg">✦</span>
            <p><strong className="text-wine">ISKCON</strong> provides the spiritual direction.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-gold mt-1 text-lg">✦</span>
            <p><strong className="text-wine">GAS</strong> provides practical support through governance, administration, fundraising, technology and programme management.</p>
          </div>
        </div>
      </section>

      {/* Mandate */}
      <section>
        <h2 className="text-2xl text-wine mb-3 font-serif">Our Mandate</h2>
        <ul className="space-y-3">
          {[
            'Strengthen township preaching and congregational development.',
            'Support community upliftment through food relief, youth development, education and skills programmes.',
            'Promote accountability, transparency and responsible stewardship of donations.',
            'Build organisational capacity through volunteer management, planning and reporting.',
            'Develop sustainable funding partnerships and technology solutions.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-gold shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Commitment */}
      <section className="bg-wine rounded-2xl p-8 text-cream">
        <h2 className="text-2xl text-gold mb-3 font-serif">Our Commitment</h2>
        <p className="text-cream/85 leading-relaxed">
          We believe every donation is a sacred trust and every programme is an offering in the
          service of Krishna. GAS is committed to integrity, transparency, measurable impact and
          good governance. We will provide clear reporting to donors, beneficiaries and ISKCON
          leadership while ensuring resources are used responsibly to advance Srila Prabhupada's
          mission.
        </p>
      </section>

      {/* Vision */}
      <section>
        <h2 className="text-2xl text-wine mb-3 font-serif">Vision</h2>
        <p className="text-lg italic text-wine/80 border-l-4 border-gold pl-5 py-1 font-serif">
          "To become a trusted organisation that empowers temples and communities across South Africa
          through organised, accountable and sustainable Krishna Conscious community development."
        </p>
      </section>

      {/* Invitation */}
      <section>
        <h2 className="text-2xl text-wine mb-3 font-serif">Invitation</h2>
        <p>
          We respectfully invite the GBC, Temple Presidents and ISKCON leaders to guide and partner
          with GAS. Together we can strengthen preaching, build sustainable community programmes and
          honour Srila Prabhupada's vision with excellence, compassion and accountability.
        </p>
      </section>

    </div>

    {/* Closing gold rule */}
    <div className="flex items-center gap-4 mt-12 mb-6">
      <div className="flex-1 h-px bg-gold/30" />
      <span className="text-gold text-lg">✦</span>
      <div className="flex-1 h-px bg-gold/30" />
    </div>

    <p className="text-center text-xs uppercase tracking-widest text-text/40 font-semibold">
      Hare Krishna · Golden Age Society · goldenage-society.org
    </p>

  </article>
);

const DevelopmentBrief = () => (
  <article className="max-w-3xl mx-auto">
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <span className="kicker">Issue 002</span>
        <span className="text-text/30">·</span>
        <span className="kicker !text-text/50">October 2026</span>
        <span className="text-text/30">·</span>
        <span className="kicker !text-text/50">Development Brief</span>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl text-wine mb-4 leading-tight">
        Development Booklet:<br/><em>our next 90 days</em>
      </h1>
      <p className="text-lg text-text/70 leading-relaxed font-medium border-l-4 border-gold pl-5 py-1">
        A working proposal from our core team, Keshav Krsna Prabhu and Premvkay.
      </p>
    </div>
    <div className="space-y-8 text-text/85 leading-relaxed text-base md:text-[1.05rem]">
      <section>
        <h2 className="text-2xl text-wine font-serif mb-3">Our vision</h2>
        <p>Thriving Kṛṣṇa-conscious communities across South Africa, starting in the townships, by cultivating devotees who can cultivate other devotees.</p>
      </section>
      <section>
        <h2 className="text-2xl text-wine font-serif mb-3">Seven pillars</h2>
        <p>Bhakti education · Saṅkīrtana · Devotee care · Prasādam &amp; welfare · Community partnerships · Finance &amp; resources · Āśrama development.</p>
      </section>
      <section>
        <h2 className="text-2xl text-wine font-serif mb-3">Katlehong first</h2>
        <p>Katlehong is our first outreach centre: Saturday Harināma and prasādam (donated in kind), with devotees from Soweto, Edenvale, Hammanskraal and Johannesburg. Each programme day needs at least R2,000 for transport, for example 20 × R100, 10 × R200 or 5 × R400. Dates: Saturdays, details on request.</p>
      </section>
      <section>
        <h2 className="text-2xl text-wine font-serif mb-3">Priorities for the first 90 days</h2>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>Confirm our legal host and authority to receive funds before any tax claims.</li>
          <li>Appoint coordinators for finance, safeguarding, outreach, prasādam, transport and records.</li>
          <li>Start an opt-in member register and two WhatsApp groups (cultivation and operations).</li>
          <li>Fund Katlehong transport days and reconcile each one.</li>
          <li>Keep a ledger with receipts and two-person sign-off, and publish monthly reports.</li>
          <li>Consent before publishing any photos; welfare kept confidential and separate from commerce.</li>
        </ul>
      </section>
    </div>
  </article>
);

function OptIn() {
  return (
    <div className="bg-paper border border-gold/20 rounded-2xl p-6 md:p-8 mt-12 text-center">
      <div className="kicker mb-2">Stay in touch</div>
      <h2 className="text-2xl text-wine font-serif mb-3">Get the next brief</h2>
      <p className="text-text/65 text-sm mb-5 max-w-md mx-auto">Opt in by email, or ask to join the WhatsApp cultivation group. You can leave at any time.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a href={mailto('Newsletter opt-in')} className="px-6 py-3 bg-wine text-cream rounded-full text-sm font-semibold hover:bg-plum transition-colors">Subscribe by email</a>
        {WHATSAPP_CULTIVATION_GROUP_URL ? (
          <a href={WHATSAPP_CULTIVATION_GROUP_URL} target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-wine/30 text-wine rounded-full text-sm font-semibold hover:bg-wine/5">Join the WhatsApp group</a>
        ) : (
          <a href={mailto('Please add me to the WhatsApp cultivation group')} className="px-6 py-3 border border-wine/30 text-wine rounded-full text-sm font-semibold hover:bg-wine/5">Ask to join the WhatsApp group</a>
        )}
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function NewsletterPage() {
  usePageTitle('Newsletter');
  const [, navigate] = useLocation();
  const [openIssue, setOpenIssue] = React.useState<string | null>(null);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-cream font-sans text-text">
      <Header />

      <main className="flex-1">
        <PageHero
          kicker="Golden Age Society"
          title={<>Our <em>Newsletter</em></>}
          subtitle="Updates, briefs and communications from the Golden Age Society — keeping our community and partners informed, transparently and with devotion."
        />

        {/* ── Issue list ── */}
        {!openIssue && (
          <div className="container mx-auto px-6 md:px-12 max-w-5xl py-16 md:py-20">
            <h2 className="text-2xl text-wine mb-8 font-serif">All issues</h2>
            <div className="space-y-5">
              {issues.map((issue, i) => (
                <motion.button
                  key={issue.id}
                  {...fadeUp(i * 0.08)}
                  onClick={() => setOpenIssue(issue.id)}
                  className="w-full text-left bg-paper border border-gold/15 rounded-2xl p-6 md:p-8
                             hover:border-gold/40 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="kicker">{issue.issue}</span>
                    <span className="text-text/30">·</span>
                    <span className="kicker !text-text/50">{issue.date}</span>
                    <span className="ml-auto px-3 py-1 bg-wine/10 text-wine text-[0.65rem] uppercase tracking-widest font-bold rounded-full">
                      {issue.tag}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl text-wine mb-2 font-serif group-hover:text-orange transition-colors">
                    {issue.title}
                  </h3>
                  <p className="text-text/60 text-sm leading-relaxed mb-4">{issue.preview}</p>
                  <span className="text-wine text-sm font-semibold group-hover:translate-x-1 inline-flex items-center gap-1 transition-transform">
                    Read full brief →
                  </span>
                </motion.button>
              ))}
            </div>
            <OptIn />
          </div>
        )}

        {/* ── Open article ── */}
        {openIssue && (
          <div className="container mx-auto px-6 md:px-12 max-w-5xl py-12 md:py-16">
            <button
              onClick={() => setOpenIssue(null)}
              className="mb-10 flex items-center gap-2 text-wine/70 hover:text-wine text-sm font-medium transition-colors"
            >
              ← Back to all issues
            </button>
            {openIssue === 'development-brief' ? <DevelopmentBrief /> : <LaunchBrief />}
            <OptIn />
          </div>
        )}

      </main>

      <Footer onSponsorClick={() => navigate('/donate')} />
    </div>
  );
}
