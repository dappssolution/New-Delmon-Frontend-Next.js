import { createAsyncThunk } from "@reduxjs/toolkit";
import { cartApi, AddToCartPayload } from "@/src/service/cartApi";

/**
 * Fetch the current cart
 */
export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (_, { rejectWithValue }) => {
        try {
            return await cartApi.getCart();
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch cart"
            );
        }
    }
);

/**
 * Add a product to cart
 */
export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async (
        { productId, payload }: { productId: number; payload?: AddToCartPayload },
        { rejectWithValue }
    ) => {
        try {
            const data = await cartApi.addToCart(productId, payload);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add to cart"
            );
        }
    }
);

/**
 * Update cart item quantity
 */
export const updateCartItem = createAsyncThunk(
    "cart/updateCartItem",
    async (
        { itemId, quantity }: { itemId: number; quantity: number },
        { rejectWithValue }
    ) => {
        try {
            const data = await cartApi.updateCartItem(itemId, quantity);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update cart item"
            );
        }
    }
);

/**
 * Remove an item from cart
 */
export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (itemId: number, { rejectWithValue }) => {
        try {
            const data = await cartApi.removeFromCart(itemId);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to remove from cart"
            );
        }
    }
);

/**
 * Apply a coupon code
 */
export const applyCoupon = createAsyncThunk(
    "cart/applyCoupon",
    async (code: string, { rejectWithValue }) => {
        try {
            const response = await cartApi.applyCoupon(code);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to apply coupon"
            );
        }
    }
);

/**
 * Remove applied coupon
 */
export const removeCoupon = createAsyncThunk(
    "cart/removeCoupon",
    async (_, { rejectWithValue }) => {
        try {
            const data = await cartApi.removeCoupon();
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to remove coupon"
            );
        }
    }
);
