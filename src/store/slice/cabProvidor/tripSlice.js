import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'utils/axios';

// Initial state for the zone names
const initialState = {
  data: [], // Empty array initially
  metaData: {
    totalCount: 0,
    page: 1,
    limit: 10
  },
  loading: false,
  error: null
};

export const addNewTrip = createAsyncThunk('trips/addNewTrip', async (payload, { rejectWithValue }) => {
  try {
    console.log(`🚀 ~ addNewTrip ~ payload:`, payload);
    const response = await axios.post('/trip/add', payload);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

export const updateTrip = createAsyncThunk('trips/updateTrip', async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.put('/trip/update', payload);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

const tripSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    reset: () => initialState, // Reset state to initial state
    resetError: (state) => {
      state.error = null;
    }
  }
});

// Export the reducer and actions
export const { reset, resetError } = tripSlice.actions;
export const tripReducer = tripSlice.reducer;
