import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

type Status = 'idle' | 'sending' | 'success' | 'error';

const BASE_URL = import.meta.env.BASE_URL?.replace(/\/$/, '') ?? '';

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Something went wrong. Please try again.');
      }
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      setErrorMsg(err.message ?? 'Something went wrong.');
      setStatus('error');
    }
  };

  const inputCls = `w-full px-4 py-3 rounded-xl border border-cream/20 bg-white/10 text-cream placeholder-cream/40
    focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition text-sm`;

  return (
    <section id="contact-form" className="py-24 md:py-[105px] bg-wine relative overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-plum/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6 md:px-12 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">

          {/* Left — intro */}
          <div>
            {/* Decorative element */}
            <div className="hidden lg:flex mb-8 w-16 h-16 rounded-full border-2 border-gold/30 items-center justify-center">
              <span className="text-3xl text-gold font-serif pb-1">✦</span>
            </div>

            <motion.div {...fadeUp(0)} className="kicker !text-gold mb-4">Get in touch</motion.div>
            <motion.h2 {...fadeUp(0.07)} className="text-4xl md:text-5xl text-cream mb-6 leading-tight">
              We'd love to <em>hear from you.</em>
            </motion.h2>
            <motion.p {...fadeUp(0.13)} className="text-cream/80 leading-relaxed mb-10 text-base md:text-lg">
              Whether you'd like to join a gathering, volunteer, partner with us, or simply learn more
              about our mission — reach out and we'll get back to you with devotion.
            </motion.p>

            <motion.div {...fadeUp(0.18)} className="space-y-5">
              {[
                { icon: '✉️', label: 'Email', value: 'ocsacademy2020@gmail.com', href: 'mailto:ocsacademy2020@gmail.com' },
                { icon: '📍', label: 'Based in', value: 'No.5, Fourth Avenue, Edenvale 1609', href: null },
                { icon: '🕐', label: 'Response time', value: 'Within 2–3 business days', href: null },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4">
                  <span className="text-xl mt-0.5">{item.icon}</span>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-cream/50 font-semibold mb-0.5">{item.label}</div>
                    {item.href
                      ? <a href={item.href} className="text-gold hover:text-cream transition-colors font-medium">{item.value}</a>
                      : <span className="text-cream/80 font-medium">{item.value}</span>}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — form */}
          <motion.div {...fadeUp(0.1)} className="bg-white/5 rounded-2xl border border-cream/10 p-8 md:p-10">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-10"
                >
                  <div className="text-5xl mb-5">🙏</div>
                  <h3 className="font-serif text-2xl text-cream mb-3">Message received!</h3>
                  <p className="text-cream/70 leading-relaxed text-sm max-w-xs mx-auto">
                    Thank you for reaching out. We'll respond within 2–3 business days. Hare Krishna!
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-8 px-6 py-2.5 bg-cream text-wine rounded-full text-sm font-bold hover:bg-gold hover:text-wine transition-all"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest text-cream/55 mb-1.5">Name *</label>
                      <input
                        type="text" required value={form.name} onChange={set('name')}
                        placeholder="Your name" className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest text-cream/55 mb-1.5">Email *</label>
                      <input
                        type="email" required value={form.email} onChange={set('email')}
                        placeholder="you@example.com" className={inputCls}
                      />
                    </div>
                  </div>

                  {/* Phone + Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest text-cream/55 mb-1.5">Phone</label>
                      <input
                        type="tel" value={form.phone} onChange={set('phone')}
                        placeholder="+27 ..." className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest text-cream/55 mb-1.5">Subject</label>
                      <select value={form.subject} onChange={set('subject')} className={inputCls}>
                        <option value="" className="bg-wine text-cream">Select a topic…</option>
                        <option value="General enquiry" className="bg-wine text-cream">General enquiry</option>
                        <option value="Volunteering" className="bg-wine text-cream">Volunteering</option>
                        <option value="Partnership" className="bg-wine text-cream">Partnership</option>
                        <option value="Join a gathering" className="bg-wine text-cream">Join a gathering</option>
                        <option value="Donation enquiry" className="bg-wine text-cream">Donation enquiry</option>
                        <option value="Media / Press" className="bg-wine text-cream">Media / Press</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-cream/55 mb-1.5">Message *</label>
                    <textarea
                      required value={form.message} onChange={set('message')}
                      rows={5} placeholder="Tell us how we can help…"
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  {/* Error */}
                  {status === 'error' && (
                    <p className="text-sm text-red-200 bg-red-900/40 rounded-lg px-4 py-3">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full py-3.5 bg-cream text-wine rounded-xl font-bold text-base
                               hover:bg-gold hover:text-wine transition-all shadow-sm
                               disabled:opacity-60 disabled:cursor-not-allowed
                               flex items-center justify-center gap-2"
                  >
                    {status === 'sending' ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <>
                        Send message
                        <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
