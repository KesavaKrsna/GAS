import React, { useEffect, useId, useRef, useState } from 'react';

const BASE_URL = import.meta.env.BASE_URL?.replace(/\/$/, '') ?? '';

const LIMITS = {
  firstName: 80,
  surname: 80,
  email: 254,
  phone: 30,
  message: 4000,
} as const;

const EMAIL_RE =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;
const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}'’.\- ]{0,79}$/u;

type Status = 'idle' | 'sending' | 'success' | 'error';
type FieldErrors = Partial<Record<'firstName' | 'surname' | 'email' | 'phone' | 'message' | 'contact', string>>;

const EMPTY = { firstName: '', surname: '', email: '', phone: '', message: '', website: '' };

const FAILURE = "We couldn't send your message. Please try again later.";

function safeServerError(value: unknown): string {
  if (typeof value !== 'string') return FAILURE;
  const text = value.trim();
  if (!text || text.length > 300) return FAILURE;
  if (/smtp|stack|password|secret|nodemailer|exception/i.test(text)) return FAILURE;
  return text;
}

function phoneDigits(phone: string): number {
  return phone.replace(/\D/g, '').length;
}

function validate(form: typeof EMPTY): FieldErrors {
  const errors: FieldErrors = {};
  const firstName = form.firstName.trim();
  const surname = form.surname.trim();
  const email = form.email.trim();
  const phone = form.phone.trim();
  const message = form.message.trim();

  if (!firstName || firstName.length > LIMITS.firstName || !NAME_RE.test(firstName)) {
    errors.firstName = 'Enter your first name.';
  }
  if (!surname || surname.length > LIMITS.surname || !NAME_RE.test(surname)) {
    errors.surname = 'Enter your surname.';
  }
  if (email && (email.length > LIMITS.email || !EMAIL_RE.test(email))) {
    errors.email = 'Enter a valid email address, or leave it blank.';
  }
  if (
    phone &&
    (phone.length > LIMITS.phone ||
      !/^\+?[0-9][0-9 ().-]{6,28}$/.test(phone) ||
      phoneDigits(phone) < 7 ||
      phoneDigits(phone) > 15)
  ) {
    errors.phone = 'Enter a valid phone number, or leave it blank.';
  }
  if (!email && !phone && !errors.email && !errors.phone) {
    errors.contact = 'Enter an email address, a phone number, or both.';
  }
  if (!message || message.length > LIMITS.message) {
    errors.message = 'Enter a message of 4000 characters or fewer.';
  }
  return errors;
}

export function GeneralEnquiryForm() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<Status>('idle');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState('');
  const successRef = useRef<HTMLHeadingElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const sendingRef = useRef(false);
  const baseId = useId();

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
    if (status === 'error' && serverError) alertRef.current?.focus();
  }, [status, serverError]);

  const setField = (field: keyof typeof EMPTY) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field as keyof FieldErrors] && field !== 'email' && field !== 'phone') return current;
      const next = { ...current };
      delete next[field as keyof FieldErrors];
      if (field === 'email' || field === 'phone') delete next.contact;
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sendingRef.current) return;
    setServerError('');
    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setStatus('idle');
      const first = (['firstName', 'surname', 'contact', 'email', 'phone', 'message'] as const).find((key) => errors[key]);
      const focusId =
        first === 'contact' ? `${baseId}-email` : first ? `${baseId}-${first}` : '';
      if (focusId) document.getElementById(focusId)?.focus();
      return;
    }

    sendingRef.current = true;
    setStatus('sending');
    try {
      const response = await fetch(`${BASE_URL}/api/contact/enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          surname: form.surname.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          message: form.message.trim(),
          website: form.website,
        }),
      });
      const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: unknown } | null;
      if (!response.ok || data?.ok !== true) {
        setServerError(safeServerError(data?.error));
        setStatus('error');
        return;
      }
      setForm(EMPTY);
      setFieldErrors({});
      setStatus('success');
    } catch {
      setServerError(FAILURE);
      setStatus('error');
    } finally {
      sendingRef.current = false;
    }
  };

  const inputClass = (invalid: boolean) =>
    `w-full min-h-12 rounded-xl border bg-white px-3 py-3 text-base text-text outline-none transition focus-visible:ring-2 focus-visible:ring-wine ${
      invalid ? 'border-red-700' : 'border-gold/40'
    }`;

  if (status === 'success') {
    return (
      <div id="general-enquiry" className="scroll-mt-28 rounded-2xl border border-gold/30 bg-paper px-5 py-6">
        <h3 ref={successRef} tabIndex={-1} className="font-serif text-2xl text-wine outline-none">
          Message sent
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-text/80">
          Thank you. Your message reached Golden Age Society. If you left an email address or phone number, we
          aim to respond within 3 business days.
        </p>
        <button
          type="button"
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-wine px-6 py-3 text-sm font-semibold text-cream hover:bg-[#5a1520] sm:w-auto"
          onClick={() => setStatus('idle')}
        >
          Send another message
        </button>
      </div>
    );
  }

  const contactErrorId = fieldErrors.contact ? `${baseId}-contact-error` : undefined;

  return (
    <form
      id="general-enquiry"
      className="relative scroll-mt-28 max-w-xl space-y-4"
      noValidate
      onSubmit={handleSubmit}
      aria-busy={status === 'sending'}
    >
      <p className="sr-only" aria-live="polite">
        {status === 'sending' ? 'Sending your message.' : ''}
      </p>

      {serverError ? (
        <div
          ref={alertRef}
          tabIndex={-1}
          role="alert"
          className="rounded-xl border border-red-700 bg-red-50 px-4 py-3 text-sm text-red-900 outline-none"
        >
          {serverError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${baseId}-firstName`} className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-text/55">
            First name
          </label>
          <input
            id={`${baseId}-firstName`}
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            maxLength={LIMITS.firstName}
            value={form.firstName}
            onChange={setField('firstName')}
            disabled={status === 'sending'}
            aria-invalid={fieldErrors.firstName ? true : undefined}
            aria-describedby={fieldErrors.firstName ? `${baseId}-firstName-error` : undefined}
            className={inputClass(Boolean(fieldErrors.firstName))}
          />
          {fieldErrors.firstName ? (
            <p id={`${baseId}-firstName-error`} className="mt-1 text-sm text-red-800">
              {fieldErrors.firstName}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor={`${baseId}-surname`} className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-text/55">
            Surname
          </label>
          <input
            id={`${baseId}-surname`}
            name="surname"
            type="text"
            autoComplete="family-name"
            required
            maxLength={LIMITS.surname}
            value={form.surname}
            onChange={setField('surname')}
            disabled={status === 'sending'}
            aria-invalid={fieldErrors.surname ? true : undefined}
            aria-describedby={fieldErrors.surname ? `${baseId}-surname-error` : undefined}
            className={inputClass(Boolean(fieldErrors.surname))}
          />
          {fieldErrors.surname ? (
            <p id={`${baseId}-surname-error`} className="mt-1 text-sm text-red-800">
              {fieldErrors.surname}
            </p>
          ) : null}
        </div>
      </div>

      <fieldset className="space-y-4" aria-describedby={contactErrorId}>
        <legend className="mb-3 text-sm leading-relaxed text-text/75">
          How should we reach you? Provide an email address, a phone number, or both.
        </legend>
        <div>
          <label htmlFor={`${baseId}-email`} className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-text/55">
            Email
          </label>
          <input
            id={`${baseId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={LIMITS.email}
            value={form.email}
            onChange={setField('email')}
            disabled={status === 'sending'}
            aria-invalid={fieldErrors.email || fieldErrors.contact ? true : undefined}
            aria-describedby={[fieldErrors.email ? `${baseId}-email-error` : '', contactErrorId ?? ''].filter(Boolean).join(' ') || undefined}
            className={inputClass(Boolean(fieldErrors.email || fieldErrors.contact))}
          />
          {fieldErrors.email ? (
            <p id={`${baseId}-email-error`} className="mt-1 text-sm text-red-800">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor={`${baseId}-phone`} className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-text/55">
            Phone
          </label>
          <input
            id={`${baseId}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={LIMITS.phone}
            value={form.phone}
            onChange={setField('phone')}
            disabled={status === 'sending'}
            aria-invalid={fieldErrors.phone || fieldErrors.contact ? true : undefined}
            aria-describedby={[fieldErrors.phone ? `${baseId}-phone-error` : '', contactErrorId ?? ''].filter(Boolean).join(' ') || undefined}
            className={inputClass(Boolean(fieldErrors.phone || fieldErrors.contact))}
          />
          {fieldErrors.phone ? (
            <p id={`${baseId}-phone-error`} className="mt-1 text-sm text-red-800">
              {fieldErrors.phone}
            </p>
          ) : null}
        </div>
        {fieldErrors.contact ? (
          <p id={`${baseId}-contact-error`} className="text-sm text-red-800">
            {fieldErrors.contact}
          </p>
        ) : null}
      </fieldset>

      <div>
        <label htmlFor={`${baseId}-message`} className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-text/55">
          Message
        </label>
        <textarea
          id={`${baseId}-message`}
          name="message"
          required
          rows={5}
          maxLength={LIMITS.message}
          value={form.message}
          onChange={setField('message')}
          disabled={status === 'sending'}
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={fieldErrors.message ? `${baseId}-message-error` : undefined}
          className={`${inputClass(Boolean(fieldErrors.message))} resize-y`}
        />
        {fieldErrors.message ? (
          <p id={`${baseId}-message-error`} className="mt-1 text-sm text-red-800">
            {fieldErrors.message}
          </p>
        ) : null}
      </div>

      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`${baseId}-website`}>Website</label>
        <input
          id={`${baseId}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={setField('website')}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-wine px-6 py-3 text-sm font-semibold text-cream hover:bg-[#5a1520] disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      >
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
