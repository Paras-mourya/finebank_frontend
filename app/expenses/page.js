"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getExpensesComparison,
  getExpensesBreakdown,
} from "@/redux/slice/expenseSlice";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function ExpensesPage() {
  const dispatch = useDispatch();
  const { comparison, breakdown, loading } = useSelector(
    (state) => state.expenses
  );

  useEffect(() => {
    dispatch(getExpensesComparison());
    dispatch(getExpensesBreakdown());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Expenses</h2>

      {/* Expenses Comparison Chart */}
      <Card className="mb-8 shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">
            Expenses Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="thisMonth" fill="#14b8a6" name="This Year" />
              <Bar dataKey="lastMonth" fill="#d1d5db" name="Last Year" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Expenses Breakdown */}
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Expenses Breakdown
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          breakdown.map((cat) => (
            <Card
              key={cat.category}
              className="shadow-md rounded-2xl hover:shadow-xl transition"
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{cat.category}</span>
                  <span className="text-xl font-bold text-gray-800">
                    ${cat.total}
                  </span>
                </CardTitle>
                <p className="text-xs text-gray-400">
                  Compare to last month
                </p>
              </CardHeader>
              <CardContent>
                {cat.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between text-sm text-gray-600 border-b py-1"
                  >
                    <span>{item.title}</span>
                    <span>${item.amount}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
