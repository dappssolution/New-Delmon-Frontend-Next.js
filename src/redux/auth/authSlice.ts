import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, resendVerificationEmail, fetchUserProfile } from "./authThunk";
import { getAuthToken, removeAuthToken, setAuthToken } from "@/src/utils/authCookies";
import { removeGuestId } from "@/src/utils/guestId";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  verified?: boolean | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  message: null,
  verified: null,
};



const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuth: (state) => {
      const token = getAuthToken();
      if (token) {
        state.token = token;
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.message = null;
      removeAuthToken();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.message = action.payload.message;
        setAuthToken(action.payload.token);
        removeGuestId();
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.message = action.payload.message;
        state.verified = action.payload.verified;
        setAuthToken(action.payload.token);
        removeGuestId();
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(resendVerificationEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendVerificationEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Verification email sent successfully";
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.loading = false;
        state.user = null;
      });

  },
});

export const { hydrateAuth, logout } = authSlice.actions;

export default authSlice.reducer;
