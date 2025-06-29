// src/redux/slices/domainSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchDomainsBySection = createAsyncThunk(
  "domains/fetchBySection",
  async (sectionName) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/domains?section=${sectionName}`
    );
    return response.data; // Assumes backend returns [{ name: "Web Dev" }, { name: "DSA" }]
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
      });
  },
});

export default domainSlice.reducer;
