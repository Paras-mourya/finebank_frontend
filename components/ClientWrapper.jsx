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
    }, 500); 

    return () => clearTimeout(timer);
  }, [pathname]);

  if (loading) {
    return (
      <div className="relative flex items-center justify-center h-[calc(100vh-4rem)]">
       
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
}
