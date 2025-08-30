"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Loader from "./Loader";

export default function ClientWrapper({ children }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // smoother UX

    return () => clearTimeout(timer);
  }, [pathname]);

  if (loading) {
    return (
      <div className="relative flex items-center justify-center h-[calc(100vh-4rem)]">
        {/* 4rem = Navbar ki height */}
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
}
