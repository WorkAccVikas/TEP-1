import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosServices from 'utils/axios';

// Async thunk to fetch vehicle types with dynamic cache key
export const fetchVehicleTypes = createAsyncThunk('vehicleType/fetchVehicleTypes', async (_, { getState, rejectWithValue }) => {
  const { vehicleType } = getState();

  // Check if the vehicle types are already cached
  if (vehicleType.cache.default) {
    return vehicleType.cache.default;
  }

  // Fetch vehicle types from API if not cached
  try {
    const response = await axiosServices.get('/vehicleType');
    const vehicles = response.data.data || [];
    const mappedVehicleType = vehicles.map((item) => ({ _id: item._id, vehicleTypeName: item.vehicleTypeName }));
    return mappedVehicleType;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch vehicle types');
  }
});

const vehicleTypeSlice = createSlice({
  name: 'vehicleType',
  initialState: {
    cache: {}, // Stores cached vehicle types
    loading: false, // Tracks loading state
    error: null // Tracks error state
  },
  reducers: {
    clearVehicleTypeCache: (state) => {
      state.cache = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicleTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicleTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.cache.default = action.payload; // Cache the fetched vehicle types
      })
      .addCase(fetchVehicleTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearVehicleTypeCache } = vehicleTypeSlice.actions;
export const vehicleTypeReducer1 = vehicleTypeSlice.reducer;
