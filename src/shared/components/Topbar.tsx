import React, { useState } from 'react';
import {
  IconButton, Badge, Avatar, Menu, MenuItem, Tooltip,
  InputBase, Divider, Typography, Box, Chip,
} from '@mui/material';
import {
  Notifications, Search, LightMode, DarkMode, Logout,
  Person, Settings, KeyboardCommandKey, Circle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/rootStore';
import { logout, selectCurrentUser } from '../../store/authSlice';
import { setTheme, selectTheme } from '../../modules/settings/slice/settingsSlice';
import { selectUnreadCount, selectNotifications, markAllRead } from '../../store/notificationsSlice';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function Topbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const theme = useAppSelector(selectTheme);
  const unreadCount = useAppSelector(selectUnreadCount);
  const notifications = useAppSelector(selectNotifications);

  const [anchorUser, setAnchorUser] = useState<null | HTMLElement>(null);
  const [anchorNotif, setAnchorNotif] = useState<null | HTMLElement>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const notifColors = {
    success: '#10b981', warning: '#f59e0b', error: '#ef4444', info: '#3b82f6',
  };

  const handleLogout = () => {
    dispatch(logout());
    setAnchorUser(null);
  };

  const openCommandPalette = () => {
    document.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  return (
    <header className="topbar">
      {/* Search */}
      <div
        className={`flex items-center gap-2 flex-1 max-w-sm px-3 py-2 rounded-xl border transition-all duration-200 ${
          searchFocused
            ? 'border-[#7c3aed] bg-[#1a1a2e] shadow-lg shadow-purple-500/10'
            : 'border-[#2a2a4a] bg-[#1a1a2e]/50'
        }`}
      >
        <Search sx={{ fontSize: 18, color: '#64748b' }} />
        <InputBase
          placeholder="Search users, modules…"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          sx={{ flex: 1, fontSize: '0.875rem', color: '#f1f5f9',
            '& input::placeholder': { color: '#64748b' } }}
          inputProps={{ 'aria-label': 'global search' }}
        />
        <Tooltip title="Command Palette (Ctrl+K)" placement="bottom">
          <button
            onClick={openCommandPalette}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#2a2a4a] hover:bg-[#7c3aed]/20 transition-colors cursor-pointer"
            style={{ border: 'none', color: '#64748b', fontSize: '11px' }}
          >
            <KeyboardCommandKey sx={{ fontSize: 12 }} />
            <span>K</span>
          </button>
        </Tooltip>
      </div>

      <div className="flex-1" />

      {/* Theme Toggle */}
      <Tooltip title={theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}>
        <IconButton
          onClick={() => dispatch(setTheme(theme === 'light' ? 'dark' : 'light'))}
          size="small"
          sx={{ color: '#94a3b8', '&:hover': { color: '#7c3aed', background: 'rgba(124,58,237,0.1)' } }}
          aria-label="toggle theme"
        >
          {theme === 'light' ? <DarkMode fontSize="small" /> : <LightMode fontSize="small" />}
        </IconButton>
      </Tooltip>

      {/* Notifications */}
      <IconButton
        onClick={e => setAnchorNotif(e.currentTarget)}
        size="small"
        sx={{ color: '#94a3b8', '&:hover': { color: '#7c3aed', background: 'rgba(124,58,237,0.1)' } }}
        aria-label={`${unreadCount} notifications`}
      >
        <Badge badgeContent={unreadCount} color="error" max={9}>
          <Notifications fontSize="small" />
        </Badge>
      </IconButton>

      {/* Notifications Menu */}
      <Menu
        anchorEl={anchorNotif}
        open={Boolean(anchorNotif)}
        onClose={() => setAnchorNotif(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: {
              width: 340, maxHeight: 480, mt: 1,
              background: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: 2,
            },
          }
        }}
      >
        <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f1f5f9' }}>
            Notifications
            {unreadCount > 0 && (
              <Chip label={unreadCount} size="small" sx={{ ml: 1, height: 18, fontSize: '0.65rem', background: '#7c3aed', color: '#fff' }} />
            )}
          </Typography>
          {unreadCount > 0 && (
            <Typography
              variant="caption"
              sx={{ color: '#7c3aed', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => { dispatch(markAllRead()); setAnchorNotif(null); }}
            >
              Mark all read
            </Typography>
          )}
        </Box>
        <Divider sx={{ borderColor: '#2a2a4a' }} />
        {notifications.length === 0 && (
          <Box sx={{ py: 4, textAlign: 'center', color: '#64748b' }}>
            <Notifications sx={{ fontSize: 32, mb: 1, opacity: 0.3 }} />
            <Typography variant="caption">No notifications</Typography>
          </Box>
        )}
        {notifications.map(n => (
          <MenuItem
            key={n.id}
            sx={{
              alignItems: 'flex-start', gap: 1, py: 1.5,
              background: n.read ? 'transparent' : 'rgba(124,58,237,0.05)',
              borderBottom: '1px solid #1e1e3a',
              '&:hover': { background: 'rgba(124,58,237,0.08)' },
            }}
          >
            <Circle sx={{ fontSize: 8, mt: 0.8, flexShrink: 0, color: notifColors[n.type], opacity: n.read ? 0.3 : 1 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#f1f5f9', display: 'block' }}>
                {n.title}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', lineHeight: 1.4 }}>
                {n.message}
              </Typography>
              <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.65rem' }}>
                {format(new Date(n.timestamp), 'MMM d, h:mm a')}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>

      {/* User Avatar */}
      <IconButton onClick={e => setAnchorUser(e.currentTarget)} size="small" aria-label="user menu">
        <Avatar src={user?.avatar} sx={{ width: 32, height: 32, border: '2px solid #7c3aed' }} />
      </IconButton>

      {/* User Menu */}
      <Menu
        anchorEl={anchorUser}
        open={Boolean(anchorUser)}
        onClose={() => setAnchorUser(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: {
              width: 220, mt: 1,
              background: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: 2,
            },
          }
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#f1f5f9' }}>{user?.name}</Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>{user?.email}</Typography>
          <Chip label={user?.role} size="small" sx={{ mt: 0.5, height: 18, fontSize: '0.65rem', background: 'rgba(124,58,237,0.2)', color: '#a78bfa', display: 'flex' }} />
        </Box>
        <Divider sx={{ borderColor: '#2a2a4a' }} />
        <MenuItem onClick={() => { navigate('/settings'); setAnchorUser(null); }}
          sx={{ gap: 1.5, color: '#94a3b8', '&:hover': { color: '#f1f5f9', background: 'rgba(124,58,237,0.08)' } }}>
          <Person sx={{ fontSize: 18 }} /> Profile
        </MenuItem>
        <MenuItem onClick={() => { navigate('/settings'); setAnchorUser(null); }}
          sx={{ gap: 1.5, color: '#94a3b8', '&:hover': { color: '#f1f5f9', background: 'rgba(124,58,237,0.08)' } }}>
          <Settings sx={{ fontSize: 18 }} /> Settings
        </MenuItem>
        <Divider sx={{ borderColor: '#2a2a4a' }} />
        <MenuItem onClick={handleLogout}
          sx={{ gap: 1.5, color: '#ef4444', '&:hover': { background: 'rgba(239,68,68,0.08)' } }}>
          <Logout sx={{ fontSize: 18 }} /> Sign out
        </MenuItem>
      </Menu>
    </header>
  );
}
