import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { openSnackbar } from 'store/reducers/snackbar';
import axios from 'utils/axios';
// Define the async thunk for fetching companies
export const fetchCompanies = createAsyncThunk('companies/fetchCompanies', async ({ page, limit }, { rejectWithValue }) => {
  try {
    // Replace with your actual endpoint
    const response = await axios.get(`/company?page=${page}&limit=${limit}`);
    return response.data.data; // This should match the shape of the data you expect
  } catch (error) {
    // Return a rejected value with error details
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Define the async thunk for fetching companies by company id
export const fetchCompaniesDetails = createAsyncThunk('companies/fetchCompaniesDetails', async (id, { rejectWithValue }) => {
  try {
    // Send a GET request to fetch details of a specific company by companyId
    const response = await axios.get(`/company/by?companyId=${id}`);
    return response.data.data; // Ensure this matches the shape of the data you expect
  } catch (error) {
    // Return a rejected value with error details
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Define the async thunk for adding a company
export const addCompany = createAsyncThunk('companies/addCompany', async (company, { rejectWithValue, dispatch }) => {
  try {
    const response = await axios.post('/company', company);

    if (response.status === 201) {
      // Dispatch success snackbar
      dispatch(
        openSnackbar({
          open: true,
          message: response.data.message,
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true
        })
      );
    }

    return response.data;
  } catch (error) {
    // Dispatch error snackbar
    dispatch(
      openSnackbar({
        open: true,
        message: error?.response?.data?.message || 'Something went wrong',
        variant: 'alert',
        alert: {
          color: 'error'
        },
        close: true
      })
    );

    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Define the async thunk for adding a branch
export const addBranch = createAsyncThunk('companies/addBranch', async (company, { rejectWithValue, dispatch }) => {
  try {
    const response = await axios.post('/companyBranch/add', company);

    if (response.status === 201) {
      // Dispatch success snackbar
      dispatch(
        openSnackbar({
          open: true,
          message: response.data.message,
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true
        })
      );
    }

    return response.data;
  } catch (error) {
    // Dispatch error snackbar
    dispatch(
      openSnackbar({
        open: true,
        message: error?.response?.data?.message || 'Something went wrong',
        variant: 'alert',
        alert: {
          color: 'error'
        },
        close: true
      })
    );

    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Define the async thunk for updating a company
export const updateCompany = createAsyncThunk('companies/updateCompany', async ({ id, updatedData }, { rejectWithValue }) => {
  try {
    // Make sure to replace the URL with your actual endpoint
    const response = await axios.put(`/api/companies/${id}`, updatedData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Define the async thunk for deleting a company
export const deleteCompany = createAsyncThunk('companies/deleteCompany', async (id, { rejectWithValue }) => {
  try {
    // Make sure to replace the URL with your actual endpoint
    await axios.delete(`/api/companies/${id}`);
    return id; // Return the id for deletion
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Get all the assigned vendors on a company
export const fetchCompaniesAssignedVendors = createAsyncThunk(
  'companies/fetchCompaniesAssignedVendors',
  async (id, { rejectWithValue }) => {
    try {
      // Send a GET request to fetch details of a specific company by companyId
      const response = await axios.get(`/company/vendors?companyID=${id}`);
      return response.data.data; // Ensure this matches the shape of the data you expect
    } catch (error) {
      // Return a rejected value with error details
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Get all the assigned drivers on a company
export const fetchCompaniesAssignedDrivers = createAsyncThunk(
  'companies/fetchCompaniesAssignedDrivers',
  async (id, { rejectWithValue }) => {
    try {
      // Send a GET request to fetch details of a specific company by companyId
      const response = await axios.get(`/company/drivers?companyID=${id}`);
      return response.data.data; // Ensure this matches the shape of the data you expect
    } catch (error) {
      // Return a rejected value with error details
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

const initialState = {
  companies: [], // Empty array initially
  companyDetails: null,
  companiesVendor: [],
  companiesDriver: [],
  metaData: {
    totalCount: 0,
    page: 1,
    limit: 10
  },
  loading: false,
  error: null
};

const companySlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    reset: () => initialState, // Reset state to initial state on logout
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.companies = action.payload.result || []; // Handle empty result
        state.metaData = {
          totalCount: action.payload.totalCount || 0,
          page: action.payload.page || 1,
          limit: action.payload.limit || 10
        };
        state.loading = false;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchCompaniesDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompaniesDetails.fulfilled, (state, action) => {
        state.companyDetails = action.payload || null; // Handle empty result
        state.loading = false;
      })
      .addCase(fetchCompaniesDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(addCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCompany.fulfilled, (state, action) => {
        state.companies.push(action.payload);
        state.loading = false;
      })
      .addCase(addCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(addBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBranch.fulfilled, (state, action) => {
        state.companies.push(action.payload);
        state.loading = false;
      })
      .addCase(addBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        const index = state.companies.findIndex((company) => company._id === action.payload._id);
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.companies = state.companies.filter((company) => company._id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchCompaniesAssignedVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompaniesAssignedVendors.fulfilled, (state, action) => {
        state.companiesVendor = action.payload || null; // Handle empty result
        state.loading = false;
      })
      .addCase(fetchCompaniesAssignedVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchCompaniesAssignedDrivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompaniesAssignedDrivers.fulfilled, (state, action) => {
        state.companiesDriver = action.payload || null; // Handle empty result
        state.loading = false;
      })
      .addCase(fetchCompaniesAssignedDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

// Export the reducer and actions
export const { reset, resetError } = companySlice.actions;
export const companyReducer = companySlice.reducer;
