import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import usersReducer from '../modules/users/slice/usersSlice';
import analyticsReducer from '../modules/analytics/slice/analyticsSlice';
import settingsReducer from '../modules/settings/slice/settingsSlice';
import authReducer from './authSlice';
import notificationsReducer from './notificationsSlice';

/**
 * ROOT STORE
 *
 * In a real Module Federation setup, each remote (usersRemote, analyticsRemote, settingsRemote)
 * would register its own slice dynamically via store.replaceReducer() or redux-dynamic-modules.
 * Here we combine them statically to demonstrate the same slice isolation pattern.
 *
 * Remote registration example:
 *   import { injectReducer } from './dynamicReducerRegistry';
 *   injectReducer('users', usersReducer);
 */
const rootReducer = combineReducers({
  auth: authReducer,
  notifications: notificationsReducer,
  // ── Module-owned slices (would be injected by each remote in production) ──
  users: usersReducer,
  analytics: analyticsReducer,
  settings: settingsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefault =>
    getDefault({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: import.meta.env.MODE !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) => useSelector(selector);
