// netlify/functions/firstpromoter-signup.ts
// Inscription affilié via FirstPromoter API

import type { Handler } from '@netlify/functions';

const FP_API_KEY = process.env.FIRSTPROMOTER_API_KEY!;
const FP_BASE = 'https://api.firstpromoter.com/v1';

const handler: Handler = async event => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const params = new URLSearchParams(event.body || '');
  const data = {
    email: params.get('email'),
    first_name: params.get('firstName'),
    last_name: params.get('lastName'),
    custom_fields: {
      website: params.get('website'),
      lang: params.get('lang'),
    },
  };

  if (!data.email) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Email requis' }) };
  }

  try {
    const res = await fetch(`${FP_BASE}/referrals`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${FP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error('[FP Signup] Error:', result);
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: result.message || 'Erreur inscription' }),
      };
    }

    // Succès : retourner code affilié + lien dashboard
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Bienvenue ! Votre espace partenaire est prêt.',
        affiliateCode: result.code,
        dashboardUrl: `https://app.firstpromoter.com/affiliate/${result.code}`,
      }),
    };
  } catch (err) {
    console.error('[FP Signup] Exception:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Erreur serveur' }) };
  }
};

export { handler };
