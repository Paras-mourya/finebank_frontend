"use client";

import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "@/redux/slice/userSlice";

export default function Navbar() {
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  
  const { user, loading } = useSelector((state) => state.user);

  
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold text-gray-800">
          Hello {loading ? "..." : user?.name || "Guest"}
        </h1>
        <span className="text-sm text-gray-500">{today}</span>
      </div>

      <div className="flex items-center gap-4">
    
        <div className="relative">
          <input
            type="text"
            placeholder="Search here"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-gray-300 pl-3 pr-3 py-1 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

      
        <button className="relative text-gray-500 hover:text-gray-700">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 inline-flex h-2 w-2 rounded-full bg-teal-500"></span>
        </button>
      </div>
    </header>
  );
}
