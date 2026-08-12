import React, { useState, useEffect } from 'react';
import {
  Box, InputBase, MenuItem, Select, FormControl, InputLabel,
  IconButton, Tooltip, Button,
} from '@mui/material';
import { Search, FilterList, Refresh, Clear } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../store/rootStore';
import { setFilter, selectUsersFilters, fetchUsers } from '../slice/usersSlice';

export function UserFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectUsersFilters);
  const [searchTerm, setSearchTerm] = useState(filters.q);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== filters.q) {
        dispatch(setFilter({ q: searchTerm }));
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, filters.q, dispatch]);

  const handleRoleChange = (e: any) => {
    dispatch(setFilter({ role: e.target.value }));
  };

  const handleStatusChange = (e: any) => {
    dispatch(setFilter({ status: e.target.value }));
  };

  const handleDepartmentChange = (e: any) => {
    dispatch(setFilter({ department: e.target.value }));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    dispatch(setFilter({ q: '', role: '', status: '', department: '' }));
  };

  const hasActiveFilters = filters.q || filters.role || filters.status || filters.department;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 3 }}>
      {/* Search Input */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1,
          borderRadius: 2.5,
          background: 'rgba(26,26,46,0.8)',
          border: '1px solid #2a2a4a',
          minWidth: 280,
          flex: 1,
          '&:focus-within': {
            borderColor: '#7c3aed',
            boxShadow: '0 0 15px rgba(124,58,237,0.2)',
          },
        }}
      >
        <Search sx={{ color: '#64748b', fontSize: 20 }} />
        <InputBase
          placeholder="Search by name, email, department…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          sx={{ flex: 1, color: '#f1f5f9', fontSize: '0.875rem' }}
          inputProps={{ 'aria-label': 'search users' }}
        />
        {searchTerm && (
          <IconButton size="small" onClick={() => setSearchTerm('')} sx={{ color: '#64748b' }}>
            <Clear fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Role Filter */}
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <Select
          value={filters.role}
          onChange={handleRoleChange}
          displayEmpty
          sx={{
            background: 'rgba(26,26,46,0.8)',
            color: '#f1f5f9',
            borderRadius: 2.5,
            fontSize: '0.875rem',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a2a4a' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(124,58,237,0.5)' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7c3aed' },
          }}
        >
          <MenuItem value="">All Roles</MenuItem>
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="Manager">Manager</MenuItem>
          <MenuItem value="Editor">Editor</MenuItem>
          <MenuItem value="Viewer">Viewer</MenuItem>
        </Select>
      </FormControl>

      {/* Status Filter */}
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <Select
          value={filters.status}
          onChange={handleStatusChange}
          displayEmpty
          sx={{
            background: 'rgba(26,26,46,0.8)',
            color: '#f1f5f9',
            borderRadius: 2.5,
            fontSize: '0.875rem',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a2a4a' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(124,58,237,0.5)' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7c3aed' },
          }}
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
          <MenuItem value="Suspended">Suspended</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
        </Select>
      </FormControl>

      {/* Department Filter */}
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <Select
          value={filters.department}
          onChange={handleDepartmentChange}
          displayEmpty
          sx={{
            background: 'rgba(26,26,46,0.8)',
            color: '#f1f5f9',
            borderRadius: 2.5,
            fontSize: '0.875rem',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a2a4a' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(124,58,237,0.5)' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7c3aed' },
          }}
        >
          <MenuItem value="">All Departments</MenuItem>
          <MenuItem value="Engineering">Engineering</MenuItem>
          <MenuItem value="Marketing">Marketing</MenuItem>
          <MenuItem value="Sales">Sales</MenuItem>
          <MenuItem value="Design">Design</MenuItem>
          <MenuItem value="DevOps">DevOps</MenuItem>
          <MenuItem value="HR">HR</MenuItem>
          <MenuItem value="Finance">Finance</MenuItem>
          <MenuItem value="Product">Product</MenuItem>
        </Select>
      </FormControl>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="text"
          size="small"
          startIcon={<Clear />}
          onClick={handleClearFilters}
          sx={{ color: '#ef4444', textTransform: 'none', fontWeight: 600 }}
        >
          Reset Filters
        </Button>
      )}

      <Tooltip title="Refresh user list">
        <IconButton
          onClick={() => dispatch(fetchUsers(filters))}
          sx={{ color: '#94a3b8', '&:hover': { color: '#7c3aed' } }}
        >
          <Refresh />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
