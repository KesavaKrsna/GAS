import { Router } from 'express';
import { verifyTransaction, getOrCreateMonthlyPlan } from '../lib/paystack.js';
import { issueCertificate } from '../lib/certificates-store.js';
import { getPool } from '@workspace/db/pool';
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
    donorType,
    donorTaxRef,
  } = req.body as {
    donorType?: string;
    donorTaxRef?: string;
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
    const paidAt = verification.data.paid_at ? new Date(verification.data.paid_at) : new Date();
    const donationDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Johannesburg' }).format(paidAt);

    // Idempotent: a repeat verify for the same Paystack reference returns the existing certificate.
    const existing = await getPool()
      .query(`SELECT cert_no FROM certificates WHERE source='paystack' AND payment_reference=$1`, [reference])
      .catch(() => null);
    if (existing?.rowCount) {
      res.json({ success: true, certificateNumber: existing.rows[0].cert_no, amountZAR, donorName, emailSent: true });
      return;
    }

    // 2. Issue numbered certificate (stored + emailed)
    let result: Awaited<ReturnType<typeof issueCertificate>> = null;
    try {
    result = await issueCertificate({
      source: 'paystack',
      donorType: ['Individual', 'Company', 'Trust', 'Other'].includes(String(donorType)) ? String(donorType) : 'Individual',
      donorName, donorIdNumber: donorId ?? '', donorTaxRef: String(donorTaxRef ?? '').replace(/\s/g, ''),
      donorAddress: donorAddress ?? '', donorPhone: donorPhone ?? '', donorEmail,
      amount: amountZAR, donationDate,
      paymentMethod: verification.data.channel
        ? 'Paystack (' + verification.data.channel.charAt(0).toUpperCase() + verification.data.channel.slice(1) + ')'
        : 'Paystack',
      paymentReference: reference, isRecurring: !!isRecurring, popiaConsent: true,
    });
    } catch (issueErr) {
      // Payment succeeded; never fail the donor here. Certificate can be issued later from the admin page.
      logger.error({ issueErr, reference }, 'Payment verified but certificate could not be issued');
    }

    res.json({
      success: true,
      certificateNumber: result?.certNo ?? null,
      amountZAR,
      donorName,
      emailSent: result?.emailed ?? false,
    });
  } catch (err) {
    logger.error({ err }, 'Donate verify error');
    res.status(500).json({ error: 'An error occurred processing your donation.' });
  }
});

export default donateRouter;
