import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Grid } from '@mui/material';
import { Person, Palette, Notifications } from '@mui/icons-material';
import { ProfileForm } from './components/ProfileForm';
import { ThemeToggle } from './components/ThemeToggle';
import { NotificationPrefs } from './components/NotificationPrefs';
import { motion } from 'framer-motion';

export default function SettingsModule() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#f1f5f9' }}>
          Console Settings
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
          Manage user profiles, appearance themes, and notification preferences.
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: '#2a2a4a', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{
            '& .MuiTab-root': {
              color: '#94a3b8',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.9rem',
              minHeight: 48,
              '&.Mui-selected': { color: '#7c3aed' },
            },
            '& .MuiTabs-indicator': { backgroundColor: '#7c3aed', height: 3 },
          }}
        >
          <Tab icon={<Person sx={{ fontSize: 18 }} />} iconPosition="start" label="Profile" />
          <Tab icon={<Palette sx={{ fontSize: 18 }} />} iconPosition="start" label="Appearance" />
          <Tab icon={<Notifications sx={{ fontSize: 18 }} />} iconPosition="start" label="Notifications & Danger Zone" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <Grid container spacing={3}>
        {activeTab === 0 && (
          <Grid size={{ xs: 12, md: 8 }}>
            <ProfileForm />
          </Grid>
        )}

        {activeTab === 1 && (
          <Grid size={{ xs: 12, md: 8 }}>
            <ThemeToggle />
          </Grid>
        )}

        {activeTab === 2 && (
          <Grid size={{ xs: 12, md: 8 }}>
            <NotificationPrefs />
          </Grid>
        )}
      </Grid>
    </motion.div>
  );
}
