import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;



const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user:  null,
  token: null,
  error: null,
  otpSent: false,
  successMessage: null,
};

// Register
export const registerUser = createAsyncThunk("auth/register", async (formData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API_URL}/register`, formData, { withCredentials: true });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Registration failed");
  }
});

// Request OTP
export const requestOtp = createAsyncThunk("auth/requestOtp", async (email, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API_URL}/request-otp`, { email });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to send OTP");
  }
});

// Verify OTP
export const verifyOtp = createAsyncThunk("auth/verifyOtp", async ({ email, otp }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API_URL}/verify-otp`, { email, otp });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "OTP verification failed");
  }
});

// Logout
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  const response = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
  return response.data;
});

// Check Auth
export const checkAuth = createAsyncThunk("auth/checkAuth", async (token, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_URL}/check-auth`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-store,no-cache,must-revalidate,proxy-revalidate',
      },
    });
    return data;
  } catch (err) {
    return rejectWithValue("Authorization failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetTokenAndCredential: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = null;
      state.successMessage = null;
      state.otpSent = false;
    },
  },
  extraReducers: (builder) => {
    builder

      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Request OTP
      .addCase(requestOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.otpSent = false;
      })
      .addCase(requestOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpSent = true;
        state.successMessage = action.payload.message;
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.otpSent = false;
        state.error = action.payload;
      })

      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        sessionStorage.setItem("token", JSON.stringify(action.payload.token));
        sessionStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = action.payload;
      })

      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
         state.user=action.payload.success? action.payload.user : null,
        state.isAuthenticated=action.payload.success? true : false
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
        sessionStorage.removeItem("token");
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
      });
  },
});

export const { resetTokenAndCredential } = authSlice.actions;

export default authSlice.reducer;
