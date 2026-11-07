import assert from 'node:assert/strict';
import { once } from 'node:events';
import type { AddressInfo } from 'node:net';
import { after, describe, it } from 'node:test';
import express from 'express';
import { DEFAULT_FROM } from './email.js';
import {
  CONTACT_ENQUIRY_FALLBACK_FROM,
  CONTACT_ENQUIRY_TO,
  buildEnquiryMail,
  isAllowedFormOrigin,
} from './contact-enquiry.js';
import { sendContactEnquiryMail, type ContactEnquiryTransportFactory } from './smtp-mail.js';
import {
  ENQUIRY_ORIGIN_REJECTED,
  ENQUIRY_RATE_LIMITED,
  ENQUIRY_SEND_FAILURE,
  createContactEnquiryRouter,
  type ContactEnquiryDeps,
} from '../routes/contact-enquiry.js';
import type { EnquiryMail } from './contact-enquiry.js';

const FROM = 'Golden Age Society <haribol@goldenage-society.org>';

function validBody(overrides: Record<string, unknown> = {}) {
  return {
    firstName: 'Amina',
    surname: 'Dlamini',
    email: 'amina@example.com',
    phone: '',
    message: 'Please tell me about the next gathering.',
    website: '',
    ...overrides,
  };
}

function startApp(deps: ContactEnquiryDeps) {
  const app = express();
  app.use(express.json());
  app.use('/api', createContactEnquiryRouter(deps));
  const server = app.listen(0, '127.0.0.1');
  return server;
}

async function post(
  port: number,
  body: unknown,
  headers: Record<string, string> = {},
): Promise<{ status: number; json: { ok?: boolean; error?: string } | null; text: string }> {
  const response = await fetch(`http://127.0.0.1:${port}/api/contact/enquiry`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://www.goldenage-society.org',
      ...headers,
    },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  let json: { ok?: boolean; error?: string } | null = null;
  try {
    json = JSON.parse(text) as { ok?: boolean; error?: string };
  } catch {
    json = null;
  }
  return { status: response.status, json, text };
}

describe('contact page enquiry', () => {
  it('keeps the recipient distinct from the haribol mailbox', () => {
    assert.equal(CONTACT_ENQUIRY_TO, 'haribo@goldenage-society.org');
    assert.equal(CONTACT_ENQUIRY_TO.includes('haribol'), false);
    assert.equal(CONTACT_ENQUIRY_FALLBACK_FROM, DEFAULT_FROM);
  });

  it('builds mail with a fixed recipient and reply-to only for a valid email', () => {
    const withEmail = buildEnquiryMail(validBody(), FROM);
    assert.equal(withEmail.ok, true);
    if (!withEmail.ok) return;
    assert.equal(withEmail.mail.to, CONTACT_ENQUIRY_TO);
    assert.equal(withEmail.mail.from, FROM);
    assert.equal(withEmail.mail.replyTo, 'amina@example.com');
    assert.equal(Object.hasOwn(withEmail.mail, 'cc'), false);
    assert.equal(Object.hasOwn(withEmail.mail, 'bcc'), false);
    assert.equal(withEmail.mail.html.includes('<script>'), false);
    assert.match(withEmail.mail.html, /Amina/);

    const phoneOnly = buildEnquiryMail(
      validBody({ email: '  ', phone: '+27 82 123 4567' }),
      FROM,
    );
    assert.equal(phoneOnly.ok, true);
    if (!phoneOnly.ok) return;
    assert.equal(phoneOnly.mail.replyTo, undefined);
    assert.match(phoneOnly.mail.text, /Phone: \+27 82 123 4567/);
    assert.match(phoneOnly.mail.text, /Email: \(not provided\)/);

    const both = buildEnquiryMail(validBody({ phone: '0821234567' }), FROM);
    assert.equal(both.ok, true);
    if (!both.ok) return;
    assert.equal(both.mail.replyTo, 'amina@example.com');
    assert.doesNotMatch(both.mail.replyTo ?? '', /0821234567/);
  });

  it('escapes message html and ignores recipient override fields', () => {
    const built = buildEnquiryMail(
      validBody({
        message: 'Hello <script>alert(1)</script> & friends',
        to: 'attacker@example.com',
        cc: 'copy@example.com',
        bcc: 'hidden@example.com',
        from: 'Visitor <visitor@example.com>',
        replyTo: 'injected@example.com',
      }),
      FROM,
    );
    assert.equal(built.ok, true);
    if (!built.ok) return;
    assert.equal(built.mail.to, CONTACT_ENQUIRY_TO);
    assert.equal(built.mail.from, FROM);
    assert.equal(built.mail.replyTo, 'amina@example.com');
    assert.equal(built.mail.html.includes('<script>'), false);
    assert.match(built.mail.html, /&lt;script&gt;/);
    assert.equal(built.mail.html.includes('attacker@example.com'), false);
    assert.equal(built.mail.text.includes('attacker@example.com'), false);
  });

  it('rejects missing contact methods, bad fields, and header injection before any mail exists', () => {
    const cases: Array<{ body: Record<string, unknown>; error: RegExp; hostile?: boolean }> = [
      { body: validBody({ email: '', phone: '' }), error: /email address, a phone number, or both/ },
      { body: validBody({ firstName: ' ' }), error: /first name/ },
      { body: validBody({ surname: '' }), error: /surname/ },
      { body: validBody({ message: '   ' }), error: /message/ },
      { body: validBody({ message: 'x'.repeat(4001) }), error: /4000/ },
      { body: validBody({ email: 'not-an-email', phone: '' }), error: /valid email/ },
      { body: validBody({ email: '', phone: '123' }), error: /valid phone/ },
      { body: validBody({ firstName: 'Amina\r\nBcc: evil@example.com' }), error: /could not be sent/, hostile: true },
      { body: validBody({ email: 'amina@example.com\nBcc: evil@example.com' }), error: /could not be sent/, hostile: true },
      { body: validBody({ phone: '+27 82\r\nBcc: evil@example.com', email: '' }), error: /could not be sent/, hostile: true },
      { body: validBody({ website: 'https://spam.example' }), error: /could not be sent/, hostile: true },
    ];
    for (const item of cases) {
      const built = buildEnquiryMail(item.body, FROM);
      assert.equal(built.ok, false, JSON.stringify(item.body));
      if (built.ok) continue;
      assert.match(built.error, item.error);
      if (item.hostile) assert.equal(built.hostile, true);
      assert.equal(JSON.stringify(built).includes('evil@example.com'), false);
    }
  });

  it('falls back when the configured sender is unsafe', () => {
    const injected = buildEnquiryMail(validBody(), 'Society <ok@goldenage-society.org>\r\nBcc: evil@example.com');
    assert.equal(injected.ok, true);
    if (!injected.ok) return;
    assert.equal(injected.mail.from, CONTACT_ENQUIRY_FALLBACK_FROM);
    assert.equal(injected.mail.from.includes('evil@'), false);

    const foreign = buildEnquiryMail(validBody(), 'Visitor <person@example.com>');
    assert.equal(foreign.ok, true);
    if (!foreign.ok) return;
    assert.equal(foreign.mail.from, CONTACT_ENQUIRY_FALLBACK_FROM);
  });

  it('allows the society site, localhost, and Vercel previews only', () => {
    assert.equal(isAllowedFormOrigin('https://www.goldenage-society.org', undefined), true);
    assert.equal(isAllowedFormOrigin('https://goldenage-society.org', undefined), true);
    assert.equal(isAllowedFormOrigin('http://localhost:5173', undefined), true);
    assert.equal(isAllowedFormOrigin('https://gas-api-server-pu7z-git-preview.vercel.app', undefined), true);
    assert.equal(isAllowedFormOrigin('http://www.goldenage-society.org', undefined), false);
    assert.equal(isAllowedFormOrigin('https://evil.example', undefined), false);
    assert.equal(isAllowedFormOrigin(undefined, undefined), false);
    assert.equal(isAllowedFormOrigin('null', undefined), false);
  });

  it('returns success only after the mail transport resolves', async () => {
    let sent: EnquiryMail | undefined;
    let release: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const server = startApp({
      fromAddress: () => FROM,
      sendMail: async (mail) => {
        sent = mail;
        await gate;
      },
    });
    await once(server, 'listening');
    const port = (server.address() as AddressInfo).port;
    try {
      const pending = post(port, validBody({ to: 'attacker@example.com', bcc: 'hidden@example.com' }));
      await new Promise((resolve) => setTimeout(resolve, 40));
      assert.equal(sent?.to, CONTACT_ENQUIRY_TO);
      assert.equal(sent?.replyTo, 'amina@example.com');
      assert.equal(JSON.stringify(sent).includes('attacker@example.com'), false);
      let settled = false;
      void pending.then(() => {
        settled = true;
      });
      await new Promise((resolve) => setTimeout(resolve, 20));
      assert.equal(settled, false);
      release?.();
      const result = await pending;
      assert.equal(result.status, 200);
      assert.deepEqual(result.json, { ok: true });
    } finally {
      server.close();
      await once(server, 'close');
    }
  });

  it('reports SMTP failure and does not claim success', async () => {
    const server = startApp({
      fromAddress: () => FROM,
      sendMail: async () => {
        throw new Error('535 authentication failed password=fixture-secret host=smtp.secret.example');
      },
    });
    await once(server, 'listening');
    const port = (server.address() as AddressInfo).port;
    try {
      const result = await post(port, validBody());
      assert.equal(result.status, 500);
      assert.equal(result.json?.ok, undefined);
      assert.equal(result.json?.error, ENQUIRY_SEND_FAILURE);
      assert.equal(result.text.includes('fixture-secret'), false);
      assert.equal(result.text.includes('smtp.secret'), false);
      assert.equal(result.text.toLowerCase().includes('password'), false);
    } finally {
      server.close();
      await once(server, 'close');
    }
  });

  it('rate limits repeated submissions and accepts a phone-only enquiry', async () => {
    let now = 1_700_000_000_000;
    let sends = 0;
    const seen: EnquiryMail[] = [];
    const server = startApp({
      fromAddress: () => FROM,
      now: () => now,
      sendMail: async (mail) => {
        sends += 1;
        seen.push(mail);
      },
    });
    await once(server, 'listening');
    const port = (server.address() as AddressInfo).port;
    try {
      for (let i = 0; i < 5; i += 1) {
        const result = await post(port, validBody({ phone: '0821234567', email: i === 4 ? '' : 'amina@example.com' }), {
          'x-forwarded-for': '203.0.113.10',
        });
        assert.equal(result.status, 200);
      }
      const blocked = await post(port, validBody(), { 'x-forwarded-for': '203.0.113.10' });
      assert.equal(blocked.status, 429);
      assert.equal(blocked.json?.error, ENQUIRY_RATE_LIMITED);
      assert.notEqual(blocked.json?.ok, true);
      assert.equal(sends, 5);
      assert.equal(seen[4]?.replyTo, undefined);

      const otherIp = await post(port, validBody(), { 'x-forwarded-for': '203.0.113.11' });
      assert.equal(otherIp.status, 200);

      now += 15 * 60 * 1000 + 1;
      const later = await post(port, validBody(), { 'x-forwarded-for': '203.0.113.10' });
      assert.equal(later.status, 200);
    } finally {
      server.close();
      await once(server, 'close');
    }
  });

  it('rejects a foreign origin before sending', async () => {
    let sends = 0;
    const server = startApp({
      fromAddress: () => FROM,
      sendMail: async () => {
        sends += 1;
      },
    });
    await once(server, 'listening');
    const port = (server.address() as AddressInfo).port;
    try {
      const result = await post(port, validBody(), { origin: 'https://evil.example' });
      assert.equal(result.status, 403);
      assert.equal(result.json?.error, ENQUIRY_ORIGIN_REJECTED);
      assert.equal(sends, 0);
    } finally {
      server.close();
      await once(server, 'close');
    }
  });
});

describe('smtp transport', () => {
  const previous = {
    SMTP_HOST: process.env['SMTP_HOST'],
    SMTP_PORT: process.env['SMTP_PORT'],
    SMTP_USER: process.env['SMTP_USER'],
    SMTP_PASS: process.env['SMTP_PASS'],
    SMTP_FROM: process.env['SMTP_FROM'],
    RESEND_FROM: process.env['RESEND_FROM'],
    RESEND_API_KEY: process.env['RESEND_API_KEY'],
  };

  after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value == null) delete process.env[key];
      else process.env[key] = value;
    }
  });

  function useFixtureSmtp() {
    delete process.env['SMTP_FROM'];
    delete process.env['RESEND_FROM'];
    delete process.env['RESEND_API_KEY'];
    process.env['SMTP_HOST'] = 'smtp.fixture.invalid';
    process.env['SMTP_PORT'] = '465';
    process.env['SMTP_USER'] = 'fixture-user';
    process.env['SMTP_PASS'] = 'fixture-pass';
  }

  it('uses the existing SMTP settings and a fixed recipient, with no network', async () => {
    useFixtureSmtp();
    let options: Parameters<ContactEnquiryTransportFactory>[0] | undefined;
    let payload: { to?: string; from?: string; replyTo?: string; cc?: string; bcc?: string } | undefined;
    const createTransport: ContactEnquiryTransportFactory = (next) => {
      options = next;
      return {
        sendMail: async (mail) => {
          payload = mail;
          return { messageId: 'mock-message' };
        },
      };
    };

    await sendContactEnquiryMail(
      {
        subject: 'Website enquiry from Amina Dlamini',
        html: '<p>Hello</p>',
        text: 'Hello',
        replyTo: 'amina@example.com',
      },
      createTransport,
    );

    assert.equal(options?.host, 'smtp.fixture.invalid');
    assert.equal(options?.port, 465);
    assert.equal(options?.secure, true);
    assert.equal(options?.auth.user, 'fixture-user');
    assert.equal(options?.auth.pass, 'fixture-pass');
    assert.equal(payload?.to, 'haribo@goldenage-society.org');
    assert.equal(payload?.from, DEFAULT_FROM);
    assert.equal(payload?.replyTo, 'amina@example.com');
    assert.equal(payload?.cc, undefined);
    assert.equal(payload?.bcc, undefined);

    process.env['SMTP_PORT'] = '587';
    let secure = true;
    await sendContactEnquiryMail(
      { subject: 'Website enquiry', html: '<p>Hi</p>', text: 'Hi' },
      (next) => {
        secure = next.secure;
        return { sendMail: async () => ({ messageId: 'mock-2' }) };
      },
    );
    assert.equal(secure, false);
  });

  it('does not open a transport when SMTP settings are missing', async () => {
    useFixtureSmtp();
    delete process.env['SMTP_HOST'];
    let called = false;
    await assert.rejects(
      () =>
        sendContactEnquiryMail(
          { subject: 'Website enquiry', html: '<p>Hi</p>', text: 'Hi' },
          () => {
            called = true;
            return { sendMail: async () => ({ messageId: 'should-not-send' }) };
          },
        ),
      /not configured/,
    );
    assert.equal(called, false);
  });

  it('refuses a reply-to that contains a header break', async () => {
    useFixtureSmtp();
    let called = false;
    await assert.rejects(
      () =>
        sendContactEnquiryMail(
          {
            subject: 'Website enquiry',
            html: '<p>Hi</p>',
            text: 'Hi',
            replyTo: 'a@example.com\r\nBcc: evil@example.com',
          },
          () => {
            called = true;
            return { sendMail: async () => ({ messageId: 'should-not-send' }) };
          },
        ),
      /rejected/,
    );
    assert.equal(called, false);
  });
});
