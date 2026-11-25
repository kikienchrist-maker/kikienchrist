// netlify/functions/payhip-webhook.ts
// Webhook Payhip → validation HMAC → écriture Google Sheets + alertes

import type { Handler, HandlerEvent } from '@netlify/functions';
import crypto from 'crypto';
import { google } from 'googleapis';

const PAYHIP_WEBHOOK_SECRET = process.env.PAYHIP_WEBHOOK_SECRET!;

// Google Sheets setup
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
let sheetsClient: ReturnType<typeof google.sheets> | null = null;

async function getSheetsClient() {
  if (sheetsClient) return sheetsClient;

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: SCOPES,
  });

  sheetsClient = google.sheets({ version: 'v4', auth });
  return sheetsClient;
}

function verifyPayhipSignature(payload: string, signature: string): boolean {
  const expected = crypto.createHmac('sha256', PAYHIP_WEBHOOK_SECRET).update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

interface PayhipPayload {
  event:
    | 'sale.completed'
    | 'sale.refunded'
    | 'sale.disputed'
    | 'subscription.created'
    | 'subscription.cancelled';
  data: {
    sale_id: string;
    product_id: string;
    product_name: string;
    customer_email: string;
    customer_name: string;
    amount: number; // en centimes
    currency: string;
    affiliate_code?: string;
    affiliate_commission?: number;
    discount_code?: string;
    discount_amount?: number;
    tax_amount?: number;
    status: 'completed' | 'refunded' | 'disputed';
    created_at: string; // ISO 8601
    metadata?: Record<string, string>;
  };
}

async function appendToSheet(row: string[]) {
  const sheets = await getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
  const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || 'Ventes';

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:Z`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  });
}

async function sendAlert(message: string) {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) return;

  await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: message }),
  });
}

const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const signature =
    event.headers['x-payhip-signature'] || event.headers['x-payhip-hmac-sha256'] || '';
  const payload = event.body || '';

  // 1. Vérifier signature HMAC
  if (!verifyPayhipSignature(payload, signature)) {
    console.warn('[Payhip Webhook] Invalid signature');
    await sendAlert('🚨 Payhip Webhook: Signature invalide reçue');
    return { statusCode: 401, body: 'Invalid signature' };
  }

  // 2. Parser payload
  let data: PayhipPayload;
  try {
    data = JSON.parse(payload);
  } catch (e) {
    console.error('[Payhip Webhook] Invalid JSON:', e);
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  console.log('[Payhip Webhook]', data.event, data.data.sale_id);

  // 3. Préparer ligne Google Sheets
  const d = data.data;
  const row = [
    data.event, // A: Type événement
    d.sale_id, // B: Sale ID
    d.product_id, // C: Product ID
    d.product_name, // D: Nom produit
    d.customer_email, // E: Email client
    d.customer_name, // F: Nom client
    (d.amount / 100).toFixed(2), // G: Montant (€)
    d.currency, // H: Devise
    d.affiliate_code || '', // I: Code affilié
    (d.affiliate_commission || 0).toFixed(2), // J: Commission affilié
    d.discount_code || '', // K: Code promo
    (d.discount_amount || 0).toFixed(2), // L: Montant promo
    (d.tax_amount || 0).toFixed(2), // M: TVA
    d.status, // N: Statut
    d.created_at, // O: Date création
    new Date().toISOString(), // P: Date réception webhook
    JSON.stringify(d.metadata || {}), // Q: Métadonnées
  ];

  // 4. Écrire dans Google Sheets
  try {
    await appendToSheet(row);
    console.log('[Payhip Webhook] Row appended to Google Sheets');
  } catch (err) {
    console.error('[Payhip Webhook] Sheets error:', err);
    await sendAlert(
      `🚨 Payhip Webhook: Erreur Google Sheets - ${err instanceof Error ? err.message : 'Unknown'}`
    );
    // Ne pas retourner 500 pour ne pas bloquer les retry Payhip
  }

  // 5. Alertes selon événement
  if (data.event === 'sale.completed') {
    await sendAlert(
      `✅ Nouvelle vente: ${d.product_name} - ${(d.amount / 100).toFixed(2)} ${d.currency} (${d.customer_email})${d.affiliate_code ? ` | Affilié: ${d.affiliate_code}` : ''}`
    );
  } else if (data.event === 'sale.refunded') {
    await sendAlert(`↩️ Remboursement: ${d.product_name} - ${d.sale_id}`);
  } else if (data.event === 'sale.disputed') {
    await sendAlert(`⚠️ Litige/Chargeback: ${d.product_name} - ${d.sale_id}`);
  }

  return { statusCode: 200, body: 'OK' };
};

export { handler };
