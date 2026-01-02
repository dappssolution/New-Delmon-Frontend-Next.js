import { createSlice } from "@reduxjs/toolkit";
import { fetchAllSubCategories } from "./subcategoryThunk";

interface SubCategoryState {
  subCategories: any[];
  loading: boolean;
  error: string | null;
}

const initialState: SubCategoryState = {
  subCategories: [],
  loading: false,
  error: null,
};

const subCategorySlice = createSlice({
  name: "subCategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSubCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllSubCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategories = action.payload?.data || [];
      })
      .addCase(fetchAllSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch sub categories";
      });
  },
});

export default subCategorySlice.reducer;
