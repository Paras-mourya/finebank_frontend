"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/redux/slice/transactionSlice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function TransactionsPage() {
  const dispatch = useDispatch();
  const { list: transactions, loading } = useSelector(
    (state) => state.transactions
  );

  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    shop: "",
    date: "",
    method: "Credit Card",
    type: "income",
    category: "",
    amount: "",
  });

  useEffect(() => {
    dispatch(getTransactions());
  }, [dispatch]);

  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      dispatch(updateTransaction({ id: editId, data: form }));
    } else {
      dispatch(createTransaction(form));
    }
    setForm({
      title: "",
      shop: "",
      date: "",
      method: "Credit Card",
      type: "income",
      category: "",
      amount: "",
    });
    setEditId(null);
    setOpen(false);
  };

  
  const filteredTransactions = transactions.filter((t) => {
    if (filter === "all") return true;
    if (filter === "revenue") return t.type === "income";
    if (filter === "expenses") return t.type === "expense";
    return true;
  });

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      
      <h2 className="text-2xl font-bold text-gray-800">Recent Transactions</h2>

      
      <div className="flex gap-6 border-b pb-2">
        {["all", "revenue", "expenses"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`capitalize pb-2 ${
              filter === tab
                ? "text-teal-600 border-b-2 border-teal-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <Card className="shadow-lg rounded-xl p-4">
        <table className="w-full text-sm">
          <thead className="text-left border-b">
            <tr className="text-gray-600">
              <th className="p-2">Items</th>
              <th className="p-2">Shop Name</th>
              <th className="p-2">Date</th>
              <th className="p-2">Payment Method</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No transactions found.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((t) => (
                <tr key={t._id} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-medium">{t.title}</td>
                  <td className="p-2">{t.shop}</td>
                  <td className="p-2">
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                  <td className="p-2">{t.method}</td>
                  <td
                    className={`p-2 font-bold ${
                      t.type === "income" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ${t.amount.toFixed(2)}
                  </td>
                  <td className="p-2 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setForm({
                          title: t.title,
                          shop: t.shop,
                          date: t.date.slice(0, 10),
                          method: t.method,
                          type: t.type,
                          category: t.category || "",
                          amount: t.amount,
                        });
                        setEditId(t._id);
                        setOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => dispatch(deleteTransaction(t._id))}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? "Update Transaction" : "Add Transaction"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Shop</Label>
              <Input
                name="shop"
                value={form.shop}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Payment Method</Label>
              <select
                name="method"
                value={form.method}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
            <div>
              <Label>Type</Label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              >
                <option value="income">Revenue (Income)</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <Label>Category</Label>
              <Input
                name="category"
                value={form.category}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editId ? "Update" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      
      <Button
        className="bg-teal-600 hover:bg-teal-700"
        onClick={() => {
          setEditId(null);
          setForm({
            title: "",
            shop: "",
            date: "",
            method: "Credit Card",
            type: "income",
            category: "",
            amount: "",
          });
          setOpen(true);
        }}
      >
        + Add Transaction
      </Button>
    </div>
  );
}
