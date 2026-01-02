import { createSlice } from "@reduxjs/toolkit";
import { fetchAllBrands } from "./brandThunk";
import { Brand } from "@/src/types/home.types";


interface BrandState {
    brands: Brand[];
    loading: boolean;
    error: string | null;
}


export const brandSlice = createSlice({
    name: "brand",
    initialState: {
        brands: [],
        loading: false,
        error: null,
    } as BrandState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllBrands.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchAllBrands.fulfilled, (state, action) => {
            state.loading = false;
            state.brands = action.payload.brands;
        });
        builder.addCase(fetchAllBrands.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Failed to fetch brands";
        });
    },
});

export default brandSlice.reducer;
