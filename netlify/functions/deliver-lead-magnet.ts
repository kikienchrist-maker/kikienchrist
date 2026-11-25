// Netlify Function - Secure Lead Magnet Delivery
// GET /.netlify/functions/deliver-lead-magnet?id=guide-priere&email=xxx&token=xxx
// Returns signed URL (valid 1 hour) or direct PDF stream

import type { Config, Context } from '@netlify/functions';

const LEAD_MAGNETS: Record<string, { filePath: string; title: string }> = {
  'guide-priere': {
    filePath: '/lead-magnets/guide-priere.pdf',
    title: 'Guide de Prière : 7 Clés pour une Prière Efficace',
  },
  'ebook-trinite': {
    filePath: '/lead-magnets/ebook-trinite.pdf',
    title: 'E-book : La Trinité expliquée simplement',
  },
};

// Simple JWT-like token verification (in production, use proper JWT library)
function verifyToken(token: string, email: string, leadMagnetId: string): boolean {
  const secret = process.env.LEAD_MAGNET_SECRET || 'dev-secret-change-me';
  // Expected format: base64(email:leadMagnetId:timestamp:signature)
  try {
    const decoded = atob(token);
    const [tokenEmail, tokenLM, timestamp, signature] = decoded.split(':');
    if (tokenEmail !== email.toLowerCase() || tokenLM !== leadMagnetId) return false;
    const expectedSig = await crypto.subtle.sign(
      'HMAC',
      await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      ),
      new TextEncoder().encode(`${email}:${leadMagnetId}:${timestamp}`)
    );
    const expectedB64 = btoa(String.fromCharCode(...new Uint8Array(expectedSig)));
    return signature === expectedB64 && Date.now() - parseInt(timestamp) < 3600000; // 1 hour
  } catch {
    return false;
  }
}

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const leadMagnetId = url.searchParams.get('id');
  const email = url.searchParams.get('email');
  const token = url.searchParams.get('token');

  if (!leadMagnetId || !email || !token) {
    return new Response(JSON.stringify({ error: 'Missing parameters' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const magnet = LEAD_MAGNETS[leadMagnetId];
  if (!magnet) {
    return new Response(JSON.stringify({ error: 'Lead magnet not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Verify token
  const valid = await verifyToken(token, email, leadMagnetId);
  if (!valid) {
    return new Response(JSON.stringify({ error: 'Invalid or expired link' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Generate signed URL for Netlify Blob Storage / Vercel Blob / S3
  // For now, redirect to public URL (in production, use signed URL)
  const fileUrl = `https://kikienchrist.vercel.app${magnet.filePath}`;

  return Response.redirect(fileUrl, 302);
};

export const config: Config = {
  path: '/api/deliver-lead-magnet',
};
