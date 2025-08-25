"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTransactions, getSummary } from "@/redux/slice/transactionSlice";
import { getGoals } from "@/redux/slice/goalSlice";
import { getExpensesBreakdown, getExpensesComparison } from "@/redux/slice/expenseSlice";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const dispatch = useDispatch();

  // Redux data
  const { list: transactions, summary } = useSelector((s) => s.transactions);
  const { goals } = useSelector((s) => s.goals);
  const { breakdown, comparison } = useSelector((s) => s.expenses);

  const [showTargetModal, setShowTargetModal] = useState(false);
  const [targetAmount, setTargetAmount] = useState("500000");
  const [presentAmount, setPresentAmount] = useState("");
  const [filter, setFilter] = useState("all");

  // Fetch real data on mount
  useEffect(() => {
    dispatch(getTransactions());
    dispatch(getSummary());
    dispatch(getGoals());
    dispatch(getExpensesBreakdown());
    dispatch(getExpensesComparison());
  }, [dispatch]);

  // ✅ Dynamic Data
  const recentTransactions = transactions.slice(0, 5); // only latest 5
  const weeklyData = comparison || []; // API से आने वाला comparison
  const expenseCategories = breakdown || [];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-3 space-y-6">
          {/* Balance & Goals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Balance */}
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600">Total Balance</p>
                <p className="text-3xl font-bold">${summary?.totalBalance || 0}</p>
                <p className="text-sm text-gray-500 mb-4">All Accounts</p>
              </CardContent>
            </Card>

            {/* Goals */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Goals</p>
                    <p className="text-3xl font-bold">
                      ${goals.length > 0 ? goals[0].targetAmount : 0}
                    </p>
                    <p className="text-sm text-gray-500">Active Goal</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTargetModal(true)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Target vs Achievement (Dynamic)
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Transactions + Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transactions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <div className="flex space-x-3 text-sm font-medium">
                  <button
                    className={`${filter === "all" ? "text-teal-600" : "text-gray-500"}`}
                    onClick={() => setFilter("all")}
                  >
                    All
                  </button>
                  <button
                    className={`${filter === "revenue" ? "text-teal-600" : "text-gray-500"}`}
                    onClick={() => setFilter("revenue")}
                  >
                    Revenue
                  </button>
                  <button
                    className={`${filter === "expenses" ? "text-teal-600" : "text-gray-500"}`}
                    onClick={() => setFilter("expenses")}
                  >
                    Expenses
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                {recentTransactions
                  .filter((t) => {
                    if (filter === "all") return true;
                    if (filter === "revenue") return t.type === "income"; // revenue == income
                    if (filter === "expenses") return t.type === "expense";
                  })
                  .map((t) => (
                    <div
                      key={t._id}
                      className="flex justify-between items-center border-b py-2"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">💵</span>
                        <div>
                          <p className="font-medium">{t.title}</p>
                          <p className="text-xs text-gray-500">{t.shop}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-medium ${
                            t.type === "income" ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {t.type === "income" ? "+" : "-"}${t.amount}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(t.date).toDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Bar dataKey="thisMonth" fill="#10b981" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="lastMonth" fill="#d1d5db" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Expense Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Expenses Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {expenseCategories.map((c, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Home className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">{c.category}</p>
                        <p className="font-semibold">${c.total}</p>
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

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bills</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-sm">Coming soon (no API yet)</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Target Modal */}
      {showTargetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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
  );
}
