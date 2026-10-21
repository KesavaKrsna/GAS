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

/* ─── Monthly report: §15 metrics. Values stay null until verified. ─── */
// TODO Kgosi: fill in verified monthly figures (numbers or 'R …' strings). null = "to be published".
const REPORT_MONTH: string | null = null;
const MONTHLY_METRICS: { label: string; value: string | null }[] = [
  { label: 'Classes held', value: null },
  { label: 'Harināmas', value: null },
  { label: 'Volunteers active', value: null },
  { label: 'Prasādam plates served', value: null },
  { label: 'Books distributed', value: null },
  { label: 'Devotee-care follow-ups', value: null },
  { label: 'Income by source', value: null },
  { label: 'Spend by purpose', value: null },
  { label: 'Balance', value: null },
];

// TODO Kgosi: per-event reconciliation (real figures only). null = "to be published".
const RECONCILIATION = { event: 'Katlehong Harināma transport day', target: 2000, raised: null as number | null, spent: null as number | null, carriedForward: null as number | null };

const PHOTOS = [1, 2, 4, 5, 7, 9].map((n) => `/gallery-prasadam-${n}.jpeg`);

const zar = (n: number | null) => (n === null ? 'To be published' : `R ${n.toLocaleString('en-ZA')}`);

export default function ImpactPage() {
  usePageTitle('Impact & Stories');
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <PageHero
        kicker="Making the Mission Visible"
        title={<>Impact & <em>Stories</em></>}
        subtitle="Honest monthly reporting: what we did, what came in and what was spent. Figures appear here once verified."
      />

      <div className="max-w-5xl mx-auto px-4 md:px-12 py-16 space-y-16">

        {/* ── Monthly report ─────────────────────────────────── */}
        <motion.div {...fadeUp(0.05)} className="bg-gradient-to-br from-wine/5 to-gold/5 border-2 border-gold/20 rounded-2xl p-8">
          <div className="flex items-start gap-4 mb-6">
            <span className="text-3xl">📋</span>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-wine/60 mb-0.5">Monthly report</div>
              <h3 className="font-serif text-2xl text-wine">{REPORT_MONTH ?? 'First report: figures to be published'}</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {MONTHLY_METRICS.map((m) => (
              <div key={m.label} className="bg-white rounded-xl border border-gold/15 p-4">
                <div className="text-xs text-text/50 uppercase tracking-wider mb-1">{m.label}</div>
                <div className={`font-serif ${m.value ? 'text-2xl text-wine font-bold' : 'text-sm text-text/45 italic'}`}>{m.value ?? 'Figures to be published'}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-text/50 mt-4">We only publish figures that have been checked against the ledger and receipts.</p>
        </motion.div>

        {/* ── Reconciliation card ─────────────────────────────── */}
        <motion.div {...fadeUp(0.1)} className="bg-white rounded-2xl border border-gold/25 shadow-sm overflow-hidden max-w-xl mx-auto">
          <div className="bg-wine/5 border-b border-gold/20 px-6 py-4">
            <div className="text-xs font-bold uppercase tracking-widest text-wine/60">Event reconciliation</div>
            <div className="font-serif text-xl text-wine">{RECONCILIATION.event}</div>
            <div className="text-xs text-text/50">Saturdays, details on request</div>
          </div>
          <dl className="px-6 py-5 space-y-3 text-sm">
            {[
              ['Target', zar(RECONCILIATION.target)],
              ['Raised', zar(RECONCILIATION.raised)],
              ['Spent', zar(RECONCILIATION.spent)],
              ['Balance carried forward', zar(RECONCILIATION.carriedForward)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <dt className="text-text/55">{k}</dt>
                <dd className={v === 'To be published' ? 'text-text/45 italic' : 'font-semibold text-wine'}>{v === 'To be published' ? 'Figures to be published' : v}</dd>
              </div>
            ))}
          </dl>
          <p className="px-6 pb-5 text-xs text-text/45">Two-person sign-off on every reconciliation.</p>
        </motion.div>

        {/* ── Photos ─────────────────────────────────────────── */}
        <div>
          <div className="text-center mb-8">
            <div className="kicker mb-3">From the field</div>
            <h2 className="font-serif text-3xl text-wine">Prasādam outreach</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PHOTOS.map((src) => (
              <div key={src} className="aspect-square rounded-2xl overflow-hidden border border-gold/15">
                <img src={src} alt="GAS prasādam outreach" loading="lazy" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="bg-plum py-14 px-4 text-center grain relative overflow-hidden">
        <h2 className="font-serif text-3xl text-cream mb-4">Be part of the next chapter.</h2>
        <p className="text-cream/80 mb-8 max-w-md mx-auto">Every donation adds to this story.</p>
        <button onClick={() => navigate('/donate')} className="btn-gold">
          ♡ Donate now →
        </button>
      </div>
      <Footer onSponsorClick={() => navigate('/donate')} />
    </div>
  );
}
