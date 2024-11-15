import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'utils/axios'; // Adjust the import path according to your project structure

const initialState = {
  cabs: [], // Empty array initially
  metaData: {
    totalCount: 0,
    page: 1,
    limit: 10,
    lastPageNo: 1
  },
  loading: false,
  error: null
};

export const fetchCabs = createAsyncThunk('cabs/fetchCabs', async ({ page = 1, limit = 10, vendorID = null }, { rejectWithValue }) => {
  try {
    const queryParams = {
      page,
      limit,
      ...(vendorID && { vendorId: vendorID })
    };
    const response = await axios.get(`/vehicle/all`, {
      params: queryParams
    });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

export const addCab = createAsyncThunk('cabs/add', async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`/vehicle/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return { status: response.status };
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

const cabSlice = createSlice({
  name: 'cabs',
  initialState,
  reducers: {
    reset: () => initialState, // Reset state to initial state on logout
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCabs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCabs.fulfilled, (state, action) => {
        state.cabs = action.payload.result || []; // Handle empty result
        state.metaData = {
          totalCount: action.payload.total || 0,
          page: action.payload.page || 1,
          limit: action.payload.limit || 10,
          lastPageNo: Math.ceil(action.payload.total / action.payload.limit) || 1
        };
        state.loading = false;
      })
      .addCase(fetchCabs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

// Export the reducer and actions
export const { reset, resetError } = cabSlice.actions;
export const cabReducer = cabSlice.reducer;
