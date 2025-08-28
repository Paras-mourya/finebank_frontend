"use client";

import { Provider, useSelector } from "react-redux";
import store from "./store";
import Loader from "@/components/Loader"; // loader component banao

// Ye component Redux ke andar se loading state sunega
function LoaderWrapper({ children }) {
  const { loading } = useSelector((state) => state.user); // tumhare userSlice se loading aayegi

  return (
    <>
      {loading && <Loader />}
      {children}
    </>
  );
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <LoaderWrapper>{children}</LoaderWrapper>
    </Provider>
  );
}
