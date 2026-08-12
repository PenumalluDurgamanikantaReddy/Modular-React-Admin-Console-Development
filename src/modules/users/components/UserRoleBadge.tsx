import React from 'react';
import { Chip } from '@mui/material';
import type { UserRole, UserStatus } from '../../../shared/types';

interface RoleBadgeProps {
  role: UserRole;
}

export function UserRoleBadge({ role }: RoleBadgeProps) {
  const styles: Record<UserRole, { bg: string; color: string; border: string }> = {
    Admin: { bg: 'rgba(124, 58, 237, 0.15)', color: '#a78bfa', border: 'rgba(124, 58, 237, 0.3)' },
    Manager: { bg: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', border: 'rgba(6, 182, 212, 0.3)' },
    Editor: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
    Viewer: { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
  };

  const style = styles[role] || styles.Viewer;

  return (
    <Chip
      label={role}
      size="small"
      sx={{
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        fontWeight: 600,
        fontSize: '0.7rem',
        height: 22,
      }}
    />
  );
}

interface StatusBadgeProps {
  status: UserStatus;
}

export function UserStatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<UserStatus, { bg: string; color: string; border: string }> = {
    Active: { bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981', border: 'rgba(16, 185, 129, 0.25)' },
    Inactive: { bg: 'rgba(148, 163, 184, 0.12)', color: '#94a3b8', border: 'rgba(148, 163, 184, 0.25)' },
    Suspended: { bg: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.25)' },
    Pending: { bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.25)' },
  };

  const style = styles[status] || styles.Inactive;

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        fontWeight: 600,
        fontSize: '0.7rem',
        height: 22,
      }}
    />
  );
}
