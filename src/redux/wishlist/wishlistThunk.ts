import { createAsyncThunk } from "@reduxjs/toolkit";
import { wishlistApi } from "@/src/service/wishlistApi";

export const fetchWishlist = createAsyncThunk(
    "wishlist/fetchWishlist",
    async (_, { rejectWithValue }) => {
        try {
            const data = await wishlistApi.getWishlist();
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || error.response?.data?.message || "Failed to fetch wishlist"
            );
        }
    }
);

export const addToWishlist = createAsyncThunk(
    "wishlist/addToWishlist",
    async (productId: number, { rejectWithValue }) => {
        try {
            const data = await wishlistApi.addToWishlist(productId);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || error.response?.data?.message || "Failed to add to wishlist"
            );
        }
    }
);

export const removeFromWishlist = createAsyncThunk(
    "wishlist/removeFromWishlist",
    async (productId: number, { rejectWithValue }) => {
        try {
            await wishlistApi.removeFromWishlist(productId);
            return productId;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || error.response?.data?.message || "Failed to remove from wishlist"
            );
        }
    }
);
