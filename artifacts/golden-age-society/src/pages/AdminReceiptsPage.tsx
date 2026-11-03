import { useEffect, useState } from 'react';

const KEY = 'gas-receipt-admin';
type Row = { id: number; receipt_id?: number; donor_name: string; donor_email: string; status: string; created_at: string; receipt_number?: string; amount_zar?: string; payment_date?: string; email_status?: string };

export default function AdminReceiptsPage() {
  const [secret, setSecret] = useState(() => sessionStorage.getItem(KEY) ?? '');
  const [authed, setAuthed] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [link, setLink] = useState('');
  const [error, setError] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex,nofollow';
    document.head.appendChild(m); return () => { m.remove(); };
  }, []);

  async function load(s = secret) {
    const r = await fetch('/api/receipts/admin/list', { headers: { 'x-admin-secret': s } });
    if (!r.ok) { setAuthed(false); setError((await r.json().catch(() => ({}))).error ?? 'Access denied'); return; }
    sessionStorage.setItem(KEY, s); setAuthed(true); setError('');
    setRows((await r.json()).items);
  }
  useEffect(() => { if (secret) load(); }, []); // eslint-disable-line

  async function create(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(''); setLink('');
    const r = await fetch('/api/receipts/admin/links', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
      body: JSON.stringify({ donorName: name, donorEmail: email }),
    });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) { setError(d.error ?? 'Failed'); return; }
    setLink(d.url); setName(''); setEmail(''); load();
  }

  const input = 'w-full border border-wine/30 rounded px-3 py-2 bg-white';
  if (!authed) return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <form onSubmit={(e) => { e.preventDefault(); load(secret); }} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-serif text-wine">GAS admin · Donation receipts</h1>
        <input type="password" className={input} placeholder="Admin secret" value={secret} onChange={(e) => setSecret(e.target.value)} />
        {error && <p className="text-red-700 text-sm">{error}</p>}
        <button className="btn-wine" type="submit">Enter</button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-serif text-wine">Donation receipt links (EFT)</h1>
        <form onSubmit={create} className="space-y-3 bg-white/60 p-5 rounded">
          <input className={input} placeholder="Donor full name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className={input} type="email" placeholder="Donor email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button className="btn-wine" disabled={busy} type="submit">{busy ? 'Creating…' : 'Create one-time link'}</button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
          {link && (
            <div className="space-y-2">
              <p className="text-sm">One-time link (send this to the donor):</p>
              <input className={input} readOnly value={link} onFocus={(e) => e.target.select()} />
              <button type="button" className="btn-wine" onClick={() => navigator.clipboard.writeText(link)}>Copy link</button>
            </div>
          )}
        </form>
        <div>
          <h2 className="text-xl font-serif text-wine mb-2">Audit trail</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left"><th>Created</th><th>Donor</th><th>Status</th><th>Receipt</th><th>Amount</th><th>Paid</th><th>Email</th><th /></tr></thead>
              <tbody>{rows.map((r) => (
                <tr key={r.id} className="border-t border-wine/10">
                  <td>{new Date(r.created_at).toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}</td>
                  <td>{r.donor_name}<br /><span className="opacity-60">{r.donor_email}</span></td>
                  <td>{r.status}</td><td>{r.receipt_number ?? '—'}</td>
                  <td>{r.amount_zar ? `R${r.amount_zar}` : '—'}</td>
                  <td>{r.payment_date ? String(r.payment_date).slice(0, 10) : '—'}</td>
                  <td>{r.email_status ?? '—'}</td>
                  <td>{r.receipt_id && <button className="underline text-wine" onClick={async () => {
                    const x = await fetch(`/api/receipts/admin/${r.receipt_id}/resend`, { method: 'POST', headers: { 'x-admin-secret': secret } });
                    const d = await x.json().catch(() => ({}));
                    setError(d.emailed ? '' : (d.error ?? 'Resend failed')); load();
                  }}>Resend</button>}</td>
                </tr>))}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
