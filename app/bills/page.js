"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBills } from "@/redux/slice/billSlice";

export default function BillsPage() {
  const dispatch = useDispatch();
  const { bills, loading } = useSelector((state) => state.bills);

  useEffect(() => {
    dispatch(getBills());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Upcoming Bills</h2>

      <div className="bg-white rounded-xl shadow p-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-500 text-sm border-b">
              <th className="pb-2">Due Date</th>
              <th className="pb-2">Logo</th>
              <th className="pb-2">Item Description</th>
              <th className="pb-2">Last Charge</th>
              <th className="pb-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : bills.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No bills found
                </td>
              </tr>
            ) : (
              bills.map((bill) => (
                <tr
                  key={bill._id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  {/* Due Date */}
                  <td className="py-4 text-center">
                    <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg w-14 h-14">
                      <span className="text-xs font-medium text-gray-500">
                        {new Date(bill.dueDate).toLocaleString("en-US", {
                          month: "short",
                        })}
                      </span>
                      <span className="text-lg font-bold text-gray-800">
                        {new Date(bill.dueDate).getDate()}
                      </span>
                    </div>
                  </td>

                  {/* Logo */}
                  <td className="py-4">
                    <img
                      src={bill.logoUrl || "/default-logo.png"}
                      alt={bill.vendor}
                      className="h-8 w-8 object-contain"
                    />
                  </td>

                  {/* Description */}
                  <td className="py-4">
                    <p className="font-medium text-gray-800">
                      {bill.vendor} - {bill.plan}
                    </p>
                    <p className="text-sm text-gray-500">
                      For advanced security and more flexible controls, the
                      Professional plan helps you scale design processes
                      company-wide.
                    </p>
                  </td>

                  {/* Last Charge */}
                  <td className="py-4 text-gray-600">
                    {bill.lastChargeDate
                      ? new Date(bill.lastChargeDate).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>

                  {/* Amount */}
                  <td className="py-4 text-right font-bold text-gray-800">
                    ${bill.amount}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
