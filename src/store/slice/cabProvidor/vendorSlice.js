import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'utils/axios';

// Define the async thunk for fetching vendors
export const fetchVendors = createAsyncThunk('vendors/fetchVendors', async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`vendor/list?page=${page}&limit=${limit}`);
    return response.data.data; // Ensure the API response is in this format
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// fetch all vendors without pagination
export const fetchAllVendors = createAsyncThunk('vendors/fetchAllVendors', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/vendor/names');
    return response.data.data; // Ensure the API response is in this format
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Define the async thunk for adding a vendor
export const addVendor = createAsyncThunk('vendors/addVendor', async (vendor, { rejectWithValue }) => {
  try {
    const response = await axios.post('/vendor', vendor); // Replace with your actual endpoint
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Define the async thunk for updating a vendor
export const updateVendor = createAsyncThunk('vendors/updateVendor', async ({ id, updatedData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/vendor/${id}`, updatedData); // Replace with your actual endpoint
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Define the async thunk for deleting a vendor
export const deleteVendor = createAsyncThunk('vendors/deleteVendor', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/vendor/${id}`); // Replace with your actual endpoint
    return id; // Return the id for deletion
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// add specific details of vendor
export const addSpecialDetails = createAsyncThunk('vendors/addSpecialDetails', async (specialDetails, { rejectWithValue }) => {
  try {
    const response = await axios.post('/vendor/add/details', specialDetails); // Replace with your actual endpoint
    return response;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

const initialState = {
  vendors: [],
  allVendors: [],
  metaData: {
    totalCount: 0,
    page: 1,
    limit: 10,
    lastPageNo: 1
  },
  loading: false,
  error: null
};

const vendorSlice = createSlice({
  name: 'vendors',
  initialState,
  reducers: {
    reset: () => initialState, // Reset state to initial state on logout
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.vendors = action.payload.results || [];
        state.metaData = {
          totalCount: action.payload.totalCount || 0,
          page: action.payload.page || 1,
          limit: action.payload.limit || 10,
          lastPageNo: Math.ceil(action.payload.totalCount / action.payload.limit) || 1
        };
        state.loading = false;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchAllVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVendors.fulfilled, (state, action) => {
        state.allVendors = action.payload || [];
        state.loading = false;
      })
      .addCase(fetchAllVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(addVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addVendor.fulfilled, (state, action) => {
        state.vendors.push(action.payload);
        state.loading = false;
      })
      .addCase(addVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVendor.fulfilled, (state, action) => {
        const index = state.vendors.findIndex((vendor) => vendor._id === action.payload._id);
        if (index !== -1) {
          state.vendors[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVendor.fulfilled, (state, action) => {
        state.vendors = state.vendors.filter((vendor) => vendor._id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

export const { reset, resetError } = vendorSlice.actions;
export const vendorReducer = vendorSlice.reducer;
