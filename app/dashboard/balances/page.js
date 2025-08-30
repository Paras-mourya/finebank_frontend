"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAccounts, addAccount, deleteAccount } from "@/redux/slice/accountSlice";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, ChevronRight } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BalancesPage() {
  const dispatch = useDispatch();
  const { accounts } = useSelector((state) => state.accounts);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    accountType: "",
    bankName: "",
    branchName: "",
    accountNumber: "",
    balance: "",
  });

  useEffect(() => {
    dispatch(getAccounts());
  }, [dispatch]);

  
  const handleChange = (eOrName, value) => {
    if (typeof eOrName === "string") {
      setForm({ ...form, [eOrName]: value });
    } else {
      setForm({ ...form, [eOrName.target.name]: eOrName.target.value });
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await dispatch(addAccount(form)).unwrap();
      toast.success("Account added successfully");
    } catch (error) {
      toast.error("Failed to add account");
    }
    setForm({
      accountType: "",
      bankName: "",
      branchName: "",
      accountNumber: "",
      balance: "",
    });
    setOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-white dark:bg-gray-900 transition-colors duration-300">
     
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Balances
        </h1>

        <div className="flex gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-500 dark:hover:bg-teal-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-xl p-6 bg-white dark:bg-gray-800">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Add New Account
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
              
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">
                    Account Type
                  </Label>
                  <Select
                    onValueChange={(value) => handleChange("accountType", value)}
                    value={form.accountType}
                  >
                    <SelectTrigger className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 outline-none">
                      <SelectValue placeholder="-- Select Account Type --" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="checking">Checking</SelectItem>
                      <SelectItem value="credit">Credit</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                      <SelectItem value="loan">Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-700 dark:text-gray-300">
                    Bank Name
                  </Label>
                  <Input
                    name="bankName"
                    placeholder="Enter bank name"
                    value={form.bankName}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">
                    Branch Name
                  </Label>
                  <Input
                    name="branchName"
                    placeholder="Enter branch name"
                    value={form.branchName}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">
                    Account Number
                  </Label>
                  <Input
                    name="accountNumber"
                    placeholder="Enter account number"
                    value={form.accountNumber}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">
                    Balance
                  </Label>
                  <Input
                    type="number"
                    name="balance"
                    placeholder="Enter balance"
                    value={form.balance}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-500 dark:hover:bg-teal-600"
                  >
                    Save Account
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            No accounts yet. Add one!
          </p>
        ) : (
          accounts.map((acc) => (
            <Card
              key={acc._id}
              className="relative overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300  bg-card"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-100">
                    {acc.accountType}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                      {acc.bankName}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {acc.branchName}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Account Number
                  </p>
                  <p className="font-mono text-sm text-gray-800 dark:text-gray-200">
                    {acc.accountNumber}
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    ₹ {Number(acc.balance).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total amount
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 border-red-300 dark:text-red-400 dark:hover:text-red-500 dark:border-red-700 bg-transparent"
                    onClick={async () => {
                      await dispatch(deleteAccount(acc._id)).unwrap();
                      toast.success("Account deleted successfully");
                    }}
                  >
                    Remove
                  </Button>
                  <Link href={`/dashboard/balances/${acc._id}`} className="ml-auto">
                    <Button
                      size="sm"
                      className="bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-500 dark:hover:bg-teal-600"
                    >
                      Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
