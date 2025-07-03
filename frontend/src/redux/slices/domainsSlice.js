// src/redux/slices/domainSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchDomainsBySection = createAsyncThunk(
  "domains/fetchBySection",
  async (sectionName) => {
    console.log('Fetching domains for section:', sectionName);
    console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/domains?section=${sectionName}`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      console.log('Domains response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching domains:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  }
);

export const fetchAllDomains = createAsyncThunk(
  "domains/fetchAll",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/domains`
    );
    return response.data; // Assumes backend returns [{ _id, name, ... }]
  }
);

const domainSlice = createSlice({
  name: "domains",
  initialState: {
    domains: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDomainsBySection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDomainsBySection.fulfilled, (state, action) => {
        state.loading = false;
        state.domains = action.payload;
      })
      .addCase(fetchDomainsBySection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAllDomains.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDomains.fulfilled, (state, action) => {
        state.loading = false;
        state.domains = action.payload;
      })
      .addCase(fetchAllDomains.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default domainSlice.reducer;
