import { http, HttpResponse, delay } from 'msw';
import { db, generateAnalyticsData, featureFlags } from '../db';

export const analyticsHandlers = [
  // ── GET /api/analytics/metrics ─────────────────────────────────────────────
  http.get('/api/analytics/metrics', async () => {
    await delay(400);
    const data = generateAnalyticsData();
    return HttpResponse.json({ data });
  }),

  // ── GET /api/analytics/chart ───────────────────────────────────────────────
  http.get('/api/analytics/chart', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const range = Number(url.searchParams.get('range') ?? '30');
    const data = generateAnalyticsData();
    return HttpResponse.json({
      data: {
        ...data,
        dailyActiveUsers: data.dailyActiveUsers.slice(-Math.min(range, 30)),
      },
    });
  }),

  // ── GET /api/audit-logs ────────────────────────────────────────────────────
  http.get('/api/audit-logs', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = Number(url.searchParams.get('limit') ?? '20');
    const module = url.searchParams.get('module') ?? undefined;
    const action = url.searchParams.get('action') ?? undefined;

    let logs = [...db.auditLogs];
    if (module) logs = logs.filter(l => l.module === module);
    if (action) logs = logs.filter(l => l.action === action);

    const total = logs.length;
    const start = (page - 1) * limit;
    return HttpResponse.json({
      data: logs.slice(start, start + limit),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  }),

  // ── GET /api/notifications ─────────────────────────────────────────────────
  http.get('/api/notifications', async () => {
    await delay(200);
    return HttpResponse.json({ data: db.notifications });
  }),

  // ── PUT /api/notifications/:id/read ───────────────────────────────────────
  http.put('/api/notifications/:id/read', async ({ params }) => {
    await delay(150);
    const n = db.notifications.find(n => n.id === params.id);
    if (n) n.read = true;
    return HttpResponse.json({ message: 'Marked as read' });
  }),

  // ── PUT /api/notifications/read-all ───────────────────────────────────────
  http.put('/api/notifications/read-all', async () => {
    await delay(150);
    db.notifications.forEach(n => (n.read = true));
    return HttpResponse.json({ message: 'All marked as read' });
  }),

  // ── GET /api/feature-flags ─────────────────────────────────────────────────
  http.get('/api/feature-flags', async () => {
    await delay(100);
    return HttpResponse.json({ data: featureFlags });
  }),
];
