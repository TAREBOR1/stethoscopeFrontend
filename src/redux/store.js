import { configureStore } from "@reduxjs/toolkit";
import authSlice from './authSlice';
import electionSlice from './admin/electionSlice'
import positionSlice from './admin/positionSlice'
import candidateSlice from './admin/candidateSlice'
import voteSlice from './student/voteSlice'
import userSlice from './userSlice'
import resultSlice from './admin/resultSlice'




const store= configureStore({
    reducer:{
   
    auth:authSlice,
    election:electionSlice,
    position:positionSlice,
    candidate:candidateSlice,
    vote:voteSlice,
    user:userSlice,
    results:resultSlice

   

    }
})

export default store