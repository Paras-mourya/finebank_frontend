"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBills,
  createBill,
  updateBill,
  deleteBill,
} from "@/redux/slice/billSlice";

export default function BillsPage() {
  const dispatch = useDispatch();
  const { bills, loading } = useSelector((state) => state.bills);

  const [formData, setFormData] = useState({
    vendor: "",
    plan: "",
    dueDate: "",
    amount: "",
    logoUrl: "",
    lastChargeDate: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(getBills());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      dispatch(updateBill({ id: editingId, data: formData }));
    } else {
      dispatch(createBill(formData));
    }
    setFormData({
      vendor: "",
      plan: "",
      dueDate: "",
      amount: "",
      logoUrl: "",
      lastChargeDate: "",
    });
    setEditingId(null);
  };

  const handleEdit = (bill) => {
    setFormData({
      vendor: bill.vendor,
      plan: bill.plan,
      dueDate: bill.dueDate.split("T")[0],
      amount: bill.amount,
      logoUrl: bill.logoUrl || "",
      lastChargeDate: bill.lastChargeDate
        ? bill.lastChargeDate.split("T")[0]
        : "",
    });
    setEditingId(bill._id);
  };

  const handleDelete = (id) => {
    dispatch(deleteBill(id));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Upcoming Bills</h2>

      {/* ✅ Bill Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-4 space-y-3"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="vendor"
            placeholder="Vendor"
            value={formData.vendor}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="plan"
            placeholder="Plan"
            value={formData.plan}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="logoUrl"
            placeholder="Logo URL"
            value={formData.logoUrl}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="date"
            name="lastChargeDate"
            value={formData.lastChargeDate}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update Bill" : "Add Bill"}
        </button>
      </form>

      {/* ✅ Bills List (Responsive) */}
      <div className="bg-white rounded-xl shadow p-4">
        {loading ? (
          <p className="text-center py-6">Loading...</p>
        ) : bills.length === 0 ? (
          <p className="text-center py-6 text-gray-500">No bills found</p>
        ) : (
          <div className="space-y-4">
            {bills.map((bill) => (
              <div
                key={bill._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between border rounded-lg p-4 hover:bg-gray-50"
              >
                {/* Left Section */}
                <div className="flex items-center gap-4">
                  {/* Due Date */}
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

                  {/* Logo + Vendor */}
                  <div>
                    <div className="flex items-center gap-2">
                      <img
                        src={bill.logoUrl || "/default-logo.png"}
                        alt={bill.vendor}
                        className="h-8 w-8 object-contain"
                      />
                      <p className="font-medium text-gray-800">
                        {bill.vendor} - {bill.plan}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      Last charge:{" "}
                      {bill.lastChargeDate
                        ? new Date(bill.lastChargeDate).toLocaleDateString(
                            "en-US",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "—"}
                    </p>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4 mt-3 sm:mt-0">
                  <p className="font-bold text-gray-800">${bill.amount}</p>
                  <button
                    onClick={() => handleEdit(bill)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(bill._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
