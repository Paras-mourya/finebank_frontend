"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBills,
  createBill,
  updateBill,
  deleteBill,
} from "@/redux/slice/billSlice";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";

export default function BillsPage() {
  const dispatch = useDispatch();
  const { bills, loading } = useSelector((state) => state.bills);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    vendor: "",
    plan: "",
    dueDate: "",
    amount: "",
    logo: null,
    lastChargeDate: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(getBills());
  }, [dispatch]);

  const handleChange = (e) => {
    if (e.target.name === "logo") {
      setFormData({ ...formData, logo: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.vendor ||
      !formData.plan ||
      !formData.dueDate ||
      !formData.amount ||
      !formData.logo ||
      !formData.lastChargeDate ||
      !formData.description
    ) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "logo") {
          if (formData.logo instanceof File) {
            data.append("logo", formData.logo);
          }
        } else {
          if (formData[key]) data.append(key, formData[key]);
        }
      });

      if (editingId) {
        dispatch(updateBill({ id: editingId, data })).unwrap();
        toast.success("Bill updated successfully");
      } else {
        dispatch(createBill(data)).unwrap();
        toast.success("Bill created successfully");
      }
    } catch (error) {
      toast.error("Failed to save the bill");
    }

    setFormData({
      vendor: "",
      plan: "",
      dueDate: "",
      amount: "",
      logo: null,
      lastChargeDate: "",
      description: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (bill) => {
    setFormData({
      vendor: bill.vendor,
      plan: bill.plan,
      dueDate: bill.dueDate.split("T")[0],
      amount: bill.amount,
      logo: bill.logo || null,
      lastChargeDate: bill.lastChargeDate
        ? bill.lastChargeDate.split("T")[0]
        : "",
      description: bill.description || "",
    });
    setEditingId(bill._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteBill(id)).unwrap();
    toast.success("Bill deleted successfully");
  };

  return (
    <div className="p-6 min-h-screen  rounded-lg space-y-6 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
      {/* Header */}
      <div className="flex items-center  justify-between">
        <h2 className="text-2xl font-bold">Upcoming Bills</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
          }}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-white transition"
        >
          <PlusCircle size={18} />
          {showForm ? "Close Bill" : "Add Bill"}
        </button>
      </div>

      {/* Bill Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl shadow-lg p-6 space-y-4 bg-card border border-gray-300 dark:border-gray-700 transition-colors"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="vendor"
              placeholder="Vendor"
              value={formData.vendor}
              onChange={handleChange}
              required
              className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 p-3 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              name="plan"
              placeholder="Plan"
              value={formData.plan}
              onChange={handleChange}
              className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 p-3 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 p-3 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 p-3 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 p-3 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500"
            />
            <label className="block">
              <input
                type="file"
                name="logo"
                accept="image/*"
                onChange={handleChange}
                className="block w-full text-sm text-gray-900 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-700 file:text-white hover:file:bg-emerald-600 cursor-pointer"
              />
            </label>
            <input
              type="date"
              name="lastChargeDate"
              value={formData.lastChargeDate}
              onChange={handleChange}
              className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 p-3 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 px-4 py-3 rounded-lg font-semibold text-white transition"
          >
            {editingId ? "Update Bill" : "Add Bill"}
          </button>
        </form>
      )}

      {/* Bills List */}
      <div className="mt-6 rounded-xl border border-gray-300 dark:border-gray-800 bg-card shadow-sm transition-colors">
        <div className="hidden grid-cols-12 border-b border-gray-300 dark:border-gray-700 px-5 py-3 text-sm font-bold md:grid">
          <div className="col-span-2">Due Date</div>
          <div className="col-span-2">Logo</div>
          <div className="col-span-5">Item Description</div>
          <div className="col-span-2">Last Charge</div>
          <div className="col-span-1 text-right">Amount</div>
        </div>

        {loading ? (
          <p className="text-center py-6">Loading...</p>
        ) : bills.length === 0 ? (
          <p className="text-center py-6 text-gray-500 dark:text-gray-400">
            No bills found
          </p>
        ) : (
          <ul className="divide-y divide-gray-300 dark:divide-gray-800">
            {bills.map((bill) => (
              <li key={bill._id} className="p-5">
                <BillRow
                  bill={bill}
                  onEdit={() => handleEdit(bill)}
                  onDelete={() => handleDelete(bill._id)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function VendorLogo({ name, logo }) {
  return (
    <img
      src={logo?.secure_url}
      alt={`${name} logo`}
      width={40}
      height={40}
      className="h-12 w-12 rounded-lg object-cover border border-gray-300 dark:border-gray-700"
      crossOrigin="anonymous"
    />
  );
}

function BillRow({ bill, onEdit, onDelete }) {
  const dueDate = new Date(bill.dueDate);
  const lastCharge = bill.lastChargeDate
    ? new Date(bill.lastChargeDate).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-center text-gray-800 dark:text-gray-200">
      <div className="md:col-span-2">
        <div className="inline-flex flex-col items-center rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800 px-3 py-2 text-center">
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {dueDate.toLocaleString("en-US", { month: "short" })}
          </span>
          <span className="text-base font-semibold">{dueDate.getDate()}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 md:col-span-2">
        <VendorLogo name={bill.vendor} logo={bill.logo} />
      </div>

      <div className="md:col-span-5">
        <p className="text-sm font-semibold">
          {bill.vendor} - {bill.plan}
        </p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {bill.description || "—"}
        </p>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 md:col-span-2">
        {lastCharge}
      </div>

      <div className="md:col-span-1 md:justify-self-end flex flex-col items-end gap-2">
        <div className="inline-flex items-center rounded-full border border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800 px-4 py-2 text-sm font-semibold">
          ₹{bill.amount}
        </div>
        <div className="flex gap-2 text-xs">
          <button
            onClick={onEdit}
            className="text-blue-600 dark:text-blue-400 hover:underline transition"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 dark:text-red-400 hover:underline transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
