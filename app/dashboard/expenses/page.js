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
import { toast } from "sonner";

export default function ExpensesPage() {
  const dispatch = useDispatch();
  const { comparison, breakdown, loading } = useSelector(
    (state) => state.expenses
  );

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
  });
  const [editingId, setEditingId] = useState(null);

  
  const [filter, setFilter] = useState("monthly");

  
  useEffect(() => {
    dispatch(getExpenses());
    dispatch(getExpensesComparison(filter));
    dispatch(getExpensesBreakdown());
  }, [dispatch, filter]);

 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.amount || !formData.category) {
      toast.error("please fill all the fields");
      return;
    }

    try {
      const payload = {
        title: formData.title.trim(),
        amount: Number(formData.amount),
        category: formData.category.trim(),
      };

      if (editingId) {
        await dispatch(
          updateExpense({ id: editingId, updatedData: payload })
        ).unwrap();
        toast.success("Expense updated successfully");
      } else {
        await dispatch(createExpense(payload)).unwrap();
        toast.success("Expense created successfully");
      }
    } catch (error) {
      toast.error("something went wrong");
    }

    setFormData({ title: "", amount: "", category: "" });
    setEditingId(null);
    setShowForm(false);

    dispatch(getExpensesComparison(filter));
    dispatch(getExpensesBreakdown());
  };

  
  const handleEdit = (exp) => {
    setFormData({
      title: exp.title,
      amount: exp.amount,
      category: exp.category,
    });
    setEditingId(exp._id);
    setShowForm(true);
  };


  const handleDelete = (id) => {
    dispatch(deleteExpense(id)).then(() => {
      dispatch(getExpensesComparison(filter));
      dispatch(getExpensesBreakdown());
    });
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-6 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Expenses
        </h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
          }}
          className="bg-[#299D91] text-white px-4 py-2 rounded hover:bg-[#2f6b65]"
        >
          {showForm ? "Close Form" : "Add Expense"}
        </button>
      </div>

     
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-xl shadow p-4 space-y-3 transition-colors"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              required
              className="border p-2 rounded bg-gray-50 dark:bg-gray-900 dark:text-gray-100"
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="border p-2 rounded bg-gray-50 dark:bg-gray-900 dark:text-gray-100"
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              required
              className="border p-2 rounded bg-gray-50 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>
          <Button type="submit" className="bg-teal-600 text-white w-full">
            {editingId ? "Update Expense" : "Add Expense"}
          </Button>
        </form>
      )}

     
      <div className="bg-card rounded-xl shadow p-4 mb-8 transition-colors">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">
            Expenses Comparison
          </h3>

         
          <div className="space-x-2">
            {["daily", "weekly", "monthly", "yearly"].map((f) => (
              <Button
                key={f}
                size="sm"
                variant={filter === f ? "default" : "outline"}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="label" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  color: "#f9fafb",
                }}
              />
              <Legend />
              <Bar dataKey="total" fill="#14b8a6" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      
      <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-4">
        Expenses Breakdown
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-center py-6 dark:text-gray-300">Loading...</p>
        ) : (
          breakdown.map((cat) => (
            <div
              key={cat.category}
              className="bg-card shadow rounded-xl p-4 hover:shadow-lg transition-colors"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-700 dark:text-gray-100">
                  {cat.category}
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  ₹{cat.total}
                </span>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                Compare to last month
              </p>
              <div className="space-y-1">
                {cat.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between text-sm text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 py-1"
                  >
                    <span>{item.title}</span>
                    <span>₹{item.amount}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 dark:text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
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
