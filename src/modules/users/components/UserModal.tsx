import React, { useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Box, Typography, IconButton,
  CircularProgress, Alert, Grid,
} from '@mui/material';
import { Close, PersonAdd, Edit } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { User, UserRole, UserStatus, Department } from '../../../shared/types';
import { useAppDispatch, useAppSelector } from '../../../store/rootStore';
import { createUser, updateUser, selectUsersSaving, selectUsersError, clearError } from '../slice/usersSlice';

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['Admin', 'Manager', 'Editor', 'Viewer'] as const),
  status: z.enum(['Active', 'Inactive', 'Suspended', 'Pending'] as const),
  department: z.enum([
    'Engineering', 'Marketing', 'Sales', 'Design', 'DevOps', 'HR', 'Finance', 'Product'
  ] as const),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  editUser?: User | null;
}

export function UserModal({ open, onClose, editUser }: Props) {
  const dispatch = useAppDispatch();
  const saving = useAppSelector(selectUsersSaving);
  const serverError = useAppSelector(selectUsersError);

  const isEdit = Boolean(editUser);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'Viewer',
      status: 'Active',
      department: 'Engineering',
      phone: '',
      bio: '',
    },
  });

  useEffect(() => {
    if (editUser) {
      reset({
        name: editUser.name,
        email: editUser.email,
        role: editUser.role,
        status: editUser.status,
        department: editUser.department,
        phone: editUser.phone || '',
        bio: editUser.bio || '',
      });
    } else {
      reset({
        name: '',
        email: '',
        role: 'Viewer',
        status: 'Active',
        department: 'Engineering',
        phone: '',
        bio: '',
      });
    }
  }, [editUser, reset, open]);

  const onSubmit = async (data: UserFormData) => {
    dispatch(clearError());
    if (isEdit && editUser) {
      const result = await dispatch(updateUser({ id: editUser.id, payload: data }));
      if (updateUser.fulfilled.match(result)) {
        onClose();
      }
    } else {
      const result = await dispatch(createUser(data));
      if (createUser.fulfilled.match(result)) {
        onClose();
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            border: '1px solid #2a2a4a',
            borderRadius: 3,
            backdropFilter: 'blur(20px)',
          },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {isEdit ? <Edit sx={{ color: '#7c3aed' }} /> : <PersonAdd sx={{ color: '#7c3aed' }} />}
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#f1f5f9' }}>
            {isEdit ? 'Edit User Profile' : 'Create New User'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#64748b' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers sx={{ borderColor: '#2a2a4a', py: 3 }}>
          {serverError && (
            <Alert severity="error" sx={{ mb: 3, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
              {serverError}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Full Name */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Full Name"
                  placeholder="e.g. Jane Doe"
                  fullWidth
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                />
              )}
            />

            {/* Email Address */}
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email Address"
                  placeholder="jane.doe@google.com"
                  fullWidth
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                />
              )}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {/* Role */}
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Role"
                    fullWidth
                    error={Boolean(errors.role)}
                    helperText={errors.role?.message}
                  >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Manager">Manager</MenuItem>
                    <MenuItem value="Editor">Editor</MenuItem>
                    <MenuItem value="Viewer">Viewer</MenuItem>
                  </TextField>
                )}
              />

              {/* Status */}
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Status"
                    fullWidth
                    error={Boolean(errors.status)}
                    helperText={errors.status?.message}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                    <MenuItem value="Suspended">Suspended</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                  </TextField>
                )}
              />
            </Box>

            {/* Department */}
            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Department"
                  fullWidth
                  error={Boolean(errors.department)}
                  helperText={errors.department?.message}
                >
                  <MenuItem value="Engineering">Engineering</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="Design">Design</MenuItem>
                  <MenuItem value="DevOps">DevOps</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="Product">Product</MenuItem>
                </TextField>
              )}
            />

            {/* Phone */}
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phone Number (Optional)"
                  placeholder="+1 (555) 000-0000"
                  fullWidth
                  error={Boolean(errors.phone)}
                  helperText={errors.phone?.message}
                />
              )}
            />

            {/* Bio */}
            <Controller
              name="bio"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Bio / Notes"
                  multiline
                  rows={2}
                  fullWidth
                  placeholder="Short note about the user's role or access..."
                />
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, borderColor: '#2a2a4a' }}>
          <Button onClick={onClose} sx={{ color: '#94a3b8' }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            sx={{
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              fontWeight: 600,
              minWidth: 120,
            }}
          >
            {saving ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : isEdit ? 'Save Changes' : 'Create User'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
