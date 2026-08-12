// Global TypeScript interfaces shared across modules

export type UserRole = 'Admin' | 'Manager' | 'Editor' | 'Viewer';
export type UserStatus = 'Active' | 'Inactive' | 'Suspended' | 'Pending';
export type Department =
  | 'Engineering'
  | 'Marketing'
  | 'Sales'
  | 'Design'
  | 'DevOps'
  | 'HR'
  | 'Finance'
  | 'Product';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  department: Department;
  avatar: string;
  createdAt: string;
  lastActive: string;
  phone?: string;
  bio?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
  message?: string;
}

export interface MetricCard {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  trend: number; // percentage change
  trendDirection: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface AnalyticsData {
  metrics: MetricCard[];
  dailyActiveUsers: ChartDataPoint[];
  moduleUsageByDept: { dept: string; users: number; analytics: number; settings: number }[];
  roleDistribution: { role: string; count: number; color: string }[];
}

export interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: { label: string; href: string };
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: AuditAction;
  resource: string;
  resourceId: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  module: 'users' | 'analytics' | 'settings' | 'auth';
}

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'VIEW'
  | 'LOGIN'
  | 'LOGOUT'
  | 'EXPORT'
  | 'BULK_DELETE';

export interface FeatureFlags {
  analyticsV2: boolean;
  auditLogs: boolean;
  advancedSearch: boolean;
  betaDashboard: boolean;
  csvExport: boolean;
  commandPalette: boolean;
  bulkActions: boolean;
}

export interface UserPreferences {
  displayName: string;
  email: string;
  bio: string;
  timezone: string;
  avatar: string;
  theme: 'dark' | 'light' | 'system';
  accentColor: string;
  compactLayout: boolean;
  sidebarCollapsed: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    digest: 'daily' | 'weekly' | 'never';
  };
  language: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  permissions: Permission[];
}

export type Permission =
  | 'users:read'
  | 'users:write'
  | 'users:delete'
  | 'analytics:read'
  | 'settings:read'
  | 'settings:write'
  | 'audit:read'
  | 'admin:all';
