import React from 'react';
import {
  Box, Typography, Paper, Switch, MenuItem, Select, FormControl, Button, Dialog,
  DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import { Notifications, Email, Smartphone, Sms, Warning, RestartAlt } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../store/rootStore';
import {
  selectSettings, updatePreferences, resetSettings,
} from '../slice/settingsSlice';

export function NotificationPrefs() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);
  const [confirmReset, setConfirmReset] = React.useState(false);

  const handleToggle = (channel: 'email' | 'push' | 'sms') => {
    dispatch(
      updatePreferences({
        notifications: {
          ...settings.notifications,
          [channel]: !settings.notifications[channel],
        },
      })
    );
  };

  const handleDigestChange = (e: any) => {
    dispatch(
      updatePreferences({
        notifications: {
          ...settings.notifications,
          digest: e.target.value,
        },
      })
    );
  };

  const handleReset = () => {
    dispatch(resetSettings());
    setConfirmReset(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
          Notification Delivery
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
          Configure channels for security alerts, activity updates, and automated reports.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Email Notifications */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Email sx={{ color: '#7c3aed' }} />
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#cbd5e1', fontWeight: 600 }}>
                  Email Notifications
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  Send activity alerts directly to {settings.email}
                </Typography>
              </Box>
            </Box>
            <Switch
              checked={settings.notifications.email}
              onChange={() => handleToggle('email')}
              sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#7c3aed' } }}
            />
          </Box>

          {/* Push Notifications */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Smartphone sx={{ color: '#06b6d4' }} />
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#cbd5e1', fontWeight: 600 }}>
                  Browser Push Notifications
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  Real-time browser popups for critical events
                </Typography>
              </Box>
            </Box>
            <Switch
              checked={settings.notifications.push}
              onChange={() => handleToggle('push')}
              sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#06b6d4' } }}
            />
          </Box>

          {/* SMS Notifications */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Sms sx={{ color: '#10b981' }} />
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#cbd5e1', fontWeight: 600 }}>
                  SMS Text Notifications
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  SMS updates for 2FA and emergency alerts
                </Typography>
              </Box>
            </Box>
            <Switch
              checked={settings.notifications.sms}
              onChange={() => handleToggle('sms')}
              sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#10b981' } }}
            />
          </Box>

          {/* Digest Summary */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#cbd5e1', fontWeight: 600 }}>
                Digest Summary Frequency
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Batch non-critical updates into periodic digest emails
              </Typography>
            </Box>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select value={settings.notifications.digest} onChange={handleDigestChange}>
                <MenuItem value="daily">Daily Digest</MenuItem>
                <MenuItem value="weekly">Weekly Digest</MenuItem>
                <MenuItem value="never">Never</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Paper>

      {/* Danger Zone */}
      <Paper
        sx={{
          p: 3,
          background: 'rgba(239, 68, 68, 0.05)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#ef4444', mb: 0.5 }}>
          Danger Zone
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
          Resetting all settings clears local preferences and restores defaults across all slices.
        </Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<RestartAlt />}
          onClick={() => setConfirmReset(true)}
          sx={{ borderRadius: 2 }}
        >
          Reset All Settings
        </Button>
      </Paper>

      {/* Reset Modal */}
      <Dialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        PaperProps={{ sx: { background: '#1a1a2e', border: '1px solid #2a2a4a' } }}
      >
        <DialogTitle sx={{ color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning sx={{ color: '#ef4444' }} /> Confirm Settings Reset
        </DialogTitle>
        <DialogContent sx={{ color: '#94a3b8' }}>
          Are you sure you want to restore default settings? This will clear custom theme selections and notification preferences.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmReset(false)} sx={{ color: '#94a3b8' }}>
            Cancel
          </Button>
          <Button onClick={handleReset} color="error" variant="contained">
            Reset Everything
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
