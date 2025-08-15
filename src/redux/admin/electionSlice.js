import axios from "axios";

import { createSlice, createAsyncThunk }  from "@reduxjs/toolkit";


const initialState={
 isLoading:false,
 electionList:[]
}

export const AddElection = createAsyncThunk('/election/create',async(election)=>{
  const response= await axios.post(`${import.meta.env.VITE_API_URL}/api/election/create`,election,{headers:{
    "Content-Type":'application/json'
  }})
  return response.data
})
export const getElection = createAsyncThunk('/election/get',async()=>{
  const response= await axios.get(`${import.meta.env.VITE_API_URL}/api/election/get`)
  return response.data
})




const electionSlice= createSlice({
    name:'election',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(AddElection.pending,(state)=>{
            state.isLoading=true
        }).addCase(AddElection.fulfilled,(state,action)=>{
            console.log(action.payload)
            state.isLoading=false;
            state.electionList=action.payload;
        }).addCase(AddElection.rejected,(state)=>{
            state.isLoading=false;
            state.electionList=[];
        }).addCase(getElection.pending,(state)=>{
            state.isLoading=true
        }).addCase(getElection.fulfilled,(state,action)=>{
            console.log(action.payload)
            state.isLoading=false;
            state.electionList=action.payload;
        }).addCase(getElection.rejected,(state)=>{
            state.isLoading=false;
            state.electionList=[];
        })
        
      
    }

})


export  default electionSlice.reducer