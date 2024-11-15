import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'utils/axios'; // Adjust the import path according to your project structure
import { commonInitialState, commonReducers } from 'store/slice/common';

// Define the async thunk for fetching drivers
export const fetchDrivers = createAsyncThunk(
  'drivers/fetchDrivers',
  async ({ page = 1, limit = 10, driverType = 1, vendorID = null }, { rejectWithValue }) => {
    try {
      // Replace with your actual endpoint
      const queryParams = {
        drivertype: driverType,
        page,
        limit,
        ...(vendorID && { vendorId: vendorID })
      };
      const response = await axios.get(`/driver/list`, { params: queryParams });
      return response.data.data; // This should match the shape of the data you expect
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Define the async thunk for adding a driver
export const addDriver = createAsyncThunk('drivers/addDriver', async (driver, { rejectWithValue }) => {
  try {
    // Replace with your actual endpoint
    const response = await axios.post('/drivers', driver);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Define the async thunk for updating a driver
export const updateDriver = createAsyncThunk('drivers/updateDriver', async ({ id, updatedData }, { rejectWithValue }) => {
  try {
    // Replace with your actual endpoint
    const response = await axios.put(`/drivers/${id}`, updatedData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Define the async thunk for deleting a driver
export const deleteDriver = createAsyncThunk('drivers/deleteDriver', async (id, { rejectWithValue }) => {
  try {
    // Replace with your actual endpoint
    await axios.delete(`/drivers/${id}`);
    return id; // Return the id for deletion
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// register driver
export const registerDriver = createAsyncThunk('drivers/register', async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post(`/driver/register`, payload);
    return { status: response.status };
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// fetch all Drivers without pagination
export const fetchAllDrivers = createAsyncThunk('drivers/fetchAllDrivers', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/driver/all/system?cabProviderId=${id}`);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

const initialState = {
  ...commonInitialState,
  drivers: [], // Empty array initially
  allDrivers: [],
  metaData: {
    totalCount: 0,
    page: 1,
    limit: 10,
    lastPageNo: 1
  },
  loading: false,
  error: null
};

const driverSlice = createSlice({
  name: 'drivers',
  initialState,
  reducers: {
    ...commonReducers,
    reset: () => initialState, // Reset state to initial state on logout
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.drivers = action.payload.result || []; // Handle empty result
        state.metaData = {
          totalCount: action.payload.total || 0,
          page: action.payload.page || 1,
          limit: action.payload.limit || 10,
          lastPageNo: Math.ceil(action.payload.total / action.payload.limit) || 1
        };
        state.loading = false;
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(addDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDriver.fulfilled, (state, action) => {
        state.drivers.push(action.payload);
        state.loading = false;
      })
      .addCase(addDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDriver.fulfilled, (state, action) => {
        const index = state.drivers.findIndex((driver) => driver._id === action.payload._id);
        if (index !== -1) {
          state.drivers[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDriver.fulfilled, (state, action) => {
        state.drivers = state.drivers.filter((driver) => driver._id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchAllDrivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDrivers.fulfilled, (state, action) => {
        state.allDrivers = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

// Export the reducer and actions
export const { reset, resetError, handleOpen, handleClose } = driverSlice.actions;
export const driverReducer = driverSlice.reducer;
