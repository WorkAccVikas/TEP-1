import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { USERTYPE } from 'constant';
import axios from 'utils/axios'; // Adjust the import path according to your project structure

const initialState = {
  companyReportData: null,
  metaData: {
    totalCount: 0,
    page: 1,
    limit: 10,
    lastPageNo: 1
  },
  loading: false,
  error: null
};

export const fetchCompanyWiseReports = createAsyncThunk('reports/fetchAllReports', async (payload, { rejectWithValue }) => {
  try {
    // await new Promise((resolve) => setTimeout(resolve, 4000));
    const response = await axios.get(`/reports/company/wise/summary`, {
      params: {
        startDate: payload?.startDate,
        endDate: payload?.endDate
      }
    });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    reset: () => initialState, // Reset state to initial state on logout
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyWiseReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyWiseReports.fulfilled, (state, action) => {
        state.companyReportData = action.payload || []; // Handle empty result
        state.loading = false;
      })
      .addCase(fetchCompanyWiseReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

// Export the reducer and actions
export const { reset, resetError } = reportSlice.actions;
export const reportReducer = reportSlice.reducer;
