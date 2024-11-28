import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { USERTYPE } from 'constant';
import axios from 'utils/axios'; // Adjust the import path according to your project structure

const initialState = {
  companyReportData: null,
  cabReportData: null,
  advanceReportData: null,
  metaData: {
    totalCount: 0,
    page: 1,
    limit: 10,
    lastPageNo: 1
  },
  loading: false,
  error: null
};

export const fetchCompanyWiseReports = createAsyncThunk('reports/fetchCompanyWiseReports', async (payload, { rejectWithValue }) => {
  try {
    console.log('payload', payload);
    // await new Promise((resolve) => setTimeout(resolve, 4000));
    const response = await axios.get(`/reports/company/wise/summary`, {
      params: {
        startDate: payload?.query?.startDate,
        endDate: payload?.query?.endDate
      }
    });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

export const fetchCabWiseReports = createAsyncThunk('reports/fetchCabWiseReports', async (payload, { rejectWithValue }) => {
  try {
    console.log('payload', payload);
    // await new Promise((resolve) => setTimeout(resolve, 4000));
    const response = await axios.get(`/reports/cab/wise/summary`, {
      params: {
        startDate: payload?.query?.startDate,
        endDate: payload?.query?.endDate
      }
    });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});
export const fetchAdvanceReports = createAsyncThunk('reports/fetchAdvanceReports', async (payload, { rejectWithValue }) => {
  try {
    console.log('payload', payload);
    // await new Promise((resolve) => setTimeout(resolve, 4000));
    const response = await axios.get(`/reports/advance/summary`, {
      params: {
        startDate: payload?.query?.startDate,
        endDate: payload?.query?.endDate
      }
    });
    console.log("response.data.data",response.data.data)
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
      })
      .addCase(fetchCabWiseReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCabWiseReports.fulfilled, (state, action) => {
        state.cabReportData = action.payload || []; // Handle empty result
        state.loading = false;
      })
      .addCase(fetchCabWiseReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchAdvanceReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdvanceReports.fulfilled, (state, action) => {
        state.advanceReportData = action.payload || []; // Handle empty result
        state.loading = false;
      })
      .addCase(fetchAdvanceReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

// Export the reducer and actions
export const { reset, resetError } = reportSlice.actions;
export const reportReducer = reportSlice.reducer;
