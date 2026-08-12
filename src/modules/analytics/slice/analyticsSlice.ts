import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AnalyticsData } from '../../../shared/types';

interface AnalyticsState {
  data: AnalyticsData | null;
  dateRange: number; // days
  loading: boolean;
  error: string | null;
  lastRefreshed: string | null;
}

export const fetchAnalytics = createAsyncThunk(
  'analytics/fetch',
  async (range: number = 30, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/analytics/chart?range=${range}`);
      if (!res.ok) throw new Error('Failed to fetch analytics');
      const json = await res.json() as { data: AnalyticsData };
      return json.data;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    data: null,
    dateRange: 30,
    loading: false,
    error: null,
    lastRefreshed: null,
  } as AnalyticsState,
  reducers: {
    setDateRange(state, action) {
      state.dateRange = action.payload as number;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAnalytics.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastRefreshed = new Date().toISOString();
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setDateRange } = analyticsSlice.actions;
export default analyticsSlice.reducer;

export const selectAnalyticsData = (state: { analytics: AnalyticsState }) => state.analytics.data;
export const selectAnalyticsLoading = (state: { analytics: AnalyticsState }) => state.analytics.loading;
export const selectAnalyticsDateRange = (state: { analytics: AnalyticsState }) => state.analytics.dateRange;
export const selectLastRefreshed = (state: { analytics: AnalyticsState }) => state.analytics.lastRefreshed;
