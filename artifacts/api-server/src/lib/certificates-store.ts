import { createHash } from 'crypto';
import { getPool } from '@workspace/db/pool';
import { generateSection18ACertificate, type CertificateData } from './certificate.js';
import { sendDonationCertificate } from './email.js';
import { logger } from './logger.js';

// Mirrors lib/db/src/schema/certificates.ts (Drizzle). Auto-created so no migration step is needed.
let ready: Promise<void> | null = null;
export function ensureCertSchema(): Promise<void> {
  ready ??= getPool().query(`
    CREATE TABLE IF NOT EXISTS certificate_counter (year INTEGER PRIMARY KEY, last_no INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS certificate_links (
      id SERIAL PRIMARY KEY, token_id TEXT NOT NULL UNIQUE, donor_name TEXT NOT NULL, donor_email TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending', created_at TIMESTAMPTZ NOT NULL DEFAULT now(), used_at TIMESTAMPTZ);
    CREATE TABLE IF NOT EXISTS certificates (
      id SERIAL PRIMARY KEY, cert_no TEXT NOT NULL, seq_year INTEGER NOT NULL, seq_no INTEGER NOT NULL,
      source TEXT NOT NULL, link_id INTEGER REFERENCES certificate_links(id),
      donor_type TEXT NOT NULL, donor_name TEXT NOT NULL, donor_id_number TEXT NOT NULL, donor_tax_ref TEXT,
      donor_address TEXT NOT NULL, donor_phone TEXT NOT NULL, donor_email TEXT NOT NULL,
      amount_zar NUMERIC(12,2) NOT NULL, donation_date DATE NOT NULL, payment_method TEXT NOT NULL,
      payment_reference TEXT, is_recurring BOOLEAN NOT NULL DEFAULT false, popia_consent BOOLEAN NOT NULL DEFAULT false,
      issued_at TIMESTAMPTZ NOT NULL DEFAULT now(), pdf_sha256 TEXT, pdf_bytes BYTEA,
      status TEXT NOT NULL DEFAULT 'issued', void_reason TEXT,
      email_status TEXT NOT NULL DEFAULT 'pending', email_message_id TEXT, email_error TEXT);
    CREATE UNIQUE INDEX IF NOT EXISTS certificates_cert_no_idx ON certificates(cert_no);
    CREATE UNIQUE INDEX IF NOT EXISTS certificates_paystack_ref_idx ON certificates(payment_reference) WHERE source = 'paystack';
  `).then(() => undefined).catch((e) => { ready = null; throw e; });
  return ready;
}

export interface IssueInput {
  source: 'paystack' | 'offline';
  linkId?: number;
  donorType: string; donorName: string; donorIdNumber: string; donorTaxRef?: string;
  donorAddress: string; donorPhone: string; donorEmail: string;
  amount: number; donationDate: string; // YYYY-MM-DD
  paymentMethod: string; paymentReference?: string; isRecurring?: boolean; popiaConsent?: boolean;
}

const saToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Johannesburg' }).format(new Date());
const pretty = (iso: string) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' });

type Row = Record<string, any>;
export function rowToCertData(r: Row): CertificateData {
  const iso = (v: any) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v).slice(0, 10));
  return {
    certificateNumber: r.cert_no,
    dateIssued: pretty(new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Johannesburg' }).format(new Date(r.issued_at))),
    donorType: r.donor_type, donorName: r.donor_name, donorId: r.donor_id_number, donorTaxRef: r.donor_tax_ref ?? '',
    donorEmail: r.donor_email, donorPhone: r.donor_phone, donorAddress: r.donor_address,
    donationDate: pretty(iso(r.donation_date)), donationAmount: Number(r.amount_zar),
    paymentMethod: r.payment_method, paystackReference: r.payment_reference ?? '', isRecurring: !!r.is_recurring,
  };
}

/**
 * Inserts a certificate with the next sequential number (in one transaction), renders + stores the PDF,
 * then emails it. A failed email keeps the certificate (email_status='failed') so it can be resent.
 * `inTx` lets the caller run extra statements (e.g. marking a link used) in the same transaction.
 */
export async function issueCertificate(
  input: IssueInput,
  inTx?: (q: (sql: string, p: unknown[]) => Promise<any>) => Promise<boolean>,
  linkInfo?: () => { id: number; donor_email: string },
) {
  await ensureCertSchema();
  const client = await getPool().connect();
  let row: Row;
  try {
    await client.query('BEGIN');
    if (inTx && !(await inTx((sql, p) => client.query(sql, p)))) { await client.query('ROLLBACK'); return null; }
    if (linkInfo) { const l = linkInfo(); input = { ...input, linkId: l.id, donorEmail: l.donor_email }; }
    const year = Number(saToday().slice(0, 4));
    const c = await client.query(
      `INSERT INTO certificate_counter (year, last_no) VALUES ($1, 1)
       ON CONFLICT (year) DO UPDATE SET last_no = certificate_counter.last_no + 1 RETURNING last_no`, [year]);
    const seq = c.rows[0].last_no as number;
    const certNo = `GAS-18A-${year}-${String(seq).padStart(5, '0')}`;
    const ins = await client.query(
      `INSERT INTO certificates (cert_no, seq_year, seq_no, source, link_id, donor_type, donor_name, donor_id_number, donor_tax_ref,
         donor_address, donor_phone, donor_email, amount_zar, donation_date, payment_method, payment_reference, is_recurring, popia_consent)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING *`,
      [certNo, year, seq, input.source, input.linkId ?? null, input.donorType, input.donorName, input.donorIdNumber, input.donorTaxRef || null,
       input.donorAddress, input.donorPhone, input.donorEmail, input.amount, input.donationDate, input.paymentMethod,
       input.paymentReference || null, !!input.isRecurring, !!input.popiaConsent]);
    row = ins.rows[0];
    const pdf = await generateSection18ACertificate(rowToCertData(row));
    const sha = createHash('sha256').update(pdf).digest('hex');
    await client.query('UPDATE certificates SET pdf_bytes=$2, pdf_sha256=$3 WHERE id=$1', [row.id, Buffer.from(pdf), sha]);
    await client.query('COMMIT');
    row.pdf_sha256 = sha;
    const emailed = await emailCertificate(row.id, pdf);
    return { id: row.id as number, certNo, emailed };
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

export async function getCertificate(id: number): Promise<Row | null> {
  await ensureCertSchema();
  const r = await getPool().query('SELECT * FROM certificates WHERE id=$1', [id]);
  return r.rows[0] ?? null;
}

export async function emailCertificate(id: number, pdf?: Uint8Array): Promise<boolean> {
  const row = await getCertificate(id);
  if (!row) throw new Error('Certificate not found');
  const bytes = pdf ?? (row.pdf_bytes as Buffer);
  try {
    const msgId = await sendDonationCertificate(rowToCertData(row), bytes);
    await getPool().query(`UPDATE certificates SET email_status='sent', email_message_id=$2, email_error=NULL WHERE id=$1`, [id, msgId]);
    return true;
  } catch (err) {
    logger.error({ err, id }, 'Failed to email certificate');
    await getPool().query(`UPDATE certificates SET email_status='failed', email_error=$2 WHERE id=$1`, [id, String((err as Error).message).slice(0, 500)]);
    return false;
  }
}
