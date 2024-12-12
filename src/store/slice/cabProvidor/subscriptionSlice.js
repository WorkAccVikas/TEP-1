import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'utils/axios'; 

const initialState = {
  settings: null,
  loading: false,
  error: null,
  userId : null
};

export const fetchSubscription = createAsyncThunk('subscription/fetchSubscription', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/subscriptionPlan');
    console.log('response', response);
    return response.data;

  } catch (error) {
    console.log('Error fetching account settings:', error);
  }
});

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    addUserId: (value)=> {
        state.userId = value
    },
    reset: () => initialState, // Reset state to initial state on logout
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        console.log("action.payload",action.payload);

        state.subscription = action.payload || null; // Handle empty result
     
        state.loading = false;
      })
      .addCase(fetchSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

export const { reset, resetError } = subscriptionSlice.actions;
export const subscriptionReducer = subscriptionSlice.reducer;
