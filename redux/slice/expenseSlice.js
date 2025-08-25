import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@api/api";

api.defaults.withCredentials = true;


export const getExpensesComparison = createAsyncThunk(
  "expenses/comparison",
  async () => {
    const res = await api.get("/api/expenses/comparison");
    return res.data.data;
  }
);


export const getExpensesBreakdown = createAsyncThunk(
  "expenses/breakdown",
  async () => {
    const res = await api.get("/api/expenses/breakdown");
    return res.data.data;
  }
);

const expenseSlice = createSlice({
  name: "expenses",
  initialState: {
    comparison: [],
    breakdown: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      
      .addCase(getExpensesComparison.pending, (state) => {
        state.loading = true;
      })
      .addCase(getExpensesComparison.fulfilled, (state, action) => {
        state.loading = false;
        state.comparison = action.payload;
      })
      .addCase(getExpensesComparison.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      
      .addCase(getExpensesBreakdown.pending, (state) => {
        state.loading = true;
      })
      .addCase(getExpensesBreakdown.fulfilled, (state, action) => {
        state.loading = false;
        state.breakdown = action.payload;
      })
      .addCase(getExpensesBreakdown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default expenseSlice.reducer;
