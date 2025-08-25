import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@api/api";

api.defaults.withCredentials = true;


export const getTransactions = createAsyncThunk("transactions/get", async () => {
  const res = await api.get("/api/transactions");
  return res.data.transactions;
});


export const createTransaction = createAsyncThunk("transactions/create", async (data) => {
  const res = await api.post("/api/transactions", data);
  return res.data.newTransaction;
});


export const updateTransaction = createAsyncThunk("transactions/update", async ({ id, data }) => {
  const res = await api.put(`/api/transactions/${id}`, data);
  return res.data;
});


export const deleteTransaction = createAsyncThunk("transactions/delete", async (id) => {
  await api.delete(`/api/transactions/${id}`);
  return id;
});


export const getSummary = createAsyncThunk("transactions/summary", async () => {
  const res = await api.get("/api/transactions/summary");
  return res.data; 
});

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    list: [],
    summary: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.list.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t._id !== action.payload);
      })
      
      .addCase(getSummary.fulfilled, (state, action) => {
        state.summary = action.payload;
      });
  },
});

export default transactionSlice.reducer;
