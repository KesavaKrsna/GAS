import { useEffect, useState } from 'react';
import { useParams } from 'wouter';

export default function ReceiptLinkPage() {
  const { token } = useParams<{ token: string }>();
  const [state, setState] = useState<'loading' | 'form' | 'used' | 'invalid' | 'done' | 'error'>('loading');
  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Johannesburg' }).format(new Date());

  useEffect(() => {
    const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex,nofollow';
    document.head.appendChild(m);
    fetch(`/api/receipts/link/${encodeURIComponent(token)}`)
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok) { setState(r.status === 404 ? 'invalid' : 'error'); return; }
        setDonorName(d.donorName); setState(d.status === 'pending' ? 'form' : 'used');
      })
      .catch(() => setState('error'));
    return () => { m.remove(); };
  }, [token]);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg('');
    const r = await fetch(`/api/receipts/link/${encodeURIComponent(token)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(amount), paymentDate: date }),
    });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (r.status === 409) { setState('used'); return; }
    if (!r.ok) { setMsg(d.error ?? 'Something went wrong.'); return; }
    setMsg(d.emailed
      ? `Your receipt ${d.receiptNumber} has been emailed to you.`
      : `Your receipt number is ${d.receiptNumber}. We could not email it right now; we will send it to you shortly.`);
    setState('done');
  }

  const input = 'w-full border border-wine/30 rounded px-3 py-2 bg-white';
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-3xl font-serif text-wine">Golden Age Society</h1>
        {state === 'loading' && <p>Loading…</p>}
        {state === 'invalid' && <p>This link is not valid. Please contact Golden Age Society.</p>}
        {state === 'error' && <p>Something went wrong. Please try again later.</p>}
        {state === 'used' && <p>This link has already been used. If you need help, please contact Golden Age Society.</p>}
        {state === 'done' && <p className="text-lg">Hare Krishna {donorName}, thank you! 🙏<br />{msg}</p>}
        {state === 'form' && (
          <form onSubmit={submit} className="space-y-4">
            <p className="text-lg">Hare Krishna {donorName}</p>
            <p>Thank you for your donation. Please enter the details of your bank (EFT) payment and we will email you a receipt.</p>
            <label className="block">Amount paid (ZAR)
              <input className={input} type="number" min="1" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} />
            </label>
            <label className="block">Payment date
              <input className={input} type="date" max={todayStr} required value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            {msg && <p className="text-red-700 text-sm">{msg}</p>}
            <button className="btn-wine" disabled={busy} type="submit">{busy ? 'Submitting…' : 'Submit and email my receipt'}</button>
          </form>
        )}
      </div>
    </div>
  );
}
