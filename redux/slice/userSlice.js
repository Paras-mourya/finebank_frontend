import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "@api/api";

// 👇 baseURL fix kar (backend ka URL dal)

api.defaults.withCredentials = true;

// REGISTER
export const registerUser = createAsyncThunk("user/register", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post("/api/users/register", data);
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Registration failed");
  }
});

// LOGIN
export const loginUser = createAsyncThunk("user/login", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post("/api/users/login", data);
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.put("/api/users/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

export const getProfile = createAsyncThunk("user/getProfile", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/api/users/me"); 
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch profile");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: { user: null, loading: false, error: null },
  reducers: {
    logoutSuccess: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
     
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(updateProfile.fulfilled, (state, action) => {
    state.loading = false;
    state.user = action.payload; // update user in redux
  })
  .addCase(updateProfile.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });

  },
});

export const { logoutSuccess } = userSlice.actions;
export default userSlice.reducer;
