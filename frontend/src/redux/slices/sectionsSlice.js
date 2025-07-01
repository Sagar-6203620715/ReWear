// redux/slices/sectionsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSections = createAsyncThunk(
  "sections/fetchAll",
  async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/sections`);
    return res.data;
  }
);

export const createSection = createAsyncThunk(
  "sections/create",
  async (sectionData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/sections`,
        sectionData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateSection = createAsyncThunk(
  "sections/update",
  async ({ id, sectionData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/sections/${id}`,
        sectionData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteSection = createAsyncThunk(
  "sections/delete",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/sections/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const sectionsSlice = createSlice({
  name: "sections",
  initialState: {
    sections: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSections.fulfilled, (state, action) => {
        state.loading = false;
        state.sections = action.payload;
      })
      .addCase(fetchSections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createSection.fulfilled, (state, action) => {
        state.sections.push(action.payload);
      })
      .addCase(updateSection.fulfilled, (state, action) => {
        const idx = state.sections.findIndex(s => s._id === action.payload._id);
        if (idx !== -1) state.sections[idx] = action.payload;
      })
      .addCase(deleteSection.fulfilled, (state, action) => {
        state.sections = state.sections.filter(s => s._id !== action.payload);
      });
  },
});

export default sectionsSlice.reducer;
