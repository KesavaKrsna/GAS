import nodemailer from 'nodemailer';
import { getFromAddress } from './email.js';
import { CONTACT_ENQUIRY_TO, safeFromAddress } from './contact-enquiry.js';

export type ContactEnquiryTransport = {
  sendMail: (mail: {
    from: string;
    to: string;
    subject: string;
    html: string;
    text: string;
    replyTo?: string;
  }) => Promise<unknown>;
};

export type ContactEnquiryTransportFactory = (options: {
  host: string;
  port: number;
  secure: boolean;
  auth: { user: string; pass: string };
}) => ContactEnquiryTransport;

const HEADER_UNSAFE = /[\u0000-\u001F\u007F\u2028\u2029]/;

function readSmtpConfig(): { host: string; port: number; user: string; pass: string } {
  const host = process.env['SMTP_HOST']?.trim() ?? '';
  const user = process.env['SMTP_USER']?.trim() ?? '';
  const pass = process.env['SMTP_PASS'] ?? '';
  const port = Number(process.env['SMTP_PORT']?.trim() || '465');
  if (!host || !user || !pass || !Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('Email service is not configured.');
  }
  if (HEADER_UNSAFE.test(host) || HEADER_UNSAFE.test(user)) {
    throw new Error('Email service is not configured.');
  }
  return { host, port, user, pass };
}

/**
 * Sends one contact-page enquiry with the same SMTP host, port, user, and password
 * already used for certificates and receipts. The recipient is fixed. There is no cc/bcc
 * and the visitor cannot set the envelope.
 */
export async function sendContactEnquiryMail(
  mail: { subject: string; html: string; text: string; replyTo?: string },
  createTransport: ContactEnquiryTransportFactory = nodemailer.createTransport as ContactEnquiryTransportFactory,
): Promise<void> {
  if (HEADER_UNSAFE.test(mail.subject) || (mail.replyTo != null && HEADER_UNSAFE.test(mail.replyTo))) {
    throw new Error('Email service rejected the message.');
  }
  const { host, port, user, pass } = readSmtpConfig();
  const from = safeFromAddress(getFromAddress());
  const transport = createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  await transport.sendMail({
    from,
    to: CONTACT_ENQUIRY_TO,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    ...(mail.replyTo ? { replyTo: mail.replyTo } : {}),
  });
}
