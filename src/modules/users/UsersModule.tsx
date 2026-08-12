import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import { Add, People, Shield, CheckCircle, HourglassEmpty } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/rootStore';
import {
  fetchUsers, selectUsers, selectUsersFilters, selectUsersMeta, selectUsersLoading,
} from './slice/usersSlice';
import { UserFilters } from './components/UserFilters';
import { UsersTable } from './components/UsersTable';
import { UserModal } from './components/UserModal';
import type { User } from '../../shared/types';
import { motion } from 'framer-motion';

export default function UsersModule() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const filters = useAppSelector(selectUsersFilters);
  const meta = useAppSelector(selectUsersMeta);
  const loading = useAppSelector(selectUsersLoading);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    dispatch(fetchUsers({ ...filters, page: meta.page, limit: meta.limit }));
  }, [dispatch, filters, meta.page, meta.limit]);

  // Listen for custom event from Command Palette
  useEffect(() => {
    const handleOpenAdd = () => {
      setEditingUser(null);
      setModalOpen(true);
    };
    document.addEventListener('open-add-user', handleOpenAdd);
    return () => document.removeEventListener('open-add-user', handleOpenAdd);
  }, []);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#f1f5f9' }}>
            User Management
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Manage organization members, roles, statuses, and permissions.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenCreate}
          sx={{
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            borderRadius: 2.5,
            px: 3,
            py: 1,
            fontWeight: 600,
          }}
        >
          Add User
        </Button>
      </Box>

      {/* Filters */}
      <UserFilters />

      {/* Data Table */}
      <UsersTable onEdit={handleOpenEdit} />

      {/* Add / Edit Modal */}
      <UserModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingUser(null);
        }}
        editUser={editingUser}
      />
    </motion.div>
  );
}
