"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAccountById, updateAccount, deleteAccount } from "@/redux/slice/accountSlice";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export default function AccountDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { selectedAccount } = useSelector((state) => state.accounts);

  const [open, setOpen] = useState(false); // dialog state
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

  const handleSubmit = () => {
    dispatch(updateAccount({ id, data: formData }));
    setOpen(false);
  };

  const handleDelete = async () => {
    await dispatch(deleteAccount(id));
    router.push("/balances"); // delete hone ke baad balances list pe redirect
  };

  if (!selectedAccount) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Balances
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">
          Account Details
        </h1>
      </div>

      {/* Account Details Card */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
              <p className="font-medium">${selectedAccount.balance}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Branch Name</p>
              <p className="font-medium">{selectedAccount.branchName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Account Number</p>
              <p className="font-mono">{selectedAccount.accountNumber}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setOpen(true)}
            >
              Edit Details
            </Button>
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive bg-transparent"
              onClick={handleDelete}
            >
              Remove
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Transactions History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
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
                    Receipt
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-4">17 Apr, 2023</td>
                  <td className="py-4 px-4">
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      Complete
                    </Badge>
                  </td>
                  <td className="py-4 px-4">Credit</td>
                  <td className="py-4 px-4 font-mono text-sm">8C52d5DKDJ5</td>
                  <td className="py-4 px-4 text-right font-medium">
                    $160.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-6">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Load More
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Account Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Bank Name</Label>
              <Input
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Account Type</Label>
              <Input
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Balance</Label>
              <Input
                name="balance"
                type="number"
                value={formData.balance}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Branch Name</Label>
              <Input
                name="branchName"
                value={formData.branchName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Account Number</Label>
              <Input
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
