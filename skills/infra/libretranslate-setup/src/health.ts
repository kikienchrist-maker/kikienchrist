/**
 * Health checks pour LibreTranslate
 */
import axios from 'axios';
import type { ServiceStatus } from './types.js';

const DEFAULT_URL = 'http://localhost:5000';

export async function checkHealth(baseUrl = DEFAULT_URL): Promise<ServiceStatus> {
  try {
    const [healthRes, languagesRes] = await Promise.all([
      axios.get(`${baseUrl}/health`, { timeout: 5000 }),
      axios.get(`${baseUrl}/languages`, { timeout: 5000 }),
    ]);

    return {
      running: true,
      healthy: healthRes.status === 200,
      url: baseUrl,
      languages: languagesRes.data.map((l: any) => l.code),
    };
  } catch (error) {
    return {
      running: false,
      healthy: false,
      url: baseUrl,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function waitForHealthy(
  baseUrl = DEFAULT_URL,
  maxWaitMs = 300000,
  intervalMs = 5000
): Promise<ServiceStatus> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitMs) {
    const status = await checkHealth(baseUrl);
    if (status.healthy) {
      return status;
    }
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
  
  return {
    running: false,
    healthy: false,
    url: baseUrl,
    error: `Timeout après ${maxWaitMs}ms`,
  };
}