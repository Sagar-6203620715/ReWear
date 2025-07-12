import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import adminReducer from "./slices/adminSlice";
import itemsReducer from "./slices/itemsSlice";
import swapsReducer from "./slices/swapsSlice";

const store =configureStore({
  reducer:{
    auth: authReducer,
    admin:adminReducer,
    items: itemsReducer,
    swaps: swapsReducer,
  },
});

export default store;