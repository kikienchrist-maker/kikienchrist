// Netlify Function - Newsletter signup (MailerLite)
// POST /.netlify/functions/newsletter

import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

interface NewsletterRequest {
  'form-name': string;
  email: string;
  lang: string;
  'lead-magnet-url'?: string;
  'lead-magnet-title'?: string;
  page: string;
  'bot-field'?: string; // Honeypot
}

interface MailerLiteSubscriber {
  email: string;
  fields: {
    name?: string;
    lang: string;
    source_page: string;
    lead_magnet?: string;
  };
  groups: string[];
  status: 'active' | 'unconfirmed';
}

const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const MAILERLITE_API_URL = 'https://connect.mailerlite.com/api';

// Groupes MailerLite par langue (à configurer dans MailerLite)
const LANG_GROUPS: Record<string, string> = {
  fr: process.env.MAILERLITE_GROUP_FR || 'g_fr_subscribers',
  en: process.env.MAILERLITE_GROUP_EN || 'g_en_subscribers',
  es: process.env.MAILERLITE_GROUP_ES || 'g_es_subscribers',
  pt: process.env.MAILERLITE_GROUP_PT || 'g_pt_subscribers',
  it: process.env.MAILERLITE_GROUP_IT || 'g_it_subscribers',
  de: process.env.MAILERLITE_GROUP_DE || 'g_de_subscribers',
  nl: process.env.MAILERLITE_GROUP_NL || 'g_nl_subscribers',
  pl: process.env.MAILERLITE_GROUP_PL || 'g_pl_subscribers',
  ar: process.env.MAILERLITE_GROUP_AR || 'g_ar_subscribers',
};

// Groupe lead magnets
const LEAD_MAGNET_GROUP = process.env.MAILERLITE_GROUP_LEAD_MAGNET || 'g_lead_magnet';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Method not allowed' }),
    };
  }

  try {
    // Parse form data
    const contentType = event.headers['content-type'] || '';
    let data: NewsletterRequest;

    if (contentType.includes('application/json')) {
      data = JSON.parse(event.body || '{}');
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      // Netlify Forms envoie application/x-www-form-urlencoded
      const params = new URLSearchParams(event.body || '');
      data = Object.fromEntries(params) as NewsletterRequest;
    } else {
      return errorResponse('Invalid content type');
    }

    // Honeypot check
    if (data['bot-field'] && data['bot-field'].trim() !== '') {
      console.log('Honeypot triggered, ignoring submission');
      return successResponse(); // Silently succeed to not reveal honeypot
    }

    // Validate required fields
    if (!data.email || !isValidEmail(data.email)) {
      return errorResponse('Invalid email');
    }

    if (!data.lang || !LANG_GROUPS[data.lang]) {
      return errorResponse('Invalid language');
    }

    // Préparer subscriber MailerLite
    const subscriber: MailerLiteSubscriber = {
      email: data.email.toLowerCase().trim(),
      fields: {
        lang: data.lang,
        source_page: data.page,
      },
      groups: [LANG_GROUPS[data.lang]],
      status: 'active',
    };

    // Ajouter lead magnet si présent
    if (data['lead-magnet-url'] && data['lead-magnet-title']) {
      subscriber.fields.lead_magnet = data['lead-magnet-title'];
      subscriber.groups.push(LEAD_MAGNET_GROUP);
    }

    // Appel API MailerLite
    const response = await fetch(`${MAILERLITE_API_URL}/subscribers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(subscriber),
    });

    const result = await response.json();

    if (!response.ok) {
      // Si email existe déjà, essayer de mettre à jour
      if (response.status === 422 && result.errors?.some((e: any) => e.field === 'email')) {
        return await updateExistingSubscriber(data, subscriber);
      }
      
      console.error('MailerLite error:', result);
      return errorResponse('Subscription failed');
    }

    console.log(`Newsletter signup: ${data.email} (${data.lang})`);
    return successResponse();

  } catch (err) {
    console.error('Newsletter function error:', err);
    return errorResponse('Internal server error');
  }
};

async function updateExistingSubscriber(data: NewsletterRequest, subscriber: MailerLiteSubscriber) {
  try {
    // Chercher subscriber existant
    const searchResponse = await fetch(`${MAILERLITE_API_URL}/subscribers/search?query=${encodeURIComponent(data.email)}`, {
      headers: {
        'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
        'Accept': 'application/json',
      },
    });

    const searchResult = await searchResponse.json();
    
    if (searchResult.data && searchResult.data.length > 0) {
      const existing = searchResult.data[0];
      
      // Mettre à jour groupes
      const updateResponse = await fetch(`${MAILERLITE_API_URL}/subscribers/${existing.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          fields: subscriber.fields,
          groups: [...new Set([...(existing.groups || []), ...subscriber.groups])],
        }),
      });

      if (updateResponse.ok) {
        return successResponse();
      }
    }

    return errorResponse('Failed to update subscriber');
  } catch {
    return errorResponse('Failed to update subscriber');
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function successResponse() {
  return {
    statusCode: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true }),
  };
}

function errorResponse(message: string) {
  return {
    statusCode: 400,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: false, error: message }),
  };
}