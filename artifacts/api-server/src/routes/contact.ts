import { Router } from 'express';
import { Resend } from 'resend';
import { logger } from '../lib/logger.js';

const contactRouter = Router();

function getResend() {
  const apiKey = process.env['RESEND_API_KEY'];
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured.');
  return new Resend(apiKey);
}

// POST /api/contact
contactRouter.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body as {
      name: string; email: string; phone?: string; subject?: string; message: string;
    };

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      res.status(400).json({ error: 'Name, email, and message are required.' });
      return;
    }

    const resend = getResend();
    const from = process.env['RESEND_FROM'] ?? 'Golden Age Society <ocsacademy2020@gmail.com>';
    const to = process.env['CONTACT_EMAIL'] ?? 'ocsacademy2020@gmail.com';

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New Contact Form Message</title></head>
<body style="font-family:Georgia,serif;background:#fffdf7;color:#230f18;margin:0;padding:0;">
  <div style="max-width:600px;margin:0 auto;background:#fffdf7;">
    <div style="background:#751c2b;padding:28px 36px;text-align:center;">
      <h1 style="margin:0 0 4px;font-size:20px;color:#fbb226;letter-spacing:1px;">Golden Age Society</h1>
      <p style="margin:0;color:rgba(255,253,247,0.8);font-size:11px;letter-spacing:2px;text-transform:uppercase;">New Website Enquiry</p>
    </div>
    <div style="padding:36px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px;">
        <tr><td style="padding:8px 0;color:#888;width:120px;">From</td><td style="padding:8px 0;font-weight:bold;">${name}</td></tr>
        <tr><td style="padding:8px 0;color:#888;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#751c2b;">${email}</a></td></tr>
        ${phone ? `<tr><td style="padding:8px 0;color:#888;">Phone</td><td style="padding:8px 0;">${phone}</td></tr>` : ''}
        ${subject ? `<tr><td style="padding:8px 0;color:#888;">Subject</td><td style="padding:8px 0;">${subject}</td></tr>` : ''}
      </table>
      <div style="background:#f8f5ed;border-left:4px solid #fbb226;padding:20px 24px;border-radius:4px;">
        <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#888;">Message</p>
        <p style="margin:0;line-height:1.8;white-space:pre-wrap;">${message}</p>
      </div>
    </div>
    <div style="background:#751c2b;padding:18px 36px;text-align:center;">
      <p style="margin:0;color:rgba(255,253,247,0.5);font-size:11px;">Golden Age Society · goldenagesociety.org</p>
    </div>
  </div>
</body>
</html>`.trim();

    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `[GAS Website] ${subject || 'New enquiry'} — from ${name}`,
      html,
    });

    logger.info({ name, email, subject }, 'Contact form submitted');
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, 'Failed to send contact email');
    res.status(500).json({ error: 'Failed to send your message. Please try again.' });
  }
});

export default contactRouter;
