import axios from "axios";

import { createSlice, createAsyncThunk }  from "@reduxjs/toolkit";


const initialState={
 isLoading:false,
 candidateList:[]
}

export const AddCandidate = createAsyncThunk('/candidate/create',async(formData)=>{
  const response= await axios.post(`${import.meta.env.VITE_API_URL}/api/candidate/create`,formData,{headers:{
    "Content-Type":'application/json'
  }})
  return response.data
})

export const getCandidate = createAsyncThunk('/candidate/get',async()=>{
  const response= await axios.get(`${import.meta.env.VITE_API_URL}/api/candidate/allCandidate`)
  return response.data
})




const candidateSlice= createSlice({
    name:'candidate',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(AddCandidate.pending,(state)=>{
            state.isLoading=true
        }).addCase(AddCandidate.fulfilled,(state,action)=>{
            state.isLoading=false;
         state.candidateList=action.payload
        }).addCase(AddCandidate.rejected,(state)=>{
            state.isLoading=false;
            state.candidateList=[]
        }).addCase(getCandidate.pending,(state)=>{
            state.isLoading=true
        }).addCase(getCandidate.fulfilled,(state,action)=>{
            state.isLoading=false;
             state.candidateList=action.payload
        }).addCase(getCandidate.rejected,(state)=>{
            state.isLoading=false;
            state.candidateList=[];
        })
        
      
    }

})


export  default candidateSlice.reducer