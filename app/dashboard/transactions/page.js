"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/redux/slice/transactionSlice";
import { getAccounts } from "@/redux/slice/accountSlice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
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
  const { accounts } = useSelector((state) => state.accounts);

  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    shop: "",
    date: "",
    method: "Credit Card",
    type: "income",
    amount: "",
    account: "",
  });

  useEffect(() => {
    dispatch(getTransactions());
    dispatch(getAccounts());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.title ||
      !form.shop ||
      !form.date ||
      !form.method ||
      !form.type ||
      !form.amount ||
      !form.account
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    try {
      if (editId) {
        await dispatch(updateTransaction({ id: editId, data: form })).unwrap();
        toast.success("Transaction updated successfully");
      } else {
        await dispatch(createTransaction(form)).unwrap();
        toast.success("Transaction created successfully");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
    setForm({
      title: "",
      shop: "",
      date: "",
      method: "Credit Card",
      type: "income",
      amount: "",
      account: "",
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
    <div className="p-4 sm:p-6 space-y-6 bg-white dark:bg-gray-900 min-h-screen ">
      <h2 className="text-xl sm:text-2xl font-bold">Recent Transactions</h2>

    
      <div className="flex flex-wrap gap-4 sm:gap-6 border-b pb-2 border-border">
        {["all", "revenue", "expenses"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`capitalize pb-2 transition-colors ${
              filter === tab
                ? "text-primary border-b-2 border-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      
      <div className="hidden md:block">
        <Card className="shadow-lg rounded-xl p-4 overflow-x-auto bg-card">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="text-left border-b border-border">
              <tr className="text-muted-foreground">
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
                  <td
                    colSpan="6"
                    className="text-center p-4 text-muted-foreground"
                  >
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr
                    key={t._id}
                    className="border-b border-border hover:bg-muted"
                  >
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
                      ₹{t.amount.toFixed(2)}
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
                        onClick={() => {
                          dispatch(deleteTransaction(t._id));
                          toast.success("Transaction deleted successfully");
                        }}
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
      </div>

     
      <div className="grid gap-4 md:hidden">
        {loading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : filteredTransactions.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No transactions found.
          </p>
        ) : (
          filteredTransactions.map((t) => (
            <Card
              key={t._id}
              className="p-4 shadow-md rounded-xl space-y-2 bg-card"
            >
              <div className="flex justify-between">
                <h3 className="font-semibold">{t.title}</h3>
                <span
                  className={`font-bold ${
                    t.type === "income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ₹{t.amount.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Shop: {t.shop}</p>
              <p className="text-sm text-muted-foreground">
                Date: {new Date(t.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Method: {t.method}
              </p>
              <div className="flex gap-2 pt-2">
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
              </div>
            </Card>
          ))
        )}
      </div>

     
      <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="max-w-md rounded-xl p-6 bg-white dark:bg-gray-800">
    <DialogHeader>
      <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        {editId ? "Update Transaction" : "Add Transaction"}
      </DialogTitle>
    </DialogHeader>

    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-gray-700 dark:text-gray-300">Title</Label>
        <Input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
        />
      </div>

      <div>
        <Label className="text-gray-700 dark:text-gray-300">Account</Label>
        <select
          name="account"
          value={form.account}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
        >
          <option value="">Select Account</option>
          {accounts &&
            accounts.map((acc) => (
              <option key={acc._id} value={acc._id}>
                {acc.bankName}
              </option>
            ))}
        </select>
      </div>

      <div>
        <Label className="text-gray-700 dark:text-gray-300">Shop</Label>
        <Input
          name="shop"
          value={form.shop}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
        />
      </div>

      <div>
        <Label className="text-gray-700 dark:text-gray-300">Date</Label>
        <Input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
        />
      </div>

      <div>
        <Label className="text-gray-700 dark:text-gray-300">Payment Method</Label>
        <select
          name="method"
          value={form.method}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
        >
          <option value="Credit Card">Credit Card</option>
          <option value="Debit Card">Debit Card</option>
          <option value="Cash">Cash</option>
          <option value="Bank Transfer">Bank Transfer</option>
        </select>
      </div>

      <div>
        <Label className="text-gray-700 dark:text-gray-300">Type</Label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
        >
          <option value="income">Revenue (Income)</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div>
        <Label className="text-gray-700 dark:text-gray-300">Amount</Label>
        <Input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
        />
      </div>

      <DialogFooter>
        <Button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white"
        >
          {editId ? "Update" : "Save"}
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>


      <Button
        className="bg-teal-600 hover:bg-teal-700 w-full sm:w-auto"
        onClick={() => {
          setEditId(null);
          setForm({
            title: "",
            shop: "",
            date: "",
            method: "Credit Card",
            type: "income",
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
