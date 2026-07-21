import { Resend } from 'resend';
import type { CertificateData } from './certificate.js';

function getResend() {
  const apiKey = process.env['RESEND_API_KEY'];
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured.');
  return new Resend(apiKey);
}

export async function sendDonationCertificate(
  data: CertificateData,
  pdfBytes: Uint8Array,
): Promise<void> {
  const resend = getResend();
  const from = process.env['SMTP_FROM'] ?? 'Golden Age Society <donations@goldenagesociety.org>';

  const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Thank You for Your Donation</title></head>
<body style="font-family: Georgia, serif; background: #fffdf7; color: #230f18; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; background: #fffdf7;">

    <!-- Header -->
    <div style="background: #751c2b; padding: 32px 36px; text-align: center;">
      <h1 style="margin: 0 0 6px; font-size: 22px; color: #fbb226; font-family: Georgia, serif; letter-spacing: 1px;">
        Golden Age Society
      </h1>
      <p style="margin: 0; color: rgba(255,253,247,0.85); font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">
        Section 18A Tax Certificate
      </p>
    </div>

    <!-- Body -->
    <div style="padding: 36px;">
      <p style="font-size: 16px; margin-top: 0;">Dear ${data.donorName},</p>
      <p style="line-height: 1.7;">
        Thank you for supporting <strong>Golden Age Society</strong>. Your generous donation of
        <strong style="color: #751c2b;">R${data.donationAmount.toLocaleString('en-ZA')}</strong>
        will help us continue our devotional service through:
      </p>
      <ul style="line-height: 2; padding-left: 20px; color: #751c2b;">
        <li>Kasi Kirtan outreach</li>
        <li>Prasadam distribution</li>
        <li>Translation &amp; distribution of books</li>
        <li>Reuniting township devotees</li>
        <li>Temple support and maintenance</li>
      </ul>
      <p style="line-height: 1.7;">
        Attached to this email is your <strong>Section 18A Tax Deductible Donation Certificate</strong>,
        which may be used when submitting your annual income tax return to SARS.
      </p>

      <!-- Summary Table -->
      <div style="background: #f8f5ed; border-left: 4px solid #fbb226; padding: 20px 24px; margin: 24px 0; border-radius: 4px;">
        <h3 style="margin: 0 0 14px; color: #751c2b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Donation Summary</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 5px 0; color: #666;">Certificate Number</td><td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.certificateNumber}</td></tr>
          <tr><td style="padding: 5px 0; color: #666;">Donation Amount</td><td style="padding: 5px 0; font-weight: bold; text-align: right; color: #751c2b;">R${data.donationAmount.toLocaleString('en-ZA')}</td></tr>
          <tr><td style="padding: 5px 0; color: #666;">Donation Type</td><td style="padding: 5px 0; text-align: right;">${data.isRecurring ? 'Monthly Recurring' : 'Once-off'}</td></tr>
          <tr><td style="padding: 5px 0; color: #666;">Donation Date</td><td style="padding: 5px 0; text-align: right;">${data.donationDate}</td></tr>
          <tr><td style="padding: 5px 0; color: #666;">Payment Reference</td><td style="padding: 5px 0; text-align: right; font-family: monospace; font-size: 12px;">${data.paystackReference}</td></tr>
        </table>
      </div>

      <p style="line-height: 1.7;">We sincerely appreciate your generosity and support. Hare Krishna! 🙏</p>

      <p style="margin-bottom: 4px; font-weight: bold;">Kind regards,</p>
      <p style="margin: 0; color: #751c2b;">Kgositsile Mogane</p>
      <p style="margin: 0; font-size: 13px; color: #666;">Chairman, Golden Age Society</p>
    </div>

    <!-- Footer -->
    <div style="background: #751c2b; padding: 20px 36px; text-align: center;">
      <p style="margin: 0; color: rgba(255,253,247,0.6); font-size: 11px;">
        Golden Age Society · PBO No. 930070132 · Section 18A Approved
      </p>
      <p style="margin: 4px 0 0; color: rgba(255,253,247,0.5); font-size: 10px;">
        donations@goldenagesociety.org
      </p>
    </div>

  </div>
</body>
</html>
  `.trim();

  await resend.emails.send({
    from,
    to: data.donorEmail,
    subject: 'Thank You for Your Donation – Your Section 18A Tax Certificate',
    html: htmlBody,
    attachments: [
      {
        filename: `Section18A_Certificate_${data.certificateNumber}.pdf`,
        content: Buffer.from(pdfBytes).toString('base64'),
      },
    ],
  });
}
