import { useEffect, useState } from 'react';
import { useParams } from 'wouter';

export default function CertificateLinkPage() {
  const { token } = useParams<{ token: string }>();
  const [state, setState] = useState<'loading' | 'form' | 'used' | 'invalid' | 'done' | 'error'>('loading');
  const [email, setEmail] = useState('');
  const [f, setF] = useState({ donorType: 'Individual', donorName: '', donorIdNumber: '', donorTaxRef: '', donorAddress: '', donorPhone: '', amount: '', donationDate: '', paymentReference: '', popiaConsent: false, declaration: false });
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Johannesburg' }).format(new Date());
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value });

  useEffect(() => {
    const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex,nofollow';
    document.head.appendChild(m);
    fetch(`/api/certificates/link/${encodeURIComponent(token)}`)
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok) { setState(r.status === 404 ? 'invalid' : 'error'); return; }
        setEmail(d.donorEmail); setF((x) => ({ ...x, donorName: d.donorName }));
        setState(d.status === 'pending' ? 'form' : 'used');
      })
      .catch(() => setState('error'));
    return () => { m.remove(); };
  }, [token]);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg('');
    const r = await fetch(`/api/certificates/link/${encodeURIComponent(token)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...f, amount: Number(f.amount) }),
    });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (r.status === 409) { setState('used'); return; }
    if (!r.ok) { setMsg(d.error ?? 'Something went wrong.'); return; }
    setMsg(d.emailed
      ? `Your Section 18A certificate ${d.certNo} has been emailed to ${email}.`
      : `Your certificate number is ${d.certNo}. We could not email it right now; we will send it to you shortly.`);
    setState('done');
  }

  const input = 'w-full border border-wine/30 rounded px-3 py-2 bg-white';
  const individual = f.donorType === 'Individual';
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-4">
        <h1 className="text-3xl font-serif text-wine">Golden Age Society</h1>
        <p className="text-sm opacity-70">Section 18A donation certificate</p>
        {state === 'loading' && <p>Loading…</p>}
        {state === 'invalid' && <p>This link is not valid. Please contact Golden Age Society.</p>}
        {state === 'error' && <p>Something went wrong. Please try again later.</p>}
        {state === 'used' && <p>This link has already been used. If you need help, please contact haribol@goldenage-society.org.</p>}
        {state === 'done' && <p className="text-lg">Hare Krishna {f.donorName}, thank you! 🙏<br />{msg}</p>}
        {state === 'form' && (
          <form onSubmit={submit} className="space-y-3">
            <p className="text-lg">Hare Krishna {f.donorName}</p>
            <p>Thank you for your donation. Please complete your details exactly as they should appear on your Section 18A certificate. It will be emailed to <strong>{email}</strong>.</p>
            <label className="block">Donor type
              <select className={input} value={f.donorType} onChange={set('donorType')}>
                <option>Individual</option><option>Company</option><option>Trust</option><option>Other</option>
              </select>
            </label>
            <label className="block">{individual ? 'Full name' : 'Registered name'}
              <input className={input} required value={f.donorName} onChange={set('donorName')} /></label>
            <label className="block">{individual ? 'SA ID or passport number' : 'Registration number'}
              <input className={input} required value={f.donorIdNumber} onChange={set('donorIdNumber')} /></label>
            <label className="block">Income tax reference number (10 digits)
              <input className={input} required inputMode="numeric" pattern="\s*\d{10}\s*" value={f.donorTaxRef} onChange={set('donorTaxRef')} /></label>
            <label className="block">Full physical address (street, suburb, city, postal code)
              <textarea className={input} required rows={2} value={f.donorAddress} onChange={set('donorAddress')} /></label>
            <label className="block">Phone number
              <input className={input} required type="tel" value={f.donorPhone} onChange={set('donorPhone')} /></label>
            <label className="block">Amount donated (ZAR)
              <input className={input} required type="number" min="1" step="0.01" value={f.amount} onChange={set('amount')} /></label>
            <label className="block">EFT payment date
              <input className={input} required type="date" max={todayStr} value={f.donationDate} onChange={set('donationDate')} /></label>
            <label className="block">Payment reference (as on your bank transfer)
              <input className={input} value={f.paymentReference} onChange={set('paymentReference')} /></label>
            <label className="flex gap-2 items-start text-sm"><input type="checkbox" required checked={f.popiaConsent} onChange={set('popiaConsent')} />
              <span>I consent to Golden Age Society processing my personal information to issue this certificate and report it to SARS, as required by law (POPIA).</span></label>
            <label className="flex gap-2 items-start text-sm"><input type="checkbox" required checked={f.declaration} onChange={set('declaration')} />
              <span>I declare that these details are true and that the donation was unconditional, with no goods or services received in return.</span></label>
            {msg && <p className="text-red-700 text-sm">{msg}</p>}
            <button className="btn-wine" disabled={busy} type="submit">{busy ? 'Submitting…' : 'Submit and email my certificate'}</button>
          </form>
        )}
      </div>
    </div>
  );
}
