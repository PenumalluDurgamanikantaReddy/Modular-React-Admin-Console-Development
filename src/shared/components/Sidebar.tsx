import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Dashboard, People, Settings, Security, ChevronLeft, ChevronRight,
  Analytics, AutoGraph, AdminPanelSettings,
} from '@mui/icons-material';
import { Tooltip, Avatar, Chip, Box, Typography } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../store/rootStore';
import { selectCurrentUser } from '../../store/authSlice';
import { selectSidebarCollapsed, setSidebarCollapsed } from '../../modules/settings/slice/settingsSlice';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/analytics', label: 'Analytics', icon: AutoGraph, description: 'KPIs & Charts' },
  { path: '/users', label: 'User Management', icon: People, description: 'CRUD & Bulk Actions' },
  { path: '/settings', label: 'Settings', icon: Settings, description: 'Preferences & Profile' },
  { path: '/audit', label: 'Audit Log', icon: Security, description: 'Activity Tracking' },
];

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector(selectSidebarCollapsed);
  const user = useAppSelector(selectCurrentUser);
  const location = useLocation();

  const toggle = () => dispatch(setSidebarCollapsed(!collapsed));

  return (
    <motion.aside
      className={`sidebar ${collapsed ? 'collapsed' : ''}`}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >

      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 2.5, borderBottom: '1px solid #2a2a4a' }}>
        <Box sx={{
          flexShrink: 0, width: 36, height: 36, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)'
        }}>
          <AdminPanelSettings sx={{ fontSize: 20, color: '#fff' }} />
        </Box>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'white', lineHeight: 1.2 }}>Operations</Typography>
              <Typography sx={{ fontSize: '10px', color: '#94a3b8', lineHeight: 1.2 }}>Admin Console</Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, py: 2, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {!collapsed && (
          <Typography sx={{ px: 3, mb: 1, fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', color: '#475569', textTransform: 'uppercase' }}>
            Modules
          </Typography>
        )}
        {navItems.map(item => (
          <Tooltip
            key={item.path}
            title={collapsed ? item.label : ''}
            placement="right"
            arrow

          >
            <NavLink
              to={item.path}
              style={{ textDecoration: 'none' }}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%', pl: 2 }}>
                <item.icon sx={{ fontSize: 20, flexShrink: 0 }} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}
                    >
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.label}
                      </Typography>
                      <Typography sx={{ fontSize: '10px', color: '#64748b', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.description}
                      </Typography>
                    </motion.div>
                  )}
                </AnimatePresence>
                {!collapsed && item.path === '/audit' && (
                  <Chip label="New" size="small" sx={{ fontSize: '0.6rem', height: 16, background: '#7c3aed', color: '#fff' }} />
                )}
              </Box>
            </NavLink>
          </Tooltip>
        ))}
      </Box>

      {/* User Card */}
      {user && (
        <Box sx={{ borderTop: '1px solid #2a2a4a', p: 1.5, display: collapsed ? 'flex' : 'block', justifyContent: 'center' }}>
          {collapsed ? (
            <Tooltip title={user.name} placement="right">
              <Avatar src={user.avatar} sx={{ width: 36, height: 36 }} />
            </Tooltip>
          ) : (
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 1.5, px: 1, py: 1, borderRadius: '12px',
              transition: 'background 0.2s', cursor: 'pointer', '&:hover': { bgcolor: '#252545' }
            }}>
              <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</Typography>
                <Typography sx={{ fontSize: '10px', color: '#7c3aed', fontWeight: 600 }}>{user.role}</Typography>
              </Box>
            </Box>
          )}
        </Box>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={toggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full border border-[#2a2a4a] bg-[#1a1a2e] flex items-center justify-center cursor-pointer hover:border-[#7c3aed] hover:bg-[#252545] transition-all z-10"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed
          ? <ChevronRight sx={{ fontSize: 14, color: '#94a3b8' }} />
          : <ChevronLeft sx={{ fontSize: 14, color: '#94a3b8' }} />
        }
      </button>
    </motion.aside>
  );
}
