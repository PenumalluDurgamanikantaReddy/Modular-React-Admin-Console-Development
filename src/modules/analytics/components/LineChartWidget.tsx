import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import type { ChartDataPoint } from '../../../shared/types';

interface Props {
  data: ChartDataPoint[];
}

export function LineChartWidget({ data }: Props) {
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
          Daily Active Users (DAU)
        </Typography>
        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
          User session trends over selected time window
        </Typography>
      </Box>

      <Box sx={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDau" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              tickFormatter={str => str.split('-').slice(1).join('/')}
            />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: '#1a1a2e',
                border: '1px solid #2a2a4a',
                borderRadius: 8,
                color: '#f1f5f9',
              }}
              itemStyle={{ color: '#a78bfa' }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              name="Active Users"
              stroke="#7c3aed"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorDau)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
