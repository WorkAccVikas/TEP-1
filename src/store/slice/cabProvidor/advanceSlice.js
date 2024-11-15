import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'utils/axios';

// Define the async thunk for fetching advance
export const fetchAdvances = createAsyncThunk('advances/fetchAdvances', async (_, { rejectWithValue }) => {
  try {
    // Advance Requests to CabProvider
    const response = await axios.get(`/advance/requested/cab/provider`);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Initial state for the zone names
const initialState = {
  advances: [], // Empty array initially
  metaData: {
    totalCount: 0,
    page: 1,
    limit: 10
  },
  loading: false,
  error: null
};

// Create the slice for zone names
const advanceSlice = createSlice({
  name: 'advances',
  initialState,
  reducers: {
    reset: () => initialState, // Reset state to initial state
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdvances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdvances.fulfilled, (state, action) => {
        state.advances = action.payload; // Handle empty result
        state.loading = false;
      })
      .addCase(fetchAdvances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

// Export the reducer and actions
export const { reset, resetError } = advanceSlice.actions;
export const advanceReducer = advanceSlice.reducer;
