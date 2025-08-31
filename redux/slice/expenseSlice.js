import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@api/api";

api.defaults.withCredentials = true;


export const getExpenses = createAsyncThunk("expenses/getAll", async () => {
  const res = await api.get("/api/expenses");
  return res.data.expenses;
});

export const createExpense = createAsyncThunk(
  "expenses/create",
  async (expenseData, { dispatch, getState }) => {
    const res = await api.post("/api/expenses", expenseData);

    
    const filter = getState().expenses.filter;
    dispatch(getExpensesComparison(filter));
    dispatch(getExpensesBreakdown(filter));

    return res.data.expense;
  }
);

export const updateExpense = createAsyncThunk(
  "expenses/update",
  async ({ id, updatedData }, { dispatch, getState }) => {
    const res = await api.put(`/api/expenses/${id}`, updatedData);

    
    const filter = getState().expenses.filter;
    dispatch(getExpensesComparison(filter));
    dispatch(getExpensesBreakdown(filter));

    return res.data.expense;
  }
);

export const deleteExpense = createAsyncThunk(
  "expenses/delete",
  async (id, { dispatch, getState }) => {
    await api.delete(`/api/expenses/${id}`);

    
    const filter = getState().expenses.filter;
    dispatch(getExpensesComparison(filter));
    dispatch(getExpensesBreakdown(filter));

    return id;
  }
);


export const getExpensesComparison = createAsyncThunk(
  "expenses/comparison",
  async (filter = "monthly") => {
    const res = await api.get(`/api/expenses/analytics/comparison?filter=${filter}`);
    return res.data.data;
  }
);

export const getExpensesBreakdown = createAsyncThunk(
  "expenses/breakdown",
  async (filter = "monthly") => {
    const res = await api.get(`/api/expenses/analytics/breakdown?filter=${filter}`);
    return res.data.data;
  }
);

const expenseSlice = createSlice({
  name: "expenses",
  initialState: {
    expenses: [],
    comparison: [],
    breakdown: [],
    filter: "monthly", 
    loading: false,
    error: null,
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
    
      .addCase(getExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(getExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(getExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      
      .addCase(createExpense.fulfilled, (state, action) => {
        state.expenses.unshift(action.payload); // newest on top
      })

      
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex((e) => e._id === action.payload._id);
        if (index !== -1) state.expenses[index] = action.payload;
      })

     
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter((e) => e._id !== action.payload);
      })

      
      .addCase(getExpensesComparison.fulfilled, (state, action) => {
        state.comparison = action.payload;
      })

      
      .addCase(getExpensesBreakdown.fulfilled, (state, action) => {
        state.breakdown = action.payload;
      });
  },
});

export const { setFilter } = expenseSlice.actions;
export default expenseSlice.reducer;
