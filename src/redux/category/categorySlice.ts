import { createSlice } from "@reduxjs/toolkit";
import { fetchAllCategory } from "./categoryThunk";
import { CategoryData } from "@/src/types/vendor.types";


interface CategoryState {
    categories: CategoryData[];
    loading: boolean;
    error: string | null;
}


export const categorySlice = createSlice({
    name: "category",
    initialState: {
        categories: [],
        loading: false,
        error: null
    } as CategoryState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllCategory.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchAllCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.categories = action.payload?.data || [];
        })
        builder.addCase(fetchAllCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Something went wrong";
        })
    }
})

export default categorySlice.reducer
