import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { CONTACT_EMAIL, mailto } from '@/config/site';

export const PICKUP_POINTS = ['Soweto', 'Edenvale', 'Hammanskraal', 'Johannesburg'];

export function SectionHeading({ kicker, title, intro }: { kicker: string; title: React.ReactNode; intro?: React.ReactNode }) {
  return (
    <div className="text-center mb-10">
      <div className="kicker mb-3">{kicker}</div>
      <h2 className="font-serif text-3xl md:text-4xl text-wine mb-3">{title}</h2>
      {intro && <p className="text-text/65 text-base max-w-2xl mx-auto leading-relaxed">{intro}</p>}
    </div>
  );
}

/** Katlehong Saturday Harināma & prasādam feature. */
export function KatlehongFeature({ showChecklist = true }: { showChecklist?: boolean }) {
  const [, navigate] = useLocation();
  return (
    <div className="bg-white rounded-[1.75rem] border border-gold/25 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2">
      <div className="p-7 md:p-9">
        <span className="inline-block text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-gold/15 text-wine/80 mb-3">
          First outreach centre
        </span>
        <h3 className="font-serif text-2xl md:text-3xl text-wine mb-3">Katlehong Harināma &amp; Prasādam</h3>
        <p className="text-text/75 leading-relaxed text-[15px] mb-4">
          Our first working model: congregational chanting through the streets of Katlehong followed by prasādam,
          which is donated in kind. Devotees travel in from {PICKUP_POINTS.join(', ')}.
        </p>
        <dl className="grid grid-cols-2 gap-3 text-sm mb-5">
          <div className="bg-paper/60 rounded-xl p-3"><dt className="text-text/50 text-xs uppercase tracking-wider">When</dt><dd className="font-medium text-wine">Saturdays, details on request</dd></div>
          <div className="bg-paper/60 rounded-xl p-3"><dt className="text-text/50 text-xs uppercase tracking-wider">Transport need</dt><dd className="font-medium text-wine">At least R2,000 per day</dd></div>
          <div className="bg-paper/60 rounded-xl p-3"><dt className="text-text/50 text-xs uppercase tracking-wider">Status</dt><dd className="font-medium text-wine">Active; frequency being confirmed</dd></div>
          <div className="bg-paper/60 rounded-xl p-3"><dt className="text-text/50 text-xs uppercase tracking-wider">Pick-up points</dt><dd className="font-medium text-wine">{PICKUP_POINTS.join(' · ')}</dd></div>
        </dl>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate('/donate?tier=transport')} className="inline-flex items-center gap-2 px-5 py-2.5 bg-wine text-cream rounded-full text-sm font-semibold hover:bg-plum transition-colors">
            Sponsor a transport day →
          </button>
          <button onClick={() => navigate('/get-involved')} className="inline-flex items-center gap-2 px-5 py-2.5 border border-wine/30 text-wine rounded-full text-sm font-semibold hover:bg-wine/5 transition-colors">
            Volunteer
          </button>
        </div>
      </div>
      {showChecklist && (
        <div className="bg-gradient-to-br from-wine to-[#4a0f1b] text-cream p-7 md:p-9">
          <div className="text-gold font-serif text-xl mb-4">Programme-day checklist</div>
          <ol className="space-y-2.5 text-sm text-cream/85 list-decimal pl-5">
            <li>Confirm transport is funded (R2,000 target) and drivers / pick-up times are set.</li>
            <li>Confirm prasādam donations in kind and who is cooking and serving.</li>
            <li>Kīrtan team, instruments and books packed (prepared on Friday).</li>
            <li>Photo consent: no photos of children or vulnerable people without consent.</li>
            <li>Record attendance, prasādam served and books given.</li>
            <li>Reconcile money raised and spent within the week; two people sign off.</li>
          </ol>
        </div>
      )}
    </div>
  );
}

const SERVICE_TYPES = ['Kīrtan / Harināma', 'Prasādam cooking & serving', 'Transport / driving', 'Books', 'Devotee care follow-ups', 'Finance & records', 'Media (with consent rules)'];

/** Opt-in register / volunteer form. No backend: opens the visitor's email app with the details. */
export function VolunteerForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [origin, setOrigin] = useState('');
  const [availability, setAvailability] = useState('');
  const [skills, setSkills] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);

  const toggle = (s: string) => setServices((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  const body = [
    `Name: ${name}`,
    `Phone / WhatsApp: ${phone}`,
    `Travelling from: ${origin}`,
    `Availability: ${availability}`,
    `Skills: ${skills}`,
    `Type of service: ${services.join(', ')}`,
    `I agree to be added to the GAS opt-in register: ${consent ? 'yes' : 'no'}`,
  ].join('\n');

  const href = `${mailto('Volunteer / opt-in register')}&body=${encodeURIComponent(body)}`;
  const inputCls = 'w-full px-4 py-2.5 border border-paper rounded-xl text-sm focus:outline-none focus:border-wine transition-colors bg-white';

  return (
    <form
      className="bg-white rounded-2xl border border-paper shadow-sm p-6 md:p-8 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        window.location.href = href;
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="text-xs font-semibold text-text/60">Name<input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls + ' mt-1.5'} /></label>
        <label className="text-xs font-semibold text-text/60">Phone / WhatsApp<input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls + ' mt-1.5'} /></label>
        <label className="text-xs font-semibold text-text/60">Travelling from
          <select value={origin} onChange={(e) => setOrigin(e.target.value)} className={inputCls + ' mt-1.5'}>
            <option value="">Choose…</option>
            {[...PICKUP_POINTS, 'Katlehong', 'Other'].map((p) => <option key={p}>{p}</option>)}
          </select>
        </label>
        <label className="text-xs font-semibold text-text/60">Availability<input value={availability} onChange={(e) => setAvailability(e.target.value)} placeholder="e.g. Saturdays, Wednesday evenings" className={inputCls + ' mt-1.5'} /></label>
      </div>
      <label className="block text-xs font-semibold text-text/60">Skills<textarea rows={2} value={skills} onChange={(e) => setSkills(e.target.value)} className={inputCls + ' mt-1.5 resize-none'} /></label>
      <div>
        <div className="text-xs font-semibold text-text/60 mb-2">Type of service</div>
        <div className="flex flex-wrap gap-2">
          {SERVICE_TYPES.map((s) => (
            <button type="button" key={s} onClick={() => toggle(s)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${services.includes(s) ? 'bg-gold/20 border-gold text-wine' : 'bg-paper/40 border-paper text-text/60 hover:border-gold/40'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <label className="flex items-start gap-2 text-sm text-text/70">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
        I agree to be added to the GAS opt-in register. My details are kept confidential and I can ask to be removed at any time.
      </label>
      <button type="submit" className="w-full py-3.5 bg-wine text-cream rounded-xl font-semibold hover:bg-plum transition-colors">
        Send via email
      </button>
      <p className="text-xs text-text/45 text-center">This opens your email app with your details filled in, addressed to {CONTACT_EMAIL}.</p>
    </form>
  );
}

const ASHRAMA_STAGES = [
  { stage: 'Stage 1', title: 'Home programmes', body: 'Monthly saṅga at Keshav Krsna Prabhu’s house and home visits that build steady sādhanā.' },
  { stage: 'Stage 2', title: 'Outreach centre', body: 'A regular base for Harināma and prasādam, starting with Katlehong as the working model.' },
  { stage: 'Stage 3', title: 'Residential seva', body: 'Committed devotees serving and living together, with structured study and devotee care.' },
  { stage: 'Stage 4', title: 'Brahmacārī āśrama', body: 'A full brahmacārī āśrama training devotees who can cultivate other devotees.' },
];

export function AshramaTimeline() {
  return (
    <ol className="relative grid grid-cols-1 md:grid-cols-4 gap-4">
      {ASHRAMA_STAGES.map((s, i) => (
        <li key={s.stage} className="relative bg-paper rounded-[1.5rem] p-6 border border-gold/15">
          <div className="w-10 h-10 rounded-full bg-wine text-gold font-serif flex items-center justify-center mb-3">{i + 1}</div>
          <div className="kicker mb-1">{s.stage}</div>
          <h3 className="font-serif text-xl text-wine mb-2">{s.title}</h3>
          <p className="text-sm text-text/70 leading-relaxed">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

export const ASHRAMA_NOTE = 'The booklet sets out four stages ending in a brahmacārī āśrama. Stage wording is a draft to be agreed by the core team.';

export const WEEKLY_RHYTHM = [
  ['Mon', 'Quote of the week'],
  ['Tue', 'Japa focus'],
  ['Wed', 'Online class'],
  ['Thu', 'Devotee check-ins'],
  ['Fri', 'Kīrtan preparation'],
  ['Sat', 'Katlehong Harināma'],
  ['Sun', 'Reading'],
];

export function WeeklyRhythm() {
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {WEEKLY_RHYTHM.map(([d, t]) => (
          <div key={d} className="bg-white rounded-xl border border-gold/20 p-3 text-center">
            <div className="font-serif text-gold text-lg">{d}</div>
            <div className="text-xs text-text/75">{t}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-text/50 mt-3 text-center">Monthly saṅga at Keshav Krsna Prabhu’s house. Times and links: details on request.</p>
    </div>
  );
}
