import api from "@/src/lib/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAllSubCategories = createAsyncThunk(
  "subCategory/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/categories?limit=1000&type=sub-category");
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
