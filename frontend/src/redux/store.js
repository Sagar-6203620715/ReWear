import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import courseReducer from "./slices/coursesSlice";
import adminReducer from "./slices/adminSlice";
import adminCourseReducer from "./slices/adminCourseSlice"

const store =configureStore({
  reducer:{
    auth: authReducer,
    courses:courseReducer,
    admin:adminReducer,
    adminCourses:adminCourseReducer,
  },
});

export default store;