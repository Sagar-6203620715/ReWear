import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  swaps: [],
  loading: false,
  error: null,
  pendingSwaps: 0
};

// Async thunks
export const fetchUserSwaps = createAsyncThunk(
  'swaps/fetchUserSwaps',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/swaps/user`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data.swaps;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch swaps');
    }
  }
);

export const createSwap = createAsyncThunk(
  'swaps/createSwap',
  async (swapData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/swaps`,
        swapData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      return response.data.swap;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create swap');
    }
  }
);

export const acceptSwap = createAsyncThunk(
  'swaps/acceptSwap',
  async (swapId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/swaps/${swapId}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data.swap;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to accept swap');
    }
  }
);

export const rejectSwap = createAsyncThunk(
  'swaps/rejectSwap',
  async (swapId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/swaps/${swapId}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data.swap;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject swap');
    }
  }
);

export const completeSwap = createAsyncThunk(
  'swaps/completeSwap',
  async (swapId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/swaps/${swapId}/complete`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data.swap;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to complete swap');
    }
  }
);

export const cancelSwap = createAsyncThunk(
  'swaps/cancelSwap',
  async ({ swapId, reason }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/swaps/${swapId}/cancel`,
        { reason },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data.swap;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel swap');
    }
  }
);

export const addSwapMessage = createAsyncThunk(
  'swaps/addSwapMessage',
  async ({ swapId, message }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/swaps/${swapId}/message`,
        { message },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data.swap;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add message');
    }
  }
);

const swapsSlice = createSlice({
  name: 'swaps',
  initialState,
  reducers: {
    clearSwaps: (state) => {
      state.swaps = [];
      state.pendingSwaps = 0;
    },
    updatePendingSwapsCount: (state, action) => {
      state.pendingSwaps = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user swaps
      .addCase(fetchUserSwaps.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSwaps.fulfilled, (state, action) => {
        state.loading = false;
        state.swaps = action.payload;
        state.pendingSwaps = action.payload.filter(swap => swap.status === 'pending').length;
      })
      .addCase(fetchUserSwaps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create swap
      .addCase(createSwap.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSwap.fulfilled, (state, action) => {
        state.loading = false;
        state.swaps.unshift(action.payload);
        if (action.payload.status === 'pending') {
          state.pendingSwaps += 1;
        }
      })
      .addCase(createSwap.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Accept swap
      .addCase(acceptSwap.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptSwap.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.swaps.findIndex(swap => swap._id === action.payload._id);
        if (index !== -1) {
          state.swaps[index] = action.payload;
          if (action.payload.status === 'accepted') {
            state.pendingSwaps = Math.max(0, state.pendingSwaps - 1);
          }
        }
      })
      .addCase(acceptSwap.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Reject swap
      .addCase(rejectSwap.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectSwap.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.swaps.findIndex(swap => swap._id === action.payload._id);
        if (index !== -1) {
          state.swaps[index] = action.payload;
          if (action.payload.status === 'rejected') {
            state.pendingSwaps = Math.max(0, state.pendingSwaps - 1);
          }
        }
      })
      .addCase(rejectSwap.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Complete swap
      .addCase(completeSwap.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeSwap.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.swaps.findIndex(swap => swap._id === action.payload._id);
        if (index !== -1) {
          state.swaps[index] = action.payload;
        }
      })
      .addCase(completeSwap.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Cancel swap
      .addCase(cancelSwap.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelSwap.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.swaps.findIndex(swap => swap._id === action.payload._id);
        if (index !== -1) {
          state.swaps[index] = action.payload;
          if (action.payload.status === 'cancelled') {
            state.pendingSwaps = Math.max(0, state.pendingSwaps - 1);
          }
        }
      })
      .addCase(cancelSwap.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add message
      .addCase(addSwapMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSwapMessage.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.swaps.findIndex(swap => swap._id === action.payload._id);
        if (index !== -1) {
          state.swaps[index] = action.payload;
        }
      })
      .addCase(addSwapMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSwaps, updatePendingSwapsCount } = swapsSlice.actions;
export default swapsSlice.reducer; 