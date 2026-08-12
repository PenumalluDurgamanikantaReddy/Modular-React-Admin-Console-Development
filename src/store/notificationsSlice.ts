import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { NotificationItem } from '../shared/types';

interface NotificationsState {
  items: NotificationItem[];
  loading: boolean;
}

export const fetchNotifications = createAsyncThunk('notifications/fetch', async () => {
  const res = await fetch('/api/notifications');
  const json = await res.json() as { data: NotificationItem[] };
  return json.data;
});

export const markAllRead = createAsyncThunk('notifications/markAllRead', async () => {
  await fetch('/api/notifications/read-all', { method: 'PUT' });
});

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: { items: [], loading: false } as NotificationsState,
  reducers: {
    markRead(state, action) {
      const n = state.items.find(i => i.id === action.payload);
      if (n) n.read = true;
    },
    addNotification(state, action) {
      state.items.unshift(action.payload as NotificationItem);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchNotifications.pending, state => { state.loading = true; })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(markAllRead.fulfilled, state => {
        state.items.forEach(i => (i.read = true));
      });
  },
});

export const { markRead, addNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;

export const selectNotifications = (state: { notifications: NotificationsState }) =>
  state.notifications.items;
export const selectUnreadCount = (state: { notifications: NotificationsState }) =>
  state.notifications.items.filter(n => !n.read).length;
