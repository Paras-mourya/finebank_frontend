import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@api/api";

api.defaults.withCredentials = true;


export const getBills = createAsyncThunk("bills/get", async () => {
  const res = await api.get("/api/bills");
  return res.data.bills;
});


export const getBillById = createAsyncThunk("bills/getById", async (id) => {
  const res = await api.get(`/api/bills/${id}`);
  return res.data.bill;
});


export const createBill = createAsyncThunk("bills/create", async (billData) => {
  const res = await api.post("/api/bills", billData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.bill;
});

export const updateBill = createAsyncThunk("bills/update", async ({ id, data }) => {
  const res = await api.put(`/api/bills/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.bill;
});


export const deleteBill = createAsyncThunk("bills/delete", async (id) => {
  await api.delete(`/api/bills/${id}`);
  return id;
});

const billSlice = createSlice({
  name: "bills",
  initialState: {
    bills: [],
    selectedBill: null, 
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
     
      .addCase(getBills.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBills.fulfilled, (state, action) => {
        state.loading = false;
        state.bills = action.payload;
      })
      .addCase(getBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      
      .addCase(getBillById.fulfilled, (state, action) => {
        state.selectedBill = action.payload;
      })

      
      .addCase(createBill.fulfilled, (state, action) => {
        state.bills.push(action.payload);
      })

      
      .addCase(updateBill.fulfilled, (state, action) => {
        state.bills = state.bills.map((bill) =>
          bill._id === action.payload._id ? action.payload : bill
        );
      })

     
      .addCase(deleteBill.fulfilled, (state, action) => {
        state.bills = state.bills.filter((bill) => bill._id !== action.payload);
      });
  },
});

export default billSlice.reducer;
