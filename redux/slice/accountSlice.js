import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@api/api";


export const getAccounts = createAsyncThunk("accounts/get", async () => {
  const res = await api.get("/api/accounts");
  return res.data.accounts;
});

// Get account by ID
export const getAccountById = createAsyncThunk("accounts/getById", async (id) => {
  const res = await api.get(`/api/accounts/${id}`);
  return res.data.account;
});

// Add account
export const addAccount = createAsyncThunk("accounts/add", async (data) => {
  const res = await api.post("/api/accounts", data);
  return res.data.account;
});

// Update account
export const updateAccount = createAsyncThunk("accounts/update", async ({ id, data }) => {
  const res = await api.put(`/api/accounts/${id}`, data);
  return res.data.account;
});

// Delete account
export const deleteAccount = createAsyncThunk("accounts/delete", async (id) => {
  await api.delete(`/api/accounts/${id}`);
  return id;
});

const accountSlice = createSlice({
  name: "accounts",
  initialState: {
    accounts: [],
    selectedAccount: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAccounts.fulfilled, (state, action) => {
        state.accounts = action.payload;
      })
      .addCase(getAccountById.fulfilled, (state, action) => {
        state.selectedAccount = action.payload;
      })
      .addCase(addAccount.fulfilled, (state, action) => {
        state.accounts.push(action.payload);
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        const index = state.accounts.findIndex((a) => a._id === action.payload._id);
        if (index !== -1) state.accounts[index] = action.payload;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.accounts = state.accounts.filter((a) => a._id !== action.payload);
      });
  },
});

export default accountSlice.reducer;
