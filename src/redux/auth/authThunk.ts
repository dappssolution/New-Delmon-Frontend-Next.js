import api from "@/src/lib/axios";
import { LoginResponse, RegisterResponse } from "@/src/types/auth.types";
import { GetProfileResponse } from "@/src/types/user.types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserProfile } from "@/src/service/userApi";
import { toast } from "sonner";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    data: {
      name: string;
      email: string;
      contact_no: string;
      password: string;
      password_confirmation: string;
      role?: string;
      username?: string;
      vendor_join?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post<RegisterResponse>("/register", data);
      return res.data;
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.response?.data?.message || "Registration failed");
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    data: {
      email: string;
      password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post<LoginResponse>("/login", data);
      return res.data;
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.response?.data?.message || "Login failed");
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || "Login failed");
    }
  }
);

export const resendVerificationEmail = createAsyncThunk(
  "auth/resendVerificationEmail",
  async (token: string, { rejectWithValue }) => {
    try {
      const res = await api.post("/email/resend", { token });
      return res.data;
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.response?.data?.message || "Failed to resend verification email");
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || "Failed to resend verification email");
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserProfile();
      return res.data;
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.response?.data?.message || "Failed to fetch user profile");
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || "Failed to fetch user profile");
    }
  }
);
