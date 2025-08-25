"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from "@/redux/slice/goalSlice";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function GoalsPage() {
  const dispatch = useDispatch();
  const { goals, loading } = useSelector((state) => state.goals);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(getGoals());
  }, [dispatch]);

  // Handle Create / Update
  const handleSubmit = () => {
    if (editId) {
      dispatch(updateGoal({ id: editId, data: form }));
    } else {
      dispatch(createGoal(form));
    }
    setShowModal(false);
    setForm({ title: "", targetAmount: "", currentAmount: "", deadline: "" });
    setEditId(null);
  };

  // Chart Data
  const chartData = goals.map((goal) => ({
    name: goal.title,
    target: goal.targetAmount,
    current: goal.currentAmount,
  }));

  const pieData = goals.map((goal) => ({
    name: goal.title,
    value: goal.currentAmount,
  }));

  const COLORS = ["#14b8a6", "#6366f1", "#f59e0b", "#ef4444", "#10b981"];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
          Goals Dashboard
        </h2>
        <Button
          onClick={() => {
            setEditId(null);
            setShowModal(true);
          }}
          className="bg-teal-600 hover:bg-teal-700 shadow-md"
        >
          + Add Goal
        </Button>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Line Chart */}
        <Card className="shadow-lg rounded-xl hover:shadow-2xl transition">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-t-xl">
            <CardTitle className="text-lg font-semibold text-gray-700">
              Savings Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {goals.length === 0 ? (
              <p className="text-gray-400 text-center mt-20">
                No goals yet...
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="current"
                    stroke="#14b8a6"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#94a3b8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="shadow-lg rounded-xl hover:shadow-2xl transition">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-xl">
            <CardTitle className="text-lg font-semibold text-gray-700">
              Goal Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {pieData.length === 0 ? (
              <p className="text-gray-400">No goals yet...</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Goals List */}
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        Your Goals
      </h3>
      {loading ? (
        <p>Loading...</p>
      ) : goals.length === 0 ? (
        <p className="text-gray-500">No goals created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = Math.min(
              (goal.currentAmount / goal.targetAmount) * 100,
              100
            );
            return (
              <Card
                key={goal._id}
                className="shadow-md hover:shadow-xl transition rounded-xl border border-gray-100"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-800">{goal.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-1">
                    Deadline: {goal.deadline?.slice(0, 10)}
                  </p>
                  <p className="text-lg font-bold text-gray-900 mb-1">
                    Current: ${goal.currentAmount}
                  </p>
                  <p className="text-gray-700 mb-3">
                    Target: ${goal.targetAmount}
                  </p>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className="bg-gradient-to-r from-teal-400 to-emerald-500 h-2 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    {progress.toFixed(0)}% achieved
                  </p>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="border-teal-600 text-teal-600 hover:bg-teal-50 w-full"
                      onClick={() => {
                        setForm({
                          title: goal.title,
                          targetAmount: goal.targetAmount,
                          currentAmount: goal.currentAmount,
                          deadline: goal.deadline?.slice(0, 10) || "",
                        });
                        setEditId(goal._id);
                        setShowModal(true);
                      }}
                    >
                      Adjust
                    </Button>

                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => dispatch(deleteGoal(goal._id))}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="rounded-xl p-6 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {editId ? "Adjust Goal" : "Add Goal"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <input
              type="number"
              placeholder="Target Amount"
              value={form.targetAmount}
              onChange={(e) =>
                setForm({ ...form, targetAmount: e.target.value })
              }
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <input
              type="number"
              placeholder="Current Amount"
              value={form.currentAmount}
              onChange={(e) =>
                setForm({ ...form, currentAmount: e.target.value })
              }
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <input
              type="date"
              value={form.deadline}
              onChange={(e) =>
                setForm({ ...form, deadline: e.target.value })
              }
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none"
            />

            <Button
              className="w-full bg-teal-600 hover:bg-teal-700"
              onClick={handleSubmit}
            >
              {editId ? "Update Goal" : "Save Goal"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
