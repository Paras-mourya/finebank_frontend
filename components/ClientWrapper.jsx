"use client";

import { useEffect, useState } from "react";
import Loader from "./Loader";
import  SmoothCursor  from "./ui/smooth-cursor";

export default function ClientWrapper({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // simulate API call (replace with actual API)
        await new Promise((resolve) => setTimeout(resolve, 4000));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <SmoothCursor />
      {children}
    </>
  );
}
