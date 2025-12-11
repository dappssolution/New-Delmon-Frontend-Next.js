"use client";

import { Provider, useDispatch } from "react-redux";
import { store } from "../../redux/store";
import { useEffect } from "react";
import { hydrateAuth } from "@/src/redux/auth/authSlice";

type ReduxProviderProps = {
  children: React.ReactNode;
};

function InitAuth({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  return <>{children}</>;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>
    <InitAuth>
    {children}  
    </InitAuth>
    </Provider>
}
