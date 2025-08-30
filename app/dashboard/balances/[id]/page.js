"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAccountById,
  updateAccount,
  deleteAccount,
} from "@/redux/slice/accountSlice";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AccountDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { selectedAccount } = useSelector((state) => state.accounts);

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    bankName: "",
    accountType: "",
    balance: "",
    branchName: "",
    accountNumber: "",
  });

  useEffect(() => {
    if (id) dispatch(getAccountById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedAccount) {
      setFormData({
        bankName: selectedAccount.bankName || "",
        accountType: selectedAccount.accountType || "",
        balance: selectedAccount.balance || "",
        branchName: selectedAccount.branchName || "",
        accountNumber: selectedAccount.accountNumber || "",
      });
    }
  }, [selectedAccount]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    await dispatch(updateAccount({ id, data: formData })).unwrap();
    toast.success("Account updated successfully");
    setOpen(false);
  };

  const handleDelete = async () => {
    await dispatch(deleteAccount(id)).unwrap();
    toast.success("Account deleted successfully");
    router.push("/dashboard/balances");
  };

  if (!selectedAccount) return <p>Loading...</p>;

  
  const transactions = selectedAccount.transactions || [];

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8">
     
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-semibold text-foreground">
          Account Details
        </h1>
        <Button
          variant="ghost"
          size="sm"
          className="w-full sm:w-auto text-muted-foreground hover:text-foreground"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Balances
        </Button>
        
      </div>

     
      <Card>
        <CardContent className="p-4 md:p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Bank Name</p>
              <p className="font-medium">{selectedAccount.bankName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Account Type</p>
              <p className="font-medium">{selectedAccount.accountType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Balance</p>
              <p className="font-medium">₹{selectedAccount.balance}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Branch Name</p>
              <p className="font-medium">{selectedAccount.branchName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Account Number
              </p>
              <p className="font-mono break-all">
                {selectedAccount.accountNumber}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setOpen(true)}
            >
              Edit Details
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto text-destructive hover:text-destructive bg-transparent"
              onClick={handleDelete}
            >
              Remove
            </Button>
          </div>
        </CardContent>
      </Card>

  
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl font-semibold">
            Transactions History
          </CardTitle>
        </CardHeader>
        <CardContent>
        
          <div className="block md:hidden space-y-4">
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <div
                  key={t._id}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{t.date}</p>

                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant="secondary"
                    className={`${
                      t.status === "Complete"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {t.status}
                  </Badge>

                  <p className="text-sm text-muted-foreground">
                    Transaction Type
                  </p>
                  <p className="font-medium">{t.type}</p>

                  <p className="text-sm text-muted-foreground">Items</p>
                  <p className="font-mono text-sm">{t.title}</p>

                  <p className="text-sm text-muted-foreground">Shop</p>
                  <p className="font-mono text-sm">{t.shop}</p>

                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium">₹{t.amount}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center">
                No transactions found
              </p>
            )}
          </div>

          
          <div className="hidden md:block overflow-x-auto">
            {transactions.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Transaction Type
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Items
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Shop
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr
                      key={t._id}
                      className="border-b border-border/50"
                    >
                      <td className="py-4 px-4">{t.date}</td>
                      <td className="py-4 px-4">
                        <Badge
                          variant="secondary"
                          className={`${
                            t.status === "Complete"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {t.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">{t.type}</td>
                      <td className="py-4 px-4 ">{t.title}</td>
                      <td className="py-4 px-4 ">{t.shop}</td>
                      <td className="py-4 px-4 text-right font-medium">
                        ₹{t.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No transactions found
              </p>
            )}
          </div>

          <div className="flex justify-center mt-6">
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
              Load More
            </Button>
          </div>
        </CardContent>
      </Card>

    
    <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="max-w-lg w-full rounded-xl p-6 bg-white dark:bg-gray-800">
    <DialogHeader>
      <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        Edit Account Details
      </DialogTitle>
    </DialogHeader>

    <div className="space-y-4">
      {/* Bank Name */}
      <div>
        <Label className="text-gray-700 dark:text-gray-300">Bank Name</Label>
        <Input
          name="bankName"
          value={formData.bankName}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 
                     text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
        />
      </div>

      {/* Account Type */}
      <div>
        <Label className="text-gray-700 dark:text-gray-300">Account Type</Label>
        <select
          name="accountType"
          value={formData.accountType}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 
                     text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
        >
          <option value="">-- Select Account Type --</option>
          <option value="savings">Savings</option>
          <option value="checking">Checking</option>
          <option value="credit">Credit</option>
          <option value="investment">Investment</option>
          <option value="loan">Loan</option>
        </select>
      </div>

      {/* Balance */}
      <div>
        <Label className="text-gray-700 dark:text-gray-300">Balance</Label>
        <Input
          name="balance"
          type="number"
          value={formData.balance}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 
                     text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
        />
      </div>

      {/* Branch Name */}
      <div>
        <Label className="text-gray-700 dark:text-gray-300">Branch Name</Label>
        <Input
          name="branchName"
          value={formData.branchName}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 
                     text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
        />
      </div>

      {/* Account Number */}
      <div>
        <Label className="text-gray-700 dark:text-gray-300">Account Number</Label>
        <Input
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 
                     text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
        />
      </div>
    </div>

    <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:justify-end mt-4">
      <Button
        variant="outline"
        onClick={() => setOpen(false)}
        className="w-full sm:w-auto border-gray-300 text-gray-800 dark:text-gray-200 
                   dark:border-gray-600 dark:hover:bg-gray-700"
      >
        Cancel
      </Button>
      <Button
        onClick={handleSubmit}
        className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white 
                   dark:bg-teal-500 dark:hover:bg-teal-600"
      >
        Save Changes
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </div>
  );
}
