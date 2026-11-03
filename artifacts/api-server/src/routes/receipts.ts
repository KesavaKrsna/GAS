import { Router, type Request, type Response, type NextFunction } from 'express';
import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { getPool } from '@workspace/db/pool';
import { sendReceiptEmail } from '../lib/receipt-email.js';
import { logger } from '../lib/logger.js';

const receiptsRouter = Router();
const ADMIN_ENV = 'RECEIPT_ADMIN_SECRET';

let schemaReady: Promise<void> | null = null;
function ensureSchema(): Promise<void> {
  schemaReady ??= getPool()
    .query(`
      CREATE TABLE IF NOT EXISTS receipt_links (
        id SERIAL PRIMARY KEY,
        token_id TEXT NOT NULL UNIQUE,
        donor_name TEXT NOT NULL,
        donor_email TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        used_at TIMESTAMPTZ
      );
      CREATE SEQUENCE IF NOT EXISTS donation_receipt_seq START 1;
      CREATE TABLE IF NOT EXISTS donation_receipts (
        id SERIAL PRIMARY KEY,
        receipt_number TEXT NOT NULL UNIQUE,
        link_id INTEGER REFERENCES receipt_links(id),
        donor_name TEXT NOT NULL,
        donor_email TEXT NOT NULL,
        amount_zar NUMERIC(12,2) NOT NULL,
        payment_date DATE NOT NULL,
        payment_method TEXT NOT NULL DEFAULT 'EFT',
        issue_date DATE NOT NULL,
        email_status TEXT NOT NULL DEFAULT 'pending',
        email_message_id TEXT,
        email_error TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );`)
    .then(() => undefined)
    .catch((e) => { schemaReady = null; throw e; });
  return schemaReady;
}

function secret(): string {
  const s = process.env[ADMIN_ENV];
  if (!s || s.length < 16) throw new Error(`${ADMIN_ENV} is not configured.`);
  return s;
}
const sign = (id: string) => createHmac('sha256', secret()).update(`receipt-link:${id}`).digest('base64url').slice(0, 32);
function parseToken(token: string): string | null {
  const [id, sig] = token.split('.');
  if (!id || !sig || !/^[A-Za-z0-9_-]{20,64}$/.test(id)) return null;
  const a = Buffer.from(sig), b = Buffer.from(sign(id));
  return a.length === b.length && timingSafeEqual(a, b) ? id : null;
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const given = Buffer.from(String(req.header('x-admin-secret') ?? ''));
    const want = Buffer.from(secret());
    if (given.length === want.length && timingSafeEqual(given, want)) return next();
    res.status(401).json({ error: 'Unauthorised' });
  } catch (err) {
    logger.error({ err }, 'Admin gate misconfigured');
    res.status(500).json({ error: 'Admin access is not configured on the server.' });
  }
}

const isEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Johannesburg' }).format(new Date());

function baseUrl(req: Request) {
  const host = req.header('x-forwarded-host') ?? req.header('host');
  const proto = req.header('x-forwarded-proto') ?? 'https';
  return `${proto}://${host}`;
}

// Admin: create a one-time link
receiptsRouter.post('/receipts/admin/links', requireAdmin, async (req, res) => {
  try {
    const donorName = String(req.body?.donorName ?? '').trim();
    const donorEmail = String(req.body?.donorEmail ?? '').trim().toLowerCase();
    if (!donorName || !isEmail(donorEmail)) {
      res.status(400).json({ error: 'Donor name and a valid email are required.' });
      return;
    }
    await ensureSchema();
    const id = randomBytes(24).toString('base64url');
    await getPool().query('INSERT INTO receipt_links (token_id, donor_name, donor_email) VALUES ($1,$2,$3)', [id, donorName, donorEmail]);
    res.json({ url: `${baseUrl(req)}/receipt/${id}.${sign(id)}`, donorName, donorEmail });
  } catch (err) {
    logger.error({ err }, 'Failed to create receipt link');
    res.status(500).json({ error: (err as Error).message });
  }
});

// Admin: audit list
receiptsRouter.get('/receipts/admin/list', requireAdmin, async (_req, res) => {
  try {
    await ensureSchema();
    const links = await getPool().query(
      `SELECT l.id, l.donor_name, l.donor_email, l.status, l.created_at, l.used_at,
              r.receipt_number, r.amount_zar, r.payment_date, r.email_status, r.email_error
         FROM receipt_links l LEFT JOIN donation_receipts r ON r.link_id = l.id
        ORDER BY l.id DESC LIMIT 200`);
    res.json({ items: links.rows });
  } catch (err) {
    logger.error({ err }, 'Failed to list receipts');
    res.status(500).json({ error: (err as Error).message });
  }
});

// Donor: view link
receiptsRouter.get('/receipts/link/:token', async (req, res) => {
  try {
    const id = parseToken(req.params.token);
    if (!id) { res.status(404).json({ error: 'This link is not valid.' }); return; }
    await ensureSchema();
    const r = await getPool().query('SELECT donor_name, status FROM receipt_links WHERE token_id=$1', [id]);
    if (!r.rowCount) { res.status(404).json({ error: 'This link is not valid.' }); return; }
    res.json({ donorName: r.rows[0].donor_name, status: r.rows[0].status });
  } catch (err) {
    logger.error({ err }, 'Failed to read receipt link');
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
});

// Donor: submit payment details -> receipt
receiptsRouter.post('/receipts/link/:token', async (req, res) => {
  const id = parseToken(req.params.token);
  if (!id) { res.status(404).json({ error: 'This link is not valid.' }); return; }
  const amount = Math.round(Number(req.body?.amount) * 100) / 100;
  const paymentDate = String(req.body?.paymentDate ?? '');
  if (!Number.isFinite(amount) || amount <= 0 || amount > 100_000_000) {
    res.status(400).json({ error: 'Please enter a valid amount in Rand.' }); return;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(paymentDate) || isNaN(Date.parse(paymentDate)) || paymentDate > today()) {
    res.status(400).json({ error: 'Please enter a valid payment date (not in the future).' }); return;
  }
  const client = await getPool().connect().catch((err) => { logger.error({ err }, 'DB connect failed'); return null; });
  if (!client) { res.status(500).json({ error: 'Something went wrong. Please try again later.' }); return; }
  let receipt: { id: number; receipt_number: string; donor_name: string; donor_email: string; issue_date: string } | null = null;
  try {
    await ensureSchema();
    await client.query('BEGIN');
    const link = await client.query(
      `UPDATE receipt_links SET status='used', used_at=now() WHERE token_id=$1 AND status='pending' RETURNING id, donor_name, donor_email`, [id]);
    if (!link.rowCount) {
      await client.query('ROLLBACK');
      res.status(409).json({ error: 'This link has already been used.' }); return;
    }
    const l = link.rows[0];
    const issueDate = today();
    const ins = await client.query(
      `INSERT INTO donation_receipts (receipt_number, link_id, donor_name, donor_email, amount_zar, payment_date, issue_date)
       VALUES ('GAS-R-' || to_char(now() AT TIME ZONE 'Africa/Johannesburg','YYYY') || '-' || lpad(nextval('donation_receipt_seq')::text, 5, '0'),
               $1,$2,$3,$4,$5,$6)
       RETURNING id, receipt_number, donor_name, donor_email, to_char(issue_date,'YYYY-MM-DD') AS issue_date`,
      [l.id, l.donor_name, l.donor_email, amount, paymentDate, issueDate]);
    await client.query('COMMIT');
    receipt = ins.rows[0];
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    logger.error({ err }, 'Failed to record receipt');
    res.status(500).json({ error: 'Something went wrong. Please try again later.' }); return;
  } finally {
    client.release();
  }
  try {
    const msgId = await sendReceiptEmail({
      receiptNumber: receipt!.receipt_number, donorName: receipt!.donor_name, donorEmail: receipt!.donor_email,
      amount, paymentDate, issueDate: receipt!.issue_date,
    });
    await getPool().query(`UPDATE donation_receipts SET email_status='sent', email_message_id=$2 WHERE id=$1`, [receipt!.id, msgId]);
    res.json({ ok: true, receiptNumber: receipt!.receipt_number, emailed: true });
  } catch (err) {
    logger.error({ err }, 'Failed to send receipt email');
    await getPool().query(`UPDATE donation_receipts SET email_status='failed', email_error=$2 WHERE id=$1`, [receipt!.id, String((err as Error).message).slice(0, 500)]).catch(() => {});
    res.json({ ok: true, receiptNumber: receipt!.receipt_number, emailed: false });
  }
});

export default receiptsRouter;
