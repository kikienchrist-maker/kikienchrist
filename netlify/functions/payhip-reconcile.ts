// netlify/functions/payhip-reconcile.ts
// Fonction de réconciliation : compare Payhip API vs Google Sheets
// À déclencher manuellement ou via cron (Netlify Scheduled Functions)

import type { Handler } from '@netlify/functions';
import { google } from 'googleapis';

const PAYHIP_API_KEY = process.env.PAYHIP_API_KEY!; // Payhip → Settings → API
const PAYHIP_BASE = 'https://api.payhip.com/v1';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
];

async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: SCOPES,
  });
  return google.sheets({ version: 'v4', auth });
}

async function fetchPayhipSales(fromDate: string) {
  // Payhip API: GET /sales?from=YYYY-MM-DD
  const res = await fetch(`${PAYHIP_BASE}/sales?from=${fromDate}`, {
    headers: { Authorization: `Bearer ${PAYHIP_API_KEY}` },
  });
  return res.json();
}

async function fetchSheetSales(sheets: any, sheetName: string) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID!,
    range: `${sheetName}!B:B`, // Colonne B = Sale ID
  });
  return new Set(res.data.values?.flat() || []);
}

const handler: Handler = async () => {
  try {
    const sheets = await getSheetsClient();
    const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || 'Ventes';

    // 1. Récupérer ventes Payhip (30 derniers jours)
    const fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const payhipSales = await fetchPayhipSales(fromDate);

    // 2. Récupérer Sale IDs dans Google Sheets
    const sheetSaleIds = await fetchSheetSales(sheets, sheetName);

    // 3. Trouver manquants
    const missing: any[] = [];
    for (const sale of payhipSales.data || []) {
      if (!sheetSaleIds.has(sale.sale_id)) {
        missing.push(sale);
      }
    }

    // 4. Insérer manquants
    for (const sale of missing) {
      const row = [
        'sale.completed (reconciled)',
        sale.sale_id,
        sale.product_id,
        sale.product_name,
        sale.customer_email,
        sale.customer_name,
        (sale.amount / 100).toFixed(2),
        sale.currency,
        sale.affiliate_code || '',
        (sale.affiliate_commission || 0).toFixed(2),
        sale.discount_code || '',
        (sale.discount_amount || 0).toFixed(2),
        (sale.tax_amount || 0).toFixed(2),
        sale.status,
        sale.created_at,
        new Date().toISOString(),
        'RECONCILIATION',
      ];
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID!,
        range: `${sheetName}!A:Z`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [row] },
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        checked: payhipSales.data?.length || 0,
        missing: missing.length,
        inserted: missing.map(s => s.sale_id),
      }),
    };
  } catch (err) {
    console.error('[Reconcile] Error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
};

export { handler };
