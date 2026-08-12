import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
} from 'recharts';

interface Props {
  data: { dept: string; users: number; analytics: number; settings: number }[];
}

export function BarChartWidget({ data }: Props) {
  return (
    <Paper
      sx={{
        p: 3,
        background: 'linear-gradient(135deg, rgba(26,26,46,0.9) 0%, rgba(22,33,62,0.8) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid #2a2a4a',
        borderRadius: 3,
        height: 380,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#f1f5f9' }}>
          Module Usage by Department
        </Typography>
        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
          Interaction volume across application modules
        </Typography>
      </Box>

      <Box sx={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" vertical={false} />
            <XAxis dataKey="dept" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: '#1a1a2e',
                border: '1px solid #2a2a4a',
                borderRadius: 8,
                color: '#f1f5f9',
              }}
            />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
            <Bar dataKey="users" name="User Mgmt" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            <Bar dataKey="analytics" name="Analytics" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="settings" name="Settings" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
