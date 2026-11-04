/**
 * Central site config. Values that need real data are left EMPTY on purpose.
 * Empty values hide the related link / figure on the site, so nothing invented is shown.
 */

// TODO Kgosi: real WhatsApp number in international format, digits only (e.g. 27XXXXXXXXX).
export const WHATSAPP_NUMBER = '';
// TODO Kgosi: real Facebook page URL.
export const FACEBOOK_URL = '';
// TODO Kgosi: real Instagram profile URL.
export const INSTAGRAM_URL = '';
// TODO Kgosi: WhatsApp cultivation-group invite link (newsletter opt-in).
export const WHATSAPP_CULTIVATION_GROUP_URL = '';

export const CONTACT_EMAIL = 'ocsacademy2020@gmail.com';

/** Kārtika morning japa. The hero button opens this Google Meet in a new tab. */
export const KARTIK_JAPA_MEET_URL = 'https://meet.google.com/wmc-kugp-rjk';

// TODO Kgosi: EFT bank details once the legal host is confirmed. Leave empty to show "EFT details coming".
export const EFT_DETAILS: { bank: string; accountName: string; accountNumber: string; branchCode: string; reference: string } | null = null;

// TODO Kgosi: amount raised (ZAR) toward the current Katlehong transport day. Real figures only.
export const TRANSPORT_DAY_TARGET = 2000;
export const TRANSPORT_DAY_RAISED = 0;

// TODO Kgosi: confirmed legal host wording. Until confirmed, tax/PBO claims stay "pending confirmation".
export const LEGAL_HOST_CONFIRMED = false;

export const SOCIAL_LINKS = [
  { label: 'WhatsApp', href: WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : '' },
  { label: 'Facebook', href: FACEBOOK_URL },
  { label: 'Instagram', href: INSTAGRAM_URL },
].filter((s) => s.href);

/** Recipient for website form submissions (volunteer form). */
export const FORMS_EMAIL = 'comms@goldenage-society.org';

export const mailto = (subject: string) => `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;

export const formsMailto = (subject: string) =>
  `mailto:comms@goldenage-society.org?subject=${encodeURIComponent(subject)}&cc=haribol%40goldenage-society.org`;
