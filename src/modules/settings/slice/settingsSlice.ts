import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserPreferences } from '../../../shared/types';

const STORAGE_KEY = 'google_settings';

function loadFromStorage(): Partial<UserPreferences> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<UserPreferences>) : {};
  } catch {
    return {};
  }
}

function saveToStorage(prefs: UserPreferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

const defaults: UserPreferences = {
  displayName: 'Gowtham Admin',
  email: 'gowtham@google.com',
  bio: 'Full-stack developer & admin at Google.',
  timezone: 'Asia/Kolkata',
  avatar: 'https://ui-avatars.com/api/?name=Gowtham+Admin&background=7c3aed&color=fff&size=128&bold=true',
  theme: 'dark',
  accentColor: '#7c3aed',
  compactLayout: false,
  sidebarCollapsed: false,
  notifications: {
    email: true,
    push: true,
    sms: false,
    digest: 'weekly',
  },
  language: 'en',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState: { ...defaults, ...loadFromStorage() } as UserPreferences,
  reducers: {
    updatePreferences(state, action: PayloadAction<Partial<UserPreferences>>) {
      const next = { ...state, ...action.payload };
      saveToStorage(next);
      return next;
    },
    setTheme(state, action: PayloadAction<'dark' | 'light' | 'system'>) {
      state.theme = action.payload;
      saveToStorage(state);
    },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
      saveToStorage(state);
    },
    resetSettings() {
      localStorage.removeItem(STORAGE_KEY);
      return defaults;
    },
  },
});

export const { updatePreferences, setTheme, setSidebarCollapsed, resetSettings } = settingsSlice.actions;
export default settingsSlice.reducer;

export const selectSettings = (state: { settings: UserPreferences }) => state.settings;
export const selectTheme = (state: { settings: UserPreferences }) => state.settings.theme;
export const selectSidebarCollapsed = (state: { settings: UserPreferences }) => state.settings.sidebarCollapsed;
export const selectAccentColor = (state: { settings: UserPreferences }) => state.settings.accentColor;
