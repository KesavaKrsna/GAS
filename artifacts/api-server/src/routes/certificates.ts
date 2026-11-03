import { Router } from 'express';
import { randomBytes } from 'crypto';
import { getPool } from '@workspace/db/pool';
import { ensureCertSchema, issueCertificate, getCertificate, emailCertificate } from '../lib/certificates-store.js';
import { requireAdmin, sign, parseToken, isEmail, today, baseUrl } from './receipts.js';
import { logger } from '../lib/logger.js';

const r = Router();
const KIND = 'certificate';

// Admin: create one-time donor link
r.post('/certificates/admin/links', requireAdmin, async (req, res) => {
  try {
    const donorName = String(req.body?.donorName ?? '').trim();
    const donorEmail = String(req.body?.donorEmail ?? '').trim().toLowerCase();
    if (!donorName || !isEmail(donorEmail)) { res.status(400).json({ error: 'Donor name and a valid email are required.' }); return; }
    await ensureCertSchema();
    const id = randomBytes(24).toString('base64url');
    await getPool().query('INSERT INTO certificate_links (token_id, donor_name, donor_email) VALUES ($1,$2,$3)', [id, donorName, donorEmail]);
    res.json({ url: `${baseUrl(req)}/certificate/${id}.${sign(id, KIND)}`, donorName, donorEmail });
  } catch (err) {
    logger.error({ err }, 'Failed to create certificate link');
    res.status(500).json({ error: (err as Error).message });
  }
});

// Admin: list links + issued certificates (sequential)
r.get('/certificates/admin/list', requireAdmin, async (_req, res) => {
  try {
    await ensureCertSchema();
    const certs = await getPool().query(
      `SELECT id, cert_no, source, donor_name, donor_email, amount_zar, to_char(donation_date,'YYYY-MM-DD') AS donation_date,
              payment_method, payment_reference, issued_at, status, email_status, email_error, pdf_sha256
         FROM certificates ORDER BY seq_year DESC, seq_no DESC LIMIT 500`);
    const links = await getPool().query(
      `SELECT id, donor_name, donor_email, status, created_at, used_at FROM certificate_links ORDER BY id DESC LIMIT 200`);
    res.json({ certificates: certs.rows, links: links.rows });
  } catch (err) {
    logger.error({ err }, 'Failed to list certificates');
    res.status(500).json({ error: (err as Error).message });
  }
});

// Admin: download / reprint the stored PDF (secret via header or ?k= for a plain link)
r.get('/certificates/admin/:id/pdf', (req, res, next) => {
  if (!req.header('x-admin-secret') && typeof req.query.k === 'string') req.headers['x-admin-secret'] = req.query.k;
  next();
}, requireAdmin, async (req, res) => {
  try {
    const row = await getCertificate(Number(req.params.id));
    if (!row?.pdf_bytes) { res.status(404).json({ error: 'Not found' }); return; }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${row.cert_no}_Section18A.pdf"`);
    res.setHeader('Cache-Control', 'no-store');
    res.end(row.pdf_bytes);
  } catch (err) {
    logger.error({ err }, 'PDF download failed');
    res.status(500).json({ error: 'Failed' });
  }
});

// Admin: resend email
r.post('/certificates/admin/:id/resend', requireAdmin, async (req, res) => {
  try {
    const row = await getCertificate(Number(req.params.id));
    if (!row) { res.status(404).json({ error: 'Not found' }); return; }
    if (row.status === 'void') { res.status(409).json({ error: 'Certificate is void.' }); return; }
    res.json({ emailed: await emailCertificate(row.id) });
  } catch (err) {
    logger.error({ err }, 'Resend failed');
    res.status(500).json({ error: (err as Error).message });
  }
});

// Donor: view link
r.get('/certificates/link/:token', async (req, res) => {
  try {
    const id = parseToken(req.params.token, KIND);
    if (!id) { res.status(404).json({ error: 'This link is not valid.' }); return; }
    await ensureCertSchema();
    const q = await getPool().query('SELECT donor_name, donor_email, status FROM certificate_links WHERE token_id=$1', [id]);
    if (!q.rowCount) { res.status(404).json({ error: 'This link is not valid.' }); return; }
    res.json({ donorName: q.rows[0].donor_name, donorEmail: q.rows[0].donor_email, status: q.rows[0].status });
  } catch (err) {
    logger.error({ err }, 'Failed to read certificate link');
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
});

const str = (v: unknown, max = 300) => String(v ?? '').trim().slice(0, max);

// Donor: submit all 18A details -> numbered certificate emailed
r.post('/certificates/link/:token', async (req, res) => {
  const id = parseToken(req.params.token, KIND);
  if (!id) { res.status(404).json({ error: 'This link is not valid.' }); return; }
  const b = req.body ?? {};
  const donorType = ['Individual', 'Company', 'Trust', 'Other'].includes(b.donorType) ? b.donorType : '';
  const donorName = str(b.donorName, 200), donorIdNumber = str(b.donorIdNumber, 50), donorTaxRef = str(b.donorTaxRef, 20).replace(/\s/g, '');
  const donorAddress = str(b.donorAddress, 400), donorPhone = str(b.donorPhone, 30), paymentReference = str(b.paymentReference, 100);
  const amount = Math.round(Number(b.amount) * 100) / 100;
  const donationDate = str(b.donationDate, 10);
  const errors: string[] = [];
  if (!donorType) errors.push('donor type');
  if (!donorName) errors.push('full name');
  if (!donorIdNumber) errors.push('ID / registration number');
  if (!/^\d{10}$/.test(donorTaxRef)) errors.push('income tax reference number (10 digits)');
  if (donorAddress.length < 8) errors.push('full physical address');
  if (!/^[+\d][\d\s()-]{6,}$/.test(donorPhone)) errors.push('phone number');
  if (!Number.isFinite(amount) || amount <= 0 || amount > 100_000_000) errors.push('amount');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(donationDate) || isNaN(Date.parse(donationDate)) || donationDate > today()) errors.push('EFT payment date');
  if (b.popiaConsent !== true) errors.push('POPIA consent');
  if (b.declaration !== true) errors.push('declaration');
  if (errors.length) { res.status(400).json({ error: `Please check: ${errors.join(', ')}.` }); return; }

  try {
    let link: { id: number; donor_email: string } | null = null;
    const result = await issueCertificate(
      { source: 'offline', donorType, donorName, donorIdNumber, donorTaxRef, donorAddress, donorPhone, donorEmail: '',
        amount, donationDate, paymentMethod: 'EFT', paymentReference, popiaConsent: true },
      async (q) => {
        const u = await q(`UPDATE certificate_links SET status='used', used_at=now() WHERE token_id=$1 AND status='pending' RETURNING id, donor_email`, [id]);
        if (!u.rowCount) return false;
        link = u.rows[0];
        return true;
      },
      () => link!,
    );
    if (!result) { res.status(409).json({ error: 'This link has already been used.' }); return; }
    res.json({ ok: true, certNo: result.certNo, emailed: result.emailed });
  } catch (err) {
    logger.error({ err }, 'Failed to issue certificate');
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
});

export default r;
