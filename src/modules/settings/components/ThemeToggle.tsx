import React from 'react';
import {
  Box, Typography, Paper, ToggleButtonGroup, ToggleButton, Switch, FormControlLabel,
} from '@mui/material';
import { DarkMode, LightMode, SettingsBrightness, Palette } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../store/rootStore';
import {
  selectSettings, setTheme, updatePreferences,
} from '../slice/settingsSlice';

const ACCENT_COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

export function ThemeToggle() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);

  const handleThemeChange = (_: any, newTheme: 'dark' | 'light' | 'system' | null) => {
    if (newTheme) {
      dispatch(setTheme(newTheme));
    }
  };

  const handleAccentChange = (color: string) => {
    dispatch(updatePreferences({ accentColor: color }));
  };

  return (
    <Paper
      sx={{
        p: 3,
        background: 'linear-gradient(135deg, rgba(26,26,46,0.9) 0%, rgba(22,33,62,0.8) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid #2a2a4a',
        borderRadius: 3,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#f1f5f9', mb: 0.5 }}>
        Appearance & Theme
      </Typography>
      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
        Customize color scheme, theme mode, and layout density.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Theme Mode selector */}
        <Box>
          <Typography variant="subtitle2" sx={{ color: '#cbd5e1', fontWeight: 600, mb: 1 }}>
            Theme Mode
          </Typography>
          <ToggleButtonGroup
            value={settings.theme}
            exclusive
            onChange={handleThemeChange}
            fullWidth
            sx={{
              background: '#0f0f23',
              p: 0.5,
              borderRadius: 2.5,
              border: '1px solid #2a2a4a',
              '& .MuiToggleButton-root': {
                color: '#94a3b8',
                border: 'none',
                borderRadius: 2,
                py: 1,
                fontWeight: 600,
                textTransform: 'none',
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  color: '#ffffff',
                },
              },
            }}
          >
            <ToggleButton value="dark">
              <DarkMode sx={{ mr: 1, fontSize: 18 }} /> Dark Mode
            </ToggleButton>
            <ToggleButton value="light">
              <LightMode sx={{ mr: 1, fontSize: 18 }} /> Light Mode
            </ToggleButton>
            <ToggleButton value="system">
              <SettingsBrightness sx={{ mr: 1, fontSize: 18 }} /> System
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Accent Color picker */}
        <Box>
          <Typography variant="subtitle2" sx={{ color: '#cbd5e1', fontWeight: 600, mb: 1 }}>
            Accent Color
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            {ACCENT_COLORS.map(color => {
              const isSelected = settings.accentColor === color;
              return (
                <Box
                  key={color}
                  onClick={() => handleAccentChange(color)}
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: color,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: isSelected ? '3px solid #ffffff' : '2px solid transparent',
                    boxShadow: isSelected ? `0 0 15px ${color}` : 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': { transform: 'scale(1.1)' },
                  }}
                />
              );
            })}
          </Box>
        </Box>

        {/* Compact Layout Toggle */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#cbd5e1', fontWeight: 600 }}>
              Compact Spacing Mode
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Reduce padding across tables and metrics cards for high density displays.
            </Typography>
          </Box>
          <Switch
            checked={settings.compactLayout}
            onChange={e => dispatch(updatePreferences({ compactLayout: e.target.checked }))}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': { color: '#7c3aed' },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#7c3aed' },
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
}
