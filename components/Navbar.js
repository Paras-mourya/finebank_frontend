"use client";

import { Bell, Menu, Sun, Moon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "@/redux/slice/userSlice";
import socket from "@/utils/socket"; // ✅ helper import

const menuItems = [
  { name: "Overview", href: "/dashboard/overview" },
  { name: "Balances", href: "/dashboard/balances" },
  { name: "Transactions", href: "/dashboard/transactions" },
  { name: "Bills", href: "/dashboard/bills" },
  { name: "Expenses", href: "/dashboard/expenses" },
  { name: "Goals", href: "/dashboard/goals" },
  { name: "Settings", href: "/dashboard/settings" },
];

export default function Navbar({ onToggleSidebar }) {
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [theme, setTheme] = useState("light");
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.user);

  
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  
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

  
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredPages.length > 0) {
      router.push(filteredPages[0].href);
      setSearch("");
    }
  };

  
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-3 flex items-center justify-between">
      
      <div className="flex items-center gap-3">

        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className="h-6 w-6" />
        </button>

       
        <div className="hidden lg:flex flex-col">
         
          <span className="text-sm text-gray-600 dark:text-gray-200">{today}</span>
        </div>
      </div>

      
      <div className="flex items-center gap-4">
        
        <div className="relative  md:block">
          <input
            type="text"
            placeholder="Search pages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="rounded-lg border border-gray-300 dark:border-gray-900 bg-white dark:bg-gray-800 pl-3 pr-3 py-1 text-sm w-64 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          {search && (
            <div className="absolute top-10 left-0 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-md max-h-60 overflow-y-auto z-50">
              {filteredPages.length > 0 ? (
                filteredPages.map((page) => (
                  <div
                    key={page.href}
                    onClick={() => {
                      router.push(page.href);
                      setSearch("");
                    }}
                    className="px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {page.name}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                  No pages found
                </div>
              )}
            </div>
          )}
        </div>

       

       
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
          >
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 inline-flex h-2 w-2 rounded-full bg-teal-500"></span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
              {notifications.length > 0 ? (
                notifications.map((n, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 text-sm border-b border-gray-200 dark:border-gray-600 last:border-none"
                  >
                    <p className="font-medium text-gray-800 dark:text-gray-100">{n.message}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(n.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
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
