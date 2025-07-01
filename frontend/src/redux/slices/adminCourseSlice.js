import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// ✅ Fetch all admin courses
export const fetchAdminCourses = createAsyncThunk(
  "adminCourses/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        return rejectWithValue("No authentication token found. Please login.");
      }
      
      const response = await axios.get(`${API_URL}/api/admin/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        return rejectWithValue("Access denied. You need admin privileges to view this page.");
      } else if (error.response?.status === 401) {
        return rejectWithValue("Authentication failed. Please login again.");
      } else {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch courses");
      }
    }
  }
);

// ✅ Create a new course
export const createCourse = createAsyncThunk(
  "adminCourses/createCourse",
  async (courseData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        return rejectWithValue("No authentication token found. Please login.");
      }
      
      const response = await axios.post(
        `${API_URL}/api/admin/courses`,
        courseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        return rejectWithValue("Access denied. You need admin privileges to create courses.");
      } else if (error.response?.status === 401) {
        return rejectWithValue("Authentication failed. Please login again.");
      } else {
        return rejectWithValue(error.response?.data?.message || "Failed to create course");
      }
    }
  }
);

// ✅ Update a course
export const updateCourse = createAsyncThunk(
  "adminCourses/updateCourse",
  async ({ id, courseData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        return rejectWithValue("No authentication token found. Please login.");
      }
      
      const response = await axios.put(
        `${API_URL}/api/admin/courses/${id}`,
        courseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        return rejectWithValue("Access denied. You need admin privileges to update courses.");
      } else if (error.response?.status === 401) {
        return rejectWithValue("Authentication failed. Please login again.");
      } else {
        return rejectWithValue(error.response?.data?.message || "Failed to update course");
      }
    }
  }
);

// ✅ Delete a course
export const deleteCourse = createAsyncThunk(
  "adminCourses/deleteCourse",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        return rejectWithValue("No authentication token found. Please login.");
      }
      
      await axios.delete(`${API_URL}/api/admin/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error) {
      if (error.response?.status === 403) {
        return rejectWithValue("Access denied. You need admin privileges to delete courses.");
      } else if (error.response?.status === 401) {
        return rejectWithValue("Authentication failed. Please login again.");
      } else {
        return rejectWithValue(error.response?.data?.message || "Failed to delete course");
      }
    }
  }
);

// ✅ Admin Course Slice
const adminCourseSlice = createSlice({
  name: "adminCourses",
  initialState: {
    courses: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch
      .addCase(fetchAdminCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
        state.error = null;
      })
      .addCase(fetchAdminCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Create
      .addCase(createCourse.fulfilled, (state, action) => {
        state.courses.push(action.payload);
        state.error = null;
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // Update
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.courses.findIndex(
          (course) => course._id === action.payload._id
        );
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // Delete
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter(
          (course) => course._id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearError } = adminCourseSlice.actions;
export default adminCourseSlice.reducer;
