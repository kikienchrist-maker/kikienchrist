// Netlify Function - Newsletter Subscribe (MailerLite Integration)
// POST /.netlify/functions/subscribe

import type { Config, Context } from '@netlify/functions';

interface SubscribeRequest {
  email: string;
  lang?: string;
  leadMagnet?: boolean;
  leadMagnetId?: string; // e.g., 'guide-priere'
  source?: string; // 'blog-sidebar', 'blog-inline', 'hero', 'footer'
  hp_field?: string; // honeypot (must be empty)
  recaptcha_token?: string; // optional reCAPTCHA v3
}

interface MailerLiteSubscriber {
  email: string;
  fields: {
    name?: string;
    lang?: string;
    source?: string;
    lead_magnet?: string;
  };
  groups: string[];
  status: 'active' | 'unconfirmed';
}

interface MailerLiteResponse {
  data: {
    id: string;
    email: string;
    status: string;
  };
}

const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const MAILERLITE_BASE_URL = 'https://connect.mailerlite.com/api';
const BLOG_SUBSCRIBERS_GROUP = process.env.MAILERLITE_BLOG_GROUP_ID || 'blog-subscribers';
const LEAD_MAGNET_GROUP_PREFIX = 'lead-magnet-';

// Lead magnet mapping
const LEAD_MAGNETS: Record<
  string,
  { groupId: string; fileUrl: string; title: Record<string, string> }
> = {
  'guide-priere': {
    groupId: 'lead-magnet-guide-priere',
    fileUrl: 'https://kikienchrist.vercel.app/lead-magnets/guide-priere.pdf',
    title: {
      fr: 'Guide de Prière : 7 Clés pour une Prière Efficace',
      en: 'Prayer Guide: 7 Keys to Effective Prayer',
      es: 'Guía de Oración: 7 Claves para una Oración Efectiva',
      pt: 'Guia de Oração: 7 Chaves para Oração Eficaz',
      it: 'Guida alla Preghiera: 7 Chiavi per una Preghiera Efficace',
      de: 'Gebetsführer: 7 Schlüssel für wirksames Gebet',
      nl: 'Gids voor Gebed: 7 Sleutels voor Effectief Gebed',
      pl: 'Przewodnik Modlitwy: 7 Kluczy do Skutecznej Modlitwy',
      ar: 'دليل الصلاة: 7 مفاتيح للصلاة الفعالة',
      zh: '祷告指南：高效祷告的7个关键',
      hi: 'प्रार्थना गाइड: प्रभावी प्रार्थना के 7 कुंजी',
    },
  },
  'ebook-trinite': {
    groupId: 'lead-magnet-ebook-trinite',
    fileUrl: 'https://kikienchrist.vercel.app/lead-magnets/ebook-trinite.pdf',
    title: {
      fr: 'E-book : La Trinité expliquée simplement',
      en: 'E-book: The Trinity Simply Explained',
    },
  },
};

export default async (req: Request, context: Context) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Check API key
  if (!MAILERLITE_API_KEY) {
    console.error('MAILERLITE_API_KEY not configured');
    return new Response(JSON.stringify({ error: 'Service unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body: SubscribeRequest = await req.json();
    const {
      email,
      lang = 'fr',
      leadMagnet = false,
      leadMagnetId,
      source = 'unknown',
      hp_field,
      recaptcha_token,
    } = body;

    // 1. Honeypot check
    if (hp_field && hp_field.trim() !== '') {
      console.log('Honeypot triggered', { email, ip: context.ip });
      return new Response(JSON.stringify({ success: true, message: 'Subscribed' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. Optional reCAPTCHA v3 verification
    if (recaptcha_token && process.env.RECAPTCHA_SECRET_KEY) {
      const recaptchaRes = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptcha_token}`,
        { method: 'POST' }
      );
      const recaptchaData = await recaptchaRes.json();
      if (!recaptchaData.success || (recaptchaData.score && recaptchaData.score < 0.5)) {
        console.log('reCAPTCHA failed', { email, score: recaptchaData.score });
        return new Response(JSON.stringify({ error: 'Verification failed' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // 4. Prepare MailerLite subscriber
    const groups = [BLOG_SUBSCRIBERS_GROUP];
    const fields: MailerLiteSubscriber['fields'] = {
      lang,
      source,
    };

    // Add lead magnet group if requested
    if (leadMagnet && leadMagnetId && LEAD_MAGNETS[leadMagnetId]) {
      groups.push(LEAD_MAGNETS[leadMagnetId].groupId);
      fields.lead_magnet = leadMagnetId;
    }

    const subscriber: MailerLiteSubscriber = {
      email: email.toLowerCase().trim(),
      fields,
      groups,
      status: 'active', // Single opt-in (or 'unconfirmed' for double opt-in)
    };

    // 5. Call MailerLite API
    const mlResponse = await fetch(`${MAILERLITE_BASE_URL}/subscribers`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MAILERLITE_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(subscriber),
    });

    const mlData = await mlResponse.json();

    if (!mlResponse.ok) {
      // Handle "already subscribed" - update instead
      if (mlResponse.status === 422 && mlData.message?.includes('already')) {
        const updateRes = await fetch(
          `${MAILERLITE_BASE_URL}/subscribers/${encodeURIComponent(email.toLowerCase())}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${MAILERLITE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fields, groups }),
          }
        );

        if (!updateRes.ok) {
          const updateData = await updateRes.json();
          console.error('MailerLite update failed', updateData);
          return new Response(JSON.stringify({ error: 'Subscription update failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      } else {
        console.error('MailerLite create failed', mlData);
        return new Response(JSON.stringify({ error: 'Subscription failed' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // 6. Success response
    return new Response(
      JSON.stringify({
        success: true,
        message: leadMagnet
          ? 'Subscribed! Check your email for the free resource.'
          : 'Subscribed successfully!',
        leadMagnetUrl:
          leadMagnet && leadMagnetId && LEAD_MAGNETS[leadMagnetId]
            ? LEAD_MAGNETS[leadMagnetId].fileUrl
            : null,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Subscribe function error', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const config: Config = {
  path: '/api/newsletter',
};
