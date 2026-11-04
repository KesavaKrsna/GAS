import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { getFromAddress } from './email.js';

export interface ReceiptData {
  receiptNumber: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  paymentDate: string; // YYYY-MM-DD
  issueDate: string; // YYYY-MM-DD
}

export const RECEIPT_COPY_TO = 'haribol@goldenage-society.org';

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const formatZar = (n: number) =>
  'R' + n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function renderReceiptHtml(d: ReceiptData): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Thank You for Your Donation</title></head>
<body style="font-family: Georgia, serif; background: #fffdf7; color: #230f18; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; background: #fffdf7;">
    <div style="background: #751c2b; padding: 32px 36px; text-align: center;">
      <h1 style="margin: 0 0 6px; font-size: 22px; color: #fbb226; font-family: Georgia, serif; letter-spacing: 1px;">Golden Age Society</h1>
      <p style="margin: 0; color: rgba(255,253,247,0.85); font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Donation Receipt</p>
    </div>
    <div style="padding: 36px;">
      <p style="font-size: 16px; margin-top: 0;">Hare Krishna ${esc(d.donorName)},</p>
      <p style="line-height: 1.7;">
        Thank you for supporting <strong>Golden Age Society</strong>. We confirm receipt of your generous donation of
        <strong style="color: #751c2b;">${formatZar(d.amount)}</strong>, which will help us continue our devotional service through:
      </p>
      <ul style="line-height: 2; padding-left: 20px; color: #751c2b;">
        <li>Kasi Kirtan outreach</li>
        <li>Prasadam distribution</li>
        <li>Translation &amp; distribution of books</li>
        <li>Reuniting township devotees</li>
        <li>Temple support and maintenance</li>
      </ul>
      <div style="background: #f8f5ed; border-left: 4px solid #fbb226; padding: 20px 24px; margin: 24px 0; border-radius: 4px;">
        <h3 style="margin: 0 0 14px; color: #751c2b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Receipt Summary</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 5px 0; color: #666;">Organisation</td><td style="padding: 5px 0; text-align: right;">Golden Age Society</td></tr>
          <tr><td style="padding: 5px 0; color: #666;">Receipt Number</td><td style="padding: 5px 0; font-weight: bold; text-align: right;">${esc(d.receiptNumber)}</td></tr>
          <tr><td style="padding: 5px 0; color: #666;">Donor</td><td style="padding: 5px 0; text-align: right;">${esc(d.donorName)}</td></tr>
          <tr><td style="padding: 5px 0; color: #666;">Amount</td><td style="padding: 5px 0; font-weight: bold; text-align: right; color: #751c2b;">${formatZar(d.amount)}</td></tr>
          <tr><td style="padding: 5px 0; color: #666;">Payment Method</td><td style="padding: 5px 0; text-align: right;">EFT</td></tr>
          <tr><td style="padding: 5px 0; color: #666;">Payment Date</td><td style="padding: 5px 0; text-align: right;">${esc(d.paymentDate)}</td></tr>
          <tr><td style="padding: 5px 0; color: #666;">Issue Date</td><td style="padding: 5px 0; text-align: right;">${esc(d.issueDate)}</td></tr>
        </table>
      </div>
      <p style="line-height: 1.7;">We sincerely appreciate your generosity and support. Hare Krishna! 🙏</p>
      <p style="margin-bottom: 4px; font-weight: bold;">Kind regards,</p>
      <p style="margin: 0; color: #751c2b;">Kgositsile Mogane</p>
      <p style="margin: 0; font-size: 13px; color: #666;">Chairman, Golden Age Society</p>
    </div>
    <div style="background: #751c2b; padding: 20px 36px; text-align: center;">
      <p style="margin: 0; color: rgba(255,253,247,0.6); font-size: 11px;">Golden Age Society · www.goldenage-society.org</p>
      <p style="margin: 4px 0 0; color: rgba(255,253,247,0.5); font-size: 10px;">This is a receipt confirming your donation was received.</p>
    </div>
  </div>
</body>
</html>`.trim();
}

export const RECEIPT_SUBJECT = 'Thank You for Your Donation – Your Receipt';

/** Sends via Resend (RESEND_API_KEY) or, if absent, SMTP (SMTP_HOST/SMTP_USER/SMTP_PASS). Returns a message id. */
export async function sendReceiptEmail(d: ReceiptData): Promise<string> {
  const from = getFromAddress();
  const html = renderReceiptHtml(d);
  const bcc = d.donorEmail.toLowerCase() === RECEIPT_COPY_TO ? undefined : [RECEIPT_COPY_TO];
  if (process.env['RESEND_API_KEY']) {
    const resend = new Resend(process.env['RESEND_API_KEY']);
    const { data, error } = await resend.emails.send({ from, to: d.donorEmail, bcc, replyTo: RECEIPT_COPY_TO, subject: RECEIPT_SUBJECT, html });
    if (error) throw new Error(`Resend: ${error.message}`);
    return data?.id ?? 'resend';
  }
  if (process.env['SMTP_HOST'] && process.env['SMTP_USER'] && process.env['SMTP_PASS']) {
    const port = Number(process.env['SMTP_PORT'] ?? 465);
    const t = nodemailer.createTransport({
      host: process.env['SMTP_HOST'], port, secure: port === 465,
      auth: { user: process.env['SMTP_USER'], pass: process.env['SMTP_PASS'] },
    });
    const info = await t.sendMail({ from, to: d.donorEmail, bcc, replyTo: RECEIPT_COPY_TO, subject: RECEIPT_SUBJECT, html });
    return info.messageId;
  }
  throw new Error('No email provider configured (set RESEND_API_KEY, or SMTP_HOST/SMTP_USER/SMTP_PASS).');
}
