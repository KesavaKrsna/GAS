/**
 * Contact-page general enquiry. Recipient and sender are fixed here.
 * The visitor cannot choose who the message is delivered to.
 */

export const CONTACT_ENQUIRY_TO = 'haribo@goldenage-society.org';

/** Same default sender as certificate mail when SMTP_FROM / RESEND_FROM is unset. */
export const CONTACT_ENQUIRY_FALLBACK_FROM = 'Golden Age Society <haribol@goldenage-society.org>';

export const ENQUIRY_LIMITS = {
  firstName: 80,
  surname: 80,
  email: 254,
  phone: 30,
  message: 4000,
} as const;

export const ENQUIRY_RATE_LIMIT = 5;
export const ENQUIRY_RATE_WINDOW_MS = 15 * 60 * 1000;

const HEADER_UNSAFE = /[\u0000-\u001F\u007F\u2028\u2029]/;
const MESSAGE_UNSAFE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}'’.\- ]{0,79}$/u;
const EMAIL_RE =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;
const PHONE_RE = /^\+?[0-9][0-9 ().-]{6,28}$/;

const ALLOWED_HOSTS = new Set([
  'goldenage-society.org',
  'www.goldenage-society.org',
  'localhost',
  '127.0.0.1',
  '[::1]',
]);

export type EnquiryMail = {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export type EnquiryBuild =
  | { ok: true; mail: EnquiryMail }
  | { ok: false; error: string; hostile: boolean };

export function isAllowedFormOrigin(origin: string | undefined, referer: string | undefined): boolean {
  const candidate = (origin ?? '').trim() || (referer ?? '').trim();
  if (!candidate) return false;
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return false;
  }
  if (url.username || url.password) return false;
  const localhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '[::1]';
  if (url.protocol === 'http:') {
    if (!localhost) return false;
  } else if (url.protocol !== 'https:') {
    return false;
  }
  if (ALLOWED_HOSTS.has(url.hostname)) return true;
  return url.protocol === 'https:' && (url.hostname === 'vercel.app' || url.hostname.endsWith('.vercel.app'));
}

export function safeFromAddress(address: string): string {
  const trimmed = address.trim();
  if (!trimmed || trimmed.length > 200 || HEADER_UNSAFE.test(trimmed)) return CONTACT_ENQUIRY_FALLBACK_FROM;
  if (!/@goldenage-society\.org>?$/i.test(trimmed)) return CONTACT_ENQUIRY_FALLBACK_FROM;
  return trimmed;
}

export function clientIp(forwarded: string | string[] | undefined, fallback?: string): string {
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const first = typeof raw === 'string' ? (raw.split(',')[0]?.trim() ?? '') : '';
  if (first && first.length <= 80 && !HEADER_UNSAFE.test(first)) return first;
  const ip = fallback?.trim() ?? '';
  if (ip && ip.length <= 80 && !HEADER_UNSAFE.test(ip)) return ip;
  return 'unknown';
}

export function createRateLimiter(options: { limit: number; windowMs: number; now: () => number }) {
  const buckets = new Map<string, number[]>();
  return {
    allow(key: string): { ok: true } | { ok: false; retryAfterSeconds: number } {
      const now = options.now();
      const recent = (buckets.get(key) ?? []).filter((stamp) => now - stamp < options.windowMs);
      if (recent.length >= options.limit) {
        buckets.set(key, recent);
        const oldest = recent[0] ?? now;
        const retryAfterSeconds = Math.max(1, Math.ceil((options.windowMs - (now - oldest)) / 1000));
        return { ok: false, retryAfterSeconds };
      }
      recent.push(now);
      buckets.set(key, recent);
      if (buckets.size > 5000) {
        const oldestKey = buckets.keys().next().value;
        if (oldestKey) buckets.delete(oldestKey);
      }
      return { ok: true };
    },
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

type FieldText =
  | { kind: 'empty' }
  | { kind: 'invalid' }
  | { kind: 'value'; value: string; hostile: boolean };

function readString(value: unknown, max: number): FieldText {
  if (value == null) return { kind: 'empty' };
  if (typeof value !== 'string') return { kind: 'invalid' };
  if (value.length > max + 32) return { kind: 'invalid' };
  const trimmed = value.trim();
  if (!trimmed) return { kind: 'empty' };
  if (trimmed.length > max) return { kind: 'invalid' };
  return { kind: 'value', value: trimmed, hostile: HEADER_UNSAFE.test(trimmed) };
}

function phoneDigits(phone: string): number {
  return phone.replace(/\D/g, '').length;
}

export function buildEnquiryMail(body: unknown, fromAddress: string): EnquiryBuild {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'Check the form and try again.', hostile: false };
  }
  const record = body as Record<string, unknown>;

  const website = record['website'];
  const honeypotFilled =
    (typeof website === 'string' && website.trim() !== '') ||
    (website != null && typeof website !== 'string');
  if (honeypotFilled) {
    return { ok: false, error: 'This message could not be sent.', hostile: true };
  }

  const firstName = readString(record['firstName'], ENQUIRY_LIMITS.firstName);
  const surname = readString(record['surname'], ENQUIRY_LIMITS.surname);
  const email = readString(record['email'], ENQUIRY_LIMITS.email);
  const phone = readString(record['phone'], ENQUIRY_LIMITS.phone);
  const messageRaw = record['message'];

  if (
    firstName.kind === 'invalid' ||
    surname.kind === 'invalid' ||
    email.kind === 'invalid' ||
    phone.kind === 'invalid'
  ) {
    return { ok: false, error: 'One of the fields is too long or is not text.', hostile: false };
  }
  if (firstName.kind !== 'value' || firstName.hostile || !NAME_RE.test(firstName.value)) {
    const hostile = firstName.kind === 'value' && firstName.hostile;
    return {
      ok: false,
      error: hostile ? 'This message could not be sent.' : 'Enter your first name.',
      hostile,
    };
  }
  if (surname.kind !== 'value' || surname.hostile || !NAME_RE.test(surname.value)) {
    const hostile = surname.kind === 'value' && surname.hostile;
    return {
      ok: false,
      error: hostile ? 'This message could not be sent.' : 'Enter your surname.',
      hostile,
    };
  }

  if (typeof messageRaw !== 'string' || messageRaw.length > ENQUIRY_LIMITS.message + 32) {
    return { ok: false, error: 'Enter a message of 4000 characters or fewer.', hostile: false };
  }
  const message = messageRaw.trim();
  if (!message || message.length > ENQUIRY_LIMITS.message) {
    return { ok: false, error: 'Enter a message of 4000 characters or fewer.', hostile: false };
  }
  if (MESSAGE_UNSAFE.test(message)) {
    return { ok: false, error: 'This message could not be sent.', hostile: true };
  }

  let replyTo: string | undefined;
  if (email.kind === 'value') {
    if (email.hostile || !EMAIL_RE.test(email.value)) {
      return {
        ok: false,
        error: email.hostile
          ? 'This message could not be sent.'
          : 'Enter a valid email address, or leave it blank and provide a phone number.',
        hostile: email.hostile,
      };
    }
    replyTo = email.value;
  }
  let phoneValue = '';
  if (phone.kind === 'value') {
    const digits = phoneDigits(phone.value);
    if (phone.hostile || !PHONE_RE.test(phone.value) || digits < 7 || digits > 15) {
      return {
        ok: false,
        error: phone.hostile
          ? 'This message could not be sent.'
          : 'Enter a valid phone number, or leave it blank and provide an email address.',
        hostile: phone.hostile,
      };
    }
    phoneValue = phone.value;
  }
  if (!replyTo && !phoneValue) {
    return { ok: false, error: 'Enter an email address, a phone number, or both.', hostile: false };
  }

  const from = safeFromAddress(fromAddress);
  const subject = `Website enquiry from ${firstName.value} ${surname.value}`;
  const text = [
    'New website enquiry',
    '',
    `First name: ${firstName.value}`,
    `Surname: ${surname.value}`,
    `Email: ${replyTo ?? '(not provided)'}`,
    `Phone: ${phoneValue || '(not provided)'}`,
    '',
    'Message:',
    message,
  ].join('\n');

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Website enquiry</title></head>
<body style="font-family:Georgia,serif;background:#fffdf7;color:#230f18;margin:0;padding:0;">
  <div style="max-width:600px;margin:0 auto;background:#fffdf7;">
    <div style="background:#751c2b;padding:28px 36px;text-align:center;">
      <h1 style="margin:0 0 4px;font-size:20px;color:#fbb226;">Golden Age Society</h1>
      <p style="margin:0;color:rgba(255,253,247,0.8);font-size:11px;letter-spacing:2px;text-transform:uppercase;">Contact page enquiry</p>
    </div>
    <div style="padding:36px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px;">
        <tr><td style="padding:8px 0;color:#888;width:120px;">First name</td><td style="padding:8px 0;">${escapeHtml(firstName.value)}</td></tr>
        <tr><td style="padding:8px 0;color:#888;">Surname</td><td style="padding:8px 0;">${escapeHtml(surname.value)}</td></tr>
        <tr><td style="padding:8px 0;color:#888;">Email</td><td style="padding:8px 0;">${escapeHtml(replyTo ?? '(not provided)')}</td></tr>
        <tr><td style="padding:8px 0;color:#888;">Phone</td><td style="padding:8px 0;">${escapeHtml(phoneValue || '(not provided)')}</td></tr>
      </table>
      <div style="background:#f8f5ed;border-left:4px solid #fbb226;padding:20px 24px;">
        <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#888;">Message</p>
        <p style="margin:0;line-height:1.8;white-space:pre-wrap;">${escapeHtml(message)}</p>
      </div>
    </div>
  </div>
</body>
</html>`;

  const mail: EnquiryMail = {
    from,
    to: CONTACT_ENQUIRY_TO,
    subject,
    html,
    text,
  };
  if (replyTo) mail.replyTo = replyTo;
  return { ok: true, mail };
}
