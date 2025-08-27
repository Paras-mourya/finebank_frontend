"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Edit,
  Home,
  Car,
  ShoppingBag,
  Utensils,
  Gamepad2,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  X,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"


const weeklyData = [
  { day: "Sun", thisWeek: 180, lastWeek: 120 },
  { day: "Mon", thisWeek: 220, lastWeek: 180 },
  { day: "Tue", thisWeek: 150, lastWeek: 200 },
  { day: "Wed", thisWeek: 280, lastWeek: 160 },
  { day: "Thu", thisWeek: 320, lastWeek: 240 },
  { day: "Fri", thisWeek: 380, lastWeek: 280 },
  { day: "Sat", thisWeek: 300, lastWeek: 220 },
]

const expenseCategories = [
  { name: "Housing", amount: 250.0, percentage: "12%", icon: Home, color: "#10b981" },
  { name: "Food", amount: 350.0, percentage: "08%", icon: Utensils, color: "#f59e0b" },
  { name: "Transportation", amount: 50.0, percentage: "12%", icon: Car, color: "#3b82f6" },
  { name: "Entertainment", amount: 80.0, percentage: "15%", icon: Gamepad2, color: "#8b5cf6" },
  { name: "Shopping", amount: 420.0, percentage: "25%", icon: ShoppingBag, color: "#ef4444" },
  { name: "Others", amount: 650.0, percentage: "23%", icon: MoreHorizontal, color: "#6b7280" },
]


const recentTransactions = [
  { id: 1, name: "GTR 5", category: "Gadget & Gear", amount: 160.0, date: "17 May 2025", icon: "🎮", type: "expense" },
  { id: 2, name: "Polo Shirt", category: "XL fashions", amount: 20.0, date: "17 May 2025", icon: "👕", type: "expense" },
  { id: 3, name: "Biriyani", category: "Hajir Biriyani", amount: 10.0, date: "17 May 2025", icon: "🍛", type: "expense" },
  { id: 4, name: "Taxi Fare", category: "Uber", amount: 12.0, date: "17 May 2025", icon: "🚗", type: "expense" },
  { id: 5, name: "Keyboard", category: "Gadget & Gear", amount: 22.0, date: "17 May 2025", icon: "⌨️", type: "expense" },
  { id: 6, name: "Salary", category: "Company Inc.", amount: 2000.0, date: "15 May 2025", icon: "💵", type: "revenue" },
]

const upcomingBills = [
  { id: 1, name: "Figma", description: "Figma - Monthly", amount: 150, date: "15", month: "May", lastCharge: "14 May, 2022", logo: "🎨" },
  { id: 2, name: "Adobe", description: "Adobe - Yearly", amount: 559, date: "16", month: "Jun", lastCharge: "17 Jun, 2023", logo: "🔴" },
]

export default function DashboardPage() {
  const [showTargetModal, setShowTargetModal] = useState(false)
  const [targetAmount, setTargetAmount] = useState("500000")
  const [presentAmount, setPresentAmount] = useState("")
  const [filter, setFilter] = useState("all") 

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <div className="lg:col-span-3 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600">Total Balance</p>
                <p className="text-3xl font-bold">$240,399</p>
                <p className="text-sm text-gray-500 mb-4">All Accounts</p>

                <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-4 text-white">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm opacity-90">Account Type</p>
                      <p className="font-semibold">Credit Card</p>
                      <p className="text-sm opacity-90">•••• •••• •••• 2598</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">$25,000</p>
                      <div className="flex space-x-2 mt-1">
                        <div className="w-8 h-5 bg-red-500 rounded-sm"></div>
                        <div className="w-8 h-5 bg-yellow-400 rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

           
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Goals</p>
                    <p className="text-3xl font-bold">$20,000</p>
                    <p className="text-sm text-gray-500">May, 2025</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowTargetModal(true)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">Target vs Achievement</p>
              </CardContent>
            </Card>
          </div>

        
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <div className="flex space-x-3 text-sm font-medium">
                  <button className={`${filter === "all" ? "text-teal-600" : "text-gray-500"}`} onClick={() => setFilter("all")}>All</button>
                  <button className={`${filter === "revenue" ? "text-teal-600" : "text-gray-500"}`} onClick={() => setFilter("revenue")}>Revenue</button>
                  <button className={`${filter === "expenses" ? "text-teal-600" : "text-gray-500"}`} onClick={() => setFilter("expenses")}>Expenses</button>
                </div>
              </CardHeader>
              <CardContent>
                {recentTransactions
                  .filter((t) => {
                    if (filter === "all") return true
                    if (filter === "revenue") return t.type === "revenue"
                    if (filter === "expenses") return t.type === "expense"
                  })
                  .map((t) => (
                    <div key={t.id} className="flex justify-between items-center border-b py-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{t.icon}</span>
                        <div>
                          <p className="font-medium">{t.name}</p>
                          <p className="text-xs text-gray-500">{t.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${t.type === "revenue" ? "text-green-600" : "text-red-500"}`}>
                          {t.type === "revenue" ? "+" : "-"}${t.amount}
                        </p>
                        <p className="text-xs text-gray-500">{t.date}</p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

           
            <Card>
              <CardHeader>
                <CardTitle>Weekly Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Bar dataKey="thisWeek" fill="#10b981" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="lastWeek" fill="#d1d5db" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          
          <Card>
            <CardHeader>
              <CardTitle>Expenses Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {expenseCategories.map((c, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <c.icon className="h-5 w-5" style={{ color: c.color }} />
                      <div>
                        <p className="text-sm text-gray-600">{c.name}</p>
                        <p className="font-semibold">${c.amount}</p>
                      </div>
                    </div>
                    {i % 2 === 0 ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bills</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingBills.map((b) => (
                <div key={b.id} className="flex justify-between items-center border-b py-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{b.logo}</span>
                    <div>
                      <p className="font-medium">{b.name}</p>
                      <p className="text-xs text-gray-500">{b.description}</p>
                      <p className="text-xs text-gray-400">Last Charge: {b.lastCharge}</p>
                    </div>
                  </div>
                  <p className="font-bold">${b.amount}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      
      {showTargetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Update Goal</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowTargetModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <Input value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="Target Amount" />
              <Input value={presentAmount} onChange={(e) => setPresentAmount(e.target.value)} placeholder="Present Amount" />
              <Button className="w-full bg-teal-600 hover:bg-teal-700">Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
