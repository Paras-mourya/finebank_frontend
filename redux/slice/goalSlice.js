
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@api/api";

api.defaults.withCredentials = true;


export const getGoals = createAsyncThunk("goals/get", async () => {
  const res = await api.get("/api/goals");
  return res.data.goals;
});


export const createGoal = createAsyncThunk("goals/create", async (data) => {
  const res = await api.post("/api/goals", data);
  return res.data.goal;
});

export const updateGoal = createAsyncThunk(
  "goals/update",
  async ({ id, data }) => {
    const res = await api.put(`/api/goals/${id}`, data);
    return res.data.goal;
  }
);


export const deleteGoal = createAsyncThunk("goals/delete", async (id) => {
  await api.delete(`/api/goals/${id}`);
  return id;
});

const goalSlice = createSlice({
  name: "goals",
  initialState: {
    goals: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGoals.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.goals.push(action.payload);
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
  const updated = action.payload;
  if (!updated?._id) return;   
  const index = state.goals.findIndex((g) => g._id === updated._id);
  if (index !== -1) state.goals[index] = updated;
})

      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter((g) => g._id !== action.payload);
      });
  },
});

export default goalSlice.reducer;
