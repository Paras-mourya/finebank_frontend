"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
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
  const { expenses, comparison, breakdown, loading } = useSelector(
    (state) => state.expenses
  );

  const [formData, setFormData] = useState({ title: "", amount: "", category: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(getExpenses());
    dispatch(getExpensesComparison());
    dispatch(getExpensesBreakdown());
  }, [dispatch]);

  // ✅ handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title.trim(),
      amount: Number(formData.amount),
      category: formData.category.trim(),
    };

    if (!payload.title || !payload.amount || !payload.category) return;

    if (editingId) {
      dispatch(updateExpense({ id: editingId, updatedData: payload }));
    } else {
      dispatch(createExpense(payload));
    }

    setFormData({ title: "", amount: "", category: "" });
    setEditingId(null);

    dispatch(getExpensesComparison());
    dispatch(getExpensesBreakdown());
  };

  // ✅ handle edit
  const handleEdit = (exp) => {
    setFormData({
      title: exp.title,
      amount: exp.amount,
      category: exp.category,
    });
    setEditingId(exp._id);
  };

  // ✅ handle delete
  const handleDelete = (id) => {
    dispatch(deleteExpense(id)).then(() => {
      dispatch(getExpensesComparison());
      dispatch(getExpensesBreakdown());
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Expenses</h2>

      {/* ✅ Expense Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-4 mb-6 space-y-3"
      >
        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
        </div>
        <Button type="submit" className="bg-teal-600 text-white">
          {editingId ? "Update Expense" : "Add Expense"}
        </Button>
      </form>

      {/* ✅ Expenses Table */}
      <div className="bg-white rounded-xl shadow p-4 mb-8">
        <h3 className="text-md font-semibold text-gray-700 mb-4">All Expenses</h3>
        {loading ? (
          <p className="text-center py-6">Loading...</p>
        ) : expenses.length === 0 ? (
          <p className="text-center py-6 text-gray-500">No expenses found</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-500 text-sm border-b">
                <th className="pb-2">Title</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr
                  key={exp._id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="py-3">{exp.title}</td>
                  <td className="py-3">{exp.category}</td>
                  <td className="py-3 font-semibold text-gray-800">
                    ₹{exp.amount}
                  </td>
                  <td className="py-3 text-center space-x-3">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exp._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ Comparison Chart */}
      <div className="bg-white rounded-xl shadow p-4 mb-8">
        <h3 className="text-md font-semibold text-gray-700 mb-4">
          Expenses Comparison
        </h3>
        <div className="h-80">
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
        </div>
      </div>

      {/* ✅ Breakdown Section */}
      <h3 className="text-md font-semibold text-gray-700 mb-4">
        Expenses Breakdown
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-center py-6">Loading...</p>
        ) : (
          breakdown.map((cat) => (
            <div
              key={cat.category}
              className="bg-white shadow rounded-xl p-4 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-700">
                  {cat.category}
                </span>
                <span className="text-lg font-bold text-gray-900">
                  ₹{cat.total}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-2">
                Compare to last month
              </p>
              <div className="space-y-1">
                {cat.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between text-sm text-gray-600 border-b py-1"
                  >
                    <span>{item.title}</span>
                    <span>₹{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
