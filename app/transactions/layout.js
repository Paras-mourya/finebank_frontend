"use client"

import Sidebar from "@/components/Sidebar"
import Navbar from "@/components/Navbar"
import { useState, useEffect } from "react"

export default function TransactionsLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // ✅ By default: mobile -> sidebar hidden, desktop -> sidebar open
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false) // mobile
      } else {
        setIsSidebarOpen(true) // desktop
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        {/* Navbar with toggle button */}
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
