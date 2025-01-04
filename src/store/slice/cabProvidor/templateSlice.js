import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'utils/axios';
import { logoutActivity } from './accountSettingSlice';
import { handleReset } from 'utils/helper';

const initialState = {
  data: null, // Empty array initially
  rosterTemplateId: null,
  metaData: {
    totalCount: 0,
    page: 1,
    limit: 10
  },
  loading: false,
  error: null
};

const API_URL = {
  ALL: '/tripData/list/roster/settings',
  CREATE: '/tripData/add/roster/setting',
  UPDATE: '/tripData/roster/setting/edit/template',
  DELETE: '/tripData/roster/setting/delete/template',
  DETAILS: '/tripData/roster/setting/view/template'
};

export const fetchAllTemplates = createAsyncThunk('templates/fetchAll', async (_, { rejectWithValue, getState }) => {
  try {
    const response = await axios.get(API_URL.ALL);
    return response?.data?.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

export const createTemplate = createAsyncThunk('templates/create', async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post(API_URL.CREATE, payload);
    return response;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

export const updateTemplate = createAsyncThunk('templates/update', async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post(API_URL.UPDATE, payload);
    return response;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

export const deleteTemplate = createAsyncThunk('templates/delete', async (id, { rejectWithValue, getState }) => {
  try {
    const state = getState();
    // const rosterTemplateId = state.template.rosterTemplateId;
    const response = await axios.put(`${API_URL.DELETE}`, null, {
      params: {
        rosterTemplateId: id
      }
    });
    return response;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

export const getTemplateDetails = createAsyncThunk('templates/details', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL.DETAILS}`, {
      params: {
        rosterTemplateId: id
      }
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    reset: () => initialState, // Reset state to initial state
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTemplates.fulfilled, (state, action) => {
        console.log(`🚀 ~ .addCase ~ action:`, action);
        const rosterTemplateId = action.payload._id;
        console.log(`🚀 ~ .addCase ~ rosterTemplateId:`, rosterTemplateId);

        state.data = action.payload.RosterTemplates || []; // Handle empty result
        state.rosterTemplateId = rosterTemplateId;
        state.loading = false;
      })
      .addCase(fetchAllTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(logoutActivity, handleReset(initialState));
  }
});

// Export the reducer and actions
export const { reset, resetError } = templateSlice.actions;
export const templateReducer = templateSlice.reducer;
