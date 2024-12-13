import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'utils/axios';

const initialState = {
  subscriptionPlan: null,
  metaData: {
    totalCount: 0,
    page: 1,
    limit: 10,
    lastPageNo: 1
  },
  loading: false,
  error: null
};

export const fetchsubscriptionPlan = createAsyncThunk('subscription/fetchsubscriptionPlan', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/subscriptionPlan');
    console.log('response', response);

    return response?.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    reset: () => initialState,
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchsubscriptionPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchsubscriptionPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptionPlan = action.payload;
      })
      .addCase(fetchsubscriptionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { reset, resetError } = subscriptionSlice.actions;
export const subscriptionReducer = subscriptionSlice.reducer;
