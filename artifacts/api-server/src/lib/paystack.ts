const PAYSTACK_BASE = 'https://api.paystack.co';

function getHeaders() {
  const key = process.env['PAYSTACK_SECRET_KEY'];
  if (!key) throw new Error('PAYSTACK_SECRET_KEY is not set');
  return {
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    status: string; // 'success' | 'failed' | 'pending'
    reference: string;
    amount: number; // kobo
    currency: string;
    paid_at: string;
    customer: { email: string };
    channel: string;
    metadata?: Record<string, unknown>;
  };
}

export async function verifyTransaction(reference: string): Promise<PaystackVerifyResponse> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: getHeaders(),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Paystack verify failed: ${res.status} ${body}`);
  }
  return res.json() as Promise<PaystackVerifyResponse>;
}

export interface CreatePlanResponse {
  status: boolean;
  data: { plan_code: string; name: string; amount: number };
}

// In-memory cache so we don't create duplicate plans per session
const planCache = new Map<number, string>(); // amount (ZAR kobo) → plan_code

export async function getOrCreateMonthlyPlan(amountZAR: number): Promise<string> {
  const amountKobo = amountZAR * 100;
  const cached = planCache.get(amountKobo);
  if (cached) return cached;

  const res = await fetch(`${PAYSTACK_BASE}/plan`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      name: `Golden Age Society Monthly Donation – R${amountZAR}`,
      interval: 'monthly',
      amount: amountKobo,
      currency: 'ZAR',
      description: 'Recurring monthly donation to Golden Age Society – Section 18A approved',
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Paystack create plan failed: ${res.status} ${body}`);
  }

  const json = (await res.json()) as CreatePlanResponse;
  const planCode = json.data.plan_code;
  planCache.set(amountKobo, planCode);
  return planCode;
}
