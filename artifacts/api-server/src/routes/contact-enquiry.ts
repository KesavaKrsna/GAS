import { Router, type Request } from 'express';
import { logger } from '../lib/logger.js';
import { getFromAddress } from '../lib/email.js';
import {
  ENQUIRY_RATE_LIMIT,
  ENQUIRY_RATE_WINDOW_MS,
  buildEnquiryMail,
  clientIp,
  createRateLimiter,
  isAllowedFormOrigin,
  type EnquiryMail,
} from '../lib/contact-enquiry.js';
import { sendContactEnquiryMail } from '../lib/smtp-mail.js';

export const ENQUIRY_SEND_FAILURE = "We couldn't send your message. Please try again later.";
export const ENQUIRY_RATE_LIMITED = 'Too many messages from this network. Please wait and try again.';
export const ENQUIRY_ORIGIN_REJECTED = 'This form can only be submitted from the Golden Age Society website.';

export type ContactEnquiryDeps = {
  sendMail?: (mail: EnquiryMail) => Promise<void>;
  fromAddress?: () => string;
  now?: () => number;
};

function headerValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function createContactEnquiryRouter(deps: ContactEnquiryDeps = {}) {
  const sendMail =
    deps.sendMail ??
    (async (mail: EnquiryMail) => {
      await sendContactEnquiryMail({
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        ...(mail.replyTo ? { replyTo: mail.replyTo } : {}),
      });
    });
  const fromAddress = deps.fromAddress ?? getFromAddress;
  const limiter = createRateLimiter({
    limit: ENQUIRY_RATE_LIMIT,
    windowMs: ENQUIRY_RATE_WINDOW_MS,
    now: deps.now ?? (() => Date.now()),
  });

  const router = Router();

  router.post('/contact/enquiry', async (req: Request, res) => {
    const origin = headerValue(req.headers.origin);
    const referer = headerValue(req.headers.referer);
    if (!isAllowedFormOrigin(origin, referer)) {
      res.status(403).json({ error: ENQUIRY_ORIGIN_REJECTED });
      return;
    }

    const ip = clientIp(req.headers['x-forwarded-for'], req.ip);
    const allowance = limiter.allow(ip);
    if (!allowance.ok) {
      res.setHeader('Retry-After', String(allowance.retryAfterSeconds));
      res.status(429).json({ error: ENQUIRY_RATE_LIMITED });
      return;
    }

    const built = buildEnquiryMail(req.body, fromAddress());
    if (!built.ok) {
      res.status(400).json({ error: built.error });
      return;
    }

    try {
      await sendMail(built.mail);
    } catch {
      logger.error('Contact enquiry SMTP send failed');
      res.status(500).json({ error: ENQUIRY_SEND_FAILURE });
      return;
    }

    res.status(200).json({ ok: true });
  });

  return router;
}

const contactEnquiryRouter = createContactEnquiryRouter();

export default contactEnquiryRouter;
