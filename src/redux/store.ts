import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./products/slice";
import authSlice from "./auth/authSlice";
import userSlice from "./user/userSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    product: productSlice,
    user: userSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
