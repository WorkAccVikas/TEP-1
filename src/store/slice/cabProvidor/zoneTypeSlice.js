import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'utils/axios';

const initialState = {
  zoneTypes: [], // Empty array initially
  metaData: {
    totalCount: 0,
    page: 1,
    limit: 10
  },
  loading: false,
  error: null
};

export const fetchAllZoneTypes = createAsyncThunk('zoneTypes/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/zoneType/all');
    return response?.data?.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

export const addZoneType = createAsyncThunk(
  'zoneType/addzoneType',
  async ({ zoneId, zoneTypeName, zoneTypeDescription }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/zoneType/add', {
        data: {
          zoneId,
          zoneTypeName,
          zoneTypeDescription
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Define the async thunk for updating a zone type
export const updateZoneType = createAsyncThunk(
  'zoneType/updatezoneType',
  async ({ _id, zoneTypeName, zoneTypeDescription }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/zoneType/edit`, { data: { _id, zoneTypeName, zoneTypeDescription } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Define the async thunk for deleting a zone type
export const deleteZoneType = createAsyncThunk('zoneType/deletezoneType', async (id, { rejectWithValue }) => {
  try {
    // Replace with your actual endpoint
    await axios.delete(`/zoneType?zoneTypeId=${id}`);
    return id; // Return the id for deletion
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Create the slice for zone names
const zoneTypeSlice = createSlice({
  name: 'zoneTypes',
  initialState,
  reducers: {
    reset: () => initialState, // Reset state to initial state
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllZoneTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllZoneTypes.fulfilled, (state, action) => {
        state.zoneTypes = action.payload; // Handle empty result
        state.loading = false;
      })
      .addCase(fetchAllZoneTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

// Export the reducer and actions
export const { reset, resetError } = zoneTypeSlice.actions;
export const zoneTypeReducer = zoneTypeSlice.reducer;
