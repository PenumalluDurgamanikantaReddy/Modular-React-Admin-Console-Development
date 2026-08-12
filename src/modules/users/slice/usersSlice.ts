import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { User, PaginationMeta } from '../../../shared/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UsersFilters {
  q: string;
  role: string;
  status: string;
  department: string;
  sort: string;
  order: 'asc' | 'desc';
}

interface UsersState {
  items: User[];
  selected: string[]; // selected user IDs for bulk actions
  meta: PaginationMeta;
  filters: UsersFilters;
  loading: boolean;
  saving: boolean;
  error: string | null;
  // Optimistic updates tracking
  optimisticDeletes: string[];
}

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (params: Partial<UsersFilters & { page: number; limit: number }>, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (params.q) query.set('q', params.q);
      if (params.role) query.set('role', params.role);
      if (params.status) query.set('status', params.status);
      if (params.department) query.set('department', params.department);
      if (params.sort) query.set('sort', params.sort);
      if (params.order) query.set('order', params.order);
      if (params.page) query.set('page', String(params.page));
      if (params.limit) query.set('limit', String(params.limit));

      const res = await fetch(`/api/users?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch users');
      return await res.json() as { data: User[]; meta: PaginationMeta };
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const createUser = createAsyncThunk(
  'users/create',
  async (payload: Omit<User, 'id' | 'avatar' | 'createdAt' | 'lastActive'>, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json() as { message: string };
        throw new Error(err.message);
      }
      const json = await res.json() as { data: User; message: string };
      return json.data;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, payload }: { id: string; payload: Partial<User> }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update user');
      const json = await res.json() as { data: User };
      return json.data;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
      return id;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const bulkDeleteUsers = createAsyncThunk(
  'users/bulkDelete',
  async (ids: string[], { rejectWithValue }) => {
    try {
      const res = await fetch('/api/users/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error('Failed to bulk delete');
      return ids;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState: UsersState = {
  items: [],
  selected: [],
  meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
  filters: { q: '', role: '', status: '', department: '', sort: 'name', order: 'asc' },
  loading: false,
  saving: false,
  error: null,
  optimisticDeletes: [],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<Partial<UsersFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
      state.meta.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.meta.page = action.payload;
    },
    setLimit(state, action: PayloadAction<number>) {
      state.meta.limit = action.payload;
      state.meta.page = 1;
    },
    toggleSelectUser(state, action: PayloadAction<string>) {
      const idx = state.selected.indexOf(action.payload);
      if (idx === -1) state.selected.push(action.payload);
      else state.selected.splice(idx, 1);
    },
    selectAll(state) {
      state.selected = state.items.map(u => u.id);
    },
    clearSelection(state) {
      state.selected = [];
    },
    clearError(state) {
      state.error = null;
    },
    // Optimistic delete — immediately remove from UI, rollback on failure
    optimisticDelete(state, action: PayloadAction<string>) {
      state.optimisticDeletes.push(action.payload);
      state.items = state.items.filter(u => u.id !== action.payload);
    },
    rollbackOptimisticDelete(state, action: PayloadAction<User>) {
      state.optimisticDeletes = state.optimisticDeletes.filter(id => id !== action.payload.id);
      state.items.unshift(action.payload);
    },
  },
  extraReducers: builder => {
    builder
      // fetchUsers
      .addCase(fetchUsers.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // createUser
      .addCase(createUser.pending, state => { state.saving = true; })
      .addCase(createUser.fulfilled, (state, action) => {
        state.saving = false;
        state.items.unshift(action.payload);
        state.meta.total += 1;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      })
      // updateUser
      .addCase(updateUser.pending, state => { state.saving = true; })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.saving = false;
        const idx = state.items.findIndex(u => u.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      })
      // deleteUser
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter(u => u.id !== action.payload);
        state.optimisticDeletes = state.optimisticDeletes.filter(id => id !== action.payload);
        state.meta.total -= 1;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // bulkDeleteUsers
      .addCase(bulkDeleteUsers.fulfilled, (state, action) => {
        state.items = state.items.filter(u => !action.payload.includes(u.id));
        state.selected = [];
        state.meta.total -= action.payload.length;
      })
      .addCase(bulkDeleteUsers.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setFilter, setPage, setLimit,
  toggleSelectUser, selectAll, clearSelection,
  clearError, optimisticDelete, rollbackOptimisticDelete,
} = usersSlice.actions;

export default usersSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectUsers = (state: { users: UsersState }) => state.users.items;
export const selectUsersMeta = (state: { users: UsersState }) => state.users.meta;
export const selectUsersFilters = (state: { users: UsersState }) => state.users.filters;
export const selectUsersLoading = (state: { users: UsersState }) => state.users.loading;
export const selectUsersSaving = (state: { users: UsersState }) => state.users.saving;
export const selectUsersError = (state: { users: UsersState }) => state.users.error;
export const selectSelectedUsers = (state: { users: UsersState }) => state.users.selected;
