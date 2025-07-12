import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



// Async thunk to fetch items from API
export const fetchItems = createAsyncThunk(
  "items/fetchItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000'}/api/items`);
      return response.data.items || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch items");
    }
  }
);

// Async thunk to fetch items by category
export const fetchItemsByCategory = createAsyncThunk(
  "items/fetchItemsByCategory",
  async (category, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000'}/api/items?category=${category}`);
      return response.data.items || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch items");
    }
  }
);

// Async thunk to create a new item
export const createItem = createAsyncThunk(
  "items/createItem",
  async (itemData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000'}/api/items`, itemData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.item;
    } catch (error) {
      console.error('Error in createItem thunk:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Failed to create item");
    }
  }
);

const itemsSlice = createSlice({
  name: "items",
  initialState: {
    items: [],
    loading: false,
    error: null,
    filters: {
      category: "",
      size: "",
      condition: "",
      sortBy: "newest"
    }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: "",
        size: "",
        condition: "",
        sortBy: "newest"
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchItemsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItemsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItemsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload); // Add new item to the beginning
      })
      .addCase(createItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, clearFilters } = itemsSlice.actions;
export default itemsSlice.reducer; 