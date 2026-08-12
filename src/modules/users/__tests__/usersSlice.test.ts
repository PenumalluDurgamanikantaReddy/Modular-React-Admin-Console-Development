import usersReducer, {
  setFilter,
  setPage,
  toggleSelectUser,
  clearSelection,
  optimisticDelete,
  rollbackOptimisticDelete,
} from '../slice/usersSlice';
import type { User } from '../../../shared/types';

describe('usersSlice Reducer', () => {
  const initialState = {
    items: [
      {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice@google.com',
        role: 'Admin' as const,
        status: 'Active' as const,
        department: 'Engineering' as const,
        avatar: '',
        createdAt: '2026-01-01',
        lastActive: '2026-08-01',
      },
    ],
    selected: [],
    meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    filters: { q: '', role: '', status: '', department: '', sort: 'name', order: 'asc' as const },
    loading: false,
    saving: false,
    error: null,
    optimisticDeletes: [],
  };

  test('should handle setFilter', () => {
    const state = usersReducer(initialState, setFilter({ q: 'Alice', role: 'Admin' }));
    expect(state.filters.q).toBe('Alice');
    expect(state.filters.role).toBe('Admin');
    expect(state.meta.page).toBe(1);
  });

  test('should handle setPage', () => {
    const state = usersReducer(initialState, setPage(2));
    expect(state.meta.page).toBe(2);
  });

  test('should handle toggleSelectUser and clearSelection', () => {
    let state = usersReducer(initialState, toggleSelectUser('1'));
    expect(state.selected).toContain('1');

    state = usersReducer(state, clearSelection());
    expect(state.selected).toHaveLength(0);
  });

  test('should handle optimisticDelete and rollback', () => {
    const sampleUser = initialState.items[0];
    let state = usersReducer(initialState, optimisticDelete('1'));
    expect(state.items).toHaveLength(0);
    expect(state.optimisticDeletes).toContain('1');

    state = usersReducer(state, rollbackOptimisticDelete(sampleUser));
    expect(state.items).toHaveLength(1);
    expect(state.optimisticDeletes).not.toContain('1');
  });
});
