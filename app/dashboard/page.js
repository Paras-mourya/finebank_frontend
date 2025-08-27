"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  getTransactions,
  getSummary,
} from "@/redux/slice/transactionSlice"
import { getBills } from "@/redux/slice/billSlice"
import { getExpensesBreakdown } from "@/redux/slice/expenseSlice"
import { getAccounts } from "@/redux/slice/accountSlice"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  TrendingUp,
  TrendingDown,
  X,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

export default function DashboardPage() {
  const dispatch = useDispatch()

  // Redux states
  const { list: transactions, loading: txLoading } = useSelector((s) => s.transactions)
  const { bills } = useSelector((s) => s.bills)
  const { breakdown } = useSelector((s) => s.expenses)
  const { accounts } = useSelector((s) => s.accounts)
  const { goals } = useSelector((s) => s.goals)

  // Local states
  const [showTargetModal, setShowTargetModal] = useState(false)
  const [targetAmount, setTargetAmount] = useState("500000")
  const [presentAmount, setPresentAmount] = useState("")
  const [filter, setFilter] = useState("all")

  // ✅ Static weekly data
  const weeklyData = [
    { day: "Sun", thisWeek: 180, lastWeek: 120 },
    { day: "Mon", thisWeek: 220, lastWeek: 180 },
    { day: "Tue", thisWeek: 150, lastWeek: 200 },
    { day: "Wed", thisWeek: 280, lastWeek: 160 },
    { day: "Thu", thisWeek: 320, lastWeek: 240 },
    { day: "Fri", thisWeek: 380, lastWeek: 280 },
    { day: "Sat", thisWeek: 300, lastWeek: 220 },
  ]

  // Load data on mount
  useEffect(() => {
    dispatch(getTransactions())
    dispatch(getSummary())
    dispatch(getBills())
    dispatch(getExpensesBreakdown())
    dispatch(getAccounts())
  }, [dispatch])

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Left Section */}
        <div className="lg:col-span-3 space-y-6">

          {/* ✅ Balance + Goals row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* ✅ Total Balance */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <p className="text-sm text-gray-600">Total Balance</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  ${accounts.reduce((acc, a) => acc + (a.balance || 0), 0)}
                </p>
                <p className="text-sm text-gray-500 mb-4">All Accounts</p>

                <div className="space-y-3">
                  {accounts.map((a) => (
                    <div
                      key={a._id}
                      className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-4 text-white"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                        <div>
                          <p className="text-sm opacity-90">Account Type</p>
                          <p className="font-semibold">{a.name}</p>
                          {a.last4 && (
                            <p className="text-sm opacity-90">
                              •••• •••• •••• {a.last4}
                            </p>
                          )}
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-lg sm:text-xl font-bold">${a.balance}</p>
                          <div className="flex space-x-2 mt-1 justify-start sm:justify-end">
                            <div className="w-8 h-5 bg-red-500 rounded-sm"></div>
                            <div className="w-8 h-5 bg-yellow-400 rounded-sm"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ✅ Single Goal */}
            <Card>
              <CardHeader>
                <CardTitle>Goal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {goals.length === 0 ? (
                  <p className="text-gray-500 text-sm">No goals added yet.</p>
                ) : (
                  <div className="p-3 border rounded-lg">
                    <p className="font-semibold">{goals[0].title}</p>
                    <p className="text-sm text-gray-500">
                      {goals[0].currentAmount} / {goals[0].targetAmount}
                    </p>
                    <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                      <div
                        className="bg-teal-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            (goals[0].currentAmount / goals[0].targetAmount) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ✅ Transactions + Weekly Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transactions */}
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <CardTitle>Recent Transactions</CardTitle>
                <div className="flex space-x-3 text-sm font-medium">
                  {["all", "revenue", "expenses"].map((f) => (
                    <button
                      key={f}
                      className={`${filter === f ? "text-teal-600" : "text-gray-500"}`}
                      onClick={() => setFilter(f)}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                {txLoading ? (
                  <p>Loading...</p>
                ) : (
                  transactions
                    .filter((t) => {
                      if (filter === "all") return true
                      if (filter === "revenue") return t.type === "income"
                      if (filter === "expenses") return t.type === "expense"
                    })
                    .slice(0, 6)
                    .map((t) => (
                      <div
                        key={t._id}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b py-2"
                      >
                        <div>
                          <p className="font-medium">{t.name}</p>
                          <p className="text-xs text-gray-500">{t.category}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p
                            className={`font-medium ${
                              t.type === "income"
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {t.type === "income" ? "+" : "-"}${t.amount}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(t.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                )}
              </CardContent>
            </Card>

            {/* ✅ Weekly Stats (Static Data) */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" fontSize={12} />
                    <YAxis fontSize={12} />
                    <ReTooltip
                      cursor={{ fill: "rgba(0,0,0,0.05)" }}
                      contentStyle={{ fontSize: "12px", borderRadius: "8px" }}
                    />
                    <Bar dataKey="thisWeek" fill="#10b981" radius={[4, 4, 0, 0]} name="This Week" />
                    <Bar dataKey="lastWeek" fill="#d1d5db" radius={[4, 4, 0, 0]} name="Last Week" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* ✅ Expense Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Expenses Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {breakdown.map((c, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm text-gray-600">{c.category}</p>
                      <p className="font-semibold">${c.total}</p>
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

        {/* ✅ Right Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bills</CardTitle>
            </CardHeader>
            <CardContent>
              {bills.map((b) => (
                <div
                  key={b._id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b py-3"
                >
                  <div>
                    <p className="font-medium">{b.name}</p>
                    <p className="text-xs text-gray-500">{b.description}</p>
                  </div>
                  <p className="font-bold">${b.amount}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ✅ Goal Modal */}
      {showTargetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Update Goal</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTargetModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <Input
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="Target Amount"
              />
              <Input
                value={presentAmount}
                onChange={(e) => setPresentAmount(e.target.value)}
                placeholder="Present Amount"
              />
              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
