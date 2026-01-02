import api from "@/src/lib/axios";
import { GetCategoryResponse } from "@/src/types/vendor.types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAllCategory = createAsyncThunk(
  "category/fetchAllCategory",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<GetCategoryResponse>("/categories?limit=1000");
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
