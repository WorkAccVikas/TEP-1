import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'utils/axios';

// Define the async thunk for fetching zone names
export const fetchZoneNames = createAsyncThunk('zoneNames/fetchZoneNames', async (_, { rejectWithValue }) => {
  try {
    // Replace with your actual endpoint
    const response = await axios.get(`/zone/get`);
    return response.data.data; // Adjust according to your API response structure
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Define the async thunk for adding a zone name
export const addZoneName = createAsyncThunk('zoneNames/addZoneName', async (payload, { rejectWithValue }) => {
  try {
    // Replace with your actual endpoint
    const response = await axios.post('/zone/add', payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Define the async thunk for updating a zone name
export const updateZoneName = createAsyncThunk('zoneNames/updateZoneName', async (payload, { rejectWithValue }) => {
  try {
    // Replace with your actual endpoint
    const response = await axios.put(`/zone/edit`, payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Define the async thunk for deleting a zone name
export const deleteZoneName = createAsyncThunk('zoneNames/deleteZoneName', async (payload, { rejectWithValue }) => {
  try {
    // Replace with your actual endpoint
    await axios.put(`/zone/delete`, payload);
    return payload.data._id; // Return the id for deletion
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Initial state for the zone names
const initialState = {
  zoneNames: [], // Empty array initially
  metaData: {
    totalCount: 0,
    page: 1,
    limit: 10
  },
  loading: false,
  error: null
};
// Create the slice for zone names
const zoneNameSlice = createSlice({
  name: 'zoneNames',
  initialState,
  reducers: {
    reset: () => initialState, // Reset state to initial state
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchZoneNames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchZoneNames.fulfilled, (state, action) => {
        state.zoneNames = action.payload; // Handle empty result
        state.loading = false;
      })
      .addCase(fetchZoneNames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(addZoneName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addZoneName.fulfilled, (state, action) => {
        state.zoneNames.push(action.payload);
        state.loading = false;
      })
      .addCase(addZoneName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateZoneName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateZoneName.fulfilled, (state, action) => {
        const index = state.zoneNames.findIndex((zoneName) => zoneName._id === action.payload._id);
        if (index !== -1) {
          state.zoneNames[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateZoneName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteZoneName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteZoneName.fulfilled, (state, action) => {
        state.zoneNames = state.zoneNames.filter((zoneName) => zoneName._id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteZoneName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

// Export the reducer and actions
export const { reset, resetError } = zoneNameSlice.actions;
export const zoneNameReducer = zoneNameSlice.reducer;
