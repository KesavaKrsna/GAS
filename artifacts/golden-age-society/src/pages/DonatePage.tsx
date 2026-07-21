import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
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

const PRESET_AMOUNTS = [100, 250, 500, 1000, 2500];

type Frequency = 'once' | 'monthly';
type Step = 'form' | 'processing' | 'success' | 'error';

function formatZAR(n: number) {
  return `R ${n.toLocaleString('en-ZA')}`;
}

export default function DonatePage() {
  const [, navigate] = useLocation();
  const [selectedAmount, setSelectedAmount] = useState<number>(250);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [frequency, setFrequency] = useState<Frequency>('once');
  const [step, setStep] = useState<Step>('form');
  const [successData, setSuccessData] = useState<{ certNumber: string; amount: number; name: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

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
        amount: effectiveAmount * 100, // kobo
        currency: 'ZAR',
        ...(planCode ? { plan: planCode } : {}),
        metadata: {
          custom_fields: [
            { display_name: 'Donor Name',    variable_name: 'donor_name',    value: formData.donorName },
            { display_name: 'Donor ID',      variable_name: 'donor_id',      value: formData.donorId },
            { display_name: 'Donor Phone',   variable_name: 'donor_phone',   value: formData.donorPhone },
            { display_name: 'Donor Address', variable_name: 'donor_address', value: formData.donorAddress },
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

      {/* ── Compact nav header ───────────────────────────────────────────── */}
      <header className="bg-[#fffdf8] border-b border-paper shadow-sm sticky top-0 z-40 h-[72px] flex items-center">
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={gasLogo} alt="Golden Age Society" className="w-12 h-[53px] object-contain" />
            <span className="font-serif text-wine text-lg leading-tight font-semibold hidden sm:block">
              Golden Age<br/>Society
            </span>
          </button>
          <button onClick={() => navigate('/')} className="text-sm text-text/60 hover:text-wine transition-colors flex items-center gap-1">
            ← Back to home
          </button>
        </div>
      </header>

      {/* ── Hero banner ──────────────────────────────────────────────────── */}
      <div className="bg-wine py-12 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `repeating-radial-gradient(circle at center, transparent 0, transparent 30px, rgba(251,178,38,0.4) 30px, rgba(251,178,38,0.4) 31px)` }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 text-gold text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            ✦ Section 18A Approved · PBO No. 930070132
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-cream mb-4">
            Support the <em className="text-gold">Golden Age Society.</em>
          </h1>
          <p className="text-cream/80 text-lg max-w-xl mx-auto leading-relaxed">
            Your donation is tax-deductible under Section 18A of the Income Tax Act. A certified receipt will be emailed to you instantly.
          </p>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="container mx-auto px-6 md:px-12 max-w-6xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 items-start">

          {/* ── LEFT: Info column ─────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Section 18A Status Card */}
            <div className="bg-white rounded-2xl border border-gold/30 shadow-sm overflow-hidden">
              <div className="bg-wine/5 border-b border-gold/20 px-6 py-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-lg font-bold">✓</span>
                <div>
                  <div className="font-bold text-wine text-sm uppercase tracking-wide">Section 18A Approved</div>
                  <div className="text-xs text-text/60">SARS Approved Public Benefit Organisation</div>
                </div>
              </div>
              <div className="px-6 py-5 space-y-3 text-sm">
                {[
                  ['PBO Number', '930070132'],
                  ['Income Tax Reference', '9884366171'],
                  ['Section 18A Approval', '07 September 2020'],
                  ['Exemption', 'Section 10(1)(cN) of the Income Tax Act'],
                  ['Donations Tax', 'Exempt under Section 56(1)(h)'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="text-text/60">{label}</span>
                    <span className="font-medium text-wine text-right">{value}</span>
                  </div>
                ))}
                <p className="pt-2 text-xs text-text/50 leading-relaxed">
                  Donations to Golden Age Society qualify as tax-deductible in terms of and subject to the limitations prescribed in Section 18A of the Income Tax Act.
                </p>
              </div>
            </div>

            {/* What your donation funds */}
            <div className="bg-white rounded-2xl border border-paper shadow-sm px-6 py-5">
              <h3 className="font-serif text-xl text-wine mb-4">Your donation supports</h3>
              <ul className="space-y-2.5">
                {[
                  ['🎶', 'Kasi Kirtan outreach'],
                  ['🍱', 'Prasadam distribution'],
                  ['📚', 'Translation & distribution of books'],
                  ['🏘️', 'Reuniting township devotees'],
                  ['🛕', 'Temple support and maintenance'],
                ].map(([icon, label]) => (
                  <li key={label as string} className="flex items-center gap-3 text-sm text-text">
                    <span className="text-base">{icon}</span>
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recurring benefit badge */}
            <div className="bg-gold/10 border border-gold/30 rounded-2xl px-6 py-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">♻️</span>
                <div>
                  <div className="font-semibold text-wine text-sm mb-1">Set up a monthly donation</div>
                  <p className="text-xs text-text/70 leading-relaxed">
                    Monthly recurring donations give us predictable funding so we can plan long-term programmes. You'll receive a Section 18A certificate for every payment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Donation form ──────────────────────────────────────── */}
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
                <div className="px-8 py-6 border-b border-paper">
                  <h2 className="font-serif text-2xl text-wine">Make a donation</h2>
                  <p className="text-sm text-text/60 mt-1">You'll receive a Section 18A certificate by email immediately.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-6">

                  {/* Frequency toggle */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text/50 mb-2">Donation type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['once', 'monthly'] as Frequency[]).map(f => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFrequency(f)}
                          className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                            frequency === f
                              ? 'bg-wine text-cream border-wine shadow-sm'
                              : 'bg-paper/50 text-text/60 border-paper hover:border-wine/30'
                          }`}
                        >
                          {f === 'once' ? '💳 Once-off' : '♻️ Monthly'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text/50 mb-2">
                      {frequency === 'monthly' ? 'Monthly amount' : 'Donation amount'}
                    </label>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {PRESET_AMOUNTS.map(a => (
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
                      <button
                        type="button"
                        onClick={() => setIsCustom(true)}
                        className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${
                          isCustom
                            ? 'bg-gold/20 border-gold text-wine shadow-sm'
                            : 'bg-paper/40 text-text/60 border-paper hover:border-gold/40'
                        }`}
                      >
                        Custom
                      </button>
                    </div>
                    {isCustom && (
                      <div className="relative">
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
                        {frequency === 'monthly' ? `You'll be charged ${formatZAR(effectiveAmount)}/month` : `Total: ${formatZAR(effectiveAmount)}`}
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
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-text/60 mb-1.5">Full Name / Company Name <span className="text-wine">*</span></label>
                      <input
                        {...register('donorName', { required: 'Full name is required' })}
                        placeholder="e.g. Thabo Nkosi"
                        className="w-full px-4 py-2.5 border border-paper rounded-xl text-sm focus:outline-none focus:border-wine transition-colors"
                      />
                      {errors.donorName && <p className="text-xs text-red-500 mt-1">{errors.donorName.message}</p>}
                    </div>

                    {/* ID / Company Reg */}
                    <div>
                      <label className="block text-xs font-semibold text-text/60 mb-1.5">ID Number / Company Registration No. <span className="text-wine">*</span></label>
                      <input
                        {...register('donorId', { required: 'ID or company registration number is required' })}
                        placeholder="e.g. 8501015009087 or 2020/123456/07"
                        className="w-full px-4 py-2.5 border border-paper rounded-xl text-sm focus:outline-none focus:border-wine transition-colors"
                      />
                      {errors.donorId && <p className="text-xs text-red-500 mt-1">{errors.donorId.message}</p>}
                    </div>

                    {/* Email */}
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

                    {/* Phone */}
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

                    {/* Address */}
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

                  {/* Submit */}
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
                        Donate {effectiveAmount >= 10 ? formatZAR(effectiveAmount) : ''}{frequency === 'monthly' ? '/month' : ''}
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-text/40 leading-relaxed">
                    Secured by Paystack · SSL encrypted · Your certificate will be emailed instantly
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
                  <div className="bg-gold/10 border border-gold/30 rounded-xl px-6 py-5">
                    <div className="text-xs font-bold uppercase tracking-wider text-text/50 mb-1">Donation received</div>
                    <div className="text-3xl font-serif font-bold text-wine">{formatZAR(successData.amount)}</div>
                    {frequency === 'monthly' && <div className="text-xs text-text/50 mt-1">per month</div>}
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
                  <a href="mailto:donations@goldenagesociety.org" className="w-full py-3.5 border border-wine text-wine rounded-xl font-semibold hover:bg-wine/5 transition-colors block">
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
