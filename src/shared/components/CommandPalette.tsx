import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, InputBase, Divider } from '@mui/material';
import {
  AutoGraph, People, Settings, Security, Add, Search,
  LightMode, DarkMode, Logout, KeyboardReturn,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store/rootStore';
import { setTheme, selectTheme } from '../../modules/settings/slice/settingsSlice';
import { logout } from '../../store/authSlice';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  group: string;
  action: () => void;
  keywords?: string[];
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useAppSelector(selectTheme);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    { id: 'nav-analytics', label: 'Go to Analytics', icon: <AutoGraph fontSize="small" />, group: 'Navigate', action: () => navigate('/analytics'), keywords: ['dashboard', 'charts', 'metrics'] },
    { id: 'nav-users', label: 'Go to Users', icon: <People fontSize="small" />, group: 'Navigate', action: () => navigate('/users'), keywords: ['user management', 'table'] },
    { id: 'nav-settings', label: 'Go to Settings', icon: <Settings fontSize="small" />, group: 'Navigate', action: () => navigate('/settings'), keywords: ['preferences', 'profile'] },
    { id: 'nav-audit', label: 'Go to Audit Log', icon: <Security fontSize="small" />, group: 'Navigate', action: () => navigate('/audit'), keywords: ['activity', 'log'] },
    { id: 'new-user', label: 'Create New User', description: 'Open the add user form', icon: <Add fontSize="small" />, group: 'Actions', action: () => { navigate('/users'); setTimeout(() => document.dispatchEvent(new CustomEvent('open-add-user')), 300); } },
    { id: 'theme-dark', label: 'Switch to Dark Mode', icon: <DarkMode fontSize="small" />, group: 'Preferences', action: () => dispatch(setTheme('dark')) },
    { id: 'theme-light', label: 'Switch to Light Mode', icon: <LightMode fontSize="small" />, group: 'Preferences', action: () => dispatch(setTheme('light')) },
    { id: 'sign-out', label: 'Sign Out', icon: <Logout fontSize="small" />, group: 'Account', action: () => dispatch(logout()) },
  ];

  const filtered = query.trim()
    ? commands.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.description?.toLowerCase().includes(query.toLowerCase()) ||
        c.keywords?.some(k => k.includes(query.toLowerCase()))
      )
    : commands;

  const grouped = filtered.reduce<Record<string, Command[]>>((acc, cmd) => {
    if (!acc[cmd.group]) acc[cmd.group] = [];
    acc[cmd.group].push(cmd);
    return acc;
  }, {});

  const runHighlighted = useCallback(() => {
    if (filtered[highlighted]) {
      filtered[highlighted].action();
      setOpen(false);
      setQuery('');
    }
  }, [filtered, highlighted]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
        setQuery('');
        setHighlighted(0);
      }
      if (e.key === 'Escape') setOpen(false);
      if (open) {
        if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(h => Math.min(h + 1, filtered.length - 1)); }
        if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)); }
        if (e.key === 'Enter') { e.preventDefault(); runHighlighted(); }
      }
    };
    const onCustom = () => { setOpen(true); setQuery(''); setHighlighted(0); };

    window.addEventListener('keydown', onKey);
    document.addEventListener('open-command-palette', onCustom);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('open-command-palette', onCustom);
    };
  }, [open, filtered.length, runHighlighted]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => { setHighlighted(0); }, [query]);

  let globalIdx = 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="command-palette-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ width: '100%', maxWidth: 560 }}
          >
            <Box sx={{
              background: '#1a1a2e', border: '1px solid rgba(124,58,237,0.4)',
              borderRadius: 3, overflow: 'hidden',
              boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(124,58,237,0.15)',
            }}>
              {/* Search Input */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, borderBottom: '1px solid #2a2a4a' }}>
                <Search sx={{ color: '#7c3aed', fontSize: 20 }} />
                <InputBase
                  inputRef={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search commands…"
                  fullWidth
                  sx={{ fontSize: '1rem', color: '#f1f5f9',
                    '& input::placeholder': { color: '#64748b' } }}
                  inputProps={{ 'aria-label': 'command search' }}
                />
                <Box sx={{ px: 1, py: 0.5, borderRadius: 1, background: '#252545',
                  fontSize: '0.65rem', color: '#94a3b8', flexShrink: 0 }}>ESC</Box>
              </Box>

              {/* Results */}
              <Box sx={{ maxHeight: 360, overflowY: 'auto', py: 1 }}>
                {Object.entries(grouped).length === 0 && (
                  <Box sx={{ py: 4, textAlign: 'center', color: '#64748b' }}>
                    <Typography variant="body2">No commands found</Typography>
                  </Box>
                )}
                {Object.entries(grouped).map(([group, cmds]) => (
                  <Box key={group}>
                    <Typography variant="caption" sx={{ px: 2, py: 0.5, display: 'block',
                      color: '#475569', fontWeight: 700, letterSpacing: '0.08em',
                      textTransform: 'uppercase', fontSize: '0.65rem' }}>
                      {group}
                    </Typography>
                    {cmds.map(cmd => {
                      const isHighlighted = globalIdx === highlighted;
                      const itemIdx = globalIdx++;
                      return (
                        <Box
                          key={cmd.id}
                          onClick={() => { cmd.action(); setOpen(false); setQuery(''); }}
                          onMouseEnter={() => setHighlighted(itemIdx)}
                          sx={{
                            display: 'flex', alignItems: 'center', gap: 2,
                            px: 2, py: 1, cursor: 'pointer', transition: 'all 0.1s',
                            background: isHighlighted ? 'rgba(124,58,237,0.12)' : 'transparent',
                            borderLeft: isHighlighted ? '2px solid #7c3aed' : '2px solid transparent',
                          }}
                        >
                          <Box sx={{ color: isHighlighted ? '#a78bfa' : '#64748b', display: 'flex' }}>
                            {cmd.icon}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ color: isHighlighted ? '#f1f5f9' : '#94a3b8', fontWeight: 500 }}>
                              {cmd.label}
                            </Typography>
                            {cmd.description && (
                              <Typography variant="caption" sx={{ color: '#475569' }}>
                                {cmd.description}
                              </Typography>
                            )}
                          </Box>
                          {isHighlighted && (
                            <KeyboardReturn sx={{ fontSize: 14, color: '#7c3aed' }} />
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                ))}
              </Box>

              {/* Footer */}
              <Box sx={{ px: 2, py: 1, borderTop: '1px solid #2a2a4a',
                display: 'flex', gap: 2, alignItems: 'center' }}>
                {[['↑↓', 'navigate'], ['↵', 'select'], ['esc', 'close']].map(([key, label]) => (
                  <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ px: 1, py: 0.25, borderRadius: 1, background: '#252545',
                      fontSize: '0.65rem', color: '#94a3b8', fontFamily: 'monospace' }}>{key}</Box>
                    <Typography variant="caption" sx={{ color: '#475569' }}>{label}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
