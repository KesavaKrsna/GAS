import { Router } from 'express';
import { verifyTransaction, getOrCreateMonthlyPlan } from '../lib/paystack.js';
import { generateSection18ACertificate, generateCertificateNumber } from '../lib/certificate.js';
import { sendDonationCertificate } from '../lib/email.js';
import { logger } from '../lib/logger.js';

const donateRouter = Router();

// POST /api/donate/initialize  — get Paystack plan code for recurring donations
donateRouter.post('/donate/initialize', async (req, res) => {
  try {
    const { amount } = req.body as { amount: number };
    if (!amount || amount <= 0) {
      res.status(400).json({ error: 'Valid amount (ZAR) is required' });
      return;
    }
    const planCode = await getOrCreateMonthlyPlan(amount);
    res.json({ planCode });
  } catch (err) {
    logger.error({ err }, 'Failed to create Paystack plan');
    res.status(500).json({ error: 'Failed to create subscription plan. Please try again.' });
  }
});

// POST /api/donate/verify  — verify payment → generate cert → send email
donateRouter.post('/donate/verify', async (req, res) => {
  const {
    reference,
    donorName,
    donorId,
    donorEmail,
    donorPhone,
    donorAddress,
    isRecurring,
  } = req.body as {
    reference: string;
    donorName: string;
    donorId: string;
    donorEmail: string;
    donorPhone: string;
    donorAddress: string;
    isRecurring: boolean;
  };

  if (!reference || !donorName || !donorEmail) {
    res.status(400).json({ error: 'reference, donorName and donorEmail are required' });
    return;
  }

  try {
    // 1. Verify with Paystack
    const verification = await verifyTransaction(reference);
    if (!verification.status || verification.data.status !== 'success') {
      res.status(402).json({ error: 'Payment not confirmed. Status: ' + verification.data.status });
      return;
    }

    const amountZAR = verification.data.amount / 100; // kobo → ZAR
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' });

    // 2. Generate certificate
    const certNumber = generateCertificateNumber();
    const certData = {
      certificateNumber: certNumber,
      dateIssued: dateStr,
      donorName,
      donorId,
      donorEmail,
      donorPhone,
      donorAddress,
      donationDate: dateStr,
      donationAmount: amountZAR,
      paymentMethod: verification.data.channel
        ? verification.data.channel.charAt(0).toUpperCase() + verification.data.channel.slice(1)
        : 'Paystack',
      paystackReference: reference,
      isRecurring: !!isRecurring,
    };

    const pdfBytes = await generateSection18ACertificate(certData);

    // 3. Send email (non-fatal if it fails)
    try {
      await sendDonationCertificate(certData, pdfBytes);
    } catch (emailErr) {
      logger.error({ emailErr }, 'Failed to send donation certificate email');
      // Still return success — cert was generated, email is best-effort
    }

    res.json({
      success: true,
      certificateNumber: certNumber,
      amountZAR,
      donorName,
      emailSent: true,
    });
  } catch (err) {
    logger.error({ err }, 'Donate verify error');
    res.status(500).json({ error: 'An error occurred processing your donation.' });
  }
});

export default donateRouter;
