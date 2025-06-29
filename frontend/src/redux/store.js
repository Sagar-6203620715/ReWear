import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import courseReducer from "./slices/coursesSlice";
import adminReducer from "./slices/adminSlice";
import adminCourseReducer from "./slices/adminCourseSlice"
import domainReducer from "./slices/domainsSlice";
import sectionsReducer from "./slices/sectionsSlice";

const store =configureStore({
  reducer:{
    auth: authReducer,
    courses:courseReducer,
    domains: domainReducer,
    sections: sectionsReducer,
    admin:adminReducer,
    adminCourses:adminCourseReducer,
  },
});

export default store;