import axios from "axios";

import { createSlice, createAsyncThunk }  from "@reduxjs/toolkit";


const initialState={
 isLoading:false,
 userList:[]
}


export const getAllUser = createAsyncThunk('/user/all',async()=>{
  const response= await axios.get(`${import.meta.env.VITE_API_URL}/api/user/all`)
  return response.data
})




const userSlice= createSlice({
    name:'user',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getAllUser.pending,(state)=>{
            state.isLoading=true
        }).addCase(getAllUser.fulfilled,(state,action)=>{
            console.log(action.payload)
            state.isLoading=false;
            state.userList=action.payload;
        }).addCase(getAllUser.rejected,(state)=>{
            state.isLoading=false;
            state.userList=[];
        })
        
      
    }

})


export  default userSlice.reducer