// netlify/functions/firstpromoter-webhook.ts
// Reçoit événements FirstPromoter (conversion, signup, payout)

import type { Handler, HandlerEvent } from '@netlify/functions';
import crypto from 'crypto';

const WEBHOOK_SECRET = process.env.FIRSTPROMOTER_WEBHOOK_SECRET!;

function verifySignature(payload: string, signature: string): boolean {
  const expected = crypto.createHmac('sha256', WEBHOOK_SECRET).update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const signature = event.headers['x-firstpromoter-signature'] || '';
  const payload = event.body || '';

  if (!verifySignature(payload, signature)) {
    console.warn('[FP Webhook] Invalid signature');
    return { statusCode: 401, body: 'Invalid signature' };
  }

  let data;
  try {
    data = JSON.parse(payload);
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  console.log('[FP Webhook]', data.event, data);

  switch (data.event) {
    case 'conversion.created':
      // Conversion validée → synchroniser avec Google Sheets / email / DB
      await handleConversion(data.data);
      break;
    case 'referral.created':
      // Nouvel affilié inscrit
      await handleNewAffiliate(data.data);
      break;
    case 'payout.created':
      // Paiement déclenché
      await handlePayout(data.data);
      break;
  }

  return { statusCode: 200, body: 'OK' };
};

async function handleConversion(data: any) {
  // TODO: Google Sheets append row, email notif, etc.
  console.log('Conversion:', data.code, data.amount, data.currency, data.order_id);
}

async function handleNewAffiliate(data: any) {
  console.log('New affiliate:', data.email, data.code);
}

async function handlePayout(data: any) {
  console.log('Payout:', data.affiliate_code, data.amount);
}

export { handler };
