import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { AdminPanelSettings, Lock } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface Props {
  loading: boolean;
}

export default function LoginPage({ loading }: Props) {
  return (
    <Box
      sx={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #0f0f23 100%)',
      }}
    >
      {/* Animated background blobs */}
      <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              filter: 'blur(80px)',
              opacity: 0.15,
              background: i === 0 ? '#7c3aed' : i === 1 ? '#06b6d4' : '#8b5cf6',
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
              top: `${[10, 50, 70][i]}%`,
              left: `${[10, 60, 30][i]}%`,
            }}
            animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ zIndex: 1 }}
      >
        <Box sx={{
          width: 420, p: 5, borderRadius: 4,
          background: 'rgba(26,26,46,0.85)', backdropFilter: 'blur(30px)',
          border: '1px solid rgba(124,58,237,0.3)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 60px rgba(124,58,237,0.1)',
          textAlign: 'center',
        }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box sx={{
              width: 64, height: 64, borderRadius: 3,
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 40px rgba(124,58,237,0.4)',
            }}>
              <AdminPanelSettings sx={{ fontSize: 32, color: '#fff' }} />
            </Box>
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 800, color: '#f1f5f9', mb: 0.5 }}>
            Google
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 4 }}>
            Modular Admin Console
          </Typography>

          {/* Feature Pills */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 4 }}>
            {['React 19', 'TypeScript', 'Redux Toolkit', 'MSW', 'MUI + Tailwind'].map(tag => (
              <Box key={tag} sx={{
                px: 1.5, py: 0.5, borderRadius: 5, fontSize: '0.65rem', fontWeight: 600,
                background: 'rgba(124,58,237,0.12)', color: '#a78bfa',
                border: '1px solid rgba(124,58,237,0.25)',
              }}>{tag}</Box>
            ))}
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={36} sx={{ color: '#7c3aed' }} />
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Authenticating…
              </Typography>
            </Box>
          ) : (
            <Box sx={{
              p: 2, borderRadius: 2, background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.2)', display: 'flex',
              alignItems: 'center', gap: 1.5,
            }}>
              <Lock sx={{ color: '#10b981', fontSize: 18 }} />
              <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 500 }}>
                Demo mode — auto-authenticating as Admin
              </Typography>
            </Box>
          )}
        </Box>
      </motion.div>
    </Box>
  );
}
