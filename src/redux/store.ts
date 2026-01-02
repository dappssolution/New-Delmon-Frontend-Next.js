import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./products/slice";
import authSlice from "./auth/authSlice";
import userSlice from "./user/userSlice";
import cartSlice from "./cart/cartSlice";
import wishlistSlice from "./wishlist/wishlistSlice";
import brandSlice from "./brand/brandSlice";
import categorySlice from "./category/categorySlice";
import subCategorySlice from "./subCategory/subcategorySlice";
import vendorSlice from "./vendor/vendorSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    product: productSlice,
    user: userSlice,
    cart: cartSlice,
    wishlist: wishlistSlice,
    brand: brandSlice,
    category: categorySlice,
    subCategory: subCategorySlice,
    vendor: vendorSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
