import { sql } from "drizzle-orm";
import { pgTable, serial, text, integer, numeric, date, timestamp, boolean, customType, uniqueIndex } from "drizzle-orm/pg-core";

const bytea = customType<{ data: Buffer }>({ dataType: () => "bytea" });

/** Per-year sequential counter for Section 18A certificate numbers. Numbers are never reused. */
export const certificateCounterTable = pgTable("certificate_counter", {
  year: integer("year").primaryKey(),
  lastNo: integer("last_no").notNull().default(0),
});

/** One-time donor self-serve links for Section 18A certificates. */
export const certificateLinksTable = pgTable("certificate_links", {
  id: serial("id").primaryKey(),
  tokenId: text("token_id").notNull().unique(),
  donorName: text("donor_name").notNull(),
  donorEmail: text("donor_email").notNull(),
  status: text("status").notNull().default("pending"), // pending | used | revoked
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  usedAt: timestamp("used_at", { withTimezone: true }),
});

/** Every issued Section 18A certificate, in sequential order. Void, never delete. */
export const certificatesTable = pgTable("certificates", {
  id: serial("id").primaryKey(),
  certNo: text("cert_no").notNull(),
  seqYear: integer("seq_year").notNull(),
  seqNo: integer("seq_no").notNull(),
  source: text("source").notNull(), // paystack | offline
  linkId: integer("link_id"),
  donorType: text("donor_type").notNull(),
  donorName: text("donor_name").notNull(),
  donorIdNumber: text("donor_id_number").notNull(),
  donorTaxRef: text("donor_tax_ref"),
  donorAddress: text("donor_address").notNull(),
  donorPhone: text("donor_phone").notNull(),
  donorEmail: text("donor_email").notNull(),
  amountZar: numeric("amount_zar", { precision: 12, scale: 2 }).notNull(),
  donationDate: date("donation_date").notNull(),
  paymentMethod: text("payment_method").notNull(),
  paymentReference: text("payment_reference"),
  isRecurring: boolean("is_recurring").notNull().default(false),
  popiaConsent: boolean("popia_consent").notNull().default(false),
  issuedAt: timestamp("issued_at", { withTimezone: true }).notNull().defaultNow(),
  pdfSha256: text("pdf_sha256"),
  pdfBytes: bytea("pdf_bytes"),
  status: text("status").notNull().default("issued"), // issued | void
  voidReason: text("void_reason"),
  emailStatus: text("email_status").notNull().default("pending"),
  emailMessageId: text("email_message_id"),
  emailError: text("email_error"),
}, (t) => [uniqueIndex("certificates_cert_no_idx").on(t.certNo), uniqueIndex("certificates_paystack_ref_idx").on(t.paymentReference).where(sql`source = 'paystack'`)]);
