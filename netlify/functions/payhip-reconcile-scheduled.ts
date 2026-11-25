// netlify/functions/payhip-reconcile-scheduled.ts
// Cron quotidien 3h00 UTC (Netlify Scheduled Functions)
// Déclenche la réconciliation automatiquement

import { handler as reconcileHandler } from './payhip-reconcile';

export const handler = async (event: any) => {
  // Netlify Scheduled Functions passent { source: 'schedule' }
  if (event.source !== 'schedule') {
    return { statusCode: 403, body: 'Forbidden' };
  }
  return reconcileHandler(event);
};
