import api from "@/src/lib/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    data: {
      name: string;
      email: string;
      contact_no: string;
      password: string;
      password_confirmation: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post("/register",data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
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
      const res = await api.post("/login",data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);
