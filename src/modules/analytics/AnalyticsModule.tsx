import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, FormControl, Select, MenuItem,
  LinearProgress, Chip, IconButton, Tooltip, Grid,
} from '@mui/material';
import { Refresh, AutoGraph, AccessTime, Sync } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/rootStore';
import {
  fetchAnalytics, setDateRange, selectAnalyticsData, selectAnalyticsLoading,
  selectAnalyticsDateRange, selectLastRefreshed,
} from './slice/analyticsSlice';
import { MetricCardWidget } from './components/MetricCard';
import { LineChartWidget } from './components/LineChartWidget';
import { BarChartWidget } from './components/BarChartWidget';
import { PieChartWidget } from './components/PieChartWidget';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function AnalyticsModule() {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectAnalyticsData);
  const loading = useAppSelector(selectAnalyticsLoading);
  const dateRange = useAppSelector(selectAnalyticsDateRange);
  const lastRefreshed = useAppSelector(selectLastRefreshed);

  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    dispatch(fetchAnalytics(dateRange));
  }, [dispatch, dateRange]);

  // Auto-refresh timer every 30s
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          dispatch(fetchAnalytics(dateRange));
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [dispatch, dateRange]);

  const handleRefresh = () => {
    dispatch(fetchAnalytics(dateRange));
    setCountdown(30);
  };

  const handleRangeChange = (e: any) => {
    const range = Number(e.target.value);
    dispatch(setDateRange(range));
    setCountdown(30);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#f1f5f9' }}>
            Analytics Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Real-time business performance metrics & application telemetry.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Auto Refresh Chip */}
          <Chip
            icon={<Sync className="pulse-dot" sx={{ fontSize: 14, color: '#10b981' }} />}
            label={`Live (Refresh in ${countdown}s)`}
            size="small"
            sx={{
              background: 'rgba(16,185,129,0.1)',
              color: '#10b981',
              border: '1px solid rgba(16,185,129,0.3)',
              fontWeight: 600,
            }}
          />

          {/* Date Range Selector */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={dateRange}
              onChange={handleRangeChange}
              sx={{
                background: 'rgba(26,26,46,0.8)',
                color: '#f1f5f9',
                borderRadius: 2.5,
                fontSize: '0.875rem',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a2a4a' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#7c3aed' },
              }}
            >
              <MenuItem value={7}>Last 7 Days</MenuItem>
              <MenuItem value={14}>Last 14 Days</MenuItem>
              <MenuItem value={30}>Last 30 Days</MenuItem>
            </Select>
          </FormControl>

          <Tooltip title="Manual Refresh">
            <IconButton
              onClick={handleRefresh}
              sx={{ color: '#94a3b8', border: '1px solid #2a2a4a', borderRadius: 2 }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Loading Bar */}
      {loading && <LinearProgress sx={{ mb: 3, borderRadius: 1, backgroundColor: '#2a2a4a', '& .MuiLinearProgress-bar': { backgroundColor: '#7c3aed' } }} />}

      {/* Metric Cards Grid */}
      {data?.metrics && (
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {data.metrics.map(metric => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={metric.id}>
              <MetricCardWidget metric={metric} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Charts Grid */}
      {data && (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <LineChartWidget data={data.dailyActiveUsers} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <PieChartWidget data={data.roleDistribution} />
          </Grid>
          <Grid item xs={12}>
            <BarChartWidget data={data.moduleUsageByDept} />
          </Grid>
        </Grid>
      )}

      {/* Footer Timestamp */}
      {lastRefreshed && (
        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1, color: '#64748b' }}>
          <AccessTime sx={{ fontSize: 14 }} />
          <Typography variant="caption">
            Last synced with telemetry services at {format(new Date(lastRefreshed), 'PPpp')}
          </Typography>
        </Box>
      )}
    </motion.div>
  );
}
