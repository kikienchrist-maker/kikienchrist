// src/lib/affiliation.ts
// Client FirstPromoter minimaliste + utilitaires tracking

export interface AffiliateLink {
  url: string;
  code: string;
  productId: string;
}

export interface FirstPromoterConfig {
  apiKey: string;
  baseUrl: string;
}

const FP_BASE = 'https://api.firstpromoter.com/v1';

export async function createReferral(
  config: FirstPromoterConfig,
  data: {
    email: string;
    firstName?: string;
    lastName?: string;
    customFields?: Record<string, string>;
  }
) {
  const res = await fetch(`${FP_BASE}/referrals`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function trackConversion(
  config: FirstPromoterConfig,
  data: {
    code: string;
    amount: number; // en centimes
    currency: string;
    orderId: string;
    customerEmail: string;
    productId?: string;
  }
) {
  const res = await fetch(`${FP_BASE}/conversions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getAffiliateStats(config: FirstPromoterConfig, code: string) {
  const res = await fetch(`${FP_BASE}/affiliates/${code}/stats`, {
    headers: { Authorization: `Bearer ${config.apiKey}` },
  });
  return res.json();
}

// Helper: générer lien affilié
export function buildAffiliateUrl(baseUrl: string, code: string, path: string = '/'): string {
  const url = new URL(path, baseUrl);
  url.searchParams.set('fp_ref', code);
  return url.toString();
}

// Helper: extraire code depuis URL (pour landing pages)
export function extractAffiliateCode(url: string): string | null {
  const u = new URL(url);
  return u.searchParams.get('fp_ref');
}

// Cookie first-party pour attribution (30 jours)
export function setAffiliateCookie(code: string): void {
  if (typeof document === 'undefined') return;
  const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `fp_ref=${code}; expires=${expiry}; path=/; SameSite=Lax; Secure`;
}

export function getAffiliateCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|; )fp_ref=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}
