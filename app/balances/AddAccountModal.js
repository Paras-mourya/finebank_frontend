"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addAccount, getAccounts } from "@/redux/slice/accountSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AddAccountModal() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    accountType: "",
    bankName: "",
    branchName: "",
    accountNumber: "",
    balance: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(addAccount(form));
    dispatch(getAccounts());
    setForm({
      accountType: "",
      bankName: "",
      branchName: "",
      accountNumber: "",
      balance: "",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">+ Add Account</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          
          <DialogTitle>Add New Account</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="accountType">Account Type</Label>
            <Input
              id="accountType"
              name="accountType"
              value={form.accountType}
              onChange={handleChange}
              placeholder="savings / checking / credit"
              required
            />
          </div>

          <div>
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              name="bankName"
              value={form.bankName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="branchName">Branch Name</Label>
            <Input
              id="branchName"
              name="branchName"
              value={form.branchName}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="balance">Balance</Label>
            <Input
              id="balance"
              type="number"
              name="balance"
              value={form.balance}
              onChange={handleChange}
              required
            />
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full">
              Save Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
