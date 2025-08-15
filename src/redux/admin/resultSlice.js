
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


 const initialState= {
    loading: false,
    results: null,
  }

export const getResultsByPosition = createAsyncThunk(
  "results/getByPosition",
  async (positionId) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/results/${positionId}`);
    return res.data;
  }
);

const resultSlice = createSlice({
  name: "results",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getResultsByPosition.pending, (state) => {
        state.loading = true;
      })
      .addCase(getResultsByPosition.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(getResultsByPosition.rejected, (state) => {
        state.loading = false;
        state.results = [];
      });
  },
});

export default resultSlice.reducer;
