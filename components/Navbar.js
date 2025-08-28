"use client";

import { Bell, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "@/redux/slice/userSlice";
import socket from "@/utils/socket"; // ✅ helper import

const menuItems = [
  { name: "Overview", href: "/dashboard" },
  { name: "Balances", href: "/balances" },
  { name: "Transactions", href: "/transactions" },
  { name: "Bills", href: "/bills" },
  { name: "Expenses", href: "/expenses" },
  { name: "Goals", href: "/goals" },
  { name: "Settings", href: "/settings" },
];

export default function Navbar({ onToggleSidebar }) {
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.user);

  // ✅ Get profile
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  // ✅ Socket connection
  useEffect(() => {
    socket.on("notification", (data) => {
      setNotifications((prev) => [
        { ...data, time: new Date().toISOString() },
        ...prev,
      ]);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  // ✅ Search filter
  const filteredPages = useMemo(() => {
    if (!search) return [];
    return menuItems.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  // ✅ Enter to search
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredPages.length > 0) {
      router.push(filteredPages[0].href);
      setSearch("");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between">
      {/* 🔹 Left Section */}
      <div className="flex items-center gap-3">
        {/* Hamburger button (only mobile) */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Greeting (hide on mobile, show on lg+) */}
        <div className="hidden lg:flex flex-col">
          <h1 className="text-lg font-semibold text-gray-800">
            Hello {loading ? "..." : user?.name || "Guest"}
          </h1>
          <span className="text-sm text-gray-500">{today}</span>
        </div>
      </div>

      {/* 🔹 Right Section */}
      <div className="flex items-center gap-4">
        {/* Search Input (hidden on small screens, show from md+) */}
        <div className="relative  md:block">
          <input
            type="text"
            placeholder="Search pages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="rounded-lg border border-gray-300 pl-3 pr-3 py-1 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          {search && (
            <div className="absolute top-10 left-0 w-64 bg-white border rounded-lg shadow-md max-h-60 overflow-y-auto z-50">
              {filteredPages.length > 0 ? (
                filteredPages.map((page) => (
                  <div
                    key={page.href}
                    onClick={() => {
                      router.push(page.href);
                      setSearch("");
                    }}
                    className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    {page.name}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No pages found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative text-gray-500 hover:text-gray-700"
          >
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 inline-flex h-2 w-2 rounded-full bg-teal-500"></span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
              {notifications.length > 0 ? (
                notifications.map((n, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 text-sm border-b last:border-none"
                  >
                    <p className="font-medium text-gray-800">{n.message}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(n.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No new notifications
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
