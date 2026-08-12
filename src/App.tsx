import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme, lightTheme } from './shared/theme/muiTheme';
import { useAppDispatch, useAppSelector } from './store/rootStore';
import { login } from './store/authSlice';
import { selectTheme } from './modules/settings/slice/settingsSlice';
import { fetchNotifications } from './store/notificationsSlice';
import ShellLayout from './shared/components/ShellLayout';
import PageSkeleton from './shared/components/PageSkeleton';
import LoginPage from './shared/components/LoginPage';
import ErrorBoundary from './shared/components/ErrorBoundary';
import CommandPalette from './shared/components/CommandPalette';

// ─── Lazy-loaded modules (simulating MF remote imports) ───────────────────────
/**
 * In Module Federation these would be:
 *   const UsersModule = lazy(() => import('usersRemote/UsersModule'));
 *   const AnalyticsModule = lazy(() => import('analyticsRemote/AnalyticsModule'));
 *   const SettingsModule = lazy(() => import('settingsRemote/SettingsModule'));
 */
const UsersModule = lazy(() => import('./modules/users/UsersModule'));
const AnalyticsModule = lazy(() => import('./modules/analytics/AnalyticsModule'));
const SettingsModule = lazy(() => import('./modules/settings/SettingsModule'));
const AuditModule = lazy(() => import('./modules/audit/AuditModule'));

function AppRoutes() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(s => s.auth.isAuthenticated);
  const authLoading = useAppSelector(s => s.auth.loading);

  // Auto-login for demo/portfolio (replace with real auth in production)
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      dispatch(login());
    }
  }, [dispatch, isAuthenticated, authLoading]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, isAuthenticated]);

  if (authLoading || !isAuthenticated) {
    return <LoginPage loading={authLoading} />;
  }

  return (
    <>
      <CommandPalette />
      <ShellLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/analytics" replace />} />
          <Route
            path="/analytics"
            element={
              <ErrorBoundary moduleName="Analytics">
                <Suspense fallback={<PageSkeleton />}>
                  <AnalyticsModule />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/users"
            element={
              <ErrorBoundary moduleName="Users">
                <Suspense fallback={<PageSkeleton />}>
                  <UsersModule />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/settings"
            element={
              <ErrorBoundary moduleName="Settings">
                <Suspense fallback={<PageSkeleton />}>
                  <SettingsModule />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/audit"
            element={
              <ErrorBoundary moduleName="Audit Log">
                <Suspense fallback={<PageSkeleton />}>
                  <AuditModule />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route path="*" element={<Navigate to="/analytics" replace />} />
        </Routes>
      </ShellLayout>
    </>
  );
}

function App() {
  const theme = useAppSelector(selectTheme);
  const muiTheme = theme === 'light' ? lightTheme : darkTheme;

  // Apply dark/light class to html element for Tailwind
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme !== 'light');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
