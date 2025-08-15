import axios from "axios";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  votingList: [],
};

export const castVote = createAsyncThunk("/vote/cast", async (votePayload) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/vote/cast`,
    votePayload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
});
export const getVoteByStudent = createAsyncThunk(
  "/vote/getVoteByStudent",
  async (studentId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/vote/getVoteByStudent/${studentId}`
    );
    return response.data;
  }
);
export const getAllVotes = createAsyncThunk("/vote/all", async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/vote/all`
  );
  return response.data;
});

const voteSlice = createSlice({
  name: "vote",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(castVote.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(castVote.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(castVote.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getVoteByStudent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getVoteByStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.votingList = action.payload;
      })
      .addCase(getVoteByStudent.rejected, (state) => {
        state.isLoading = false;
        state.votingList = [];
      })
      .addCase(getAllVotes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllVotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.votingList = action.payload;
      })
      .addCase(getAllVotes.rejected, (state) => {
        state.isLoading = false;
        state.votingList = [];
      });
  },
});

export default voteSlice.reducer;
