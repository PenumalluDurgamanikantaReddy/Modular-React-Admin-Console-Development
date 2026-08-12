import { v4 as uuidv4 } from 'uuid';
import type {
  User,
  UserRole,
  UserStatus,
  Department,
  AuditLog,
  NotificationItem,
  AnalyticsData,
  FeatureFlags,
} from '../shared/types';

// ─── Seed Data Helpers ────────────────────────────────────────────────────────

const roles: UserRole[] = ['Admin', 'Manager', 'Editor', 'Viewer'];
const statuses: UserStatus[] = ['Active', 'Active', 'Active', 'Inactive', 'Suspended', 'Pending'];
const departments: Department[] = [
  'Engineering', 'Marketing', 'Sales', 'Design', 'DevOps', 'HR', 'Finance', 'Product',
];
const firstNames = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn',
  'Skylar', 'Dakota', 'Cameron', 'Reese', 'Finley', 'Emerson', 'Sage',
  'Rowan', 'Blake', 'Piper', 'Logan', 'Peyton', 'Harley', 'Drew', 'Parker',
  'Kendall', 'Ashton', 'Devon', 'Elliot', 'Frankie', 'Gray', 'Harper',
];
const lastNames = [
  'Johnson', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore',
  'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin',
  'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez',
  'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez',
];

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

function makeAvatar(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7c3aed&color=fff&size=128&bold=true`;
}

function generateUser(overrides: Partial<User> = {}): User {
  const fn = pick(firstNames);
  const ln = pick(lastNames);
  const name = `${fn} ${ln}`;
  const email = `${fn.toLowerCase()}.${ln.toLowerCase()}@google.com`;
  const role = pick(roles);
  const status = pick(statuses);
  const dept = pick(departments);
  return {
    id: uuidv4(),
    name,
    email,
    role,
    status,
    department: dept,
    avatar: makeAvatar(name),
    createdAt: daysAgo(randInt(1, 365)),
    lastActive: daysAgo(randInt(0, 30)),
    phone: `+1 (${randInt(200, 999)}) ${randInt(100, 999)}-${randInt(1000, 9999)}`,
    bio: `${role} in the ${dept} team at Google. Focused on delivering high-quality software solutions.`,
    ...overrides,
  };
}

// ─── Mock Database ────────────────────────────────────────────────────────────

export const db = {
  users: Array.from({ length: 50 }, (_, i) =>
    generateUser(
      i === 0
        ? {
            name: 'Gowtham Admin',
            email: 'gowtham@google.com',
            role: 'Admin',
            status: 'Active',
            department: 'Engineering',
          }
        : {}
    )
  ) as User[],

  auditLogs: [] as AuditLog[],
  notifications: [] as NotificationItem[],

  // ── Helpers ──────────────────────────────────────────────────────────────

  getUsers(params: {
    q?: string;
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    role?: string;
    status?: string;
    department?: string;
  }) {
    let filtered = [...this.users];

    if (params.q) {
      const q = params.q.toLowerCase();
      filtered = filtered.filter(
        u =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.department.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q)
      );
    }
    if (params.role) filtered = filtered.filter(u => u.role === params.role);
    if (params.status) filtered = filtered.filter(u => u.status === params.status);
    if (params.department) filtered = filtered.filter(u => u.department === params.department);

    if (params.sort) {
      const key = params.sort as keyof User;
      const dir = params.order === 'desc' ? -1 : 1;
      filtered.sort((a, b) => {
        const av = String(a[key] ?? '');
        const bv = String(b[key] ?? '');
        return av.localeCompare(bv) * dir;
      });
    }

    const total = filtered.length;
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  getUserById(id: string) {
    return this.users.find(u => u.id === id);
  },

  createUser(payload: Omit<User, 'id' | 'avatar' | 'createdAt' | 'lastActive'>): User {
    const newUser: User = {
      id: uuidv4(),
      avatar: makeAvatar(payload.name),
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      ...payload,
    };
    this.users.unshift(newUser);
    return newUser;
  },

  updateUser(id: string, payload: Partial<User>): User | null {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.users[idx] = { ...this.users[idx], ...payload };
    return this.users[idx];
  },

  deleteUser(id: string): boolean {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) return false;
    this.users.splice(idx, 1);
    return true;
  },

  bulkDeleteUsers(ids: string[]): number {
    const before = this.users.length;
    this.users = this.users.filter(u => !ids.includes(u.id));
    return before - this.users.length;
  },

  addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
    const entry: AuditLog = { id: uuidv4(), timestamp: new Date().toISOString(), ...log };
    this.auditLogs.unshift(entry);
    if (this.auditLogs.length > 500) this.auditLogs.pop();
    return entry;
  },
};

// ─── Seed Audit Logs ──────────────────────────────────────────────────────────

const auditActions = [
  { action: 'CREATE' as const, resource: 'User', details: 'Created new user account' },
  { action: 'UPDATE' as const, resource: 'User', details: 'Updated user profile' },
  { action: 'DELETE' as const, resource: 'User', details: 'Deleted user account' },
  { action: 'LOGIN' as const, resource: 'Session', details: 'User logged in successfully' },
  { action: 'LOGOUT' as const, resource: 'Session', details: 'User logged out' },
  { action: 'EXPORT' as const, resource: 'Report', details: 'Exported users CSV' },
];

for (let i = 0; i < 40; i++) {
  const user = pick(db.users);
  const ev = pick(auditActions);
  const target = pick(db.users);
  db.auditLogs.push({
    id: uuidv4(),
    userId: user.id,
    userName: user.name,
    userAvatar: user.avatar,
    action: ev.action,
    resource: ev.resource,
    resourceId: target.id,
    details: ev.details,
    timestamp: daysAgo(randInt(0, 30)),
    ipAddress: `${randInt(10, 200)}.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(1, 254)}`,
    module: pick(['users', 'analytics', 'settings', 'auth']),
  });
}
db.auditLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

// ─── Seed Notifications ───────────────────────────────────────────────────────

db.notifications = [
  {
    id: uuidv4(), type: 'success', title: 'New user registered',
    message: 'Jordan Williams joined the Engineering team.', timestamp: daysAgo(0), read: false,
  },
  {
    id: uuidv4(), type: 'warning', title: 'High server load',
    message: 'DevOps API is at 89% CPU. Consider scaling.', timestamp: daysAgo(0), read: false,
  },
  {
    id: uuidv4(), type: 'info', title: 'Weekly report ready',
    message: 'Analytics digest for this week is available.', timestamp: daysAgo(1), read: false,
  },
  {
    id: uuidv4(), type: 'error', title: 'Failed login attempt',
    message: '3 failed login attempts for gowtham@google.com.', timestamp: daysAgo(1), read: true,
  },
  {
    id: uuidv4(), type: 'success', title: 'Deployment completed',
    message: 'v2.4.1 deployed to production successfully.', timestamp: daysAgo(2), read: true,
  },
];

// ─── Analytics Generator ──────────────────────────────────────────────────────

export function generateAnalyticsData(): AnalyticsData {
  const dailyActiveUsers = Array.from({ length: 30 }, (_, i) => ({
    date: daysAgo(29 - i).split('T')[0],
    value: randInt(200, 1200),
    label: `Day ${i + 1}`,
  }));

  const moduleUsageByDept = departments.map(dept => ({
    dept,
    users: randInt(20, 100),
    analytics: randInt(10, 80),
    settings: randInt(5, 40),
  }));

  const roleCounts = {
    Admin: db.users.filter(u => u.role === 'Admin').length,
    Manager: db.users.filter(u => u.role === 'Manager').length,
    Editor: db.users.filter(u => u.role === 'Editor').length,
    Viewer: db.users.filter(u => u.role === 'Viewer').length,
  };

  return {
    metrics: [
      { id: 'm1', label: 'Total Users', value: db.users.length, trend: 12.5, trendDirection: 'up', icon: 'people', color: '#7c3aed' },
      { id: 'm2', label: 'Active Users', value: db.users.filter(u => u.status === 'Active').length, trend: 8.2, trendDirection: 'up', icon: 'person_check', color: '#10b981' },
      { id: 'm3', label: 'Active Sessions', value: randInt(80, 200), trend: -3.1, trendDirection: 'down', icon: 'wifi', color: '#06b6d4' },
      { id: 'm4', label: 'Conversion Rate', value: `${randInt(70, 95)}%`, trend: 4.7, trendDirection: 'up', icon: 'trending_up', color: '#f59e0b' },
      { id: 'm5', label: 'Avg. Session Time', value: `${randInt(4, 12)}m`, trend: 1.8, trendDirection: 'up', icon: 'timer', color: '#8b5cf6' },
      { id: 'm6', label: 'New This Month', value: randInt(5, 20), trend: 15.0, trendDirection: 'up', icon: 'person_add', color: '#ec4899' },
    ],
    dailyActiveUsers,
    moduleUsageByDept,
    roleDistribution: [
      { role: 'Admin', count: roleCounts.Admin, color: '#7c3aed' },
      { role: 'Manager', count: roleCounts.Manager, color: '#06b6d4' },
      { role: 'Editor', count: roleCounts.Editor, color: '#10b981' },
      { role: 'Viewer', count: roleCounts.Viewer, color: '#f59e0b' },
    ],
  };
}

// ─── Feature Flags ────────────────────────────────────────────────────────────

export const featureFlags: FeatureFlags = {
  analyticsV2: true,
  auditLogs: true,
  advancedSearch: true,
  betaDashboard: false,
  csvExport: true,
  commandPalette: true,
  bulkActions: true,
};
