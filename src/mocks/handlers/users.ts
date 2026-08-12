import { http, HttpResponse, delay } from 'msw';
import { db } from '../db';

const SIM_DELAY = 300; // ms — simulate network latency

export const userHandlers = [
  // ── GET /api/users ─────────────────────────────────────────────────────────
  http.get('/api/users', async ({ request }) => {
    await delay(SIM_DELAY);
    const url = new URL(request.url);
    const q = url.searchParams.get('q') ?? undefined;
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = Number(url.searchParams.get('limit') ?? '10');
    const sort = url.searchParams.get('sort') ?? undefined;
    const order = (url.searchParams.get('order') ?? 'asc') as 'asc' | 'desc';
    const role = url.searchParams.get('role') ?? undefined;
    const status = url.searchParams.get('status') ?? undefined;
    const department = url.searchParams.get('department') ?? undefined;

    const result = db.getUsers({ q, page, limit, sort, order, role, status, department });
    return HttpResponse.json(result);
  }),

  // ── GET /api/users/:id ─────────────────────────────────────────────────────
  http.get('/api/users/:id', async ({ params }) => {
    await delay(SIM_DELAY);
    const user = db.getUserById(params.id as string);
    if (!user) return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    return HttpResponse.json({ data: user });
  }),

  // ── POST /api/users ────────────────────────────────────────────────────────
  http.post('/api/users', async ({ request }) => {
    await delay(SIM_DELAY);
    const body = await request.json() as Record<string, unknown>;
    if (!body.name || !body.email || !body.role || !body.department) {
      return HttpResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    // Check email uniqueness
    if (db.users.some(u => u.email === body.email)) {
      return HttpResponse.json({ message: 'Email already exists' }, { status: 409 });
    }
    const newUser = db.createUser({
      name: body.name as string,
      email: body.email as string,
      role: body.role as import('../../shared/types').UserRole,
      status: (body.status as import('../../shared/types').UserStatus) ?? 'Active',
      department: body.department as import('../../shared/types').Department,
      phone: body.phone as string | undefined,
      bio: body.bio as string | undefined,
    });
    db.addAuditLog({
      userId: db.users[0].id,
      userName: db.users[0].name,
      userAvatar: db.users[0].avatar,
      action: 'CREATE',
      resource: 'User',
      resourceId: newUser.id,
      details: `Created user "${newUser.name}"`,
      ipAddress: '127.0.0.1',
      module: 'users',
    });
    return HttpResponse.json({ data: newUser, message: 'User created successfully' }, { status: 201 });
  }),

  // ── PUT /api/users/:id ─────────────────────────────────────────────────────
  http.put('/api/users/:id', async ({ params, request }) => {
    await delay(SIM_DELAY);
    const body = await request.json() as Partial<import('../../shared/types').User>;
    const updated = db.updateUser(params.id as string, body);
    if (!updated) return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    db.addAuditLog({
      userId: db.users[0].id,
      userName: db.users[0].name,
      userAvatar: db.users[0].avatar,
      action: 'UPDATE',
      resource: 'User',
      resourceId: updated.id,
      details: `Updated user "${updated.name}"`,
      ipAddress: '127.0.0.1',
      module: 'users',
    });
    return HttpResponse.json({ data: updated, message: 'User updated successfully' });
  }),

  // ── DELETE /api/users/bulk ─────────────────────────────────────────────────
  http.delete('/api/users/bulk', async ({ request }) => {
    await delay(SIM_DELAY);
    const body = await request.json() as { ids: string[] };
    const deleted = db.bulkDeleteUsers(body.ids);
    db.addAuditLog({
      userId: db.users[0].id,
      userName: db.users[0].name,
      userAvatar: db.users[0].avatar,
      action: 'BULK_DELETE',
      resource: 'User',
      resourceId: body.ids.join(','),
      details: `Bulk deleted ${deleted} users`,
      ipAddress: '127.0.0.1',
      module: 'users',
    });
    return HttpResponse.json({ message: `Deleted ${deleted} users` });
  }),

  // ── DELETE /api/users/:id ──────────────────────────────────────────────────
  http.delete('/api/users/:id', async ({ params }) => {
    await delay(SIM_DELAY);
    const user = db.getUserById(params.id as string);
    const ok = db.deleteUser(params.id as string);
    if (!ok) return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    if (user) {
      db.addAuditLog({
        userId: db.users[0].id,
        userName: db.users[0].name,
        userAvatar: db.users[0].avatar,
        action: 'DELETE',
        resource: 'User',
        resourceId: params.id as string,
        details: `Deleted user "${user.name}"`,
        ipAddress: '127.0.0.1',
        module: 'users',
      });
    }
    return HttpResponse.json({ message: 'User deleted successfully' });
  }),
];
