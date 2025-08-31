"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  getTransactions,
  getSummary,
} from "@/redux/slice/transactionSlice"
import { getBills } from "@/redux/slice/billSlice"
import {
  getExpensesBreakdown,
  getExpensesComparison,
} from "@/redux/slice/expenseSlice"
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
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"

export default function DashboardPage() {
  const dispatch = useDispatch()

 
  const { list: transactions, loading: txLoading } = useSelector((s) => s.transactions)
  const { bills } = useSelector((s) => s.bills)
  const { breakdown, comparison, loading } = useSelector((s) => s.expenses)
  const { accounts } = useSelector((s) => s.accounts)
  const { goals } = useSelector((s) => s.goals)

  
  const [showTargetModal, setShowTargetModal] = useState(false)
  const [targetAmount, setTargetAmount] = useState("500000")
  const [presentAmount, setPresentAmount] = useState("")
  const [filter, setFilter] = useState("all")
  const [weeklyData, setWeeklyData] = useState([])

  
  useEffect(() => {
    dispatch(getTransactions())
    dispatch(getSummary())
    dispatch(getBills())
    dispatch(getExpensesBreakdown())
    dispatch(getAccounts())
    dispatch(getExpensesComparison("weekly"))
  }, [dispatch])

  
  useEffect(() => {
    if (comparison.length > 0) {
      const lastTwo = comparison.slice(-2)
      const lastWeek = lastTwo[0]?.days || []
      const thisWeek = lastTwo[1]?.days || []

      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

      const formatted = days.map((day, i) => ({
        day,
        thisWeek: thisWeek[i]?.total || 0,
        lastWeek: lastWeek[i]?.total || 0,
      }))

      setWeeklyData(formatted)
    }
  }, [comparison])

  return (
    <div className="flex-1 overflow-y-auto rounded-lg p-4 sm:p-6 bg-white dark:bg-gray-900 ">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

       
        <div className="lg:col-span-3 space-y-6">

         
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            
            <Card className="bg-card text-card-foreground shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  ₹{accounts.reduce((acc, a) => acc + (a.balance || 0), 0)}
                </p>
                <p className="text-sm text-muted-foreground mb-4">All Accounts</p>

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
                          <p className="text-lg sm:text-xl font-bold">₹{a.balance}</p>
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

            
            <Card className="bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {goals.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No goals added yet.</p>
                ) : (
                  goals.slice(0, 3).map((goal) => (
                    <div
                      key={goal._id}
                      className="p-3 border rounded-lg shadow-sm hover:shadow-md transition"
                    >
                      <p className="font-semibold">{goal.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {goal.currentAmount} / {goal.targetAmount}
                      </p>
                      <div className="w-full bg-muted h-2 rounded-full mt-2">
                        <div
                          className="bg-teal-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              (goal.currentAmount / goal.targetAmount) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

         
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
           
            <Card className="bg-card text-card-foreground">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <CardTitle>Recent Transactions</CardTitle>
                <div className="flex space-x-3 text-sm font-medium">
                  {["all", "revenue", "expenses"].map((f) => (
                    <button
                      key={f}
                      className={`${filter === f ? "text-teal-600" : "text-muted-foreground"}`}
                      onClick={() => setFilter(f)}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                {txLoading ? (
                  <p className="text-muted-foreground">Loading...</p>
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
                          <p className="text-xs text-muted-foreground">{t.category}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p
                            className={`font-medium ${
                              t.type === "income"
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {t.type === "income" ? "+" : "-"}₹{t.amount}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(t.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                )}
              </CardContent>
            </Card>

         
            <Card className="bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>Weekly Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground">Loading...</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="thisWeek" fill="#10b981" name="This Week" />
                      <Bar dataKey="lastWeek" fill="#d1d5db" name="Last Week" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

         
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle>Expenses Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {breakdown.map((c, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-4 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="text-sm text-muted-foreground">{c.category}</p>
                      <p className="font-semibold">₹{c.total}</p>
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
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle>Upcoming Bills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {bills.length === 0 ? (
                <p className="text-muted-foreground text-sm">No upcoming bills.</p>
              ) : (
                bills.map((bill) => (
                  <div
                    key={bill._id}
                    className="flex items-center justify-between border-b py-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={bill.logo?.secure_url || "/default-logo.png"}
                        alt={bill.vendor || "Bill Logo"}
                        className="h-10 w-10 rounded-md object-cover border"
                      />
                      <div className="flex flex-col">
                        <p className="text-xs text-muted-foreground">{bill.description}</p>
                      </div>
                    </div>
                    <p className="font-bold text-sm">₹{bill.amount}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

       
        {showTargetModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-card text-card-foreground p-6 rounded-lg w-full max-w-md shadow-lg">
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
    </div>
  )
}
