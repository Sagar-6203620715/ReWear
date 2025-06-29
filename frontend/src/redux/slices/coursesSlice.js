import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCoursesByFilters=createAsyncThunk(
  "courses/fetchByFilters",
  async({
    sortBy,
  })=>{
    const query =new URLSearchParams();
    if(sortBy) query.append("sortBy",sortBy);

    const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/courses?${query.toString()}`);
    return response.data;
  }
);

export const fetchCourseDetails=createAsyncThunk(
  "courses/fetchCourseDetails",
  async (id)=>{
    const response=await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/courses/${id}`
    );
    return response.data;
  }
);

export const updateCourse=createAsyncThunk(
  "courses/updateCourse",
  async ({id,courseData})=>{
    const response=await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/courses/${id}`,
      courseData,
      {
        headers:{
          Authorization:`Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data;
  }
);

const coursesSlice=createSlice({
  name:"courses",
  initialState:{
    courses:[],
    selectedCourse:null,
    loading:false,
    error:null,
    filters:{
      sortBy:"",
    },
  },
  reducers:{
    setFilters:(state,action)=>{
      state.filters={...state.filters,...action.payload};
    },
    clearfilters:(state)=>{
      state.filters={
        sortBy:"",
      };
    },
  },
  extraReducers:(builder)=>{
    builder
    .addCase(fetchCoursesByFilters.pending,(state)=>{
      state.loading=true;
      state.error=null;
    })
    .addCase(fetchCoursesByFilters.fulfilled,(state,action)=>{
      state.loading=false;
      state.courses=Array.isArray(action.payload)?action.payload:[];
    })
    .addCase(fetchCoursesByFilters.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.error.message;
    })
    .addCase(fetchCourseDetails.pending,(state)=>{
      state.loading=true;
      state.error=null;
    })
    .addCase(fetchCourseDetails.fulfilled,(state,action)=>{
      state.loading=false;
      state.selectedCourse=action.payload;
    })
    .addCase(fetchCourseDetails.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.error.message;
    })
    .addCase(updateCourse.pending,(state)=>{
      state.loading=true;
      state.error=null;
    })
    .addCase(updateCourse.fulfilled,(state,action)=>{
      state.loading=false;
      const updateCourse=action.payload;
      const index=state.courses.findIndex(
        (course)=>course._id===updateCourse._id
      );
      if(index !==-1){
        state.courses[index]=updateCourse;
      }
    })
    .addCase(updateCourse.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.error.message;
    });
  },
});

export const {setFilters,clearfilters}=coursesSlice.actions;
export default coursesSlice.reducer;