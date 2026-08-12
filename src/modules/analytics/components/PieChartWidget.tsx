import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
} from 'recharts';

interface Props {
  data: { role: string; count: number; color: string }[];
}

export function PieChartWidget({ data }: Props) {
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
          User Role Distribution
        </Typography>
        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
          Breakdown of user accounts by permission tier
        </Typography>
      </Box>

      <Box sx={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="count"
              nameKey="role"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#1a1a2e" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#1a1a2e',
                border: '1px solid #2a2a4a',
                borderRadius: 8,
                color: '#f1f5f9',
              }}
            />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
