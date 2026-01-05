import { createSlice } from "@reduxjs/toolkit";
import {
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    applyCoupon,
    removeCoupon,
} from "./cartThunk";
import { Cart } from "@/src/types/cart.types";

interface CartState {
    cart: Cart | null;
    loading: boolean;
    error: string | null;
    message: string | null;
}

const initialState: CartState = {
    cart: null,
    loading: false,
    error: null,
    message: null,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        clearCartError: (state) => {
            state.error = null;
        },
        clearCartMessage: (state) => {
            state.message = null;
        },
        resetCart: (state) => {
            state.cart = null;
            state.error = null;
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Cart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Add to Cart
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && action.payload.cart_items) {
                    state.cart = action.payload;
                }
                state.message = "Item added to cart successfully";
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Update Cart Item
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.loading = false;
                if (state.cart) {
                    const itemIndex = state.cart.cart_items.findIndex(
                        (item) => item.id === action.meta.arg.itemId
                    );

                    if (itemIndex !== -1) {
                        const { qty, price, total } = action.payload as any;
                        state.cart.cart_items[itemIndex].qty = qty;
                        state.cart.cart_items[itemIndex].price = Number(price);
                        state.cart.cart_items[itemIndex].total = total;

                        // Recalculate totals
                        state.cart.cart_total = state.cart.cart_items.reduce(
                            (acc, item) => acc + item.total,
                            0
                        );
                        state.cart.cart_count = state.cart.cart_items.reduce(
                            (acc, item) => acc + item.qty,
                            0
                        );
                    }
                }
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Remove from Cart
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.message = "Item removed from cart";
                if (state.cart) {
                    const itemId = action.meta.arg;
                    state.cart.cart_items = state.cart.cart_items.filter(
                        (item) => item.id !== itemId
                    );

                    // Recalculate totals
                    state.cart.cart_total = state.cart.cart_items.reduce(
                        (acc, item) => acc + item.total,
                        0
                    );
                    state.cart.cart_count = state.cart.cart_items.reduce(
                        (acc, item) => acc + item.qty,
                        0
                    );
                }
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Apply Coupon
            .addCase(applyCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(applyCoupon.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && action.payload.cart_items) {
                    state.cart = action.payload;
                }
                state.message = "Coupon applied successfully";
            })
            .addCase(applyCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Remove Coupon
            .addCase(removeCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeCoupon.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && action.payload.cart_items) {
                    state.cart = action.payload;
                }
                state.message = "Coupon removed";
            })
            .addCase(removeCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearCartError, clearCartMessage, resetCart } = cartSlice.actions;

export default cartSlice.reducer;
