import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { waterUsageAPI } from '../services/apiServices';

const initialState = {
  usages: [],
  analytics: null,
  systemAnalytics: null,
  loading: false,
  error: null,
  pagination: null,
};

export const addWaterUsage = createAsyncThunk(
  'waterUsage/add',
  async (data, { rejectWithValue }) => {
    try {
      const response = await waterUsageAPI.addUsage(data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add water usage');
    }
  }
);

export const fetchMyUsage = createAsyncThunk(
  'waterUsage/fetchMy',
  async (params, { rejectWithValue }) => {
    try {
      const response = await waterUsageAPI.getMyUsage(params);
      return {
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch water usage');
    }
  }
);

export const fetchAnalytics = createAsyncThunk(
  'waterUsage/fetchAnalytics',
  async (params, { rejectWithValue }) => {
    try {
      const response = await waterUsageAPI.getAnalytics(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

export const fetchSystemAnalytics = createAsyncThunk(
  'waterUsage/fetchSystemAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await waterUsageAPI.getSystemAnalytics();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch system analytics');
    }
  }
);

const waterUsageSlice = createSlice({
  name: 'waterUsage',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add usage
      .addCase(addWaterUsage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addWaterUsage.fulfilled, (state, action) => {
        state.loading = false;
        state.usages.unshift(action.payload);
      })
      .addCase(addWaterUsage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch my usage
      .addCase(fetchMyUsage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyUsage.fulfilled, (state, action) => {
        state.loading = false;
        state.usages = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMyUsage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch analytics
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch system analytics
      .addCase(fetchSystemAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSystemAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.systemAnalytics = action.payload;
      })
      .addCase(fetchSystemAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = waterUsageSlice.actions;
export default waterUsageSlice.reducer;
