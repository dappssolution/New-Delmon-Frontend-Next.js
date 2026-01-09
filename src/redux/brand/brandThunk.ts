import { homeApi } from "@/src/service/homeApi";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";

export const fetchAllBrands = createAsyncThunk("brand/fetchAllBrands", async (_, { rejectWithValue }) => {
    try {
        const response = await homeApi.getBrands();
        return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.error || error.response?.data?.message || "Failed to fetch brands");
        return rejectWithValue(error);
    }
});