import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import gasLogo from '@assets/gas-logo.png';

declare global {
  interface Window {
    PaystackPop: {
      setup: (opts: Record<string, unknown>) => { openIframe: () => void };
    };
  }
}

interface DonorForm {
  donorName: string;
  donorId: string;
  donorEmail: string;
  donorPhone: string;
  donorAddress: string;
}

type Frequency = 'once' | 'monthly';
type Step = 'form' | 'processing' | 'success' | 'error';

function formatZAR(n: number) {
  return `R ${n.toLocaleString('en-ZA')}`;
}

/* ── Sponsorship tiers ─────────────────────────────────────────────── */
interface Tier {
  id: string;
  icon: string;
  name: string;
  description: string;
  suggestedAmount: number;   // placeholder — user to confirm exact figures
  preferredFrequency: Frequency;
  tag?: string;
}

const TIERS: Tier[] = [
  {
    id: 'prasadam-pot',
    icon: '🍲',
    name: 'Sponsor a Prasadam Pot',
    description: 'Fund one township outreach feeding session — kirtan, prasadam, and book distribution in a community near you.',
    suggestedAmount: 350,
    preferredFrequency: 'once',
  },
  {
    id: 'kasi-kirtan-day',
    icon: '🎶',
    name: 'Sponsor a Kasi Kirtan Outreach Day',
    description: 'Cover instruments, transport, and sound for a full harinam/kirtan day in the townships.',
    suggestedAmount: 1500,
    preferredFrequency: 'once',
  },
  {
    id: 'translated-book',
    icon: '📖',
    name: 'Sponsor a Translated Book',
    description: 'Fund the translation and printing of a Śrīla Prabhupāda title into Zulu, Sotho, Tswana, Pedi, Xhosa, or Afrikaans.',
    suggestedAmount: 750,
    preferredFrequency: 'once',
  },
  {
    id: 'academy-student',
    icon: '🎓',
    name: 'Adopt a Kasi Kirtan Academy Student',
    description: 'Monthly recurring gift for one child\'s instrument lessons and Bhakti mentorship in the Kasi Kirtan Academy.',
    suggestedAmount: 350,
    preferredFrequency: 'monthly',
    tag: 'Monthly giving',
  },
  {
    id: 'bhakti-connect',
    icon: '📱',
    name: 'Bhakti Connect App Partner',
    description: 'Fund hosting, content development, and outreach tracking for the Bhakti Connect devotee app.',
    suggestedAmount: 1000,
    preferredFrequency: 'monthly',
    tag: 'Monthly giving',
  },
  {
    id: 'corporate-csi',
    icon: '🏢',
    name: 'Corporate CSI Partner',
    description: 'Larger annual commitment with impact reporting and site visits. Companies qualify for B-BBEE CSI recognition.',
    suggestedAmount: 5000,
    preferredFrequency: 'once',
    tag: 'CSI / B-BBEE',
  },
];

/* ── Component ─────────────────────────────────────────────────────── */
export default function DonatePage() {
  usePageTitle('Donate');
  const [, navigate] = useLocation();

  // Tier selection
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);

  // Form state
  const [selectedAmount, setSelectedAmount] = useState<number>(350);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [frequency, setFrequency] = useState<Frequency>('monthly'); // monthly-first
  const [step, setStep] = useState<Step>('form');
  const [successData, setSuccessData] = useState<{ certNumber: string; amount: number; name: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const formRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<DonorForm>();

  // Load Paystack script
  useEffect(() => {
    if (!document.getElementById('paystack-js')) {
      const s = document.createElement('script');
      s.id = 'paystack-js';
      s.src = 'https://js.paystack.co/v1/inline.js';
      document.head.appendChild(s);
    }
  }, []);

  const effectiveAmount = isCustom ? parseInt(customAmount || '0', 10) : selectedAmount;

  const selectTier = (tier: Tier) => {
    setSelectedTierId(tier.id);
    setSelectedAmount(tier.suggestedAmount);
    setIsCustom(false);
    setFrequency(tier.preferredFrequency);
    // Scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const selectedTier = TIERS.find(t => t.id === selectedTierId) ?? null;

  const onSubmit = async (formData: DonorForm) => {
    if (!effectiveAmount || effectiveAmount < 10) {
      setErrorMsg('Minimum donation is R10.');
      return;
    }
    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string | undefined;
    if (!publicKey) {
      setErrorMsg('Payment is not configured yet. Please contact us directly.');
      return;
    }
    if (!window.PaystackPop) {
      setErrorMsg('Payment library is still loading. Please wait a moment and try again.');
      return;
    }

    setStep('processing');
    setErrorMsg('');

    try {
      let planCode: string | undefined;

      if (frequency === 'monthly') {
        const res = await fetch('/api/donate/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: effectiveAmount }),
        });
        if (!res.ok) throw new Error('Could not create subscription plan.');
        const json = await res.json() as { planCode: string };
        planCode = json.planCode;
      }

      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: formData.donorEmail,
        amount: effectiveAmount * 100,
        currency: 'ZAR',
        ...(planCode ? { plan: planCode } : {}),
        metadata: {
          custom_fields: [
            { display_name: 'Donor Name',      variable_name: 'donor_name',      value: formData.donorName },
            { display_name: 'Donor ID',        variable_name: 'donor_id',        value: formData.donorId },
            { display_name: 'Donor Phone',     variable_name: 'donor_phone',     value: formData.donorPhone },
            { display_name: 'Donor Address',   variable_name: 'donor_address',   value: formData.donorAddress },
            { display_name: 'Sponsorship Tier', variable_name: 'sponsorship_tier', value: selectedTier?.name ?? 'General Donation' },
          ],
        },
        callback: (response: { reference: string }) => {
          void (async () => {
            try {
              const verifyRes = await fetch('/api/donate/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  reference: response.reference,
                  donorName: formData.donorName,
                  donorId: formData.donorId,
                  donorEmail: formData.donorEmail,
                  donorPhone: formData.donorPhone,
                  donorAddress: formData.donorAddress,
                  isRecurring: frequency === 'monthly',
                }),
              });
              const result = await verifyRes.json() as { success?: boolean; certificateNumber?: string; amountZAR?: number; donorName?: string; error?: string };
              if (!verifyRes.ok || !result.success) throw new Error(result.error ?? 'Verification failed.');
              setSuccessData({ certNumber: result.certificateNumber!, amount: result.amountZAR!, name: result.donorName! });
              setStep('success');
            } catch (err) {
              setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please contact us.');
              setStep('error');
            }
          })();
        },
        onClose: () => {
          if (step === 'processing') setStep('form');
        },
      });

      handler.openIframe();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setStep('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1e7]">

      {/* ── Sticky nav header ──────────────────────────────────────── */}
      <header className="bg-[#fffdf8] border-b border-paper shadow-sm sticky top-0 z-40 h-[64px] flex items-center">
        <div className="container mx-auto px-4 md:px-12 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={gasLogo} alt="Golden Age Society" className="w-10 h-[44px] object-contain" />
            <span className="font-serif text-wine text-base leading-tight font-semibold hidden sm:block">
              Golden Age<br/>Society
            </span>
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-sm text-text/60 hover:text-wine transition-colors">
              ← Home
            </button>
            <button
              onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="px-4 py-2 bg-wine text-cream rounded-full text-sm font-semibold hover:bg-plum transition-colors"
            >
              ♡ Donate now
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero / Section 18A callout ─────────────────────────────── */}
      <div className="bg-wine py-12 px-4 md:px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `repeating-radial-gradient(circle at center, transparent 0, transparent 30px, rgba(251,178,38,0.4) 30px, rgba(251,178,38,0.4) 31px)` }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 text-gold text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            ✦ Tax-Deductible · Section 18A Approved
          </div>
          <h1 className="text-3xl md:text-5xl font-serif text-cream mb-5 leading-tight">
            Become a Bhakti Builder.<br/>
            <em className="text-gold">Give monthly.</em>
          </h1>
          {/* OCSA / Section 18A plain-language block */}
          <div className="bg-white/10 border border-white/20 rounded-2xl px-6 py-5 text-left max-w-2xl mx-auto">
            <p className="text-cream/90 text-sm md:text-base leading-relaxed">
              <span className="text-gold font-semibold">Your donation is tax-deductible.</span>{' '}
              GAS operates under the <strong>Oasis Community Skills Academy (OCSA)</strong>, a registered nonprofit
              holding a Section 18A certificate (<strong>PBO Reference No. 930070132</strong>).
              You'll receive a tax-deductible receipt, and companies can claim <strong>CSI / B-BBEE credit</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* ── Sponsorship tiers ──────────────────────────────────────── */}
      <div className="bg-[#fffdf7] border-b border-gold/10 py-14 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="kicker mb-3">Choose how you give</p>
            <h2 className="font-serif text-3xl md:text-4xl text-wine mb-3">Sponsorship Tiers</h2>
            <p className="text-text/65 text-base max-w-xl mx-auto">
              Select a programme to support. Suggested amounts are indicated — you can adjust them in the form below.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TIERS.map((tier) => {
              const isSelected = selectedTierId === tier.id;
              return (
                <motion.button
                  key={tier.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectTier(tier)}
                  className={`text-left rounded-2xl border-2 p-5 transition-all duration-200 group ${
                    isSelected
                      ? 'border-wine bg-wine/5 shadow-md'
                      : 'border-gold/20 bg-white hover:border-wine/40 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{tier.icon}</span>
                    {tier.tag && (
                      <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full ${
                        isSelected ? 'bg-wine text-cream' : 'bg-gold/15 text-wine/80'
                      }`}>
                        {tier.tag}
                      </span>
                    )}
                    {!tier.tag && isSelected && (
                      <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full bg-wine text-cream">
                        Selected ✓
                      </span>
                    )}
                  </div>
                  <h3 className={`font-serif text-lg leading-snug mb-2 ${isSelected ? 'text-wine' : 'text-text group-hover:text-wine'}`}>
                    {tier.name}
                  </h3>
                  <p className="text-sm text-text/65 leading-relaxed mb-4">{tier.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-text/45 uppercase tracking-wider mb-0.5">Suggested</div>
                      <div className={`text-lg font-bold font-serif ${isSelected ? 'text-wine' : 'text-text/70'}`}>
                        {formatZAR(tier.suggestedAmount)}
                        {tier.preferredFrequency === 'monthly' && <span className="text-sm font-normal">/mo</span>}
                      </div>
                    </div>
                    <span className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${
                      isSelected
                        ? 'bg-wine text-cream'
                        : 'bg-paper text-wine border border-wine/20 group-hover:bg-wine group-hover:text-cream'
                    }`}>
                      {isSelected ? 'Selected ✓' : 'Select →'}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* General donation option */}
          <p className="text-center text-sm text-text/50 mt-6">
            Prefer to give a general donation?{' '}
            <button
              onClick={() => {
                setSelectedTierId(null);
                setSelectedAmount(250);
                setIsCustom(false);
                setFrequency('monthly');
                formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="text-wine underline underline-offset-2 hover:text-plum"
            >
              Skip tiers — go to form →
            </button>
          </p>
        </div>
      </div>

      {/* ── Main content: info + form ──────────────────────────────── */}
      <div ref={formRef} className="container mx-auto px-4 md:px-12 max-w-6xl py-12 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 items-start">

          {/* ── LEFT: info ────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Selected tier summary */}
            {selectedTier && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-wine/5 border-2 border-wine/20 rounded-2xl px-5 py-4 flex items-start gap-4"
              >
                <span className="text-3xl">{selectedTier.icon}</span>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-wine/60 mb-0.5">Selected tier</div>
                  <div className="font-serif text-wine text-lg leading-snug">{selectedTier.name}</div>
                  <div className="text-sm text-text/60 mt-0.5">{formatZAR(selectedTier.suggestedAmount)}{selectedTier.preferredFrequency === 'monthly' ? '/month' : ''}</div>
                </div>
              </motion.div>
            )}

            {/* Section 18A details */}
            <div className="bg-white rounded-2xl border border-gold/30 shadow-sm overflow-hidden">
              <div className="bg-wine/5 border-b border-gold/20 px-5 py-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">✓</span>
                <div>
                  <div className="font-bold text-wine text-sm uppercase tracking-wide">Section 18A Approved</div>
                  <div className="text-xs text-text/60">SARS Approved Public Benefit Organisation</div>
                </div>
              </div>
              <div className="px-5 py-5 space-y-3 text-sm">
                {[
                  ['Organisation', 'Oasis Community Skills Academy (OCSA)'],
                  ['PBO Number', '930070132'],
                  ['Income Tax Ref', '9884366171'],
                  ['18A Approval Date', '07 September 2020'],
                  ['Exemption', 'Section 10(1)(cN) Income Tax Act'],
                  ['Donations Tax', 'Exempt — Section 56(1)(h)'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-3">
                    <span className="text-text/55 shrink-0">{label}</span>
                    <span className="font-medium text-wine text-right text-xs">{value}</span>
                  </div>
                ))}
                <p className="pt-2 text-xs text-text/45 leading-relaxed border-t border-paper mt-3">
                  Donations qualify as tax-deductible subject to the limitations in Section 18A of the Income Tax Act. Companies may claim CSI credit.
                </p>
              </div>
            </div>

            {/* What your donation supports */}
            <div className="bg-white rounded-2xl border border-paper shadow-sm px-5 py-5">
              <h3 className="font-serif text-lg text-wine mb-4">Your donation supports</h3>
              <ul className="space-y-2.5">
                {[
                  ['🎶', 'Kasi Kirtan township harinam outreach'],
                  ['🍲', 'Krishna Prasadam feeding programmes'],
                  ['📖', 'Book translation into African languages'],
                  ['🤝', 'Reuniting township devotees'],
                  ['🛕', 'Temple support & development'],
                  ['📱', 'Bhakti Connect app & digital outreach'],
                ].map(([icon, label]) => (
                  <li key={label as string} className="flex items-center gap-3 text-sm text-text">
                    <span className="text-base">{icon}</span>
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bhakti Builder pitch */}
            <div className="bg-gradient-to-br from-wine to-[#4a0f1b] rounded-2xl px-5 py-5 text-cream">
              <div className="text-gold text-2xl mb-2">♻️</div>
              <div className="font-serif text-xl text-gold mb-2">Become a Bhakti Builder</div>
              <p className="text-cream/80 text-sm leading-relaxed">
                Monthly giving gives us the predictability to plan long-term programmes — hiring teachers,
                booking venues, printing books. You'll receive a Section 18A certificate for every payment.
              </p>
            </div>
          </div>

          {/* ── RIGHT: donation form ──────────────────────────────── */}
          <AnimatePresence mode="wait">

            {/* FORM STATE */}
            {(step === 'form' || step === 'processing') && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-paper overflow-hidden"
              >
                <div className="px-6 md:px-8 py-6 border-b border-paper">
                  <h2 className="font-serif text-2xl text-wine">
                    {selectedTier ? selectedTier.name : 'Make a donation'}
                  </h2>
                  <p className="text-sm text-text/60 mt-1">
                    You'll receive a Section 18A certificate by email immediately.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="px-6 md:px-8 py-6 space-y-6">

                  {/* Frequency toggle — monthly primary */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text/50 mb-2">
                      Giving frequency
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFrequency('monthly')}
                        className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all flex flex-col items-center gap-0.5 ${
                          frequency === 'monthly'
                            ? 'bg-wine text-cream border-wine shadow-sm'
                            : 'bg-paper/50 text-text/60 border-paper hover:border-wine/30'
                        }`}
                      >
                        <span>♻️ Monthly</span>
                        <span className="text-[10px] font-normal opacity-80">Bhakti Builder</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFrequency('once')}
                        className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                          frequency === 'once'
                            ? 'bg-wine text-cream border-wine shadow-sm'
                            : 'bg-paper/50 text-text/60 border-paper hover:border-wine/30'
                        }`}
                      >
                        💳 Once-off
                      </button>
                    </div>
                    {frequency === 'monthly' && (
                      <p className="text-xs text-wine/70 mt-1.5 text-center">
                        ✦ Monthly giving is our most impactful option
                      </p>
                    )}
                  </div>

                  {/* Amount selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text/50 mb-2">
                      {frequency === 'monthly' ? 'Monthly amount' : 'Donation amount'}
                      <span className="ml-2 text-text/35 font-normal normal-case tracking-normal">(suggested — adjust freely)</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[250, 350, 500, 750, 1000, 1500].map(a => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => { setSelectedAmount(a); setIsCustom(false); }}
                          className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${
                            !isCustom && selectedAmount === a
                              ? 'bg-gold/20 border-gold text-wine shadow-sm'
                              : 'bg-paper/40 text-text/60 border-paper hover:border-gold/40'
                          }`}
                        >
                          R{a.toLocaleString('en-ZA')}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCustom(true)}
                      className={`w-full py-2 rounded-xl text-sm font-semibold border transition-all ${
                        isCustom
                          ? 'bg-gold/20 border-gold text-wine shadow-sm'
                          : 'bg-paper/40 text-text/60 border-paper hover:border-gold/40'
                      }`}
                    >
                      Custom amount
                    </button>
                    {isCustom && (
                      <div className="relative mt-2">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-wine font-bold text-sm">R</span>
                        <input
                          type="number"
                          min="10"
                          placeholder="Enter amount"
                          value={customAmount}
                          onChange={e => setCustomAmount(e.target.value)}
                          className="w-full pl-8 pr-4 py-2.5 border border-paper rounded-xl text-sm focus:outline-none focus:border-wine transition-colors"
                        />
                      </div>
                    )}
                    {effectiveAmount >= 10 && (
                      <p className="text-xs text-text/50 mt-1.5">
                        {frequency === 'monthly'
                          ? `You'll be charged ${formatZAR(effectiveAmount)}/month`
                          : `Total: ${formatZAR(effectiveAmount)}`}
                      </p>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-paper" />
                    <span className="text-xs text-text/40 uppercase tracking-wider">Your details</span>
                    <div className="h-px flex-1 bg-paper" />
                  </div>

                  {/* Donor details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-text/60 mb-1.5">Full Name / Company Name <span className="text-wine">*</span></label>
                      <input
                        {...register('donorName', { required: 'Full name is required' })}
                        placeholder="e.g. Thabo Nkosi"
                        className="w-full px-4 py-2.5 border border-paper rounded-xl text-sm focus:outline-none focus:border-wine transition-colors"
                      />
                      {errors.donorName && <p className="text-xs text-red-500 mt-1">{errors.donorName.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text/60 mb-1.5">ID Number / Company Reg No. <span className="text-wine">*</span></label>
                      <input
                        {...register('donorId', { required: 'ID or company registration number is required' })}
                        placeholder="e.g. 8501015009087 or 2020/123456/07"
                        className="w-full px-4 py-2.5 border border-paper rounded-xl text-sm focus:outline-none focus:border-wine transition-colors"
                      />
                      {errors.donorId && <p className="text-xs text-red-500 mt-1">{errors.donorId.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text/60 mb-1.5">Email Address <span className="text-wine">*</span></label>
                      <input
                        {...register('donorEmail', {
                          required: 'Email is required',
                          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' }
                        })}
                        type="email"
                        placeholder="you@example.com"
                        className="w-full px-4 py-2.5 border border-paper rounded-xl text-sm focus:outline-none focus:border-wine transition-colors"
                      />
                      {errors.donorEmail && <p className="text-xs text-red-500 mt-1">{errors.donorEmail.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text/60 mb-1.5">Phone Number <span className="text-wine">*</span></label>
                      <input
                        {...register('donorPhone', { required: 'Phone number is required' })}
                        type="tel"
                        placeholder="e.g. 082 123 4567"
                        className="w-full px-4 py-2.5 border border-paper rounded-xl text-sm focus:outline-none focus:border-wine transition-colors"
                      />
                      {errors.donorPhone && <p className="text-xs text-red-500 mt-1">{errors.donorPhone.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text/60 mb-1.5">Physical Address <span className="text-wine">*</span></label>
                      <textarea
                        {...register('donorAddress', { required: 'Physical address is required' })}
                        rows={2}
                        placeholder="e.g. 10 Clifton St, Crystal Park, Gauteng, 1501"
                        className="w-full px-4 py-2.5 border border-paper rounded-xl text-sm focus:outline-none focus:border-wine transition-colors resize-none"
                      />
                      {errors.donorAddress && <p className="text-xs text-red-500 mt-1">{errors.donorAddress.message}</p>}
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={step === 'processing'}
                    className="w-full py-4 bg-wine text-cream rounded-xl text-base font-bold shadow-md hover:bg-plum transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {step === 'processing' ? (
                      <>
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Processing…
                      </>
                    ) : (
                      <>
                        <span>♡</span>
                        {frequency === 'monthly' ? 'Become a Bhakti Builder' : 'Donate'}{' '}
                        {effectiveAmount >= 10 ? formatZAR(effectiveAmount) : ''}
                        {frequency === 'monthly' ? '/month' : ''}
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-text/40 leading-relaxed">
                    Secured by Paystack · SSL encrypted · Section 18A certificate emailed instantly
                  </p>
                </form>
              </motion.div>
            )}

            {/* SUCCESS STATE */}
            {step === 'success' && successData && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-sm border border-paper overflow-hidden text-center"
              >
                <div className="bg-wine pt-10 pb-8 px-8">
                  <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold mx-auto flex items-center justify-center text-3xl mb-4">✓</div>
                  <h2 className="font-serif text-3xl text-cream mb-2">Hare Krishna! 🙏</h2>
                  <p className="text-cream/80">Thank you for your generous donation.</p>
                </div>
                <div className="px-8 py-8 space-y-6">
                  {selectedTier && (
                    <div className="bg-gold/8 border border-gold/20 rounded-xl px-5 py-3 text-left">
                      <div className="text-xs text-text/50 uppercase tracking-wider mb-0.5">Supporting</div>
                      <div className="font-serif text-wine">{selectedTier.icon} {selectedTier.name}</div>
                    </div>
                  )}
                  <div className="bg-gold/10 border border-gold/30 rounded-xl px-6 py-5">
                    <div className="text-xs font-bold uppercase tracking-wider text-text/50 mb-1">Donation received</div>
                    <div className="text-3xl font-serif font-bold text-wine">{formatZAR(successData.amount)}</div>
                    {frequency === 'monthly' && <div className="text-xs text-text/50 mt-1">per month · Bhakti Builder ♻️</div>}
                  </div>
                  <div className="bg-paper/50 rounded-xl px-6 py-4 text-left space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-text/60">Certificate Number</span>
                      <span className="font-mono font-bold text-wine">{successData.certNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text/60">Donor</span>
                      <span className="font-medium">{successData.name}</span>
                    </div>
                  </div>
                  <p className="text-sm text-text/70 leading-relaxed">
                    Your <strong>Section 18A Tax Certificate</strong> has been emailed to you. Keep it for your annual SARS tax return.
                  </p>
                  <button
                    onClick={() => navigate('/')}
                    className="w-full py-3.5 bg-wine text-cream rounded-xl font-semibold hover:bg-plum transition-colors"
                  >
                    Back to Golden Age Society
                  </button>
                </div>
              </motion.div>
            )}

            {/* ERROR STATE */}
            {step === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-sm border border-paper p-8 text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-red-100 mx-auto flex items-center justify-center text-3xl">✕</div>
                <h2 className="font-serif text-2xl text-wine">Something went wrong</h2>
                <p className="text-sm text-text/70 leading-relaxed">{errorMsg}</p>
                <div className="flex flex-col gap-3">
                  <button onClick={() => { setStep('form'); setErrorMsg(''); }} className="w-full py-3.5 bg-wine text-cream rounded-xl font-semibold hover:bg-plum transition-colors">
                    Try again
                  </button>
                  <a href="mailto:ocsacademy2020@gmail.com" className="w-full py-3.5 border border-wine text-wine rounded-xl font-semibold hover:bg-wine/5 transition-colors block text-center">
                    Contact us directly
                  </a>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
