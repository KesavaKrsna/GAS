import React from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import gasLogo from '@assets/gas-logo.png';
import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ─── Newsletter issue data ─── */
const issues = [
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

/* ─── Page ─── */
export default function NewsletterPage() {
  const [, navigate] = useLocation();
  const [openIssue, setOpenIssue] = React.useState<string | null>(null);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-cream font-sans text-text">
      <Header />

      <main className="flex-1 pt-[96px]">

        {/* ── Masthead ── */}
        <div className="bg-wine relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-plum/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

          <div className="container relative z-10 mx-auto px-6 md:px-12 max-w-5xl py-16 md:py-20 flex flex-col md:flex-row items-center gap-8 md:gap-14">
            <img src={gasLogo} alt="GAS Logo" className="w-20 h-20 md:w-28 md:h-28 object-contain filter brightness-[10] shrink-0" />
            <div>
              <div className="kicker !text-gold mb-3">Golden Age Society</div>
              <h1 className="text-4xl md:text-5xl text-cream mb-3 leading-tight">
                Our <em>Newsletter</em>
              </h1>
              <p className="text-cream/70 text-base md:text-lg max-w-xl leading-relaxed">
                Updates, briefs and communications from the Golden Age Society — keeping our
                community and partners informed, transparently and with devotion.
              </p>
            </div>
          </div>
        </div>

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
            <LaunchBrief />
          </div>
        )}

      </main>

      <Footer onSponsorClick={() => navigate('/donate')} />
    </div>
  );
}
