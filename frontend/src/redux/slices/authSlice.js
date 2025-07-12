import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

const userFromStorage = (() => {
  try {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error("Error parsing user info from localStorage:", error);
    localStorage.removeItem("userInfo"); // Clear corrupted data
    return null;
  }
})();

const initialGuestId = localStorage.getItem("guestId")||`guest_${new Date().getTime()}`;
localStorage.setItem("guestId",initialGuestId);

const initialState={
  user:userFromStorage,
  guestId:initialGuestId,
  loading:false,
  error:null,
};

export const loginUser =createAsyncThunk("auth/loginUser",async (userData,{rejectWithValue})=>{
  try{
    const response=await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,userData
    );
    console.log("Login Response:", response.data);
    localStorage.setItem("userInfo",JSON.stringify(response.data.user));
    localStorage.setItem("userToken",response.data.token);
    console.log("Saved user:", localStorage.getItem("userInfo"));
    console.log("Saved token:", localStorage.getItem("userToken"));
    return response.data.user;
    
  }catch(error){
    return rejectWithValue(error.response.data);
  }
});


export const registerUser =createAsyncThunk("auth/registerUser",async (userData,{rejectWithValue})=>{
  try{
    const response=await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,userData
    );
    
    localStorage.setItem("userInfo",JSON.stringify(response.data.user));
    localStorage.setItem("userToken",response.data.token);
    return response.data.user;
    
  }catch(error){
    return rejectWithValue(error.response.data);
  }
});

export const fetchCurrentUser = createAsyncThunk("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("userToken");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    localStorage.setItem("userInfo", JSON.stringify(response.data.user));
    return response.data.user;
    
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});


const authSlice=createSlice({
  name:"auth",
  initialState,
  reducers:{
    logout:(state)=>{
      state.user=null;
      state.guestId=`guest_${new Date().getTime()}`;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      localStorage.setItem("guestId",state.guestId);
    },
    generateNewGuestId:(state)=>{
      state.guestId=`guest_${new Date().getTime()}`;
      localStorage.setItem("guestId",state.guestId);
    },
  },
  extraReducers:(builder)=>{
    builder
    .addCase(loginUser.pending,(state)=>{
      state.loading=true;
      state.error=null;
    })
    .addCase(loginUser.fulfilled,(state,action)=>{
      state.loading=false;
      state.user=action.payload;
    })
    .addCase(loginUser.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.payload.message;
    })
    .addCase(registerUser.pending,(state)=>{
      state.loading=true;
      state.error=null;
    })
    .addCase(registerUser.fulfilled,(state,action)=>{
      state.loading=false;
      state.user=action.payload;
    })
    .addCase(registerUser.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.payload.message;
    })
    .addCase(fetchCurrentUser.pending,(state)=>{
      state.loading=true;
      state.error=null;
    })
    .addCase(fetchCurrentUser.fulfilled,(state,action)=>{
      state.loading=false;
      state.user=action.payload;
    })
    .addCase(fetchCurrentUser.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.payload.message;
    })
  }
});


export const {logout,generateNewGuestId}=authSlice.actions;
export default authSlice.reducer;