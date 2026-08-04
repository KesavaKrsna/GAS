import React, { useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Header } from '@/components/Header';
import gasLogo from '@assets/gas-logo.png';

type LegalSlug = 'terms' | 'privacy' | 'refunds' | 'contact';

const DOCS: Record<LegalSlug, { title: string; updated: string; content: React.ReactNode }> = {
  terms: {
    title: 'Terms of Use',
    updated: 'August 2026',
    content: (
      <>
        <Section heading="1. Acceptance of Terms">
          By accessing or using the Golden Age Society website (goldenage-society.org), you agree to
          be bound by these Terms of Use. If you do not agree, please do not use this site.
        </Section>

        <Section heading="2. About Golden Age Society">
          Golden Age Society (GAS) is a South African non-profit organisation dedicated to sharing
          the teachings and culture of Krishna consciousness (Bhakti Yoga) through community
          service, prasadam distribution, and devotional programmes. Our principal place of activity
          is No.5, Fourth Avenue, Edenvale 1609, South Africa.
        </Section>

        <Section heading="3. Use of This Website">
          <ul className="list-disc pl-5 space-y-2">
            <li>This website is provided for informational and devotional purposes only.</li>
            <li>You may not reproduce, distribute, or commercially exploit any content without prior written permission from Golden Age Society.</li>
            <li>You agree not to use the site in any way that is unlawful, harmful, or disruptive.</li>
            <li>We reserve the right to modify or discontinue any part of the site at any time without notice.</li>
          </ul>
        </Section>

        <Section heading="4. Intellectual Property">
          All text, images, graphics, logos, and other content on this site are the property of
          Golden Age Society or its content suppliers and are protected by applicable copyright and
          intellectual property laws. The ISKCON / Vaishnava scriptural content quoted on this site
          belongs to its respective rights holders and is used for non-commercial devotional purposes.
        </Section>

        <Section heading="5. Donations">
          All donations made through this site are processed securely via Paystack. By making a
          donation you confirm that you are the authorised account holder and that the funds are
          given voluntarily. Please refer to our <InlineLink slug="refunds">Refund Policy</InlineLink> for
          details on error refunds. Section 18A tax-deductibility certificates are issued where
          applicable under South African tax law.
        </Section>

        <Section heading="6. Third-Party Links">
          This site may contain links to external websites. Golden Age Society is not responsible
          for the content, accuracy, or privacy practices of any third-party sites.
        </Section>

        <Section heading="7. Disclaimer of Warranties">
          This website is provided "as is" without warranties of any kind, whether express or
          implied. We do not warrant that the site will be uninterrupted, error-free, or free of
          viruses or other harmful components.
        </Section>

        <Section heading="8. Limitation of Liability">
          To the fullest extent permitted by South African law, Golden Age Society shall not be
          liable for any indirect, incidental, or consequential damages arising from your use of
          this website or reliance on any information contained herein.
        </Section>

        <Section heading="9. Governing Law">
          These Terms are governed by the laws of the Republic of South Africa. Any disputes shall
          be subject to the jurisdiction of the courts of South Africa.
        </Section>

        <Section heading="10. Changes to Terms">
          We may update these Terms at any time. Continued use of the site after changes are
          posted constitutes your acceptance of the revised Terms.
        </Section>

        <Section heading="11. Contact">
          Questions about these Terms? Email us at{' '}
          <a href="mailto:ocsacademy2020@gmail.com" className="text-wine hover:underline">
            ocsacademy2020@gmail.com
          </a>.
        </Section>
      </>
    ),
  },

  privacy: {
    title: 'Privacy Policy',
    updated: 'August 2026',
    content: (
      <>
        <Section heading="1. Introduction">
          Golden Age Society ("we", "us", "our") is committed to protecting your personal
          information. This Privacy Policy explains what information we collect, how we use it, and
          your rights in relation to it. We comply with the Protection of Personal Information Act
          (POPIA) of South Africa.
        </Section>

        <Section heading="2. Information We Collect">
          <p className="mb-3">We may collect the following personal information:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Contact enquiries</strong> — your name, email address, and the message you submit via the contact form.</li>
            <li><strong>Donation processing</strong> — your name, email address, and payment information (processed securely by Paystack; we do not store card details).</li>
            <li><strong>Website analytics</strong> — anonymised usage data such as pages visited and browser type, collected to improve the site.</li>
          </ul>
        </Section>

        <Section heading="3. How We Use Your Information">
          <ul className="list-disc pl-5 space-y-2">
            <li>To respond to enquiries you submit through the contact form.</li>
            <li>To process donations and issue Section 18A tax certificates.</li>
            <li>To send acknowledgement emails relating to your interaction with us.</li>
            <li>To improve the website and our programmes.</li>
          </ul>
          <p className="mt-3">We will never sell, rent, or trade your personal information to third parties.</p>
        </Section>

        <Section heading="4. Legal Basis for Processing">
          We process your personal information on the following grounds:
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Consent</strong> — when you voluntarily submit a contact form or make a donation.</li>
            <li><strong>Legitimate interest</strong> — to operate and improve the website and respond to enquiries.</li>
            <li><strong>Legal obligation</strong> — to issue tax certificates as required by SARS regulations.</li>
          </ul>
        </Section>

        <Section heading="5. Data Retention">
          We retain your personal information only for as long as necessary to fulfil the purposes
          outlined above, or as required by South African law (e.g., financial records for 5 years).
          Contact form submissions are retained for up to 12 months.
        </Section>

        <Section heading="6. Third-Party Service Providers">
          We use the following trusted service providers:
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Paystack</strong> — secure payment processing. Subject to Paystack's own Privacy Policy.</li>
            <li><strong>Resend</strong> — transactional email delivery.</li>
          </ul>
          These providers process data solely on our behalf and are contractually bound to protect it.
        </Section>

        <Section heading="7. Cookies">
          Our website may use essential cookies to ensure the site functions correctly. We do not
          use advertising or tracking cookies. You can disable cookies in your browser settings,
          though this may affect site functionality.
        </Section>

        <Section heading="8. Your Rights">
          Under POPIA you have the right to:
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Request access to the personal information we hold about you.</li>
            <li>Request correction of inaccurate information.</li>
            <li>Request deletion of your information (subject to legal retention requirements).</li>
            <li>Object to or restrict processing in certain circumstances.</li>
            <li>Lodge a complaint with the Information Regulator of South Africa.</li>
          </ul>
          To exercise any of these rights, contact us at{' '}
          <a href="mailto:ocsacademy2020@gmail.com" className="text-wine hover:underline">
            ocsacademy2020@gmail.com
          </a>.
        </Section>

        <Section heading="9. Security">
          We take reasonable technical and organisational measures to safeguard your personal
          information against unauthorised access, loss, or disclosure. All payment data is
          transmitted over SSL/TLS encryption.
        </Section>

        <Section heading="10. Changes to This Policy">
          We may update this Privacy Policy from time to time. We will post the updated policy on
          this page with a revised "last updated" date.
        </Section>

        <Section heading="11. Contact the Information Officer">
          <p>
            Golden Age Society — Information Officer<br />
            Email:{' '}
            <a href="mailto:ocsacademy2020@gmail.com" className="text-wine hover:underline">
              ocsacademy2020@gmail.com
            </a><br />
            Location: No.5, Fourth Avenue, Edenvale 1609, South Africa
          </p>
        </Section>
      </>
    ),
  },

  refunds: {
    title: 'Refund Policy',
    updated: 'August 2026',
    content: (
      <>
        <Section heading="1. General Policy">
          Golden Age Society is a non-profit organisation. All monetary contributions are received
          as voluntary donations to support our devotional and community service programmes.
          Donations are generally <strong>non-refundable</strong> once processed, as they are
          immediately allocated to ongoing programmes.
        </Section>

        <Section heading="2. Erroneous or Duplicate Donations">
          We understand that mistakes happen. If you believe a donation was made in error —
          for example, a duplicate transaction or an incorrect amount — please contact us
          within <strong>7 calendar days</strong> of the transaction date at{' '}
          <a href="mailto:ocsacademy2020@gmail.com" className="text-wine hover:underline">
            ocsacademy2020@gmail.com
          </a>{' '}
          with the following information:
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li>Your full name and email address used during the donation.</li>
            <li>The date and approximate amount of the transaction.</li>
            <li>Proof of payment (bank statement or Paystack receipt).</li>
            <li>A brief description of the error.</li>
          </ul>
          <p className="mt-3">
            We will review your request and, where the error is verified, process a refund to the
            original payment method within <strong>10 – 15 business days</strong>.
          </p>
        </Section>

        <Section heading="3. Section 18A Tax Certificates">
          Where a donation qualifies for a Section 18A deduction under the South African Income Tax
          Act, a certificate will be issued by email within 30 days of a verified donation. If you
          do not receive your certificate or if there is an error on the certificate, please contact
          us at{' '}
          <a href="mailto:ocsacademy2020@gmail.com" className="text-wine hover:underline">
            ocsacademy2020@gmail.com
          </a>.
          <p className="mt-3">
            Note: issuing a Section 18A certificate does not affect your right to request a refund
            under clause 2 above, but the certificate will be voided if a refund is processed.
          </p>
        </Section>

        <Section heading="4. Sponsored Programmes">
          Specific sponsorship commitments (e.g., sponsoring prasadam meals for a particular
          event) are non-refundable once the programme has commenced. If the programme is cancelled
          by Golden Age Society, a full refund or credit towards a future programme will be offered.
        </Section>

        <Section heading="5. Payment Disputes">
          If you believe an unauthorised charge has occurred, please contact your bank or card
          issuer directly in addition to notifying us. We will cooperate fully with any
          chargeback investigation.
        </Section>

        <Section heading="6. Contact">
          All refund requests and queries should be directed to:{' '}
          <a href="mailto:ocsacademy2020@gmail.com" className="text-wine hover:underline">
            ocsacademy2020@gmail.com
          </a>
          . Please allow up to 3 business days for an initial response.
        </Section>
      </>
    ),
  },

  contact: {
    title: 'Contact Us',
    updated: 'August 2026',
    content: (
      <>
        <Section heading="General Enquiries">
          <ContactRow icon="✉" label="Email">
            <a href="mailto:ocsacademy2020@gmail.com" className="text-wine hover:underline">
              ocsacademy2020@gmail.com
            </a>
          </ContactRow>
        </Section>

        <Section heading="Location">
          <ContactRow icon="📍" label="Address">
No.5, Fourth Avenue, Edenvale 1609, South Africa
          </ContactRow>
          <p className="mt-4 text-sm text-text/60">
            We do not maintain a permanent public-facing office. Community gatherings and programmes
            are held at various venues across South Africa — details are announced via our newsletter
            and contact form responses.
          </p>
        </Section>

        <Section heading="Specific Enquiries">
          <div className="space-y-4">
            <ContactRow icon="🙏" label="Programme &amp; gathering info">
              <a href="mailto:ocsacademy2020@gmail.com?subject=Programme%20Enquiry" className="text-wine hover:underline">
                ocsacademy2020@gmail.com
              </a>
            </ContactRow>
            <ContactRow icon="💛" label="Donations &amp; Section 18A certificates">
              <a href="mailto:ocsacademy2020@gmail.com?subject=Donation%20Enquiry" className="text-wine hover:underline">
                ocsacademy2020@gmail.com
              </a>
            </ContactRow>
            <ContactRow icon="📰" label="Newsletter &amp; media">
              <a href="mailto:ocsacademy2020@gmail.com?subject=Newsletter%20Enquiry" className="text-wine hover:underline">
                ocsacademy2020@gmail.com
              </a>
            </ContactRow>
            <ContactRow icon="⚖" label="Legal, privacy &amp; data requests">
              <a href="mailto:ocsacademy2020@gmail.com?subject=Legal%20Enquiry" className="text-wine hover:underline">
                ocsacademy2020@gmail.com
              </a>
            </ContactRow>
          </div>
        </Section>

        <Section heading="Send Us a Message">
          <p className="mb-4 text-text/70">
            You can also reach us directly through the contact form on our home page — we aim to
            respond within 3 business days.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-wine text-cream rounded-full text-sm font-medium hover:bg-[#5a1520] transition-colors"
          >
            Go to contact form →
          </a>
        </Section>
      </>
    ),
  },
};

/* ── Helper sub-components ─────────────────────────────────────────── */

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="font-serif text-xl md:text-2xl text-wine mb-4">{heading}</h2>
      <div className="text-text/80 leading-relaxed space-y-2 text-[15px] md:text-base">{children}</div>
    </div>
  );
}

function ContactRow({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xl mt-0.5">{icon}</span>
      <div>
        <div className="text-xs uppercase tracking-widest text-text/45 font-semibold mb-0.5">{label}</div>
        <div className="text-[15px]">{children}</div>
      </div>
    </div>
  );
}

function InlineLink({ slug, children }: { slug: LegalSlug; children: React.ReactNode }) {
  const [, navigate] = useLocation();
  return (
    <button onClick={() => navigate(`/legal/${slug}`)} className="text-wine underline underline-offset-2 hover:text-[#5a1520]">
      {children}
    </button>
  );
}

const SIDENAV: { slug: LegalSlug; label: string }[] = [
  { slug: 'terms',   label: 'Terms of Use' },
  { slug: 'privacy', label: 'Privacy Policy' },
  { slug: 'refunds', label: 'Refund Policy' },
  { slug: 'contact', label: 'Contact Details' },
];

/* ── Page component ─────────────────────────────────────────────────── */

export default function LegalPage() {
  const params = useParams<{ page: string }>();
  const [, navigate] = useLocation();

  const slug = (params.page ?? 'terms') as LegalSlug;
  const doc = DOCS[slug] ?? DOCS.terms;

  usePageTitle(doc.title);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  return (
    <div className="min-h-screen bg-[#fffdf7]">
      <Header />

      {/* Masthead */}
      <div className="bg-[#32111e] pt-36 pb-14 px-6">
        <div className="max-w-3xl mx-auto flex items-center gap-5">
          <img src={gasLogo} alt="" className="w-12 h-12 object-contain filter brightness-[8] opacity-80" />
          <div>
            <p className="text-gold/70 text-xs uppercase tracking-widest font-semibold mb-1">Golden Age Society</p>
            <h1 className="font-serif text-3xl md:text-4xl text-cream">{doc.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-14 flex flex-col md:flex-row gap-10">

        {/* Sidebar nav */}
        <aside className="md:w-56 shrink-0">
          <p className="text-xs uppercase tracking-widest text-text/40 font-semibold mb-4 pl-1">Documents</p>
          <nav className="flex flex-row md:flex-col gap-1 flex-wrap">
            {SIDENAV.map((item) => (
              <button
                key={item.slug}
                onClick={() => navigate(`/legal/${item.slug}`)}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  slug === item.slug
                    ? 'bg-[#f8f5ed] text-wine font-semibold'
                    : 'text-text/70 hover:bg-[#f8f5ed] hover:text-wine'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <p className="text-xs text-text/40 mb-8">Last updated: {doc.updated}</p>
          {doc.content}
          <div className="mt-14 pt-8 border-t border-gold/10 text-xs text-text/40">
            © 2026 Golden Age Society · Edenvale, South Africa
          </div>
        </main>

      </div>
    </div>
  );
}
