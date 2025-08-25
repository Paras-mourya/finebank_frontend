"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAccountById } from "@/redux/slice/accountSlice";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AccountDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedAccount } = useSelector((state) => state.accounts);

  useEffect(() => {
    if (id) dispatch(getAccountById(id));
  }, [id, dispatch]);

  if (!selectedAccount) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Account Details</h2>
      <Card>
        <CardHeader>
          <CardTitle>{selectedAccount.bankName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Account Type: {selectedAccount.accountType}</p>
          <p>Branch: {selectedAccount.branchName}</p>
          <p>Account Number: {selectedAccount.accountNumber}</p>
          <p className="font-bold">Balance: ${selectedAccount.balance}</p>
          <div className="mt-4 flex gap-2">
            <Button>Edit Details</Button>
            <Button variant="destructive">Remove</Button>
          </div>
        </CardContent>
      </Card>

      <h3 className="text-lg font-semibold">Transactions History</h3>
      <Card>
        <CardContent>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Type</th>
                <th>Receipt</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {/* Example static transactions */}
              <tr>
                <td>17 Apr, 2023</td>
                <td>Complete</td>
                <td>Credit</td>
                <td>8C52d5DKDJ5</td>
                <td>$160.00</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-4 flex justify-center">
            <Button>Load More</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
