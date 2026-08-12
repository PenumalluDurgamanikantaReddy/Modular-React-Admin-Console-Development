import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { TrendingUp, TrendingDown, People, HowToReg, Wifi, Timer, PersonAdd } from '@mui/icons-material';
import type { MetricCard as MetricCardType } from '../../../shared/types';
import { motion } from 'framer-motion';

interface Props {
  metric: MetricCardType;
}

const iconMap: Record<string, React.ReactNode> = {
  people: <People />,
  person_check: <HowToReg />,
  wifi: <Wifi />,
  trending_up: <TrendingUp />,
  timer: <Timer />,
  person_add: <PersonAdd />,
};

export function MetricCardWidget({ metric }: Props) {
  const isPositive = metric.trend >= 0;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card
        sx={{
          background: 'linear-gradient(135deg, rgba(26,26,46,0.9) 0%, rgba(22,33,62,0.8) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid #2a2a4a',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            borderColor: metric.color,
            boxShadow: `0 10px 30px rgba(0,0,0,0.4), 0 0 20px ${metric.color}22`,
          },
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {metric.label}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#f1f5f9', mt: 0.5 }}>
                {metric.value}
              </Typography>
            </Box>

            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                background: `${metric.color}15`,
                color: metric.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${metric.color}30`,
              }}
            >
              {iconMap[metric.icon] || <People />}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 1,
                py: 0.25,
                borderRadius: 1.5,
                fontSize: '0.75rem',
                fontWeight: 700,
                background: isPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: isPositive ? '#10b981' : '#ef4444',
              }}
            >
              {isPositive ? <TrendingUp sx={{ fontSize: 14, mr: 0.5 }} /> : <TrendingDown sx={{ fontSize: 14, mr: 0.5 }} />}
              {Math.abs(metric.trend)}%
            </Box>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              vs last period
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
