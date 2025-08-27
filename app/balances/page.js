"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAccounts, addAccount, deleteAccount } from "@/redux/slice/accountSlice";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  ChevronRight,
} from "lucide-react";

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
    <div className="flex-1 flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Balances</h1>

        <div className="flex gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Account
              </Button>
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
                    placeholder="Checking / Savings / Credit"
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
      </div>

    

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.length === 0 ? (
          <p className="text-muted-foreground">No accounts yet. Add one!</p>
        ) : (
          accounts.map((acc) => (
            <Card key={acc._id} className="relative overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">
                    {acc.accountType}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {acc.bankName}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{acc.branchName}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Account Number
                  </p>
                  <p className="font-mono text-sm">{acc.accountNumber}</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    ₹ {Number(acc.balance).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total amount</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive bg-transparent"
                    onClick={() => dispatch(deleteAccount(acc._id))}
                  >
                    Remove
                  </Button>
                  <Link href={`/balances/${acc._id}`} className="ml-auto">
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
