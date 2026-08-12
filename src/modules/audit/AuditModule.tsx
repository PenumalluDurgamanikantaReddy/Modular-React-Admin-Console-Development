import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Avatar, Chip, FormControl, Select, MenuItem, Paper, TablePagination,
} from '@mui/material';
import { Security, History, FilterList } from '@mui/icons-material';
import type { AuditLog, AuditAction } from '../../shared/types';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function AuditModule() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [moduleFilter, setModuleFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function loadLogs() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        query.set('page', String(page + 1));
        query.set('limit', String(rowsPerPage));
        if (moduleFilter) query.set('module', moduleFilter);
        if (actionFilter) query.set('action', actionFilter);

        const res = await fetch(`/api/audit-logs?${query.toString()}`);
        const json = await res.json() as { data: AuditLog[]; meta: { total: number } };
        setLogs(json.data);
        setTotal(json.meta.total);
      } catch (e) {
        console.error('Failed to load audit logs', e);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, [page, rowsPerPage, moduleFilter, actionFilter]);

  const actionColors: Record<AuditAction, { bg: string; color: string }> = {
    CREATE: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981' },
    UPDATE: { bg: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' },
    DELETE: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' },
    BULK_DELETE: { bg: 'rgba(239, 68, 68, 0.2)', color: '#f87171' },
    LOGIN: { bg: 'rgba(124, 58, 237, 0.15)', color: '#a78bfa' },
    LOGOUT: { bg: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8' },
    VIEW: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' },
    EXPORT: { bg: 'rgba(139, 92, 246, 0.15)', color: '#c4b5fd' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#f1f5f9' }}>
          Audit Trail & Security Log
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
          Immutable log of administrative operations, security events, and data mutations.
        </Typography>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={moduleFilter}
            onChange={e => { setModuleFilter(e.target.value); setPage(0); }}
            displayEmpty
            sx={{
              background: 'rgba(26,26,46,0.8)',
              color: '#f1f5f9',
              borderRadius: 2.5,
              fontSize: '0.875rem',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a2a4a' },
            }}
          >
            <MenuItem value="">All Modules</MenuItem>
            <MenuItem value="users">Users</MenuItem>
            <MenuItem value="analytics">Analytics</MenuItem>
            <MenuItem value="settings">Settings</MenuItem>
            <MenuItem value="auth">Auth</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={actionFilter}
            onChange={e => { setActionFilter(e.target.value); setPage(0); }}
            displayEmpty
            sx={{
              background: 'rgba(26,26,46,0.8)',
              color: '#f1f5f9',
              borderRadius: 2.5,
              fontSize: '0.875rem',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a2a4a' },
            }}
          >
            <MenuItem value="">All Actions</MenuItem>
            <MenuItem value="CREATE">CREATE</MenuItem>
            <MenuItem value="UPDATE">UPDATE</MenuItem>
            <MenuItem value="DELETE">DELETE</MenuItem>
            <MenuItem value="LOGIN">LOGIN</MenuItem>
            <MenuItem value="EXPORT">EXPORT</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          background: 'rgba(26,26,46,0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid #2a2a4a',
          borderRadius: 3,
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Actor</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Resource</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map(log => {
              const actStyle = actionColors[log.action] || { bg: '#2a2a4a', color: '#fff' };
              return (
                <TableRow key={log.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar src={log.userAvatar} sx={{ width: 32, height: 32 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#f1f5f9' }}>
                        {log.userName}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={log.action}
                      size="small"
                      sx={{
                        background: actStyle.bg,
                        color: actStyle.color,
                        fontWeight: 700,
                        fontSize: '0.65rem',
                        height: 20,
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 600 }}>
                      {log.resource}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      {log.details}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#64748b' }}>
                      {log.ipAddress}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={e => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        sx={{ color: '#94a3b8' }}
      />
    </motion.div>
  );
}
