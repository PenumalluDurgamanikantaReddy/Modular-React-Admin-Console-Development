import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthUser, Permission } from '../shared/types';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Mock auth — in production, call your IdP here
export const login = createAsyncThunk(
  'auth/login',
  async (_: void, { rejectWithValue }) => {
    await new Promise(r => setTimeout(r, 600));
    const user: AuthUser = {
      id: 'auth-user-1',
      name: 'Gowtham Admin',
      email: 'gowtham@Google.com',
      role: 'Admin',
      avatar: 'https://ui-avatars.com/api/?name=Gowtham+Admin&background=7c3aed&color=fff&size=128&bold=true',
      permissions: [
        'users:read', 'users:write', 'users:delete',
        'analytics:read', 'settings:read', 'settings:write',
        'audit:read', 'admin:all',
      ] as Permission[],
    };
    return user;
  }
);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Login failed';
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;

export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const hasPermission = (user: AuthUser | null, perm: Permission) =>
  user?.permissions.includes(perm) || user?.permissions.includes('admin:all') || false;
