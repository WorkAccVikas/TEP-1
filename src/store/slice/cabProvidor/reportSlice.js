import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { USERTYPE } from 'constant';
import axios from 'utils/axios'; // Adjust the import path according to your project structure
import { logoutActivity } from './accountSettingSlice';
import { handleReset } from 'utils/helper';

const initialState = {
  companyReportData: null,
  companyReportDriverData: null,
  cabReportData: null,
  monthlyReportData: null,
  advanceReportData: null,
  driverAdvanceReportData: null,
  metaData: {
    totalCount: 0,
    page: 1,
    limit: 10,
    lastPageNo: 1
  },
  loading: false,
  error: null
};

const API_URL = {
  [USERTYPE.iscabProvider]: {
    COMPANY_WISE_REPORTS: '/reports/company/wise/summary',
    CAB_WISE_REPORTS: '/reports/cab/wise/summary',
    ADVANCE_REPORTS: '/reports/advance/summary'
  },
  [USERTYPE.isVendor]: {
    COMPANY_WISE_REPORTS: '/reports/company/wise/summary/vendor',
    CAB_WISE_REPORTS: '/reports/cab/wise/summary/vendor',
    ADVANCE_REPORTS: '/reports/advance/summary/vendor'
  }
};

export const fetchCompanyWiseReports = createAsyncThunk(
  'reports/fetchCompanyWiseReports',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const userType = state.auth.userType;
      const response = await axios.post(API_URL[userType].COMPANY_WISE_REPORTS, {
        data: {
          startDate: payload?.data?.startDate,
          endDate: payload?.data?.endDate,
          companyIDs: payload?.data?.companyId || [],
          vendorIds: payload?.data?.vendorIds || [],
          driverIds: payload?.data?.driverIds || []
        }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

//Companywise reports for drivers at CP level
export const fetchCompanyWiseReportsDriver = createAsyncThunk(
  'reports/fetchCompanyWiseReportsDriver',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post('/reports/company/wise/summary/driver', {
        data: {
          startDate: payload?.data?.startDate,
          endDate: payload?.data?.endDate,
          companyIDs: payload?.data?.companyId || []
        }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const fetchCabWiseReports = createAsyncThunk('reports/fetchCabWiseReports', async (payload, { rejectWithValue, getState }) => {
  try {
    const state = getState();
    const userType = state.auth.userType;
    // await new Promise((resolve) => setTimeout(resolve, 4000));
    const response = await axios.post(API_URL[userType].CAB_WISE_REPORTS, payload);

    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

export const fetchDriverMonthlyReports = createAsyncThunk(
  'reports/fetchDriverMonthlyReports',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const response = await axios.post('/reports/driver/monthly', payload);
      console.log('res', response);

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const fetchAdvanceReports = createAsyncThunk('reports/fetchAdvanceReports', async (payload, { rejectWithValue, getState }) => {
  try {
    const state = getState();
    const userType = state.auth.userType;
    // await new Promise((resolve) => setTimeout(resolve, 4000));
    const response = await axios.post(API_URL[userType].ADVANCE_REPORTS, payload);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

//Driver Advance Report
export const fetchDriverAdvanceReports = createAsyncThunk(
  'reports/fetchDriverAdvanceReports',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const response = await axios.post('/reports/advance/summary/driver', payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

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
      .addCase(fetchCompanyWiseReportsDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyWiseReportsDriver.fulfilled, (state, action) => {
        state.companyReportDriverData = action.payload || []; // Handle empty result
        state.loading = false;
      })
      .addCase(fetchCompanyWiseReportsDriver.rejected, (state, action) => {
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
      .addCase(fetchDriverMonthlyReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriverMonthlyReports.fulfilled, (state, action) => {
        state.monthlyReportData = action.payload || []; // Handle empty result
        state.loading = false;
      })
      .addCase(fetchDriverMonthlyReports.rejected, (state, action) => {
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
      })
      .addCase(fetchDriverAdvanceReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriverAdvanceReports.fulfilled, (state, action) => {
        state.driverAdvanceReportData = action.payload || []; // Handle empty result
        state.loading = false;
      })
      .addCase(fetchDriverAdvanceReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(logoutActivity, handleReset(initialState));
  }
});

// Export the reducer and actions
export const { reset, resetError } = reportSlice.actions;
export const reportReducer = reportSlice.reducer;
