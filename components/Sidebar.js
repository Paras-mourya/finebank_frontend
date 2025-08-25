"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import {
  LayoutDashboard,
  CreditCard,
  Receipt,
  FileText,
  PieChart,
  Target,
  Settings,
  LogOut,
} from "lucide-react"
import { getProfile, logoutSuccess } from "@/redux/slice/userSlice"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"  // ✅ Avatar import

const menuItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Balances", href: "/balances", icon: CreditCard },
  { name: "Transactions", href: "/transactions", icon: Receipt },
  { name: "Bills", href: "/bills", icon: FileText },
  { name: "Expenses", href: "/expenses", icon: PieChart },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(getProfile())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logoutSuccess())
    router.push("/auth/login")
  }

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-center border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">
          Xpense<span className="text-teal-400">Trakr</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-teal-600 text-white"
                  : "hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>

      {/* User Profile (bottom) */}
      {user && (
        <Link
          href="/profile"
          className="p-4 border-t border-gray-700 flex items-center space-x-3 hover:bg-gray-800 transition"
        >
          <Avatar className="h-9 w-9 border border-gray-600">
            <AvatarImage src={user.avatar?.secure_url} alt={user.name} />
            <AvatarFallback className="bg-teal-600 text-white font-medium">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-400">View Profile</p>
          </div>
        </Link>
      )}
    </aside>
  )
}
