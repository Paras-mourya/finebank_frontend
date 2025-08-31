"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addAccount, getAccounts } from "@/redux/slice/accountSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddAccountModal() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    accountType: "",
    bankName: "",
    branchName: "",
    accountNumber: "",
    balance: "",
  });

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.accountType ||
      !form.bankName ||
      !form.branchName ||
      !form.accountNumber ||
      !form.balance
    ) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      await dispatch(addAccount(form)).unwrap();
      toast.success("Account added successfully");
      dispatch(getAccounts());
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
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button className="w-full">+ Add Account</Button>
  </DialogTrigger>

  <DialogContent className="max-w-md rounded-xl p-6 bg-white dark:bg-gray-800">
    <DialogHeader>
      <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        Add New Account
      </DialogTitle>
    </DialogHeader>

    <form onSubmit={handleSubmit} className="space-y-4">
      
      <div>
        <Label className="text-gray-700 dark:text-gray-300">Account Type</Label>
        <Select
          onValueChange={(value) => handleChange("accountType", value)}
          value={form.accountType}
          required
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
        <Label className="text-gray-700 dark:text-gray-300">Bank Name</Label>
        <Input
          name="bankName"
          value={form.bankName}
          onChange={(e) => handleChange("bankName", e.target.value)}
          required
          className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
        />
      </div>

     
      <div>
        <Label className="text-gray-700 dark:text-gray-300">Branch Name</Label>
        <Input
          name="branchName"
          value={form.branchName}
          onChange={(e) => handleChange("branchName", e.target.value)}
          className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
        />
      </div>

     
      <div>
        <Label className="text-gray-700 dark:text-gray-300">Account Number</Label>
        <Input
          name="accountNumber"
          value={form.accountNumber}
          onChange={(e) => handleChange("accountNumber", e.target.value)}
          required
          className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
        />
      </div>

      
      <div>
        <Label className="text-gray-700 dark:text-gray-300">Balance</Label>
        <Input
          type="number"
          name="balance"
          value={form.balance}
          onChange={(e) => handleChange("balance", e.target.value)}
          required
          className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
        />
      </div>

      <DialogFooter>
        <Button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white"
        >
          Save Account
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>

  );
}
