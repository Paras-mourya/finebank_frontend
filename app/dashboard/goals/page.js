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
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.title ||
      !form.targetAmount ||
      !form.currentAmount ||
      !form.deadline
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    const payload = {
      ...form,
      targetAmount: Number(form.targetAmount),
      currentAmount: Number(form.currentAmount),
    };
    if (editId) {
      await dispatch(updateGoal({ id: editId, data: payload })).unwrap();
      toast.success("Goal updated successfully");
    } else {
      await dispatch(createGoal(payload)).unwrap();
      toast.success("Goal created successfully");
    }
    setShowModal(false);
    setForm({ title: "", targetAmount: "", currentAmount: "", deadline: "" });
    setEditId(null);
  };

 
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
     
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

     
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      
        <Card className="shadow-lg rounded-xl hover:shadow-2xl transition bg-card">
          <CardHeader className="bg-card border-gray-800 dark:border-gray-700">
            <CardTitle className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Savings Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {goals.length === 0 ? (
              <p className="text-gray-400 dark:text-gray-500 text-center mt-20">
                No goals yet...
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
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

       
        <Card className="shadow-lg rounded-xl hover:shadow-2xl transition bg-card">
          <CardHeader className="bg-card h-2 border-gray-200 dark:border-gray-700 rounded-t-xl">
            <CardTitle className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Goal Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {pieData.length === 0 ? (
              <p className="text-gray-400 dark:text-gray-500">
                No goals yet...
              </p>
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

     
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
        Your Goals
      </h3>
      {loading ? (
        <p>Loading...</p>
      ) : goals.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No goals created yet.
        </p>
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
                className="hover:shadow-sm transition-shadow rounded-xl border bg-card"
              >
                <CardContent className="p-5 relative">
               
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <button
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
                      className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Pencil className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>

                    <button
                      onClick={() => {
                        dispatch(deleteGoal(goal._id));
                        toast.success("Goal deleted successfully");
                      }}
                      className="p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>

                  <div className="flex items-start gap-4">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {goal.title}
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        ₹{goal.currentAmount} / ₹{goal.targetAmount}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Deadline: {goal.deadline?.slice(0, 10)}
                      </p>

                   
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                        <div
                          className="bg-gradient-to-r from-teal-400 to-emerald-500 h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {progress.toFixed(0)}% achieved
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

    
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="rounded-xl p-6 max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {editId ? "Adjust Goal" : "Add Goal"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
            />
            <input
              type="number"
              placeholder="Target Amount"
              value={form.targetAmount}
              onChange={(e) =>
                setForm({ ...form, targetAmount: e.target.value })
              }
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
            />
            <input
              type="number"
              placeholder="Current Amount"
              value={form.currentAmount}
              onChange={(e) =>
                setForm({ ...form, currentAmount: e.target.value })
              }
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
            />
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
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
