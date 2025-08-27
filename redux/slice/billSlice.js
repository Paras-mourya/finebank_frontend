import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@api/api";

api.defaults.withCredentials = true;


export const getBills = createAsyncThunk("bills/get", async () => {
  const res = await api.get("http://localhost:4000/api/bills");
  return res.data.bills;
});

const billSlice = createSlice({
  name: "bills",
  initialState: {
    bills: [],
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
      });
  },
});

export default billSlice.reducer;
