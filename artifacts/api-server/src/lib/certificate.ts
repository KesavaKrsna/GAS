import { PDFDocument, StandardFonts, rgb, type PDFPage } from 'pdf-lib';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export interface CertificateData {
  certificateNumber: string;
  dateIssued: string;
  donorName: string;
  donorId: string;
  donorEmail: string;
  donorPhone: string;
  donorAddress: string;
  donationDate: string;
  donationAmount: number; // ZAR
  paymentMethod: string;
  paystackReference: string;
  isRecurring: boolean;
}

// Brand colours as pdf-lib rgb values
const WINE  = rgb(0.459, 0.110, 0.169); // #751c2b
const GOLD  = rgb(0.984, 0.698, 0.149); // #fbb226
const CREAM = rgb(1.0,   0.992, 0.969); // #fffdf7
const DARK  = rgb(0.137, 0.059, 0.094); // #230f18
const GREY  = rgb(0.45,  0.45,  0.45);
const WHITE = rgb(1, 1, 1);
const LIGHT_GOLD = rgb(0.996, 0.882, 0.678); // soft gold

function drawRect(page: PDFPage, x: number, y: number, w: number, h: number, color: ReturnType<typeof rgb>, opacity = 1) {
  page.drawRectangle({ x, y, width: w, height: h, color, opacity });
}

function formatAmount(amount: number) {
  return `R ${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;
}

export async function generateSection18ACertificate(data: CertificateData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  // A4: 595 × 842 pt
  const page = doc.addPage([595, 842]);
  const { width, height } = page.getSize();

  const timesRoman   = await doc.embedFont(StandardFonts.TimesRoman);
  const timesBold    = await doc.embedFont(StandardFonts.TimesRomanBold);
  const timesItalic  = await doc.embedFont(StandardFonts.TimesRomanItalic);
  const helvetica    = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);

  // ── Background ────────────────────────────────────────────────────────────
  drawRect(page, 0, 0, width, height, CREAM);

  // ── Outer gold border ─────────────────────────────────────────────────────
  const MARGIN = 18;
  page.drawRectangle({ x: MARGIN, y: MARGIN, width: width - MARGIN * 2, height: height - MARGIN * 2, borderColor: GOLD, borderWidth: 3, color: CREAM });

  // ── Thin inner wine border ────────────────────────────────────────────────
  const INN = 26;
  page.drawRectangle({ x: INN, y: INN, width: width - INN * 2, height: height - INN * 2, borderColor: WINE, borderWidth: 0.6, color: CREAM });

  // ── Header band ───────────────────────────────────────────────────────────
  drawRect(page, MARGIN, height - MARGIN - 110, width - MARGIN * 2, 110, WINE);

  // ── Logo (top-left of header) ─────────────────────────────────────────────
  try {
    const logoPath = resolve(process.cwd(), '..', '..', 'attached_assets', 'gas-logo.png');
    const logoBytes = readFileSync(logoPath);
    const logoImage = await doc.embedPng(logoBytes);
    const logoSize = 62; // pt
    const logoX = MARGIN + 12;
    const logoY = height - MARGIN - 110 + (110 - logoSize) / 2;
    page.drawImage(logoImage, { x: logoX, y: logoY, width: logoSize, height: logoSize });
  } catch {
    // logo missing — skip silently
  }

  // Org name
  const orgName = 'GOLDEN AGE SOCIETY';
  const orgW = timesBold.widthOfTextAtSize(orgName, 20);
  page.drawText(orgName, {
    x: (width - orgW) / 2, y: height - MARGIN - 38,
    size: 20, font: timesBold, color: GOLD,
  });

  // Certificate title
  const title1 = 'SECTION 18A TAX DEDUCTIBLE DONATION CERTIFICATE';
  const t1W = helveticaBold.widthOfTextAtSize(title1, 10);
  page.drawText(title1, {
    x: (width - t1W) / 2, y: height - MARGIN - 57,
    size: 10, font: helveticaBold, color: LIGHT_GOLD,
  });

  const title2 = '(Issued in terms of Section 18A of the Income Tax Act, No. 58 of 1962)';
  const t2W = timesItalic.widthOfTextAtSize(title2, 8);
  page.drawText(title2, {
    x: (width - t2W) / 2, y: height - MARGIN - 71,
    size: 8, font: timesItalic, color: LIGHT_GOLD,
  });

  // PBO details line
  const pboLine = `PBO Number: 930070132   |   Income Tax Ref: 9884366171   |   Section 18A Approved: 07 September 2020`;
  const plW = helvetica.widthOfTextAtSize(pboLine, 7.5);
  page.drawText(pboLine, {
    x: (width - plW) / 2, y: height - MARGIN - 88,
    size: 7.5, font: helvetica, color: LIGHT_GOLD,
  });

  // Contact line
  const contactLine = `donations@goldenage-society.org   |   www.goldenage-society.org`;
  const clW = helvetica.widthOfTextAtSize(contactLine, 7.5);
  page.drawText(contactLine, {
    x: (width - clW) / 2, y: height - MARGIN - 100,
    size: 7.5, font: helvetica, color: LIGHT_GOLD,
  });

  // ── Gold divider ──────────────────────────────────────────────────────────
  const divY = height - MARGIN - 120;
  drawRect(page, MARGIN, divY, width - MARGIN * 2, 6, GOLD);

  // ── Certificate Ref + Date ────────────────────────────────────────────────
  let cursor = divY - 24;

  const drawKV = (label: string, value: string, yPos: number, bold = false) => {
    page.drawText(label, { x: 46, y: yPos, size: 9, font: helveticaBold, color: WINE });
    page.drawText(value, { x: 230, y: yPos, size: 9, font: bold ? helveticaBold : helvetica, color: DARK });
  };

  // Cert number + date row
  page.drawText(`CERTIFICATE NUMBER: ${data.certificateNumber}`, {
    x: 46, y: cursor, size: 11, font: timesBold, color: WINE,
  });
  page.drawText(`DATE ISSUED: ${data.dateIssued}`, {
    x: 350, y: cursor, size: 9, font: helvetica, color: GREY,
  });

  cursor -= 22;

  // ── Section header helper ─────────────────────────────────────────────────
  const drawSectionHeader = (label: string, y: number) => {
    drawRect(page, 46, y - 3, width - 92, 18, WINE, 0.1);
    page.drawRectangle({ x: 46, y: y - 3, width: width - 92, height: 18, borderColor: WINE, borderWidth: 0.5 });
    page.drawText(label, { x: 52, y: y + 1, size: 9, font: helveticaBold, color: WINE });
  };

  // ── DONOR DETAILS ─────────────────────────────────────────────────────────
  drawSectionHeader('DONOR DETAILS', cursor);
  cursor -= 20;

  const rows: Array<[string, string]> = [
    ['Full Name / Company Name:', data.donorName],
    ['Identity No / Company Reg:', data.donorId],
    ['Email Address:', data.donorEmail],
    ['Phone Number:', data.donorPhone],
    ['Physical Address:', data.donorAddress],
  ];

  rows.forEach(([label, value]) => {
    // Alternating row tint
    const idx = rows.indexOf([label, value] as [string, string]);
    if (idx % 2 === 0) drawRect(page, 46, cursor - 3, width - 92, 16, GOLD, 0.06);
    drawKV(label, value, cursor);
    cursor -= 17;
  });

  cursor -= 8;

  // ── DONATION DETAILS ──────────────────────────────────────────────────────
  drawSectionHeader('DONATION DETAILS', cursor);
  cursor -= 20;

  const donationRows: Array<[string, string]> = [
    ['Donation Date:', data.donationDate],
    ['Donation Amount:', formatAmount(data.donationAmount)],
    ['Donation Type:', data.isRecurring ? 'Recurring Monthly Donation' : 'Once-off Donation'],
    ['Payment Method:', data.paymentMethod],
    ['Transaction Reference:', data.paystackReference],
    ['Donation Purpose:', 'General Donation to Golden Age Society'],
  ];

  donationRows.forEach(([label, value]) => {
    const idx = donationRows.indexOf([label, value] as [string, string]);
    if (idx % 2 === 0) drawRect(page, 46, cursor - 3, width - 92, 16, WINE, 0.06);
    drawKV(label, value, cursor);
    cursor -= 17;
  });

  cursor -= 14;

  // ── CERTIFICATION ─────────────────────────────────────────────────────────
  drawSectionHeader('CERTIFICATION', cursor);
  cursor -= 22;

  const certLines = [
    'This is to certify that the above donation was received by Golden Age Society, an approved Public Benefit',
    'Organisation in terms of Section 30 of the Income Tax Act No. 58 of 1962.',
    '',
    'The donation qualifies as a tax-deductible donation in terms of Section 18A of the Income Tax Act, subject',
    'to the provisions of the Act.',
    '',
    'No goods or services were received by the donor in exchange for this donation, except where specifically',
    'permitted under the Income Tax Act.',
  ];

  certLines.forEach((line) => {
    if (line) {
      page.drawText(line, { x: 46, y: cursor, size: 8.5, font: timesRoman, color: DARK });
    }
    cursor -= 13;
  });

  cursor -= 6;

  // ── ORGANISATION DECLARATION ──────────────────────────────────────────────
  drawSectionHeader('ORGANISATION DECLARATION', cursor);
  cursor -= 22;

  const declarations = [
    '[+]  Golden Age Society is an approved Public Benefit Organisation (PBO No. 930070132).',
    '[+]  The donation received will be used exclusively for approved Public Benefit Activities.',
    '[+]  This certificate is issued in accordance with Section 18A of the Income Tax Act No. 58 of 1962.',
  ];
  declarations.forEach((d) => {
    page.drawText(d, { x: 52, y: cursor, size: 8.5, font: helvetica, color: DARK });
    cursor -= 14;
  });

  cursor -= 12;

  // ── SIGNATURE AREA ────────────────────────────────────────────────────────
  // Divider line
  page.drawLine({ start: { x: 46, y: cursor }, end: { x: 290, y: cursor }, thickness: 0.8, color: WINE, opacity: 0.4 });
  cursor -= 14;

  page.drawText('Kgositsile Mogane', { x: 46, y: cursor, size: 9, font: timesBold, color: WINE });
  cursor -= 13;
  page.drawText('Chairman, Golden Age Society', { x: 46, y: cursor, size: 8, font: timesItalic, color: GREY });
  cursor -= 13;
  page.drawText(`Date: ${data.dateIssued}`, { x: 46, y: cursor, size: 8, font: helvetica, color: GREY });

  // ── Footer band ───────────────────────────────────────────────────────────
  drawRect(page, MARGIN, MARGIN, width - MARGIN * 2, 40, WINE, 0.08);
  const footer1 = 'This certificate has been generated electronically and is valid without a handwritten signature.';
  const footer2 = 'For verification contact: donations@goldenage-society.org';
  const f1W = helvetica.widthOfTextAtSize(footer1, 7);
  const f2W = helvetica.widthOfTextAtSize(footer2, 7);
  page.drawText(footer1, { x: (width - f1W) / 2, y: MARGIN + 26, size: 7, font: helvetica, color: GREY });
  page.drawText(footer2, { x: (width - f2W) / 2, y: MARGIN + 14, size: 7, font: helvetica, color: WINE });

  return doc.save();
}

export function generateCertificateNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `GAS-${year}-${rand}`;
}
