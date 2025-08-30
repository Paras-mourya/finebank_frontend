"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import ClientWrapper from "@/components/ClientWrapper";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ✅ Sidebar static */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        {/* ✅ Navbar static */}
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* ✅ Sirf content area change hoga */}
        <main className="flex-1 overflow-y-auto p-6">
          <ClientWrapper>{children}</ClientWrapper>
        </main>
      </div>
    </div>
  );
}
