import { homeApi } from "@/src/service/homeApi";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const fetchAllBrands = createAsyncThunk("brand/fetchAllBrands", async (_, { rejectWithValue }) => {
    try {
        const response = await homeApi.getBrands();
        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});