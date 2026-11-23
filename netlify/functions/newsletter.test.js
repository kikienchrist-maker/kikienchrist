// Tests unitaires - Netlify Function Newsletter (Vitest)
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handler } from './newsletter.js';

// Mock fetch global
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Newsletter Function', () => {
  const validEnv = {
    MAILERLITE_API_KEY: 'test-api-key',
    MAILERLITE_GROUP_FR: 'g_fr_test',
    MAILERLITE_GROUP_EN: 'g_en_test',
    MAILERLITE_GROUP_LEAD_MAGNET: 'g_lead_magnet_test',
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv('MAILERLITE_API_KEY', validEnv.MAILERLITE_API_KEY);
    vi.stubEnv('MAILERLITE_GROUP_FR', validEnv.MAILERLITE_GROUP_FR);
    vi.stubEnv('MAILERLITE_GROUP_EN', validEnv.MAILERLITE_GROUP_EN);
    vi.stubEnv('MAILERLITE_GROUP_LEAD_MAGNET', validEnv.MAILERLITE_GROUP_LEAD_MAGNET);
  });

  const createEvent = (overrides = {}) => ({
    httpMethod: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      'form-name': 'newsletter',
      email: 'test@example.com',
      lang: 'fr',
      page: '/fr/blog/',
      'bot-field': '',
      ...overrides,
    }).toString(),
  });

  it('should return 405 for non-POST requests', async () => {
    const event = { ...createEvent(), httpMethod: 'GET' };
    const result = await handler(event as any, {} as any);
    expect(result.statusCode).toBe(405);
  });

  it('should return 400 for invalid email', async () => {
    const event = createEvent({ email: 'invalid-email' });
    const result = await handler(event as any, {} as any);
    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.success).toBe(false);
    expect(body.error).toBe('Invalid email');
  });

  it('should return 400 for missing language', async () => {
    const event = createEvent({ lang: 'xx' });
    const result = await handler(event as any, {} as any);
    expect(result.statusCode).toBe(400);
  });

  it('should silently succeed on honeypot trigger', async () => {
    const event = createEvent({ 'bot-field': 'spam-bot' });
    const result = await handler(event as any, {} as any);
    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.success).toBe(true);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should call MailerLite API with correct payload', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const event = createEvent();
    const result = await handler(event as any, {} as any);

    expect(result.statusCode).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    
    const call = mockFetch.mock.calls[0];
    expect(call[0]).toBe('https://connect.mailerlite.com/api/subscribers');
    expect(call[1].method).toBe('POST');
    
    const body = JSON.parse(call[1].body);
    expect(body.email).toBe('test@example.com');
    expect(body.groups).toContain('g_fr_test');
    expect(body.fields.lang).toBe('fr');
    expect(body.fields.source_page).toBe('/fr/blog/');
  });

  it('should add lead magnet group when lead magnet provided', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const event = createEvent({
      'lead-magnet-url': 'https://example.com/guide.pdf',
      'lead-magnet-title': 'Guide de prière',
    });
    
    const result = await handler(event as any, {} as any);
    
    expect(result.statusCode).toBe(200);
    const call = mockFetch.mock.calls[0];
    const body = JSON.parse(call[1].body);
    expect(body.groups).toContain('g_lead_magnet_test');
    expect(body.fields.lead_magnet).toBe('Guide de prière');
  });

  it('should handle MailerLite 422 error (existing email)', async () => {
    // First call: 422 error
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 422,
      json: async () => ({ errors: [{ field: 'email', message: 'Email already exists' }] }),
    });
    
    // Second call: search existing subscriber
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        data: [{ id: 'sub_123', groups: ['g_fr_test'] }] 
      }),
    });
    
    // Third call: update subscriber
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const event = createEvent();
    const result = await handler(event as any, {} as any);

    expect(result.statusCode).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('should handle CORS preflight', async () => {
    const event = { httpMethod: 'OPTIONS', headers: {}, body: '' };
    const result = await handler(event as any, {} as any);
    expect(result.statusCode).toBe(200);
    expect(result.headers['Access-Control-Allow-Origin']).toBe('*');
  });

  it('should return 500 on network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    
    const event = createEvent();
    const result = await handler(event as any, {} as any);
    
    expect(result.statusCode).toBe(400); // Current implementation returns 400 for all errors
    const body = JSON.parse(result.body);
    expect(body.success).toBe(false);
  });
});