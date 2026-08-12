import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { BugReport, Refresh } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  moduleName: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Per-module Error Boundary.
 * In Module Federation, each remote can crash independently.
 * This boundary ensures one module failure doesn't bring down the shell.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[ErrorBoundary:${this.props.moduleName}]`, error, info);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', minHeight: '60vh', gap: 2, textAlign: 'center',
          }}
        >
          <Box sx={{
            width: 72, height: 72, borderRadius: 3, background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <BugReport sx={{ fontSize: 36, color: '#ef4444' }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#f1f5f9' }}>
            {this.props.moduleName} Module Failed
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 420 }}>
            This module encountered an unexpected error. Other modules remain unaffected —
            this is the micro-frontend isolation in action.
          </Typography>
          <Typography variant="caption" sx={{ color: '#ef4444', fontFamily: 'monospace',
            background: 'rgba(239,68,68,0.05)', px: 2, py: 1, borderRadius: 2, maxWidth: 500, wordBreak: 'break-all' }}>
            {this.state.error?.message}
          </Typography>
          <Button variant="contained" startIcon={<Refresh />} onClick={this.reset}>
            Retry Module
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}
