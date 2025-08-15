import axios from "axios";

import { createSlice, createAsyncThunk }  from "@reduxjs/toolkit";


const initialState={
 isLoading:false,
 positionList:[],
 positionDetail:null
}

export const AddPosition = createAsyncThunk('/position/create',async(position)=>{
  const response= await axios.post(`${import.meta.env.VITE_API_URL}/api/position/create`,position,{headers:{
    "Content-Type":'application/json'
  }})
  return response.data
})

export const getAllPosition = createAsyncThunk('/position/get',async()=>{
  const response= await axios.get(`${import.meta.env.VITE_API_URL}/api/position/get`)
  return response.data
})
export const getPositionById = createAsyncThunk('/position/positionId',async({positionId,userId})=>{
  const response= await axios.get(`${import.meta.env.VITE_API_URL}/api/position/${positionId}?userId=${userId}`)
  return response.data
})






const positionSlice= createSlice({
    name:'position',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(AddPosition.pending,(state)=>{
            state.isLoading=true
        }).addCase(AddPosition.fulfilled,(state)=>{
            state.isLoading=false;
        }).addCase(AddPosition.rejected,(state)=>{
            state.isLoading=false;
        }).addCase(getAllPosition.pending,(state)=>{
            state.isLoading=true
        }).addCase(getAllPosition.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.positionList=action.payload
        }).addCase(getAllPosition.rejected,(state)=>{
            state.isLoading=false;
            state.positionList=[];
        }).addCase(getPositionById.pending,(state)=>{
            state.isLoading=true
        }).addCase(getPositionById.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.positionDetail=action.payload.position
        }).addCase(getPositionById.rejected,(state)=>{
            state.isLoading=false;
            state.positionDetail=null;
        })
        
      
    }

})


export  default positionSlice.reducer