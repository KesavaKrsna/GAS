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

const FESTIVALS = [
  {
    name: 'Gaura Purnima',
    icon: '🌕',
    description: 'The appearance day of Lord Caitanya Mahāprabhu — the most sacred festival in the GAS calendar. Celebrated with all-night kirtan, Prasadam, and readings from the Caitanya-caritāmṛta.',
    typicalMonth: 'March',
    tag: 'Annual festival',
  },
  {
    name: 'Ratha Yatra',
    icon: '🎡',
    description: 'The Festival of the Chariots. Lord Jagannātha is drawn through the streets in a chariot procession accompanied by kirtan and Prasadam distribution — open to the whole community.',
    typicalMonth: 'June / July',
    tag: 'Annual festival',
  },
  {
    name: 'Janmashtami',
    icon: '🎊',
    description: "The appearance day of Lord Krishna, celebrated at midnight with fasting, bhajans, and an abhisheka ceremony for the deity. One of the most joyful evenings in the devotional year.",
    typicalMonth: 'August',
    tag: 'Annual festival',
  },
  {
    name: 'Diwali / Govardhan Puja',
    icon: '🪔',
    description: 'Govardhan Puja is observed the day after Diwali to commemorate Lord Krishna lifting Govardhana Hill. Celebrated with annakuta — a mountain of offered food — kirtan and community gathering.',
    typicalMonth: 'October / November',
    tag: 'Annual festival',
  },
];

const OUTREACH_DAYS = [
  {
    name: 'Kasi Kirtan Soweto',
    icon: '🎶',
    date: 'Date TBC — contact us',
    location: 'Soweto, Gauteng',
    description: 'Township harinam and Prasadam distribution. All are welcome to join.',
  },
  {
    name: 'Kasi Kirtan Tembisa',
    icon: '🎶',
    date: 'Date TBC — contact us',
    location: 'Tembisa, Gauteng',
    description: 'Township harinam and Prasadam distribution. All are welcome to join.',
  },
  {
    name: 'Kasi Kirtan Katlehong',
    icon: '🎶',
    date: 'Date TBC — contact us',
    location: 'Katlehong, Gauteng',
    description: 'Township harinam and Prasadam distribution — GAS base area.',
  },
  {
    name: 'Book Distribution Drive',
    icon: '📖',
    date: 'Ongoing',
    location: 'Various townships',
    description: 'Distributing Prabhupāda\'s books in Zulu, Sotho, Tswana, and English at township outreach events.',
  },
  {
    name: 'Inter-Faith Symposium',
    icon: '🕊️',
    date: '15 August 2026 · 13:30–16:00',
    location: 'Katlegong Resource Centre, L824 Ramakonopi East, Katlegong',
    description: 'A multi-faith gathering exploring unity in diversity. Many paths. One truth. Meal will be served.',
    featured: true,
  },
];

export default function EventsPage() {
  usePageTitle('Events & Calendar');
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <PageHero
        kicker="Festivals & Outreach Days"
        title={<>Events & <em>Calendar</em></>}
        subtitle="Annual sacred festivals, township kirtan days, and community outreach events. All hearts welcome."
      />

      <div className="max-w-5xl mx-auto px-4 md:px-12 py-16 space-y-16">

        {/* ── Annual Festivals ─────────────────────────────────── */}
        <div>
          <div className="text-center mb-10">
            <div className="kicker mb-3">Sacred observances</div>
            <h2 className="font-serif text-3xl md:text-4xl text-wine">Annual Festivals</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FESTIVALS.map((fest, i) => (
              <motion.div key={fest.name} {...fadeUp(i * 0.07)}
                className="bg-white rounded-2xl border border-gold/20 shadow-sm p-6 hover:shadow-md hover:border-gold/40 transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{fest.icon}</span>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full bg-gold/15 text-wine/80">{fest.tag}</span>
                    <h3 className="font-serif text-xl text-wine mt-1">{fest.name}</h3>
                  </div>
                </div>
                <p className="text-sm text-text/70 leading-relaxed mb-3">{fest.description}</p>
                <div className="flex items-center gap-2 text-xs text-text/50">
                  <span>🗓</span> Typically: <span className="font-semibold text-wine/70">{fest.typicalMonth}</span>
                  <span className="ml-1 text-text/30">· Exact date announced annually</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Community Outreach Days ──────────────────────────── */}
        <div>
          <div className="text-center mb-10">
            <div className="kicker mb-3">On the ground</div>
            <h2 className="font-serif text-3xl md:text-4xl text-wine">Outreach Days</h2>
            <p className="text-text/60 mt-3 text-sm max-w-md mx-auto">
              Dates are updated regularly.{' '}
              <a href="mailto:ocsacademy2020@gmail.com" className="text-wine underline underline-offset-2">Contact us</a>
              {' '}to confirm the next outreach in your area.
            </p>
          </div>
          <div className="space-y-4">
            {OUTREACH_DAYS.map((day, i) => (
              <motion.div key={day.name} {...fadeUp(i * 0.06)}
                className={`rounded-2xl border p-5 flex items-start gap-4 transition-all ${
                  day.featured
                    ? 'bg-wine/5 border-wine/30 shadow-sm'
                    : 'bg-white border-gold/15 hover:border-gold/30'
                }`}
              >
                <span className="text-2xl mt-0.5 flex-shrink-0">{day.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-serif text-lg text-wine">{day.name}</h3>
                    {day.featured && (
                      <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full bg-wine text-cream">Featured</span>
                    )}
                  </div>
                  <p className="text-sm text-text/65 leading-relaxed mb-2">{day.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-text/50">
                    <span className="flex items-center gap-1"><span>🗓</span> {day.date}</span>
                    <span className="flex items-center gap-1"><span>📍</span> {day.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Stay updated ─────────────────────────────────────── */}
        <motion.div {...fadeUp(0.1)} className="bg-wine rounded-2xl px-8 py-8 text-center text-cream">
          <h3 className="font-serif text-2xl text-gold mb-3">Stay updated</h3>
          <p className="text-cream/80 mb-6 text-sm leading-relaxed max-w-md mx-auto">
            Dates are announced through our newsletter and WhatsApp group. Join to receive updates directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/newsletter')} className="px-6 py-3 bg-gold text-[#1a0a00] rounded-full font-bold text-sm hover:bg-cream transition-colors">
              Subscribe to newsletter
            </button>
            <a href="mailto:ocsacademy2020@gmail.com?subject=Add%20me%20to%20the%20WhatsApp%20group" className="px-6 py-3 border border-cream/30 text-cream rounded-full font-semibold text-sm hover:bg-white/10 transition-colors">
              Join WhatsApp updates
            </a>
          </div>
        </motion.div>
      </div>
      <Footer onSponsorClick={() => navigate('/donate')} />
    </div>
  );
}
