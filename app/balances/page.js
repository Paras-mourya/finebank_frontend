"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAccounts, addAccount, deleteAccount } from "@/redux/slice/accountSlice";
import Link from "next/link";
import { Button } from "@/components/ui/button";


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

  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addAccount(form));
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
    <div className="p-6 space-y-6">
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Accounts</h2>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white">+ Add Account</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Account</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Account Type</Label>
                <Input
                  name="accountType"
                  placeholder="checking / savings / credit"
                  value={form.accountType}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Bank Name</Label>
                <Input
                  name="bankName"
                  placeholder="Enter bank name"
                  value={form.bankName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Branch Name</Label>
                <Input
                  name="branchName"
                  placeholder="Enter branch name"
                  value={form.branchName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Account Number</Label>
                <Input
                  name="accountNumber"
                  placeholder="Enter account number"
                  value={form.accountNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Balance</Label>
                <Input
                  type="number"
                  name="balance"
                  placeholder="Enter balance"
                  value={form.balance}
                  onChange={handleChange}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-primary text-white">
                  Save Account
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg">Total Balance</h3>
        <p className="text-3xl font-bold mt-2">
          ₹
          {accounts.reduce((sum, acc) => sum + Number(acc.balance || 0), 0)}
        </p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.length === 0 ? (
          <p className="text-muted-foreground">No accounts yet. Add one!</p>
        ) : (
          accounts.map((acc) => (
            <div
              key={acc._id}
              className="border rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg">{acc.bankName}</h3>
              <p className="text-sm text-muted-foreground">
                {acc.accountType.toUpperCase()} • {acc.branchName}
              </p>
              <p className="text-sm text-muted-foreground">
                A/C: {acc.accountNumber}
              </p>
              <p className="mt-2 font-bold text-xl">
                ₹ {Number(acc.balance).toLocaleString()}
              </p>

              <div className="flex justify-between mt-4">
                <Button
                  variant="destructive"
                  onClick={() => dispatch(deleteAccount(acc._id))}
                >
                  Remove
                </Button>
                <Link href={`/balances/${acc._id}`}>
                  <Button>Details</Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
