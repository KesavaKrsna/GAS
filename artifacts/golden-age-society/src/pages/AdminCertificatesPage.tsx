import { useEffect, useState } from 'react';

const KEY = 'gas-receipt-admin';
type Cert = { id: number; cert_no: string; source: string; donor_name: string; donor_email: string; amount_zar: string; donation_date: string; payment_method: string; payment_reference?: string; issued_at: string; status: string; email_status: string; email_error?: string };
type Link = { id: number; donor_name: string; donor_email: string; status: string; created_at: string };

export default function AdminCertificatesPage() {
  const [secret, setSecret] = useState(() => sessionStorage.getItem(KEY) ?? '');
  const [authed, setAuthed] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [link, setLink] = useState('');
  const [msg, setMsg] = useState('');
  const [certs, setCerts] = useState<Cert[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex,nofollow';
    document.head.appendChild(m); return () => { m.remove(); };
  }, []);

  async function load(s = secret) {
    const r = await fetch('/api/certificates/admin/list', { headers: { 'x-admin-secret': s } });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { setAuthed(r.status !== 401 ? !!s && r.status === 500 : false); setMsg(d.error ?? 'Access denied'); return; }
    sessionStorage.setItem(KEY, s); setAuthed(true); setMsg('');
    setCerts(d.certificates); setLinks(d.links);
  }
  useEffect(() => { if (secret) load(); }, []); // eslint-disable-line

  async function create(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(''); setLink('');
    const r = await fetch('/api/certificates/admin/links', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
      body: JSON.stringify({ donorName: name, donorEmail: email }),
    });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) { setMsg(d.error ?? 'Failed'); return; }
    setLink(d.url); setName(''); setEmail(''); load();
  }

  async function resend(id: number) {
    const r = await fetch(`/api/certificates/admin/${id}/resend`, { method: 'POST', headers: { 'x-admin-secret': secret } });
    const d = await r.json().catch(() => ({}));
    setMsg(r.ok ? (d.emailed ? 'Email resent.' : 'Resend failed; see email status.') : d.error ?? 'Failed');
    load();
  }

  const input = 'w-full border border-wine/30 rounded px-3 py-2 bg-white';
  if (!authed) return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <form onSubmit={(e) => { e.preventDefault(); load(secret); }} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-serif text-wine">GAS admin · Section 18A certificates</h1>
        <input type="password" className={input} placeholder="Admin secret" value={secret} onChange={(e) => setSecret(e.target.value)} />
        {msg && <p className="text-red-700 text-sm">{msg}</p>}
        <button className="btn-wine" type="submit">Enter</button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-serif text-wine">Section 18A certificates</h1>
        <form onSubmit={create} className="space-y-3 bg-white/60 p-5 rounded max-w-xl">
          <p className="text-sm">Create a one-time link. The donor fills in all their 18A details and receives the numbered certificate by email automatically.</p>
          <input className={input} placeholder="Donor full name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className={input} type="email" placeholder="Donor email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button className="btn-wine" disabled={busy} type="submit">{busy ? 'Creating…' : 'Create one-time 18A link'}</button>
          {link && (
            <div className="space-y-2">
              <p className="text-sm">One-time link (send this to the donor):</p>
              <input className={input} readOnly value={link} onFocus={(e) => e.target.select()} />
              <button type="button" className="btn-wine" onClick={() => navigator.clipboard.writeText(link)}>Copy link</button>
            </div>
          )}
        </form>
        {msg && <p className="text-sm text-wine">{msg}</p>}
        <div>
          <h2 className="text-xl font-serif text-wine mb-2">Issued certificates</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left"><th>No.</th><th>Issued</th><th>Donor</th><th>Amount</th><th>Paid</th><th>Method / ref</th><th>Status</th><th>Email</th><th /></tr></thead>
              <tbody>{certs.map((c) => (
                <tr key={c.id} className="border-t border-wine/10 align-top">
                  <td className="font-mono">{c.cert_no}</td>
                  <td>{new Date(c.issued_at).toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}</td>
                  <td>{c.donor_name}<br /><span className="opacity-60">{c.donor_email}</span></td>
                  <td>R{c.amount_zar}</td><td>{c.donation_date}</td>
                  <td>{c.payment_method}<br /><span className="opacity-60">{c.payment_reference}</span></td>
                  <td>{c.status}</td>
                  <td title={c.email_error ?? ''}>{c.email_status}</td>
                  <td className="whitespace-nowrap">
                    <a className="underline text-wine mr-2" target="_blank" rel="noreferrer" href={`/api/certificates/admin/${c.id}/pdf?k=${encodeURIComponent(secret)}`}>PDF</a>
                    {c.status !== 'void' && <button className="underline text-wine" onClick={() => resend(c.id)}>Resend</button>}
                  </td>
                </tr>))}</tbody>
            </table>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-serif text-wine mb-2">Links</h2>
          <table className="w-full text-sm">
            <thead><tr className="text-left"><th>Created</th><th>Donor</th><th>Status</th></tr></thead>
            <tbody>{links.map((l) => (
              <tr key={l.id} className="border-t border-wine/10">
                <td>{new Date(l.created_at).toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}</td>
                <td>{l.donor_name} <span className="opacity-60">{l.donor_email}</span></td><td>{l.status}</td>
              </tr>))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
