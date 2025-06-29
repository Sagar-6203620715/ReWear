import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Correct API constants
const API_URL = import.meta.env.VITE_BACKEND_URL;
const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`;

// ✅ Fetch all admin courses
export const fetchAdminCourses = createAsyncThunk(
  "adminCourses/fetchCourses",
  async () => {
    const response = await axios.get(`${API_URL}/api/admin/courses`, {
      headers: {
        Authorization: USER_TOKEN,
      },
    });
    return response.data;
  }
);

// ✅ Create a new course
export const createCourse = createAsyncThunk(
  "adminCourses/createCourse",
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/admin/courses`,
        courseData,
        {
          headers: {
            Authorization: USER_TOKEN,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ✅ Update a course
export const updateCourse = createAsyncThunk(
  "adminCourses/updateCourse",
  async ({ id, courseData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/admin/courses/${id}`,
        courseData,
        {
          headers: {
            Authorization: USER_TOKEN,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ✅ Delete a course
export const deleteCourse = createAsyncThunk(
  "adminCourses/deleteCourse",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/admin/courses/${id}`, {
        headers: {
          Authorization: USER_TOKEN,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
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
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch
      .addCase(fetchAdminCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchAdminCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create
      
      .addCase(createCourse.fulfilled, (state, action) => {
        state.courses.push(action.payload);
      })
      

      // Update
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.courses.findIndex(
          (course) => course._id === action.payload._id
        );
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
      })

      // Delete
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter(
          (course) => course._id !== action.payload
        );
      });
  },
});

export default adminCourseSlice.reducer;
