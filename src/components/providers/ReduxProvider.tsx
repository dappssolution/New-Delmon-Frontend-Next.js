"use client";

import { Provider, useDispatch } from "react-redux";
import { RootState, store } from "../../redux/store";
import { useEffect } from "react";
import { hydrateAuth } from "@/src/redux/auth/authSlice";
import { fetchCart } from "@/src/redux/cart/cartThunk";
import { fetchWishlist } from "@/src/redux/wishlist/wishlistThunk";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import { fetchUserProfile } from "@/src/redux/auth/authThunk";
import { usePathname, useRouter } from "next/navigation";

type ReduxProviderProps = {
  children: React.ReactNode;
};

function InitAuth({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state: RootState) => state.auth);
  const { profile } = useAppSelector((state: RootState) => state.user)
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!user || user.role === 'user') {
      dispatch(fetchCart());
    }
  }, [dispatch, user?.role]);

  useEffect(() => {
    if (token) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (token && user?.role === 'user') {
      dispatch(fetchWishlist());
    }
  }, [dispatch, token, user?.role]);

  useEffect(() => {
    if (user) {
      if (user.role === "vendor") {
        if (!pathname.startsWith("/vendor") && profile?.email_verified_at) {
          router.replace("/vendor");
        }
      } else if (user.role === "user" && profile?.email_verified_at) {
        if (pathname === "/login" || pathname === "/register" || pathname.startsWith("/(auth)")) {
          router.replace("/");
        }
      }
    }
  }, [user, pathname, router, profile]);

  return <>{children}</>;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>
    <InitAuth>
      {children}
    </InitAuth>
  </Provider>
}
