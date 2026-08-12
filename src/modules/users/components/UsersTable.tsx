import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Checkbox, IconButton, Tooltip, TablePagination, Box, Typography,
  Avatar, Menu, MenuItem, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Chip,
} from '@mui/material';
import {
  Edit, Delete, MoreVert, ArrowUpward, ArrowDownward, Download,
  ViewColumn, DeleteSweep, CheckCircle, Warning,
} from '@mui/icons-material';
import type { User } from '../../../shared/types';
import { UserRoleBadge, UserStatusBadge } from './UserRoleBadge';
import { useAppDispatch, useAppSelector } from '../../../store/rootStore';
import {
  selectUsers, selectUsersMeta, selectUsersFilters, selectSelectedUsers,
  setFilter, setPage, setLimit, toggleSelectUser, selectAll, clearSelection,
  deleteUser, bulkDeleteUsers, optimisticDelete,
} from '../slice/usersSlice';
import { format } from 'date-fns';

interface Props {
  onEdit: (user: User) => void;
}

export function UsersTable({ onEdit }: Props) {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const meta = useAppSelector(selectUsersMeta);
  const filters = useAppSelector(selectUsersFilters);
  const selected = useAppSelector(selectSelectedUsers);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [anchorEl, setAnchorEl] = useState<{ element: HTMLElement; user: User } | null>(null);

  // Column visibility state
  const [columns, setColumns] = useState({
    user: true,
    role: true,
    status: true,
    department: true,
    lastActive: true,
    createdAt: true,
    actions: true,
  });
  const [colMenuAnchor, setColMenuAnchor] = useState<null | HTMLElement>(null);

  const isAllSelected = users.length > 0 && users.every(u => selected.includes(u.id));
  const isSomeSelected = selected.length > 0 && !isAllSelected;

  const handleSelectAll = () => {
    if (isAllSelected) {
      dispatch(clearSelection());
    } else {
      dispatch(selectAll());
    }
  };

  const handleSort = (field: string) => {
    const isAsc = filters.sort === field && filters.order === 'asc';
    dispatch(setFilter({ sort: field, order: isAsc ? 'desc' : 'asc' }));
  };

  const handleConfirmSingleDelete = () => {
    if (deleteId) {
      dispatch(optimisticDelete(deleteId));
      dispatch(deleteUser(deleteId));
      setDeleteId(null);
    }
  };

  const handleConfirmBulkDelete = () => {
    if (selected.length > 0) {
      dispatch(bulkDeleteUsers(selected));
      setShowBulkConfirm(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Department', 'Last Active', 'Created At'];
    const rows = (selected.length > 0 ? users.filter(u => selected.includes(u.id)) : users).map(u => [
      u.id,
      `"${u.name}"`,
      u.email,
      u.role,
      u.status,
      u.department,
      u.lastActive,
      u.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `google_users_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      {/* Table Toolbar / Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {selected.length > 0 ? (
            <Chip
              icon={<CheckCircle sx={{ fontSize: 16 }} />}
              label={`${selected.length} selected`}
              color="primary"
              onDelete={() => dispatch(clearSelection())}
              sx={{ fontWeight: 600 }}
            />
          ) : (
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Showing {users.length} of {meta.total} users
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {selected.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteSweep />}
              onClick={() => setShowBulkConfirm(true)}
              sx={{ borderRadius: 2 }}
            >
              Delete ({selected.length})
            </Button>
          )}

          <Button
            variant="outlined"
            size="small"
            startIcon={<Download />}
            onClick={exportToCSV}
            sx={{
              borderRadius: 2,
              borderColor: '#2a2a4a',
              color: '#94a3b8',
              '&:hover': { borderColor: '#7c3aed', color: '#f1f5f9' },
            }}
          >
            Export CSV
          </Button>

          <Tooltip title="Customize Columns">
            <IconButton
              size="small"
              onClick={e => setColMenuAnchor(e.currentTarget)}
              sx={{ color: '#94a3b8', border: '1px solid #2a2a4a', borderRadius: 2 }}
            >
              <ViewColumn fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Column Menu */}
      <Menu
        anchorEl={colMenuAnchor}
        open={Boolean(colMenuAnchor)}
        onClose={() => setColMenuAnchor(null)}
        slotProps={{ paper: { sx: { background: '#1a1a2e', border: '1px solid #2a2a4a', color: '#f1f5f9' } } }}
      >
        <MenuItem onClick={() => setColumns(c => ({ ...c, role: !c.role }))}>
          <Checkbox checked={columns.role} size="small" /> Role
        </MenuItem>
        <MenuItem onClick={() => setColumns(c => ({ ...c, status: !c.status }))}>
          <Checkbox checked={columns.status} size="small" /> Status
        </MenuItem>
        <MenuItem onClick={() => setColumns(c => ({ ...c, department: !c.department }))}>
          <Checkbox checked={columns.department} size="small" /> Department
        </MenuItem>
        <MenuItem onClick={() => setColumns(c => ({ ...c, lastActive: !c.lastActive }))}>
          <Checkbox checked={columns.lastActive} size="small" /> Last Active
        </MenuItem>
        <MenuItem onClick={() => setColumns(c => ({ ...c, createdAt: !c.createdAt }))}>
          <Checkbox checked={columns.createdAt} size="small" /> Joined Date
        </MenuItem>
      </Menu>

      {/* Data Table */}
      <TableContainer
        sx={{
          background: 'rgba(26,26,46,0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid #2a2a4a',
          borderRadius: 3,
        }}
      >
        <Table sx={{ minWidth: 700 }} aria-label="user management table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={isSomeSelected}
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  size="small"
                  sx={{ color: '#64748b' }}
                />
              </TableCell>
              {columns.user && (
                <TableCell onClick={() => handleSort('name')} sx={{ cursor: 'pointer' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    User {filters.sort === 'name' && (filters.order === 'asc' ? <ArrowUpward fontSize="inherit" /> : <ArrowDownward fontSize="inherit" />)}
                  </Box>
                </TableCell>
              )}
              {columns.role && (
                <TableCell onClick={() => handleSort('role')} sx={{ cursor: 'pointer' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    Role {filters.sort === 'role' && (filters.order === 'asc' ? <ArrowUpward fontSize="inherit" /> : <ArrowDownward fontSize="inherit" />)}
                  </Box>
                </TableCell>
              )}
              {columns.status && (
                <TableCell onClick={() => handleSort('status')} sx={{ cursor: 'pointer' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    Status {filters.sort === 'status' && (filters.order === 'asc' ? <ArrowUpward fontSize="inherit" /> : <ArrowDownward fontSize="inherit" />)}
                  </Box>
                </TableCell>
              )}
              {columns.department && (
                <TableCell onClick={() => handleSort('department')} sx={{ cursor: 'pointer' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    Department {filters.sort === 'department' && (filters.order === 'asc' ? <ArrowUpward fontSize="inherit" /> : <ArrowDownward fontSize="inherit" />)}
                  </Box>
                </TableCell>
              )}
              {columns.lastActive && <TableCell>Last Active</TableCell>}
              {columns.createdAt && <TableCell>Joined</TableCell>}
              {columns.actions && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6, color: '#64748b' }}>
                  No users found matching current criteria.
                </TableCell>
              </TableRow>
            ) : (
              users.map(user => {
                const isSelected = selected.includes(user.id);
                return (
                  <TableRow
                    key={user.id}
                    hover
                    selected={isSelected}
                    sx={{
                      '&.Mui-selected': { background: 'rgba(124,58,237,0.12)' },
                      '&.Mui-selected:hover': { background: 'rgba(124,58,237,0.18)' },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => dispatch(toggleSelectUser(user.id))}
                        size="small"
                        sx={{ color: '#64748b' }}
                      />
                    </TableCell>

                    {columns.user && (
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar src={user.avatar} sx={{ width: 36, height: 36 }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#f1f5f9' }}>
                              {user.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                    )}

                    {columns.role && (
                      <TableCell>
                        <UserRoleBadge role={user.role} />
                      </TableCell>
                    )}

                    {columns.status && (
                      <TableCell>
                        <UserStatusBadge status={user.status} />
                      </TableCell>
                    )}

                    {columns.department && (
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                          {user.department}
                        </Typography>
                      </TableCell>
                    )}

                    {columns.lastActive && (
                      <TableCell>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                          {format(new Date(user.lastActive), 'MMM d, yyyy')}
                        </Typography>
                      </TableCell>
                    )}

                    {columns.createdAt && (
                      <TableCell>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                          {format(new Date(user.createdAt), 'MMM d, yyyy')}
                        </Typography>
                      </TableCell>
                    )}

                    {columns.actions && (
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => onEdit(user)}
                            sx={{ color: '#94a3b8', '&:hover': { color: '#7c3aed' } }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => setDeleteId(user.id)}
                            sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444' } }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={meta.total}
        rowsPerPage={meta.limit}
        page={meta.page - 1}
        onPageChange={(_, p) => dispatch(setPage(p + 1))}
        onRowsPerPageChange={e => dispatch(setLimit(parseInt(e.target.value, 10)))}
        sx={{
          color: '#94a3b8',
          '.MuiTablePagination-selectIcon': { color: '#94a3b8' },
        }}
      />

      {/* Single Delete Confirmation */}
      <Dialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        slotProps={{ paper: { sx: { background: '#1a1a2e', border: '1px solid #2a2a4a' } } }}
      >
        <DialogTitle sx={{ color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning sx={{ color: '#ef4444' }} /> Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ color: '#94a3b8' }}>
          Are you sure you want to delete this user? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} sx={{ color: '#94a3b8' }}>Cancel</Button>
          <Button onClick={handleConfirmSingleDelete} color="error" variant="contained">
            Delete User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Confirmation */}
      <Dialog
        open={showBulkConfirm}
        onClose={() => setShowBulkConfirm(false)}
        slotProps={{ paper: { sx: { background: '#1a1a2e', border: '1px solid #2a2a4a' } } }}
      >
        <DialogTitle sx={{ color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning sx={{ color: '#ef4444' }} /> Bulk Delete Users
        </DialogTitle>
        <DialogContent sx={{ color: '#94a3b8' }}>
          Are you sure you want to delete {selected.length} selected users?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBulkConfirm(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
          <Button onClick={handleConfirmBulkDelete} color="error" variant="contained">
            Delete Selected
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
